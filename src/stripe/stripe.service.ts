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

    constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private configService: ConfigService,
    ) {
        
        this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
            apiVersion: '2024-09-30.acacia',
        });
    }

    async createCheckoutSession(orderId: string, amount: number, currency: string) {
        const amountInCents = Math.round(amount * 100);
        
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                currency,
                product_data: {
                    name: `Order ${orderId}`,
                    
                },
                unit_amount: amountInCents,
            },
            quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `https://www.done.com/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `https://docs.stripe.com/cancel`,
        });
        
        return session;
    }

    async handlePaymentSuccess(sessionId: string): Promise<void> {
        if (!sessionId) {
            throw new Error('Session ID is required');
        }
        
        // Tìm đơn hàng dựa vào session ID của Stripe
        const order = await this.orderRepository.findOne({
            where: { stripeSessionId: sessionId },
        });
        
        if (!order) {
            throw new NotFoundException('Order not found');
        }
        
        // Cập nhật trạng thái đơn hàng thành 'success'
        order.status = OrderStatus.SUCCESS;
        await this.orderRepository.save(order);
    }
        
    async verifyPayment(sessionId: string) {
        if (!sessionId) {
            throw new Error('Session ID is required');
        }
        
        const session = await this.stripe.checkout.sessions.retrieve(sessionId);
        
        if (session.payment_status === 'paid') {
            return true;
        }
            return false;
    }
}