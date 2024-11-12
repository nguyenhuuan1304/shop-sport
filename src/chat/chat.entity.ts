import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Message } from '../message/message.entity';

@Entity('chats')
export class Chat {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    name: string; // Cho group chat

    @Column({ default: false })
    isGroupChat: boolean;

    @ManyToOne(() => User, user => user.chats)
    creator: User;

    @OneToMany(() => Message, message => message.chat)
    messages: Message[];

    @Column('simple-array')
    participants: string[]; // Array of user IDs

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ default: true })
    isActive: boolean;
}