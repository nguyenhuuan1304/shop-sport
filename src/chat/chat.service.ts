import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { Message } from '../message/message.entity';
import { User } from '../users/user.entity';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat)
        private chatRepository: Repository<Chat>,
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async createChat(creatorId: string, participantIds: string[], isGroup = false, name?: string) {
        const creator = await this.userRepository.findOneBy({ id: creatorId });
        if (!creator) throw new NotFoundException('Creator not found');

        if (participantIds.length === 0) {
            throw new BadRequestException('Participant IDs must be provided');
        }

        const chat = this.chatRepository.create({
            creator,
            participants: [creatorId, ...participantIds],
            isGroupChat: isGroup,
            name,
        });

        return this.chatRepository.save(chat);
    }

    async createMessage(data: { content: string; chatId: string; senderId: string }) {
        const chat = await this.chatRepository.findOneBy({ id: data.chatId });
        const sender = await this.userRepository.findOneBy({ id: data.senderId });

        if (!chat || !sender) throw new NotFoundException('Chat or sender not found');

        const message = this.messageRepository.create({
            content: data.content,
            chat,
            sender,
        });

        return this.messageRepository.save(message);
    }

    async getChatById(chatId: string) {
        const chat = await this.chatRepository.findOne({
            where: { id: chatId },
            relations: ['messages', 'messages.sender'],
        });
        if (!chat) throw new NotFoundException('Chat not found');
        return chat;
    }

    async getUserChats(userId: string) {
        return this.chatRepository.find({
            where: { participants: userId },
            relations: ['messages', 'messages.sender'],
            order: { updatedAt: 'DESC' },
        });
    }

    async getChatMessages(chatId: string) {
        await this.getChatById(chatId); 
        return this.messageRepository.find({
            where: { chat: { id: chatId } },
            relations: ['sender'],
            order: { createdAt: 'ASC' },
        });
    }

    async updateChat(chatId: string, updateChatDto: UpdateChatDto) {
        const chat = await this.getChatById(chatId);
        Object.assign(chat, updateChatDto);
        return this.chatRepository.save(chat);
    }

    async deleteChat(chatId: string) {
        const chat = await this.getChatById(chatId);
        chat.isActive = false;
        return this.chatRepository.save(chat);
    }

    async addParticipants(chatId: string, participantIds: string[]) {
        const chat = await this.getChatById(chatId);
        chat.participants = [...new Set([...chat.participants, ...participantIds])];
        return this.chatRepository.save(chat);
    }

    async removeParticipant(chatId: string, participantId: string) {
        const chat = await this.getChatById(chatId);
        chat.participants = chat.participants.filter(id => id !== participantId);
        return this.chatRepository.save(chat);
    }
}
