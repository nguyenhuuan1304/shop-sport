import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../users/JwtAuthGuard';
import { RolesGuard } from '../users/rolesGuard';
import { Roles } from '../users/rolesDecorator';
import { UserRole } from '../users/user.entity';
import { Request } from 'express';
import { Cart } from './cart.entity';
import { ApiTags, ApiBearerAuth, ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('carts')
@ApiBearerAuth()
@Controller('carts')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @ApiOperation({ summary: 'Add item to cart' })
    @ApiBody({ type: CreateCartDto })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Post()
    async create(@Body() createCartDto: CreateCartDto, @Req() req: Request): Promise<Cart> {
        const user = req.user as any;
        return this.cartService.addToCart(user._id, createCartDto);
    }

    @ApiOperation({ summary: 'Get current user cart' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Get('me')
    async getMyCart(@Req() req: Request): Promise<Cart> {
        const user = req.user as any;
        return this.cartService.getUserCart(user._id);
    }

    @ApiOperation({ summary: 'Get all carts' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Get()
    async findAll(): Promise<Cart[]> {
        return this.cartService.findAll();
    }

    @ApiOperation({ summary: 'Get a specific cart by ID' })
    @ApiParam({ name: 'id', type: 'string', description: 'The ID of the cart' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Cart> {
        return this.cartService.findOne(id);
    }

    @ApiOperation({ summary: 'Update a specific cart' })
    @ApiParam({ name: 'id', type: 'string', description: 'The ID of the cart' })
    @ApiBody({ type: UpdateCartDto })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateCartDto: UpdateCartDto
    ): Promise<Cart> {
        return this.cartService.update(id, updateCartDto);
    }

    @ApiOperation({ summary: 'Remove a specific cart by ID' })
    @ApiParam({ name: 'id', type: 'string', description: 'The ID of the cart' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.cartService.remove(id);
    }
}
