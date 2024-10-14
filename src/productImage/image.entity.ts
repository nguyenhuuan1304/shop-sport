import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity()
export class ProductImage {
    @PrimaryGeneratedColumn('uuid')
    _id: string;

    @ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' })
    product: Product;

    @Column('simple-array')
    link: string[];
}
