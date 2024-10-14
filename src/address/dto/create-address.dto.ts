import { IsString, IsUUID, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAddressDto {
    @IsString()
    @IsNotEmpty()
    fullname: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    address_book: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsUUID()
    userId: string;
}