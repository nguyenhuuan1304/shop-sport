import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetail } from './orderDetail.entity';
import { OrderDetailService } from './orderDetail.service';
import { OrderDetailController } from './orderDetail.controller';
import { ProductModule } from '../products/product.module';
import { Order } from '../order/order.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([OrderDetail, Order]),
        ProductModule, 
    ],
    providers: [OrderDetailService],
    controllers: [OrderDetailController],
    exports: [OrderDetailService],
})
export class OrderDetailModule {}
