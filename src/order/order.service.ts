import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserService } from '../users/user.service';
import { OrderStatus } from './order.entity';
import { UserRole } from '../users/user.entity';
import { OrderDetailService } from '../order_detail/orderDetail.service';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,

        private userService: UserService, 

        private orderDetailService: OrderDetailService, 
    ) {}

    async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
        const user = await this.userService.findOne(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const order = this.orderRepository.create({
            user,
            status: createOrderDto.status || OrderStatus.PENDING,
        });

        const savedOrder = await this.orderRepository.save(order);

        for (const detailDto of createOrderDto.orderDetails) {
            await this.orderDetailService.create(detailDto, savedOrder._id);
        }

        return await this.orderRepository.findOne({
            where: { _id: savedOrder._id },
            relations: ['user', 'orderDetails', 'orderDetails.product'],
        });
    }

    async findAll(userId: string, userRole: UserRole): Promise<Order[]> {
        if (userRole === UserRole.SUPER_ADMIN || userRole === UserRole.ADMIN) {
            return await this.orderRepository.find({ relations: ['user', 'orderDetails', 'orderDetails.product'] });
        } else {
            return await this.orderRepository.find({
                where: { user: { id: userId } }, // Sử dụng _id thay vì id
                relations: ['user', 'orderDetails', 'orderDetails.product'],
            });
        }
    }

    async findOne(id: string, userId: string, userRole: UserRole): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { _id: id },
            relations: ['user', 'orderDetails', 'orderDetails.product'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (
            userRole !== UserRole.SUPER_ADMIN &&
            userRole !== UserRole.ADMIN &&
            order.user.id !== userId
        ) {
            throw new ForbiddenException('Access to the requested resource is forbidden');
        }

        return order;
    }

    async update(id: string, updateOrderDto: UpdateOrderDto, userId: string, userRole: UserRole): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { _id: id },
            relations: ['user', 'orderDetails', 'orderDetails.product'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (
            userRole !== UserRole.SUPER_ADMIN &&
            userRole !== UserRole.ADMIN &&
            order.user.id !== userId
        ) {
            throw new ForbiddenException('Access to the requested resource is forbidden');
        }

        if (updateOrderDto.status !== undefined) {
            order.status = updateOrderDto.status;
        }

        return await this.orderRepository.save(order);
    }

    async remove(id: string, userId: string, userRole: UserRole): Promise<void> {
        const order = await this.orderRepository.findOne({
            where: { _id: id },
            relations: ['user'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (
            userRole !== UserRole.SUPER_ADMIN &&
            userRole !== UserRole.ADMIN &&
            order.user.id !== userId
        ) {
            throw new ForbiddenException('Access to the requested resource is forbidden');
        }

        await this.orderRepository.remove(order);
    }
}
