import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, Req, BadRequestException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { JwtAuthGuard } from '../users/JwtAuthGuard';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post()
    async createChat(@Body() createChatDto: CreateChatDto, @Req() request) {
        const creatorId = request.user.id;
        
        let participants = createChatDto.participantIds
            .filter(id => {
                // Kiểm tra format UUID
                const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
                // Loại bỏ id trùng với creator
                const isNotCreator = id !== creatorId;
                
                if (!isValidUUID) {
                    throw new BadRequestException(`Invalid UUID format: ${id}`);
                }
                
                return isValidUUID && isNotCreator;
            });

        if (participants.length === 0) {
            throw new BadRequestException('At least one valid participant (different from creator) is required');
        }

        // Loại bỏ các id trùng lặp
        participants = [...new Set(participants)];

        return this.chatService.createChat(
            creatorId,
            participants,
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