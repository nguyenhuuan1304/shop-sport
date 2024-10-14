import { IsUUID, IsArray, ArrayNotEmpty, IsUrl } from 'class-validator';

export class CreateProductImageDto {
    @IsUUID()
    product_id: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsUrl({}, { each: true })
    link: string[];
}