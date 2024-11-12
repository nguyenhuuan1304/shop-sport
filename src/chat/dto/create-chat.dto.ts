import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateChatDto {
  @IsArray()
  participantIds: string[];

  @IsBoolean()
  @IsOptional()
  isGroup?: boolean;

  @IsString()
  @IsOptional()
  name?: string;
}