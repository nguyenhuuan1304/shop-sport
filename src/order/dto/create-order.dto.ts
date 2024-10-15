import { IsEnum, ValidateNested, ArrayMinSize, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../order.entity';
import { CreateOrderDetailDto } from '../../order_detail/dto/create-orderDetail.dto';

export class CreateOrderDto {
    @IsEnum(OrderStatus)
    status: OrderStatus;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreateOrderDetailDto)
    orderDetails: CreateOrderDetailDto[];
}
