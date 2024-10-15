import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { CartItem } from '../cart_item/cartItem.entity';

@Entity('carts')
export class Cart {
    @PrimaryGeneratedColumn('uuid')
    _id: string;

    @ManyToOne(() => User, user => user.carts, { onDelete: 'CASCADE' })
    user: User;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @OneToMany(() => CartItem, cartItem => cartItem.cart, { cascade: true })
    cartItems: CartItem[];
}
