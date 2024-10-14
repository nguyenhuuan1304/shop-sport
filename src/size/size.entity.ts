import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity('sizes')
export class Size {
    @PrimaryGeneratedColumn('uuid')
    _id: string;

    @ManyToOne(() => Product, (product) => product.sizes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column()
    size_name: string;

    @Column('int')
    stock: number;
}
