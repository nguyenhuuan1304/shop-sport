import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { OrderService } from '../order/order.service';
import { CartService } from '../cart/cart.service';
import { OrderStatus } from '../order/order.entity';
import { StripeService } from '../stripe/stripe.service';

@Injectable()
export class PaymentService {
    constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly orderService: OrderService,
    private readonly cartService: CartService,
    private readonly stripeService: StripeService,
    ) {}

    async createPayment(orderId: string, createPaymentDto: CreatePaymentDto): Promise<any> {
        const order = await this.orderService.findOrderById(orderId);
        if (!order) {
            throw new NotFoundException(`Order with ID ${orderId} does not exist`);
        }
        
        const amount = order.orderDetails.reduce((total, detail) => total + detail.quantity * detail.price, 0);
        
        const payment = this.paymentRepository.create({
            order,
            amount,
            method: createPaymentDto.method,
            status: PaymentStatus.PENDING,
            transaction_id: this.generateTransactionId(),
        });
        
        await this.paymentRepository.save(payment);
        
        if (createPaymentDto.method === 'Stripe') {
            const paymentIntent = await this.stripeService.createPaymentIntent(amount * 100, 'usd', createPaymentDto.token);
            
            if (paymentIntent.status === 'succeeded') {
                payment.status = PaymentStatus.SUCCESS;
                order.status = OrderStatus.SUCCESS;
            } else {
                payment.status = PaymentStatus.CANCEL;
                order.status = OrderStatus.CANCEL;
            }
        
            await this.paymentRepository.save(payment);
            await this.orderService.updateOrder(order._id, { status: order.status });
            
            await this.cartService.clearCart(order.user.id);
            
            return {
            ...payment,
            paymentIntent,
            };
        }
        
        await this.cartService.clearCart(order.user.id);
        
        return payment;
    }

    // Lấy thông tin thanh toán
    async getPayment(paymentId: string): Promise<Payment> {
        const payment = await this.paymentRepository.findOne({ where: { _id: paymentId }, relations: ['order'] });
        if (!payment) {
            throw new NotFoundException(`Payment với ID ${paymentId} không tồn tại`);
        }
        return payment;
    }

    // Cập nhật trạng thái thanh toán và đồng bộ với đơn hàng
    async updatePaymentStatus(paymentId: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
        const payment = await this.paymentRepository.findOne({ where: { _id: paymentId }, relations: ['order'] });
        if (!payment) {
            throw new NotFoundException(`Payment với ID ${paymentId} không tồn tại`);
        }

        // Cập nhật trạng thái thanh toán
        payment.status = updatePaymentDto.status;
        await this.paymentRepository.save(payment);

        // Đồng bộ trạng thái của đơn hàng
        payment.order.status = this.mapPaymentStatusToOrderStatus(updatePaymentDto.status);
        await this.orderService.updateOrder(payment.order._id, { status: payment.order.status });

        return payment;
        }

        // Hàm hỗ trợ tạo transaction ID
        private generateTransactionId(): string {
            return `PAY-${Date.now()}`;
        }

        // Hàm chuyển đổi PaymentStatus thành OrderStatus
        private mapPaymentStatusToOrderStatus(paymentStatus: PaymentStatus): OrderStatus {
            switch (paymentStatus) {
            case PaymentStatus.SUCCESS:
            return OrderStatus.SUCCESS;
            case PaymentStatus.CANCEL:
            return OrderStatus.CANCEL;
            default:
            return OrderStatus.PENDING;
        }
    }
}