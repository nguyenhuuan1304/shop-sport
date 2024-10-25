import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { OrderDetail } from '../order_detail/orderDetail.entity';
import moment from 'moment'; 
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class ZaloPayService {
  // private appId = process.env.ZALOPAY_APP_ID; 
    // private key1 = process.env.ZALOPAY_KEY1;  
    // private key2 = process.env.ZALOPAY_KEY2; 
    // private endpoint = 'https://sb-openapi.zalopay.vn/v2/create';

private appId: string;
private key1: string;
private key2: string;
private endpoint = 'https://sb-openapi.zalopay.vn/v2/create';

constructor() {
this.appId = process.env.ZALOPAY_APP_ID;
this.key1 = process.env.ZALOPAY_KEY1;
this.key2 = process.env.ZALOPAY_KEY2;

if (!this.appId || !this.key1 || !this.key2) {
throw new Error('Chưa cấu hình đúng biến môi trường cho ZaloPay');
}
console.log('App ID:', this.appId);
console.log('Key1:', this.key1);
}

getKey2(): string {
return this.key2;
}

generateChecksum(data: string, key: string): string {
return crypto.createHmac('sha256', key).update(data).digest('hex');
}

async createOrder(orderId: string, orderDetails: OrderDetail[], description: string, appUser: string) {
const now = Date.now();
const embed_data = {};

const items = orderDetails.map(od => od.product.name).join(', ');

const amount = orderDetails.reduce((total, od) => 
total + Math.round(od.price * od.quantity * 100), 0);

const transID = Math.floor(Math.random() * 1000000);
const data = {
app_id: this.appId,
app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
app_user: appUser || 'default_user@example.com',
app_time: now,
item: items,
embed_data: JSON.stringify(embed_data),
amount,
description: `Sport - Payment for the order #${transID}`,
bank_code: 'zalopayapp',
callback_url: 'http://localhost:3000/api/v1/zalopay/callback',
};

const dataStr = `${data.app_id}|${data.app_trans_id}|${data.app_user}|${data.amount}|${data.app_time}|${data.embed_data}|${data.item}`;
console.log('Data String for Checksum:', dataStr);
const checksum = this.generateChecksum(dataStr, this.key1);
data['mac'] = checksum;

console.log('Request Data:', data);

try {
const response = await axios.post(this.endpoint, data);
return response.data;
} catch (error) {
console.error('Error creating ZaloPay order:', error.response?.data || error.message);
throw new Error('ZaloPay order creation failed');
}
}
}