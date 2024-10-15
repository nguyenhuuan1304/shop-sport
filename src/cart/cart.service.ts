import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { User } from '../users/user.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,

        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    // Tạo giỏ hàng mới
    async create(createCartDto: CreateCartDto): Promise<Cart> {
        const user = await this.userRepository.findOne({ where: { id: createCartDto.user_id }, relations: ['carts'] });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Kiểm tra xem người dùng đã có giỏ hàng chưa
        if (user.carts && user.carts.length > 0) {
            throw new BadRequestException('User already has a cart');
        }

        const cart = this.cartRepository.create({
            user,
        });

        return await this.cartRepository.save(cart);
    }

    // Lấy tất cả giỏ hàng
    async findAll(): Promise<Cart[]> {
        return await this.cartRepository.find({ relations: ['user'] });
    }

    // Lấy giỏ hàng theo ID
    async findOne(id: string): Promise<Cart> {
        const cart = await this.cartRepository.findOne({ where: { _id: id }, relations: ['user'] });
        if (!cart) {
            throw new NotFoundException(`Cart with ID ${id} not found`);
        }
        return cart;
    }

    // Cập nhật giỏ hàng
    async update(id: string, updateCartDto: UpdateCartDto): Promise<Cart> {
        const cart = await this.cartRepository.findOne({ where: { _id: id }, relations: ['user'] });
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        if (updateCartDto.user_id) {
            const user = await this.userRepository.findOne({ where: { id: updateCartDto.user_id }, relations: ['carts'] });
            if (!user) {
                throw new NotFoundException('User not found');
            }
            // Kiểm tra nếu người dùng đã có giỏ hàng khác
            if (user.carts && user.carts.length > 0) {
                throw new BadRequestException('User already has a cart');
            }
            cart.user = user;
        }

        return await this.cartRepository.save(cart);
    }

    // Xóa giỏ hàng
    async remove(id: string): Promise<void> {
        const cart = await this.cartRepository.findOne({ where: { _id: id } });
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }
        await this.cartRepository.remove(cart);
    }
}
