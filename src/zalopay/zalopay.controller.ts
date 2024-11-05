import { Controller, Post, Param, Req, Res, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ZaloPayService } from './zalopay.service';
import { OrderService } from '../order/order.service';
import { Response, Request } from 'express';
import { JwtAuthGuard } from '../users/JwtAuthGuard';
import { User } from '../users/user.entity';
import { OrderStatus } from '../order/order.entity';

@ApiTags('ZaloPay')
@Controller('zalopay')
export class ZaloPayController {
    constructor(
        private readonly zaloPayService: ZaloPayService,
        private readonly orderService: OrderService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('/create/:orderId')
    @ApiOperation({ summary: 'Create a ZaloPay order' })
    @ApiParam({ name: 'orderId', description: 'ID of the order to create on ZaloPay' })
    @ApiResponse({ status: 201, description: 'Order successfully created on ZaloPay' })
    @ApiResponse({ status: 500, description: 'Order creation failed' })
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
            
            // Log generated app_trans_id
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
    @ApiOperation({ summary: 'Handle callback from ZaloPay' })
    @ApiBody({ schema: { example: { data: '...', mac: '...' } } })
    @ApiResponse({ status: 200, description: 'Callback processed successfully' })
    @ApiResponse({ status: 500, description: 'Callback processing error' })
    async handleCallback(@Req() req: Request, @Res() res: Response) {
        try {
            const { data, mac } = req.body;
            const calculatedMac = this.zaloPayService.createMac(data, this.zaloPayService.getKey2());

            if (mac !== calculatedMac) {
                return res.json({
                    return_code: -1,
                    return_message: "Invalid MAC",
                });
            }

            const callbackData = JSON.parse(data);
            const order = await this.orderService.findByAppTransId(callbackData.app_trans_id);

            if (!order) {
                return res.json({
                    return_code: 0,
                    return_message: "Order not found",
                });
            }

            if (order.status === OrderStatus.SUCCESS) {
                return res.json({
                    return_code: 2,
                    return_message: "Order already processed",
                });
            }

            await this.orderService.updateOrderStatus(order._id, OrderStatus.SUCCESS);
            await this.orderService.updateSizeStock(order._id); 

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
    @ApiOperation({ summary: 'Check ZaloPay order status' })
    @ApiParam({ name: 'appTransId', description: 'App transaction ID of the order' })
    @ApiResponse({ status: 200, description: 'Order status retrieved successfully' })
    @ApiResponse({ status: 500, description: 'Failed to check order status' })
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
