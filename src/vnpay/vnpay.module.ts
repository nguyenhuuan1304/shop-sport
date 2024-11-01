import { Module } from '@nestjs/common';
import { VNPayController } from './vnpay.controller';
import { VNPayService } from './vnpay.service';
import { OrderModule } from '../order/order.module'; 

@Module({
  imports: [OrderModule], 
  controllers: [VNPayController],
  providers: [VNPayService],
  exports: [VNPayService],
})
export class VNPayModule {}