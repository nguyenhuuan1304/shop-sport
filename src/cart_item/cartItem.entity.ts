import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Cart } from '../cart/cart.entity';
import { Product } from '../products/product.entity';

@Entity('cart_items')
export class CartItem {
    @PrimaryGeneratedColumn('uuid')
    _id: string;

    @ManyToOne(() => Cart, cart => cart.cartItems, { onDelete: 'CASCADE' })
    cart: Cart;

    @ManyToOne(() => Product, product => product.cartItems, { eager: true })
    product: Product;

    @Column('int', { default: 1 })
    quantity: number;

    @CreateDateColumn({ type: 'timestamp' })
    added_at: Date;
}
