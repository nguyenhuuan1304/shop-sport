import { IsInt, Min, IsOptional } from 'class-validator';

export class UpdateCartItemDto {
    @IsInt()
    @Min(1)
    @IsOptional()
    quantity?: number;
}
