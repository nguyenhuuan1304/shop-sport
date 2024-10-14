import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { UserModule } from '../users/user.module';
import { OrderDetail } from 'src/order_detail/orderDetail.entity';
import { OrderDetailModule } from 'src/order_detail/orderDetail.module'; 

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, OrderDetail]),
        UserModule,
        OrderDetailModule, 
    ],
    providers: [OrderService],
    controllers: [OrderController],
    exports: [OrderService],
})

export class OrderModule {}