  import { Module } from '@nestjs/common';
  import { TypeOrmModule } from '@nestjs/typeorm';
  import { StripeService } from './stripe.service';
  import { Order } from '../order/order.entity';
  import { ConfigModule } from '@nestjs/config';

  @Module({
    imports: [
      TypeOrmModule.forFeature([Order]),
      ConfigModule, 
    ],
    providers: [StripeService],
    exports: [StripeService],
  })
  export class StripeModule {}
