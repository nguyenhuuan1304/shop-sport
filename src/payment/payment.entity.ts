import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Order } from '../order/order.entity';

export enum PaymentMethod {
    Stripe = 'Stripe',
    MoMo = 'MoMo',
    ZaloPay = 'ZaloPay',
}

export enum PaymentStatus {
    PENDING = 'pending',
    SUCCESS = 'success',
    CANCEL = 'cancel',
}

@Entity()
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    _id: string;

    @ManyToOne(() => Order, (order) => order.payments)
    order: Order;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'enum', enum: PaymentMethod })
    method: PaymentMethod;

    @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
    status: PaymentStatus;

    @Column()
    transaction_id: string;

    @CreateDateColumn()
    created_at: Date;
}
