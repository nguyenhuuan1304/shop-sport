import { Module, forwardRef } from '@nestjs/common';
import { ZaloPayController } from './zalopay.controller';
import { ZaloPayService } from './zalopay.service';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [forwardRef(() => OrderModule)], 
  controllers: [ZaloPayController],
  providers: [ZaloPayService],
  exports: [ZaloPayService], 
})
export class ZaloPayModule {}