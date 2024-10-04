import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { JwtAuthGuard } from './JwtAuthGuard'; 
import { RolesGuard } from './rolesGuard';
import { Roles } from './rolesDecorator';
import { UserRole } from './user.entity';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }, @Res() res: Response) {
    return await this.userService.login(body.username, body.password, res);
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }, @Res() res: Response) {
    return await this.userService.refreshToken(body.refreshToken, res);
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    return await this.userService.logout(res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Body() { oldPassword, newPassword }: { oldPassword: string, newPassword: string },
    @Req() req: any, ) {
      const userId = req.user.id;
      return this.userService.changePassword(userId, oldPassword, newPassword);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
