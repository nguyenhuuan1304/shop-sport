import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Product } from '../products/product.entity';
import { CartItem } from '../cart_item/cartItem.entity';
import { OrderDetail } from '../order_detail/orderDetail.entity';

@Entity('sizes')
export class Size {
    @PrimaryGeneratedColumn('uuid')
    _id: string;

    @ManyToOne(() => Product, product => product.sizes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column()
    size_name: string;

    @Column('int')
    stock: number;

    @OneToMany(() => CartItem, cartItem => cartItem.size)
    cartItems: CartItem[];

    @OneToMany(() => OrderDetail, orderDetail => orderDetail.size)
    orderDetails: OrderDetail[];
}
