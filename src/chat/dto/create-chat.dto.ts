import { IsArray, IsBoolean, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateChatDto {
    @IsArray()
    @IsNotEmpty()
    participantIds: string[];

    @IsBoolean()
    @IsOptional()
    isGroup?: boolean;

    @IsString()
    @IsOptional()
    name?: string;
}