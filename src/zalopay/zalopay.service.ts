import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import moment from 'moment-timezone';
import { OrderService } from '../order/order.service';

@Injectable()
export class ZaloPayService {
  public appId: number;
  public key1: string;
  public key2: string;
  public endpoint = 'https://sb-openapi.zalopay.vn/v2/create';
  public endpointQuery = 'https://sb-openapi.zalopay.vn/v2/query';

  constructor(private configService: ConfigService, private orderService: OrderService) {
    this.appId = Number(this.configService.get<string>('ZALOPAY_APP_ID'));
    this.key1 = this.configService.get<string>('ZALOPAY_KEY1');
    this.key2 = this.configService.get<string>('ZALOPAY_KEY2');

    if (!this.appId || !this.key1 || !this.key2) {
      throw new Error('Missing environment configuration for ZaloPay');
    }
  }

  public createMac(data: string, key: string): string {
    return crypto.createHmac('sha256', key).update(data).digest('hex');
  }

  getKey2(): string {
    return this.key2;
  }

  async createQRCode(orderId: string, orderDetails: any[], appUser: string) {
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
    const app_trans_id = `${moment().tz("Asia/Ho_Chi_Minh").format('YYMMDD')}${Math.floor(Math.random() * 1000000)}`;
  
    const data = {
      app_id: this.appId,
      app_trans_id,
      app_user: appUser,
      app_time,
      item: JSON.stringify(items),
      embed_data: JSON.stringify({ orderId }),
      amount,
      description: `Sport - Thanh toán đơn hàng #${app_trans_id}`,
      bank_code: 'zalopayapp',
      callback_url: 'https://30f7-210-245-34-240.ngrok-free.app/zalopay/callback',
    };
  
    const dataString = `${this.appId}|${data.app_trans_id}|${data.app_user}|${data.amount}|${data.app_time}|${data.embed_data}|${data.item}`;
    data['mac'] = this.createMac(dataString, this.key1);
  
    try {
      const response = await axios.post(this.endpoint, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      await this.orderService.updateAppTransId(orderId, app_trans_id);
      
      const zaloPayOrder = response.data;
      return {
        ...zaloPayOrder,
        app_trans_id
      };
      
    } catch (error) {
      console.error('Error creating ZaloPay QR code:', error.response?.data || error.message);
      throw new InternalServerErrorException('ZaloPay QR code creation failed');
    }
  }

  async queryOrderStatus(appTransId: string) {
    const postData = {
      app_id: this.appId,
      app_trans_id: appTransId,
    };

    const dataString = `${postData.app_id}|${postData.app_trans_id}|${this.key1}`;
    postData['mac'] = this.createMac(dataString, this.key1);

    try {
      const response = await axios.post(this.endpointQuery, postData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { data } = response;
      if (data.return_code === 1) {
        return { status: 'SUCCESS', data };
      } else if (data.return_code === 3) {
        return { status: 'PENDING', data };
      } else {
        return { status: 'FAILED', data };
      }
    } catch (error) {
      console.error('Error querying order status:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to query order status');
    }
  }
}