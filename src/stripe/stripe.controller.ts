import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './stripe.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('stripe')
  async handleStripeWebhook(@Req() req: Request, @Res() res: Response) {
    const event = req.body;

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

    try {
      // Xử lý thanh toán thành công, cập nhật trạng thái đơn hàng
      await this.stripeService.handlePaymentSuccess(session.id);
      res.status(200).send({ received: true });
    } catch (error) {
      console.error(`Error handling payment success for session ID: ${session.id}. Error: ${error}`);
      res.status(500).send('Webhook Error');
    }
    } else if (event.type === 'checkout.session.expired' || event.type === 'payment_intent.payment_failed') {
      const session = event.data.object;

      try {
        // Xử lý thất bại thanh toán, cập nhật trạng thái đơn hàng
        await this.stripeService.handlePaymentFailure(session.id, event.type);
        res.status(200).send({ received: true });
      } catch (error) {
        console.error(`Error handling payment failure for session ID: ${session.id}. Error: ${error}`);
        res.status(500).send('Webhook Error');
      }
      } else {
        res.status(400).send('Event not handled');
      }
    }
}
