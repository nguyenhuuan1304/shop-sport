import { IsString, IsNotEmpty, IsUUID, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
    @IsUUID()
    @IsNotEmpty()
    category_id: string;

    @IsUUID()
    @IsNotEmpty()
    brand_id: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    price: number;

    @IsString()
    @IsNotEmpty()
    color: string;

    @IsString()
    @IsNotEmpty()
    material: string; 

    @IsString()
    @IsNotEmpty()
    description: string;
}
