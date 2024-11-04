import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../users/JwtAuthGuard';
import { RolesGuard } from '../users/rolesGuard';
import { Roles } from '../users/rolesDecorator';
import { UserRole } from '../users/user.entity';
import { Request } from 'express';
import { Order } from './order.entity';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ZaloPayService } from '../zalopay/zalopay.service';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
        private readonly zaloPayService: ZaloPayService,
    ) {}

    @ApiOperation({ summary: 'Create a new order' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Post()
    async create(@Req() req: Request): Promise<Order> {
        const user = req.user as any;
        return this.orderService.create(user._id);
    }

    @ApiOperation({ summary: 'Get all orders' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Get()
    async findAll(@Req() req: Request): Promise<Order[]> {
        const user = req.user as any;
        return this.orderService.findAll(user._id, user.role);
    }

    @ApiOperation({ summary: 'Create a checkout session for an order' })
    @ApiParam({ name: 'id', type: 'string', description: 'The ID of the order' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Post(':id/checkout')
    async createCheckoutSession(@Param('id') orderId: string, @Req() req: Request) {
        const user = req.user as any;

        if (!user || !user.id) {
            throw new Error('User ID is undefined');
        }

        try {
            return await this.orderService.createCheckoutSession(orderId, user.id);
        } catch (error) {
            throw error;
        }
    }

    @ApiOperation({ summary: 'Get order details by ID' })
    @ApiParam({ name: 'id', type: 'string', description: 'The ID of the order' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Get(':id')
    async findOne(@Param('id') id: string, @Req() req: Request): Promise<Order> {
        const user = req.user as any;
        return this.orderService.findOne(id, user._id, user.role);
    }

    @ApiOperation({ summary: 'Update an order' })
    @ApiParam({ name: 'id', type: 'string', description: 'The ID of the order' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateOrderDto: UpdateOrderDto,
        @Req() req: Request
    ): Promise<Order> {
        const user = req.user as any;
        return this.orderService.update(id, updateOrderDto, user._id, user.role);
    }

    @ApiOperation({ summary: 'Delete an order' })
    @ApiParam({ name: 'id', type: 'string', description: 'The ID of the order' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Delete(':id')
    async remove(@Param('id') id: string, @Req() req: Request): Promise<void> {
        const user = req.user as any;
        return this.orderService.remove(id, user._id, user.role);
    }
}
