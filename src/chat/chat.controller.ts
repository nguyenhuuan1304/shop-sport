import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { JwtAuthGuard } from '../users/JwtAuthGuard';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post()
    async createChat(@Request() req, @Body() createChatDto: CreateChatDto) {
        return this.chatService.createChat(
            req.user.id,
            createChatDto.participantIds,
            createChatDto.isGroup,
            createChatDto.name
        );
    }

    @Get()
    async getUserChats(@Request() req) {
        return this.chatService.getUserChats(req.user.id);
    }

    @Get(':id')
    async getChatById(@Param('id') chatId: string) {
        return this.chatService.getChatById(chatId);
    }

    @Get(':id/messages')
    async getChatMessages(@Param('id') chatId: string) {
        return this.chatService.getChatMessages(chatId);
    }

    @Post(':id/messages')
    async createMessage(
        @Request() req,
        @Param('id') chatId: string,
        @Body() messageData: { content: string }
    ) {
        return this.chatService.createMessage({
            content: messageData.content,
            chatId: chatId,
            senderId: req.user.id
        });
    }

    @Put(':id')
    async updateChat(
        @Param('id') chatId: string,
        @Body() updateChatDto: UpdateChatDto
    ) {
        return this.chatService.updateChat(chatId, updateChatDto);
    }

    @Delete(':id')
    async deleteChat(@Param('id') chatId: string) {
        return this.chatService.deleteChat(chatId);
    }

    @Post(':id/participants')
    async addParticipants(
        @Param('id') chatId: string,
        @Body() data: { participantIds: string[] }
    ) {
        return this.chatService.addParticipants(chatId, data.participantIds);
    }

    @Delete(':id/participants/:participantId')
    async removeParticipant(
        @Param('id') chatId: string,
        @Param('participantId') participantId: string
    ) {
        return this.chatService.removeParticipant(chatId, participantId);
    }
}