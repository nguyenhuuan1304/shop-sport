import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeService } from './stripe.service';
import { Order } from '../order/order.entity';
import { ConfigModule } from '@nestjs/config';
import { WebhookController } from './stripe.controller'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    ConfigModule, 
  ],
  providers: [StripeService],
  controllers: [WebhookController], 
  exports: [StripeService],
})
export class StripeModule {}
