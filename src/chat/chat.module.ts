import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Chat } from './chat.entity';
import { Message } from './message.entity';
import { User } from '../users/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([Chat, Message, User]),
        JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1d' },
        }),
    ],
    providers: [ChatGateway, ChatService],
    exports: [ChatService],
})
export class ChatModule {}