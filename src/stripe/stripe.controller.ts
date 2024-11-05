import { Controller, Post, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './stripe.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhookController {
  constructor(private readonly stripeService: StripeService) {}

  /**
   * Stripe Webhook Handler
   * URL: POST /webhooks/stripe
   */
  @ApiOperation({ summary: 'Handle Stripe webhook events' })
  @Post('stripe')
  async handleStripeWebhook(@Req() req: Request, @Res() res: Response) {
    const event = req.body;
    console.log('Received Stripe event:', event);

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          await this.stripeService.handlePaymentSuccess(session.id);
          res.status(200).send({ received: true });
          break;

        case 'invoice.payment_succeeded':
          const invoice = event.data.object;
          await this.stripeService.handleInvoicePaymentSuccess(invoice.id);
          res.status(200).send({ received: true });
          break;

        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          await this.stripeService.handlePaymentIntentSuccess(paymentIntent.id);
          res.status(200).send({ received: true });
          break;

        case 'payment_intent.payment_failed':
          const failedPaymentIntent = event.data.object;
          await this.stripeService.handlePaymentIntentFailure(failedPaymentIntent.id);
          res.status(200).send({ received: true });
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
          res.status(400).send('Event not handled');
          break;
      }
    } catch (error) {
      console.error(`Error handling Stripe event: ${event.type}. Error: ${error}`);
      throw new HttpException('Webhook Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
