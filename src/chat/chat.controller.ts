import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../users/JwtAuthGuard';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post()
    createChat(@Body() createChatDto: { participantIds: string[]; isGroup: boolean; name?: string }) {
        return this.chatService.createChat(
        createChatDto.participantIds[0],
        createChatDto.participantIds.slice(1),
        createChatDto.isGroup,
        createChatDto.name,
        );
    }

    @Get('user/:userId')
    getUserChats(@Param('userId') userId: string) {
        return this.chatService.getUserChats(userId);
    }

    @Get(':chatId/messages')
    getChatMessages(@Param('chatId') chatId: string) {
        return this.chatService.getChatMessages(chatId);
    }
}
