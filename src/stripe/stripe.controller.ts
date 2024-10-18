import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
constructor(private readonly stripeService: StripeService) {}

@Post('create-payment-intent')
async createPaymentIntent(
  @Body('amount') amount: number,
  @Body('currency') currency: string,
  @Body('token') token: string,
  ) {
    return await this.stripeService.createPaymentIntent(amount, currency, token);
}
}
