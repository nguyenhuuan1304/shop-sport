import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import dayjs from 'dayjs';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // Register
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOneBy({ username: createUserDto.username });
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    const user = this.userRepository.create(createUserDto);
    user.password = await bcrypt.hash(user.password, 10);
    return await this.userRepository.save(user);
  }
  
  //login
  async login(username: string, password: string, res: Response) {
    const user = await this.userRepository.findOneBy({ username });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Username or password Invalid');
    }
  
    // Generate JWT tokens
    const payload = { id: user.id, username: user.username, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '10m' }); // Access token expires in 10 minutes
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' }); // Refresh token expires in 7 days
  
    // Save refresh token and expiration in the database
    user.token = accessToken;
    user.refreshToken = refreshToken;
    user.tokenExpiration = dayjs().add(10, 'minute').toDate(); 
    await this.userRepository.save(user);
  
    // Set access token in cookies (expires in 10 minutes)
    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 10 * 60 * 1000, secure: true, sameSite: 'strict' });
  
    return res.status(200).json({ message: 'Login successful' });
  }
  
  // RefreshAccessToken
  async refreshToken(refreshToken: string, res: Response) {
    // Find the user by refresh token in the database
    const user = await this.userRepository.findOne({ where: { refreshToken } });
  
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
  
    if (dayjs().isAfter(dayjs(user.tokenExpiration))) {
      try {
        const payload = this.jwtService.verify(refreshToken);
        const newAccessToken = this.jwtService.sign(
          { id: payload.id, username: payload.username, role: payload.role },
          { expiresIn: '10m' } 
        );

        // Update access token and its expiration in the database
        user.token = newAccessToken;
        user.tokenExpiration = dayjs().add(10, 'minute').toDate(); 
        await this.userRepository.save(user);
  
        // Set new access token in cookie (expires in 10 minutes)
        res.cookie('accessToken', newAccessToken, { httpOnly: true, maxAge: 10 * 60 * 1000 });
  
        return res.status(200).json({ message: 'New access token generated' });
      } catch (error) {
        console.error('Error refreshing access token:', error.message);
        return res.status(400).json({ message: 'Failed to refresh access token', error: error.message });
      }
    }
  
    return res.status(400).json({ message: 'Access token is still valid, no need to refresh' });
  }
  
  //Logout
  async logout(userId: string, res: Response) {
    await this.userRepository.update(userId, { refreshToken: null });
    res.clearCookie('accessToken', { httpOnly: true, path: '/' });
    return res.status(200).json({ message: 'Logout successful' });
  }  

  async findAll() {
    return await this.userRepository.find({ relations: ['addresses'] });
  }

  //Change Password
  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    
    if (!isOldPasswordValid) {
      throw new BadRequestException('Old password is incorrect');
    }
    
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await this.userRepository.save(user);
    
    return { message: 'Password changed successfully' };
  }

  /**
   * Cập nhật danh sách sản phẩm đã xem gần đây của người dùng
   * @param userId ID của người dùng
   * @param productId ID của sản phẩm đã xem
   */
  async updateRecentlyViewed(userId: string, productId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    if (!user.recentlyViewed) {
      user.recentlyViewed = [];
    }

    // Loại bỏ productId nếu đã tồn tại để tránh trùng lặp
    user.recentlyViewed = user.recentlyViewed.filter(id => id !== productId);

    user.recentlyViewed.unshift(productId);

    // Giới hạn số lượng sản phẩm đã xem gần đây (ví dụ: chỉ giữ lại 10 sản phẩm gần nhất)
    if (user.recentlyViewed.length > 10) {
      user.recentlyViewed = user.recentlyViewed.slice(0, 10);
    }

    await this.userRepository.save(user);
  }

  /**
   * Lấy danh sách productId đã xem gần đây của người dùng
   * @param userId ID của người dùng
   * @returns Mảng productId
   */
  async getRecentlyViewedProducts(userId: string): Promise<string[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.recentlyViewed) {
      return [];
    }
    return user.recentlyViewed;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['addresses'], 
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
    id,
    ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
      return await this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return await this.userRepository.remove(user);
  }
}
