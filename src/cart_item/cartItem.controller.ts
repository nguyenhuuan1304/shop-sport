import { Controller, Post, Get, Body, Patch, Param, Delete, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { CartItemService } from './cartItem.service';
import { CreateCartItemDto } from './dto/create-cartItem.dto';
import { UpdateCartItemDto } from './dto/update-cartItem.dto';
import { JwtAuthGuard } from '../users/JwtAuthGuard';
import { RolesGuard } from '../users/rolesGuard';
import { Roles } from '../users/rolesDecorator';
import { UserRole } from '../users/user.entity';
import { CartItem } from './cartItem.entity';
import { Request } from 'express';

@Controller('cart-items')
export class CartItemController {
    constructor(private readonly cartItemService: CartItemService) {}

    /*
     * URL: POST /cart-items
     * Tạo CartItem mới
     */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Post()
    async create(@Body() createCartItemDto: CreateCartItemDto, @Req() req: Request): Promise<CartItem> {
        const user = req.user as any;
        if (!user || !user._id) {
            throw new NotFoundException('User không tồn tại');
        }
        return this.cartItemService.create(createCartItemDto, user._id);
    }

    /*
     * URL: GET /cart-items
     * Lấy tất cả CartItems (dành cho Admin và Super Admin)
     */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Get()
    async findAll(): Promise<CartItem[]> {
        return this.cartItemService.findAll();
    }

    /*
     * URL: GET /cart-items/:id
     * Lấy CartItem theo ID
     */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Get(':id')
    async findOne(@Param('id') id: string, @Req() req: Request): Promise<CartItem> {
        const user = req.user as any;
        if (!user || !user._id) {
            throw new NotFoundException('User không tồn tại');
        }
        return this.cartItemService.findOne(id, user._id);
    }

    /*
     * URL: PATCH /cart-items/:id
     * Cập nhật CartItem
     */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateCartItemDto: UpdateCartItemDto,
        @Req() req: Request
    ): Promise<CartItem> {
        const user = req.user as any;
        if (!user || !user._id) {
            throw new NotFoundException('User không tồn tại');
        }
        return this.cartItemService.update(id, updateCartItemDto, user._id);
    }

    /*
     * URL: DELETE /cart-items/:id
     * Xóa CartItem
     */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Delete(':id')
    async remove(@Param('id') id: string, @Req() req: Request): Promise<void> {
        const user = req.user as any;
        if (!user || !user._id) {
            throw new NotFoundException('User không tồn tại');
        }
        return this.cartItemService.remove(id, user._id);
    }
}
