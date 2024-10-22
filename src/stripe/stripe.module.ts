import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeService } from './stripe.service';
import { Order } from '../order/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}