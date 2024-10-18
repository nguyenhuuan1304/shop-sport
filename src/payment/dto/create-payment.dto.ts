import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PaymentMethod } from '../payment.entity';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsNotEmpty()
  @IsString()
  token: string;
}

