import { Module } from '@nestjs/common';
import { ZaloPayService } from './zalopay.service';

@Module({
    providers: [ZaloPayService],
    exports: [ZaloPayService],
})
export class ZaloPayModule {}