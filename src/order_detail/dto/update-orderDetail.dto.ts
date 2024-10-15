import { IsInt, Min, IsOptional } from 'class-validator';

export class UpdateOrderDetailDto {
    @IsInt()
    @Min(1)
    @IsOptional()
    quantity?: number;
}
