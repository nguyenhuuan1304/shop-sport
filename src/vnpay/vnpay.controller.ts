import { Controller, Get, Post, Param, Query, NotFoundException, Req } from '@nestjs/common';
import { VNPayService } from './vnpay.service';
import { OrderService } from '../order/order.service';

@Controller('vnpay')
export class VNPayController {
    constructor(private readonly vnpayService: VNPayService,
        private readonly orderService: OrderService
    ) {}

    @Post('create_payment_url/:orderId')
    async createPaymentUrl(@Param('orderId') orderId: string, @Req() req: any) {
        const order = await this.orderService.findOrderById(orderId);
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        
        return this.vnpayService.createPaymentUrl(order, ipAddr); 
    }

    @Get('vnpay_return')
    vnpayReturn(@Query() query: any) {
        const isValidHash = this.vnpayService.verifyReturnUrl(query);
        if (isValidHash) {
        // Hiển thị thông báo thành công/thất bại
        return { code: query['vnp_ResponseCode'] };
        }
        return { code: '97' };
    }

    @Get('vnpay_ipn')
    vnpayIPN(@Query() query: any) {
        return this.vnpayService.processIpnUrl(query);
    }
}