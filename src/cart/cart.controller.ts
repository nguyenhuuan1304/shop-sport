import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../users/JwtAuthGuard';
import { RolesGuard } from '../users/rolesGuard';
import { Roles } from '../users/rolesDecorator';
import { UserRole } from '../users/user.entity';
import { Order } from '../order/order.entity'; 
import { Request } from 'express';
import { Cart } from './cart.entity';

@Controller('carts')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    /*
     * URL: POST /carts
     * Tạo giỏ hàng cùng với các mục giỏ hàng và tạo Order
     */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Post()
    async create(@Body() createCartDto: CreateCartDto, @Req() req: Request): Promise<Order> { 
        const user = req.user as any;
        return this.cartService.create(createCartDto, user._id);
    }

    /*
     * URL: GET /carts/me
     * Lấy giỏ hàng của người dùng hiện tại
     */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN) 
    @Get('me')
    async getMyCart(@Req() req: Request): Promise<Cart> {
        const user = req.user as any;
        return this.cartService.getUserCart(user._id);
    }

    /*
     * URL: GET /carts
     * Lấy tất cả các giỏ hàng 
     */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Get()
    async findAll(): Promise<Cart[]> {
        return this.cartService.findAll();
    }

    /*
     * URL: GET /carts/:id
     * Lấy giỏ hàng theo ID
     */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Cart> {
        return this.cartService.findOne(id);
    }

    /*
     * URL: PATCH /carts/:id
     * Cập nhật giỏ hàng 
     */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateCartDto: UpdateCartDto
    ): Promise<Cart> {
        return this.cartService.update(id, updateCartDto);
    }

    /*
     * URL: DELETE /carts/:id
     * Xóa giỏ hàng 
     */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.cartService.remove(id);
    }
}
