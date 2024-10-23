import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { UserModule } from '../users/user.module';
import { OrderDetail } from '../order_detail/orderDetail.entity';
import { OrderDetailModule } from '../order_detail/orderDetail.module';
import { CartModule } from '../cart/cart.module';
import { StripeModule } from '../stripe/stripe.module';
import { SizeModule } from '../size/size.module'; // Import SizeModule

@Module({
imports: [
    TypeOrmModule.forFeature([Order, OrderDetail]),
    UserModule,
    OrderDetailModule,
    forwardRef(() => CartModule),
    StripeModule,
    SizeModule, 
],
providers: [OrderService],
controllers: [OrderController],
exports: [OrderService],
})
export class OrderModule {}