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
import { Size } from '../size/size.entity';

@Injectable()
export class OrderService {
    private failedAttempts: { [key: string]: number } = {};

    constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
        
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
        
    @InjectRepository(Size)
    private sizeRepository: Repository<Size>,
        
    private userService: UserService,
        
    private orderDetailService: OrderDetailService,
        
    private stripeService: StripeService,
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
        const order = await this.orderRepository.findOne({
            where: { _id: orderId, user: { id: userId } },
            relations: ['orderDetails', 'orderDetails.product'],
        });
    
        if (!order) {
            throw new NotFoundException('Order not found');
        }
    
        // Kiểm tra orderDetails trước khi gọi StripeService
        if (order.orderDetails.length === 0 || order.orderDetails.some(detail => detail.product.price == null || detail.quantity == null)) {
            throw new Error('Invalid product details, price, or quantity');
        }
    
        // Tạo session thanh toán Stripe
        const session = await this.stripeService.createCheckoutSession(order._id, order.orderDetails, 'usd');
    
        return { checkoutUrl: session.url };
    }

    async handlePaymentFailure(sessionId: string, reason: string): Promise<void> {
        if (!sessionId) {
            throw new Error('Session ID is undefined');
        }

        if (!this.failedAttempts[sessionId]) {
            this.failedAttempts[sessionId] = 0;
        }

        this.failedAttempts[sessionId] += 1;

        if (this.failedAttempts[sessionId] >= 3) {
            console.log(`Payment failed 3 times for session ID: ${sessionId}. Stopping further attempts.`);
            // Thực hiện các hành động cần thiết khi vượt quá giới hạn thất bại
            return;
        }

        console.log(`Payment failed for session ID: ${sessionId}. Reason: ${reason}. Attempt: ${this.failedAttempts[sessionId]}`);
    }

    async handlePaymentSuccess(sessionId: string): Promise<Order> {
        const isPaid = await this.stripeService.verifyPayment(sessionId);
    
        if (!isPaid) {
            throw new BadRequestException('Payment failed or not verified');
        }
    
        const order = await this.orderRepository.findOne({
            where: { stripeSessionId: sessionId },
            relations: ['orderDetails', 'orderDetails.size']
        });
    
        if (!order) {
            throw new NotFoundException('Order not found');
        }
    
        // Trừ số lượng sản phẩm khi thanh toán thành công
        for (const detail of order.orderDetails) {
            const size = await this.sizeRepository.findOne({ where: { _id: detail.size._id } });
            if (size) {
                size.stock -= detail.quantity;
                await this.sizeRepository.save(size);
            }
        }
    
        order.status = OrderStatus.SUCCESS;
        return await this.orderRepository.save(order);
    }
    

    async handlePaymentCancel(sessionId: string): Promise<void> {
        if (!sessionId) {
            throw new Error('Session ID is undefined');
        }

        const order = await this.orderRepository.findOne({
            where: { stripeSessionId: sessionId },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

    // Cập nhật trạng thái đơn hàng thành 'cancel'
        order.status = OrderStatus.CANCEL;
        await this.orderRepository.save(order);
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