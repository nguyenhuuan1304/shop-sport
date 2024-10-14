import { IsString, IsNotEmpty, IsUUID, IsInt, Min } from 'class-validator';

export class CreateSizeDto {
    @IsUUID()
    @IsNotEmpty()
    product_id: string;

    @IsString()
    @IsNotEmpty()
    size_name: string;

    @IsInt()
    @Min(0)
    stock: number;
}
