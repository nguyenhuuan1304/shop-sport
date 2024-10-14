// src/order-details/order-detail.controller.ts
import { Controller, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrderDetailService } from './orderDetail.service';
import { CreateOrderDetailDto } from './dto/create-orderDetail.dto';
import { UpdateOrderDetailDto } from './dto/update-orderDetail.dto';
import { JwtAuthGuard } from '../users/JwtAuthGuard';
import { RolesGuard } from '../users/rolesGuard';
import { Roles } from '../users/rolesDecorator';
import { UserRole } from '../users/user.entity';
import { OrderDetail } from './orderDetail.entity';

@Controller('order-details')
export class OrderDetailController {
    constructor(private readonly orderDetailService: OrderDetailService) {}

    /**
     * Tạo chi tiết đơn hàng mới
     * URL: POST /order-details
     */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Post()
    async create(@Body() createOrderDetailDto: CreateOrderDetailDto): Promise<OrderDetail> {
        return this.orderDetailService.create(createOrderDetailDto, createOrderDetailDto.order_id);
    }

    /**
     * Cập nhật chi tiết đơn hàng
     * URL: PATCH /order-details/:id
     */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateOrderDetailDto: UpdateOrderDetailDto
    ): Promise<OrderDetail> {
        return this.orderDetailService.update(id, updateOrderDetailDto);
    }

    /**
     * Xóa chi tiết đơn hàng
     * URL: DELETE /order-details/:id
     */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.orderDetailService.remove(id);
    }
}
