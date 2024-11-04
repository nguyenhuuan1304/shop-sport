import { Controller, Post, Get, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrderDetailService } from './orderDetail.service';
import { CreateOrderDetailWithOrderIdDto } from './dto/create-orderDetailWithOrderId.dto';
import { UpdateOrderDetailDto } from './dto/update-orderDetail.dto';
import { JwtAuthGuard } from '../users/JwtAuthGuard';
import { RolesGuard } from '../users/rolesGuard';
import { Roles } from '../users/rolesDecorator';
import { UserRole } from '../users/user.entity';
import { OrderDetail } from './orderDetail.entity';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('order-details')
@ApiBearerAuth()
@Controller('order-details')
export class OrderDetailController {
    constructor(private readonly orderDetailService: OrderDetailService) {}

    /*
     * URL: POST /order-details
     */
    @ApiOperation({ summary: 'Create a new order detail with order ID' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Post()
    async create(@Body() createOrderDetailWithOrderIdDto: CreateOrderDetailWithOrderIdDto): Promise<OrderDetail> {
        const { order_id, product_id, quantity } = createOrderDetailWithOrderIdDto;
        return this.orderDetailService.createWithOrderId({ order_id, product_id, quantity });
    }

    /*
     * URL: GET /order-details
     */
    @ApiOperation({ summary: 'Retrieve all order details' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Get()
    async findAll(): Promise<OrderDetail[]> {
        return this.orderDetailService.findAll();
    }

    /*
     * URL: GET /order-details/:id
     */
    @ApiOperation({ summary: 'Retrieve order detail by ID' })
    @ApiParam({ name: 'id', type: 'string', description: 'The ID of the order detail' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<OrderDetail> {
        return this.orderDetailService.findOne(id);
    }

    /*
     * URL: PATCH /order-details/:id
     */
    @ApiOperation({ summary: 'Update an order detail by ID' })
    @ApiParam({ name: 'id', type: 'string', description: 'The ID of the order detail' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateOrderDetailDto: UpdateOrderDetailDto
    ): Promise<OrderDetail> {
        return this.orderDetailService.update(id, updateOrderDetailDto);
    }

    /*
     * URL: DELETE /order-details/:id
     */
    @ApiOperation({ summary: 'Delete an order detail by ID' })
    @ApiParam({ name: 'id', type: 'string', description: 'The ID of the order detail' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.orderDetailService.remove(id);
    }
}
