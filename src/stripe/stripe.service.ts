import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
// import { CreateOrderDto } from 'src/order/dto/create-order.dto';
// import { Product } from 'src/products/product.entity';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(private configService: ConfigService) {
        this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
            apiVersion: '2024-09-30.acacia',
        });
    }

    // async createStripe(OrderData: CreateOrderStripeDto): Promise<any>{
    //     const session = await iStripe.checkout.sessions.create({
    //         line_item: [
    //             {
    //             price_data: {
    //                 currency: 'usd',
    //                 unit_amount: Math.round(OrderData.price * 100),
    //                 Product_data: {
    //                     name: 'Sport',
    //                     description: OrderData.description,
    //                     images: [OrderData.logo],
    //                 },
    //             },
    //             quantity: 1,
    //         },
    //     ],
    //     mode: 'payment',
    //     success_url: OrderData.urlSuccess,
    //     cancel_url: OrderData.urlCancel,
    //     client_reference_id: OrderData.user_id,
    //     customer_email: OrderData.email,
    //     });
    //     return session;
    // }

    async createPaymentIntent(amount: number, currency: string, token: string) {
        const paymentMethod = await this.stripe.paymentMethods.create({
            type: 'card',
            card: { token },
        });
        
        return await this.stripe.paymentIntents.create({
            amount,
            currency,
            payment_method: paymentMethod.id,
            confirm: true,
            return_url: 'https://si-justplay.com/', 
            automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never',
            },
        });
    }
    async retrievePaymentIntent(paymentIntentId: string) {
        return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    }
}

