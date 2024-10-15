import { IsUUID, IsInt, IsPositive } from 'class-validator';

export class CreateOrderDetailDto {
    @IsUUID()
    product_id: string;

    @IsInt()
    @IsPositive()
    quantity: number;
}
