import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../order.entity';

export class UpdateOrderDto {
    @IsEnum(OrderStatus)
    @IsOptional()
    status?: OrderStatus;
}