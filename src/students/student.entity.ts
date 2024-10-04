import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity({ name: 'student' })
export class Student {
    @PrimaryGeneratedColumn('uuid')  
    id: string;

    @Column({ length: 500 })
    fullname: string;

    @Column()
    email: string;

    @Column('text')
    address: string;

    @ManyToOne(() => User, (user) => user.students)
    user: User;
}
