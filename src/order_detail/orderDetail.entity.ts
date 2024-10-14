import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from '../order/order.entity';
import { Product } from '../products/product.entity';

@Entity('order_details')
export class OrderDetail {
    @PrimaryGeneratedColumn('uuid')
    _id: string;

    @ManyToOne(() => Order, order => order.orderDetails, { onDelete: 'CASCADE' })
    order: Order;

    @ManyToOne(() => Product, product => product.orderDetails, { eager: true })
    product: Product;

    @Column('int')
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number; // = price_product * quantity
}
