// src/chat/dto/create-message.dto.ts
import { IsString, IsUUID, IsOptional, IsEnum } from 'class-validator';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file'
}

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsUUID()
  chatId: string;

  @IsOptional()
  @IsString()
  attachmentUrl?: string;

  @IsOptional()
  @IsEnum(MessageType)
  messageType?: MessageType = MessageType.TEXT;
}