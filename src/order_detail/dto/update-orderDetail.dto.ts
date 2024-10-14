import { IsInt, Min, IsDecimal, IsOptional } from 'class-validator';

export class UpdateOrderDetailDto {
    @IsInt()
    @Min(1)
    @IsOptional()
    quantity?: number;

    @IsDecimal({ decimal_digits: '2', force_decimal: true })
    @IsOptional()
    price?: number; // = price_product * quantity
}
