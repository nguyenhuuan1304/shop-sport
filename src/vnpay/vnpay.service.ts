import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as querystring from 'qs';
import { format } from 'date-fns';
import { Order } from '../order/order.entity'; 

@Injectable()
export class VNPayService {
    private tmnCode: string;
    private hashSecret: string;
    private vnpUrl: string;
    private returnUrl: string;

    constructor(private configService: ConfigService) {
        this.tmnCode = this.configService.get<string>('vnp_TmnCode');
        this.hashSecret = this.configService.get<string>('vnp_HashSecret');
        this.vnpUrl = this.configService.get<string>('vnp_Url');
        this.returnUrl = this.configService.get<string>('vnp_ReturnUrl');
    }

    createPaymentUrl(order: Order, ipAddr: string) {
        const createDate = format(new Date(), 'yyyyMMddHHmmss');
        const orderId = order._id;

        const vnpParams: Record<string, string | number> = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: this.tmnCode,
            vnp_Amount: Math.round(order.orderDetails.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100),
            vnp_CreateDate: createDate,
            vnp_CurrCode: 'VND',
            vnp_IpAddr: ipAddr, 
            vnp_Locale: 'vn',
            vnp_OrderInfo: encodeURIComponent(`Don hang ${orderId}`.replace(/[^a-zA-Z0-9 ]/g, '')),
            vnp_OrderType: 'billpayment',
            vnp_ReturnUrl: this.returnUrl,
            vnp_TxnRef: orderId,
            vnp_ExpireDate: format(new Date(Date.now() + 15 * 60 * 1000), 'yyyyMMddHHmmss')
        };

        const sortedParams = this.sortObject(vnpParams);
        const signData = querystring.stringify(sortedParams, { encode: false });
        console.log("signData:", signData);

        const hmac = crypto.createHmac('sha512', this.hashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        console.log("signed:", signed);

        vnpParams.vnp_SecureHash = signed;

        return `${this.vnpUrl}?${querystring.stringify(vnpParams, { encode: false })}`;
    }

    verifyReturnUrl(vnpParams: Record<string, string>) {
        const { vnp_SecureHash: secureHash, ...restParams } = vnpParams;

        const sortedParams = this.sortObject(restParams);
        const signData = querystring.stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac('sha512', this.hashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        return secureHash === signed;
    }

    processIpnUrl(vnpParams: Record<string, string>) {
        const { vnp_SecureHash: secureHash, ...restParams } = vnpParams;

        const sortedParams = this.sortObject(restParams);
        const signData = querystring.stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac('sha512', this.hashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        if (secureHash === signed) {
        const { vnp_TxnRef: orderId, vnp_ResponseCode: rspCode } = vnpParams;
        console.log(`Processing payment for order ${orderId} with response code ${rspCode}`);
        return { RspCode: '00', Message: 'success' };
        }

        return { RspCode: '97', Message: 'Fail checksum' };
    }

    private sortObject(obj: Record<string, string | number>) {
        const sortedKeys = Object.keys(obj).sort();
        return sortedKeys.reduce((result, key) => {
            result[key] = obj[key];
            return result;
        }, {} as Record<string, string | number>);
    }
}
