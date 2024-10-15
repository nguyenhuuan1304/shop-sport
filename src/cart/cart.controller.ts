import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../users/JwtAuthGuard';
import { RolesGuard } from '../users/rolesGuard';
import { Roles } from '../users/rolesDecorator';
import { UserRole } from '../users/user.entity';
import { Cart } from './cart.entity';

@Controller('carts')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    /*
     * URL: POST /carts
     */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Post()
    async create(@Body() createCartDto: CreateCartDto): Promise<Cart> {
        return this.cartService.create(createCartDto);
    }

    /*
     * URL: GET /carts
     */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Get()
    async findAll(): Promise<Cart[]> {
        return this.cartService.findAll();
    }

    /*
     * URL: GET /carts/:id
     */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Cart> {
        return this.cartService.findOne(id);
    }

    /*
     * URL: PATCH /carts/:id
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
     */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.cartService.remove(id);
    }
}
