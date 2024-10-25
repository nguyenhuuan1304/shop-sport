import { Controller, Post, Body } from '@nestjs/common';
import { ZaloPayService } from './zalopay.service';

@Controller('zalopay')
export class ZaloPayController {
    constructor(private readonly zaloPayService: ZaloPayService) {}

    @Post('callback')
    async handleCallback(@Body() payload: any) {
        const { return_code, return_message, mac, ...rest } = payload;

        const dataStr = `${rest.app_id}|${rest.app_trans_id}|${rest.app_user}|${rest.amount}|${rest.app_time}|${rest.embed_data}|${rest.item}`;
        const key2 = this.zaloPayService.getKey2();  
        const checksum = this.zaloPayService.generateChecksum(dataStr, key2);

        if (mac !== checksum) {
            console.error('MAC không hợp lệ từ ZaloPay');
            return { return_code: -1, return_message: 'Invalid MAC' };
        }

        if (return_code === 1) {
            console.log('Giao dịch thành công:', rest);
        } else {
            console.error('Giao dịch thất bại:', return_message);
        }

        return { return_code: 1, return_message: 'success' };
    }
}
