import { IsUUID, IsInt, IsPositive } from 'class-validator';

export class CreateCartItemDto {
    @IsUUID()
    product_id: string;

    @IsUUID()
    size_id: string;

    @IsInt()
    @IsPositive()
    quantity: number;
}
