import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity({ name: 'address' })
export class Address {
    @PrimaryGeneratedColumn('uuid')  
    id: string;

    @Column({ length: 500 })
    fullname: string;

    @Column()
    phone: string;

    @Column('text')
    address_book: string;

    @Column()
    description: string;

    @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'SET NULL' }) 
    @JoinColumn({ name: 'user_id' }) 
    user: User;
}