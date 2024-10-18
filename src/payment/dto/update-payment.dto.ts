import { IsEnum, IsNotEmpty } from 'class-validator';
import { PaymentStatus } from '../payment.entity';

export class UpdatePaymentDto {
  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;
}