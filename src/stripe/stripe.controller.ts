import { Controller, Post, Req, Param } from '@nestjs/common';
import { Request } from 'express';
import { StripeService } from './stripe.service';
import { OrderService } from '../order/order.service';

@Controller('webhooks')
export class WebhookController {
  constructor(
  private stripeService: StripeService,
  private orderService: OrderService,
  ) {}

  @Post('stripe')
  async handleStripeWebhook(@Req() req: Request) {
    const event = req.body;

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      // Xử lý thanh toán thành công, cập nhật trạng thái đơn hàng
      await this.stripeService.handlePaymentSuccess(session.id);
    }
  }
  @Post(':id/checkout')
  async createCheckoutSession(@Param('id') orderId: string, @Req() req: Request) {
    const user = req.user as any;
    const checkoutUrl = await this.orderService.createCheckoutSession(orderId, user._id);
    return { checkoutUrl };
  }
}
