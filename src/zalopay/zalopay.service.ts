import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import moment from 'moment-timezone';
import { OrderService } from '../order/order.service';
import { OrderStatus } from '../order/order.entity';

@Injectable()
export class ZaloPayService {
  private appId: number;
  private key1: string;
  private key2: string;
  private endpoint = 'https://sb-openapi.zalopay.vn/v2/create';
  private endpointQuery = 'https://sb-openapi.zalopay.vn/v2/query';

  constructor(private configService: ConfigService, private orderService: OrderService) {
    this.appId = Number(this.configService.get<string>('ZALOPAY_APP_ID'));
    this.key1 = this.configService.get<string>('ZALOPAY_KEY1');
    this.key2 = this.configService.get<string>('ZALOPAY_KEY2');

    if (!this.appId || !this.key1 || !this.key2) {
      throw new Error('Missing environment configuration for ZaloPay');
    }
  }

  private createMac(data: string, key: string): string {
    return crypto.createHmac('sha256', key).update(data).digest('hex');
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
      bank_code: 'zalopayapp',
      callback_url: 'https://6f99-210-245-34-240.ngrok-free.app/zalopay/callback',
    };

    const dataString = `${this.appId}|${data.app_trans_id}|${data.app_user}|${data.amount}|${data.app_time}|${data.embed_data}|${data.item}`;
    data['mac'] = this.createMac(dataString, this.key1);

    console.log('Request Data:', data);

    try {
      const response = await axios.post(this.endpoint, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('ZaloPay Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating ZaloPay QR code:', error.response?.data || error.message);
      throw new InternalServerErrorException('ZaloPay QR code creation failed');
    }
  }

  async processCallback(body: any) {
    const { data: dataStr, mac: reqMac } = body;

    let data;
    try {
        data = JSON.parse(dataStr);
    } catch (error) {
        console.error("Error parsing data:", error);
        return { return_code: 0, return_message: "Invalid data format" };
    }

    // Log callback data from ZaloPay
    console.log("Received callback data:", data);

    // Verify MAC
    const mac = this.createMac(dataStr, this.key2);
    if (reqMac !== mac) {
        console.error("Invalid MAC");
        return { return_code: -1, return_message: "Invalid callback" };
    }

    const { app_trans_id, zp_trans_id } = data;

    try {
        // Cập nhật trạng thái đơn hàng dựa trên kết quả thanh toán
        if (zp_trans_id) {
            console.log(`Updating order ${app_trans_id} to SUCCESS`);
            await this.updateOrderStatus(app_trans_id, OrderStatus.SUCCESS);
            console.log(`Order ${app_trans_id} marked as SUCCESS.`);
        } else {
            console.log(`Updating order ${app_trans_id} to CANCEL`);
            await this.updateOrderStatus(app_trans_id, OrderStatus.CANCEL);
            console.log(`Order ${app_trans_id} marked as CANCEL.`);
        }

        return { return_code: 1, return_message: "Success" };
    } catch (error) {
        console.error("Error processing callback:", error);
        return { return_code: 0, return_message: "Exception" };
    }
}

async updateOrderStatus(appTransId: string, status: OrderStatus): Promise<void> {
  // Find order by appTransId as a string
  const order = await this.orderService.findOrderByAppTransId(appTransId); 
  if (!order) {
      throw new Error(`Order with appTransId ${appTransId} not found`);
  }
  console.log(`Order before update: ${JSON.stringify(order)}`);
  order.status = status;
  await this.orderService.saveOrder(order); 
  console.log(`Order after update: ${JSON.stringify(order)}`);
  console.log(`Order ${appTransId} status updated to ${status}`);
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
