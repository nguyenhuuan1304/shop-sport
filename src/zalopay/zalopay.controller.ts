import { Controller, Post, Param, Req, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { ZaloPayService } from './zalopay.service';
import { OrderService } from '../order/order.service';
import { Response, Request } from 'express';
import { OrderStatus } from '../order/order.entity';
import { JwtAuthGuard } from '../users/JwtAuthGuard';
import { User } from '../users/user.entity';

@Controller('zalopay')
export class ZaloPayController {
    constructor(
        private readonly zaloPayService: ZaloPayService,
        private readonly orderService: OrderService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('/create/:orderId')
    async createOrder(
    @Param('orderId') orderId: string,
    @Req() req: Request, // Lấy req để truy cập vào user
    @Res() res: Response,
    ) {
    try {
    const order = await this.orderService.getOrderDetails(orderId);
    const orderDetails = order.orderDetails;

    // Lấy appUser từ JWT (username)
    const user = req.user as User;
    const appUser = user.username;

    // Call ZaloPayService to create the QR code
    const zaloPayOrder = await this.zaloPayService.createQRCode(orderId, orderDetails, appUser);

    return res.status(HttpStatus.CREATED).json(zaloPayOrder);
    } catch (error) {
    console.error('Error in createOrder:', error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Order creation failed' });
    }
    }

    @Post('/callback')
    async handleCallback(@Req() req: Request, @Res() res: Response) {
    const callbackData = req.body;
    console.log('ZaloPay callback data:', callbackData);

    try {
    const { app_trans_id, return_code } = callbackData; 

    // Update order status based on ZaloPay return code
    if (return_code === 1) {
    await this.orderService.updateOrderStatus(app_trans_id, OrderStatus.SUCCESS);
    console.log(`Order ${app_trans_id} marked as SUCCESS.`);
    } else {
    await this.orderService.updateOrderStatus(app_trans_id, OrderStatus.CANCEL);
    console.log(`Order ${app_trans_id} marked as CANCEL.`);
    }

    return res.status(HttpStatus.OK).json({ message: 'Callback processed successfully' });
    } catch (error) {
    console.error('Error processing callback:', error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to process callback' });
    }
    }
}
