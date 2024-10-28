import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import moment from 'moment-timezone';
import { OrderDetail } from '../order_detail/orderDetail.entity';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class ZaloPayService {
private appId: number;
private key1: string;
private key2: string;
private endpoint = 'https://sb-openapi.zalopay.vn/v2/create';

constructor(private configService: ConfigService) {
this.appId = Number(this.configService.get<string>('ZALOPAY_APP_ID'));
this.key1 = this.configService.get<string>('ZALOPAY_KEY1');
this.key2 = this.configService.get<string>('ZALOPAY_KEY2');

console.log('ZALOPAY_APP_ID:', this.appId);
console.log('ZALOPAY_KEY1:', this.key1);
console.log('ZALOPAY_KEY2:', this.key2);

if (!this.appId || !this.key1 || !this.key2) {
throw new Error('Chưa cấu hình đúng biến môi trường cho ZaloPay');
}
}

private createMac(data: string): string {
return crypto.createHmac('sha256', this.key1).update(data).digest('hex');
}

async createQRCode(orderId: string, orderDetails: OrderDetail[], appUser: string) {
const items = orderDetails.map(od => ({
itemid: od.product._id,
itemname: od.product.name,
itemprice: Math.round(od.product.price * 1000),
itemquantity: od.quantity,
}));

const amount = Math.round(
orderDetails.reduce((total, od) => total + (od.product.price * od.quantity * 1000), 0)
);
const app_time = Date.now();
const app_trans_id = `${moment().tz("Asia/Ho_Chi_Minh").format('YYMMDD')}_${Math.floor(Math.random() * 1000000)}`;

const data = {
app_id: this.appId,
app_trans_id,
app_user: appUser,
app_time,
item: JSON.stringify(items),
embed_data: '{}',
amount,
description: `Sport - Thanh toán đơn hàng #${app_trans_id}`,
bank_code: 'zalopayapp', // Chỉ định thanh toán qua ví ZaloPay
callback_url: 'http://localhost:3000/api/v1/zalopay/callback',
};

const dataString = `${this.appId}|${data.app_trans_id}|${data.app_user}|${data.amount}|${data.app_time}|${data.embed_data}|${data.item}`;
data['mac'] = this.createMac(dataString);

console.log('Request Data:', data);

try {
const response = await axios.post(this.endpoint, data);
console.log('ZaloPay Response:', response.data);
return response.data;
} catch (error) {
console.error('Error creating ZaloPay QR code:', error.response?.data || error.message);
throw new InternalServerErrorException('ZaloPay QR code creation failed');
}
}
}