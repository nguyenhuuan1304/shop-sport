import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../users/JwtAuthGuard';
import { RolesGuard } from '../users/rolesGuard';
import { Roles } from '../users/rolesDecorator';
import { UserRole } from '../users/user.entity';
import { Request } from 'express';
import { Order } from './order.entity';
import { UpdateOrderDto } from './dto/update-order.dto';


@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Post()
    async create(@Req() req: Request): Promise<Order> {
        const user = req.user as any;
        return this.orderService.create(user._id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Get()
    async findAll(@Req() req: Request): Promise<Order[]> {
        const user = req.user as any;
        return this.orderService.findAll(user._id, user.role);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Post(':id/checkout')
    async createCheckoutSession(@Param('id') orderId: string, @Req() req: Request) {
        const user = req.user as any;
        
        try {
            return await this.orderService.createCheckoutSession(orderId, user._id);
        } catch (error) {
            console.error(`Error creating checkout session for order ID: ${orderId}, user ID: ${user._id}. Error:`, error);
            throw error;
        }
    }

    @Post('payment-success')
    async handlePaymentSuccess(@Body('sessionId') sessionId: string) {
        console.log(`Payment success webhook received for session ID: ${sessionId}`);

        try {
            return await this.orderService.handlePaymentSuccess(sessionId);
        } catch (error) {
            console.error(`Error handling payment success for session ID: ${sessionId}. Error:`, error);
            throw error;
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Get(':id')
    async findOne(@Param('id') id: string, @Req() req: Request): Promise<Order> {
        const user = req.user as any;
        return this.orderService.findOne(id, user._id, user.role);
    }

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

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Delete(':id')
    async remove(@Param('id') id: string, @Req() req: Request): Promise<void> {
        const user = req.user as any;
        return this.orderService.remove(id, user._id, user.role);
    }
}