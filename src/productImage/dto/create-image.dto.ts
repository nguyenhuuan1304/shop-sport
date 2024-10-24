import { IsNotEmpty } from 'class-validator';

export class CreateProductImageDto {
    @IsNotEmpty()
    product_id: string;
}
