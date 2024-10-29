import { Controller, Post, Param, Req, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { ZaloPayService } from './zalopay.service';
import { OrderService } from '../order/order.service';
import { Response, Request } from 'express';
import { OrderStatus } from '../order/order.entity';
import { JwtAuthGuard } from '../users/JwtAuthGuard';
import { User } from '../users/user.entity';
import * as crypto from 'crypto';

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
    async handleCallback(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const { data: dataStr, mac: reqMac } = req.body;

        const mac = crypto.createHmac('sha256', this.zaloPayService.key2)
                        .update(dataStr)
                        .digest('hex');

        // Xác thực tính hợp lệ của callback từ ZaloPay
        if (reqMac !== mac) {
        return res.status(HttpStatus.OK).json({
            return_code: -1,
            return_message: "Invalid mac",
        });
        }

        const data = JSON.parse(dataStr);
        const { app_trans_id, return_code } = data;

        try {
        // Cập nhật trạng thái đơn hàng
        if (return_code === 1) {
            await this.orderService.updateOrderStatus(app_trans_id, OrderStatus.SUCCESS);
            console.log(`Order ${app_trans_id} marked as SUCCESS.`);
        } else {
            await this.orderService.updateOrderStatus(app_trans_id, OrderStatus.CANCEL);
            console.log(`Order ${app_trans_id} marked as CANCEL.`);
        }
        return res.status(HttpStatus.OK).json({
            return_code: 1,
            return_message: "Success",
        });
        } catch (error) {
        console.error("Error updating order status:", error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            return_code: 0,
            return_message: "Internal server error",
        });
        }
    }
}
