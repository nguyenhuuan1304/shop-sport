import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateBrandDto {
    @IsUUID()
    @IsNotEmpty()
    Category_id: string; 

    @IsString()
    @IsNotEmpty()
    name: string;
}