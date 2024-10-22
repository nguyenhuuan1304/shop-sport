import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserService } from '../users/user.service';
import { OrderStatus } from './order.entity';
import { UserRole } from '../users/user.entity';
import { OrderDetailService } from '../order_detail/orderDetail.service';
import { Cart } from '../cart/cart.entity';
import { StripeService } from '../stripe/stripe.service';
    
@Injectable()
export class OrderService {
    constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,

    private userService: UserService,

    private orderDetailService: OrderDetailService,
    
    private stripeService : StripeService,
    ) {}

    async create(userId: string): Promise<Order> {
        const user = await this.userService.findOne(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        
        const cart = await this.cartRepository.findOne({
            where: { user: { id: userId } },
                relations: ['cartItems', 'cartItems.product', 'cartItems.size'],
        });
        
        if (!cart || cart.cartItems.length === 0) {
            throw new BadRequestException('Cart is empty');
        }
        
        const order = this.orderRepository.create({
            user,
            status: OrderStatus.PENDING,
        });
        
        const savedOrder = await this.orderRepository.save(order);
        
        for (const cartItem of cart.cartItems) {
            await this.orderDetailService.create({
                product_id: cartItem.product._id,
                size_id: cartItem.size._id,
                quantity: cartItem.quantity,
            }, savedOrder._id);
        }
        
        // Clear the cart after creating the order
        await this.cartRepository.remove(cart);
        
        return await this.orderRepository.findOne({
            where: { _id: savedOrder._id },
            relations: ['user', 'orderDetails', 'orderDetails.product'],
        });
    }

    async createCheckoutSession(orderId: string, userId: string): Promise<{ checkoutUrl: string }> {       
        try {
            const order = await this.orderRepository.findOne({
                where: { _id: orderId, user: { id: userId } },
                relations: ['orderDetails', 'orderDetails.product'],
            });
        
            if (!order) {
                console.error(`Order with ID ${orderId} not found for user ID: ${userId}`);
                throw new NotFoundException('Order not found');
            }
        
            // Calculate total amount
            const amount = order.orderDetails.reduce((sum, detail) => {
                return sum + detail.product.price * detail.quantity;
            }, 0);
        
            // Create a payment session
            const session = await this.stripeService.createCheckoutSession(order._id, amount, 'usd');
        

            return { checkoutUrl: session.url };
        } catch (error) {
            console.error(`Error in createCheckoutSession for order ID: ${orderId}, user ID: ${userId}. Error:`, error);
            throw error;
        }
    }

    async handlePaymentSuccess(sessionId: string): Promise<Order> {
        
        try {
            const isPaid = await this.stripeService.verifyPayment(sessionId);
        
            if (!isPaid) {
                console.error(`Payment verification failed for session ID: ${sessionId}`);
                throw new BadRequestException('Payment failed or not verified');
            }
        
            const order = await this.orderRepository.findOne({ where: { _id: sessionId } });
        
            if (!order) {
                console.error(`Order not found for session ID: ${sessionId}`);
                throw new NotFoundException('Order not found');
            }
        
            order.status = OrderStatus.SUCCESS;
            const updatedOrder = await this.orderRepository.save(order);
        
            return updatedOrder;
        } catch (error) {
            console.error(`Error in handlePaymentSuccess for session ID: ${sessionId}. Error:`, error);
            throw error;
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

    async findAll(userId: string, userRole: UserRole): Promise<Order[]> {
        if (userRole === UserRole.SUPER_ADMIN || userRole === UserRole.ADMIN) {
            return this.orderRepository.find({
                relations: ['user', 'orderDetails', 'orderDetails.product'],
            });
        } else {
            return this.orderRepository.find({
                where: { user: { id: userId } },
                relations: ['user', 'orderDetails', 'orderDetails.product'],
            });
        }
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