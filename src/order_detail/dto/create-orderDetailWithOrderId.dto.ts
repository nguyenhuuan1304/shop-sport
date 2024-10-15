import { IsUUID, IsInt, IsPositive } from 'class-validator';

export class CreateOrderDetailWithOrderIdDto {
    @IsUUID()
    order_id: string;

    @IsUUID()
    product_id: string;

    @IsInt()
    @IsPositive()
    quantity: number;
}
