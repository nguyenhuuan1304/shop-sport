import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
    ) {}

    async create(createMessageDto: CreateMessageDto) {
        const message = this.messageRepository.create(createMessageDto);
        return await this.messageRepository.save(message);
    }

    async findAll() {
        return await this.messageRepository.find({
            relations: ['sender', 'chat'],
        });
    }

    async findOne(id: string) {
        const message = await this.messageRepository.findOne({
            where: { id },
            relations: ['sender', 'chat'],
        });
        if (!message) {
            throw new NotFoundException(`Message with ID "${id}" not found`);
        }
        return message;
    }

    async update(id: string, updateMessageDto: UpdateMessageDto) {
        const message = await this.findOne(id);
        Object.assign(message, updateMessageDto);
        return await this.messageRepository.save(message);
    }

    async remove(id: string) {
        const message = await this.findOne(id);
        return await this.messageRepository.remove(message);
    }

    async markAsRead(id: string) {
        const message = await this.findOne(id);
        message.isRead = true;
        return await this.messageRepository.save(message);
    }
}