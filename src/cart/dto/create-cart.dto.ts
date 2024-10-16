import {  ValidateNested, ArrayMinSize, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCartItemDto } from '../../cart_item/dto/create-cartItem.dto';

export class CreateCartDto {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreateCartItemDto)
    cartItems: CreateCartItemDto[];
}