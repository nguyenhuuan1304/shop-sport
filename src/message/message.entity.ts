import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Chat } from '../chat/chat.entity';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    content: string;

    @ManyToOne(() => User, user => user.messages)
    sender: User;

    @ManyToOne(() => Chat, chat => chat.messages)
    chat: Chat;

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ nullable: true })
    attachmentUrl: string;

    @Column({ default: 'text' })
    messageType: string; // 'text', 'image', 'file'
}