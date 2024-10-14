import { IsNotEmpty, IsUUID, IsInt, Min } from 'class-validator';

export class CreateOrderDetailDto {
    @IsUUID()
    @IsNotEmpty()
    order_id: string; 

    @IsUUID()
    product_id: string;

    @IsInt()
    @Min(1)
    quantity: number;
}
