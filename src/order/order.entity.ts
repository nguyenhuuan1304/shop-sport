import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { OrderDetail } from '../order_detail/orderDetail.entity';
import { Payment } from '../payment/payment.entity';

export enum OrderStatus {
    PENDING = 'pending',
    SUCCESS = 'success',
    CANCEL = 'cancel',
}

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    _id: string;

    @ManyToOne(() => User, user => user.orders, { eager: true })
    user: User;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status: OrderStatus;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => OrderDetail, orderDetail => orderDetail.order, { cascade: true })
    orderDetails: OrderDetail[];

    @OneToMany(() => Payment, payments => payments.order, { cascade: true })
    payments: Payment[];

}
