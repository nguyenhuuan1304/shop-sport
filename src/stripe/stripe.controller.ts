import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './stripe.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('stripe')
  async handleStripeWebhook(@Req() req: Request, @Res() res: Response) {
    console.log('Webhook received:', req.body); 

    const event = req.body;
    console.log('Received Stripe event:', event);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      try {
        await this.stripeService.handlePaymentSuccess(session.id);
        res.status(200).send({ received: true });
      } catch (error) {
        console.error(`Error handling payment success for session ID: ${session.id}. Error: ${error}`);
        res.status(500).send('Webhook Error');
      }
    } else {
      res.status(400).send('Event not handled');
    }
  }
}
