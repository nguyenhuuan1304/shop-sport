import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { Order } from '../order/order.entity';
import { OrderStatus } from '../order/order.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
    private stripe: Stripe;
    private failedAttempts: { [key: string]: number } = {};

    constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private configService: ConfigService,
    ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
    apiVersion: '2024-09-30.acacia',
    });
    }

    async createCheckoutSession(orderId: string, orderDetails: any[], currency: string = 'usd') {
        if (!orderDetails || !Array.isArray(orderDetails) || orderDetails.length === 0) {
            throw new Error('Invalid product details');
        }
    
        const lineItems = orderDetails.map(detail => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: detail.product.name,
                    description: `Size: ${detail.size ? detail.size.size_name : 'default'}`,
                },
                unit_amount: Math.round(detail.product.price * 100), // Price in cents
            },
            quantity: detail.quantity,
        }));
    
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            payment_intent_data: {
                setup_future_usage: 'off_session', 
            },
            success_url: `https://www.done.com/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `https://www.done.com/cancel?session_id={CHECKOUT_SESSION_ID}`,
            metadata: {
                order_id: orderId,
            },
        });
    
        // Cập nhật order thành "pending"
        await this.orderRepository.update(orderId, { 
            stripeSessionId: session.id,
            status: OrderStatus.PENDING,
        });
    
        return session;
    }
    
    async handlePaymentSuccess(sessionId: string): Promise<void> {
        if (!sessionId) {
            throw new Error('Session ID is undefined');
        }

        const order = await this.orderRepository.findOne({
            where: { stripeSessionId: sessionId },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // Cập nhật trạng thái đơn hàng thành 'success'
        order.status = OrderStatus.SUCCESS;
        await this.orderRepository.save(order);

        // Reset số lần thất bại sau khi thanh toán thành công
        this.failedAttempts[sessionId] = 0;
    }

    async verifyPayment(sessionId: string) {
        const session = await this.stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            return true;
        }
            return false;
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
}