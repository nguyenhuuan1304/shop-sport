import { Controller, Post, Patch, Body, Param, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payments')
export class PaymentController {
constructor(private readonly paymentService: PaymentService) {}

  // POST: Tạo thanh toán mới
  @Post(':orderId')
  async createPayment(
    @Param('orderId') orderId: string,
    @Body() createPaymentDto: CreatePaymentDto,
    ) {
      return this.paymentService.createPayment(orderId, createPaymentDto);
  }

  // GET: Lấy thông tin thanh toán
  @Get(':paymentId')
  async getPayment(
  @Param('paymentId') paymentId: string,
) {
return this.paymentService.getPayment(paymentId);
}


  // PATCH: Cập nhật trạng thái thanh toán
  @Patch(':paymentId')
  async updatePaymentStatus(
    @Param('paymentId') paymentId: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
    ) {
      return this.paymentService.updatePaymentStatus(paymentId, updatePaymentDto);
  }
}