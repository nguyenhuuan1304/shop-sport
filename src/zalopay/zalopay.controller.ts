import { Controller, Post, Param, Req, Res, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { ZaloPayService } from './zalopay.service';
import { OrderService } from '../order/order.service';
import { Response, Request } from 'express';
import { JwtAuthGuard } from '../users/JwtAuthGuard';
import { User } from '../users/user.entity';
import {OrderStatus } from '../order/order.entity';

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
            const user = req.user as User;
            const appUser = user.username;
    
            const zaloPayOrder = await this.zaloPayService.createQRCode(orderId, orderDetails, appUser);
            
            // Add logging
            console.log('Generated app_trans_id:', zaloPayOrder.app_trans_id);
            
            await this.orderService.updateAppTransId(orderId, zaloPayOrder.app_trans_id);
            
            // Verify the update
            const updatedOrder = await this.orderService.getOrderDetails(orderId);
            console.log('Updated order:', updatedOrder);
    
            return res.status(HttpStatus.CREATED).json(zaloPayOrder);
        } catch (error) {
            console.error('Error in createOrder:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Order creation failed' });
        }
    }
    @Post('/callback')
    async handleCallback(@Req() req: Request, @Res() res: Response) {
        try {
            const { data, mac } = req.body;
            console.log('Received callback data:', data);
            console.log('Received MAC:', mac);

            const calculatedMac = this.zaloPayService.createMac(data, this.zaloPayService.getKey2());
            
            if (mac !== calculatedMac) {
                console.error('Invalid MAC');
                return res.json({
                    return_code: -1,
                    return_message: "Invalid MAC",
            });
            }

            const callbackData = JSON.parse(data);
            console.log('Parsed callback data:', callbackData);

            // Tìm order bằng app_trans_id
            const order = await this.orderService.findByAppTransId(callbackData.app_trans_id);
            
            if (!order) {
                console.error(`Order not found for app_trans_id: ${callbackData.app_trans_id}`);
                return res.json({
                    return_code: 0,
                    return_message: "Order not found",
            });
            }

            if (order.status === OrderStatus.SUCCESS) {
                console.log('Order already processed');
                return res.json({
                    return_code: 2,
                    return_message: "Order already processed",
                });
            }

            // Cập nhật trạng thái đơn hàng
            await this.orderService.updateOrderStatus(order._id, OrderStatus.SUCCESS);
            console.log(`Order ${order._id} status updated to SUCCESS`);

            return res.json({
                return_code: 1,
                return_message: "success",
            });

        } catch (error) {
            console.error('Callback processing error:', error);
            return res.json({
                return_code: 0,
                return_message: error.message,
            });
        }
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
