import { IsUUID, IsOptional, IsArray, IsUrl } from 'class-validator';

export class UpdateProductImageDto {
    @IsUUID()
    @IsOptional()
    product_id?: string;

    @IsArray()
    @IsOptional()
    @IsUrl({}, { each: true })
    link?: string[];
}