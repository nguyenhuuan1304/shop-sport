import { Controller, Post, Param, Req, Res, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { ZaloPayService } from './zalopay.service';
import { OrderService } from '../order/order.service';
import { Response, Request } from 'express';
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
        @Req() req: Request, 
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
        const result = await this.zaloPayService.processCallback(req.body);
        return res.status(HttpStatus.OK).json(result);
    }

    @Get('/status/:appTransId')
    async checkOrderStatus(
        @Param('appTransId') appTransId: string,
        @Res() res: Response
    ) {
        try {
            const result = await this.zaloPayService.queryOrderStatus(appTransId);

            if (result.status === 'SUCCESS') {
                return res.status(HttpStatus.OK).json({
                    status: 'SUCCESS',
                    message: 'Order has been successfully paid',
                    data: result.data,
                });
            } else if (result.status === 'PENDING') {
                return res.status(HttpStatus.OK).json({
                    status: 'PENDING',
                    message: 'Order is still pending or being processed',
                    data: result.data,
                });
            } else {
                return res.status(HttpStatus.OK).json({
                    status: 'FAILED',
                    message: 'Order payment failed or was cancelled',
                    data: result.data,
                });
            }
        } catch (error) {
            console.error('Error checking order status:', error.message);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'ERROR',
                message: 'Failed to check order status',
            });
        }
    }
}
