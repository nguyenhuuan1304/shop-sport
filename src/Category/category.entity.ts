import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Brand } from '../brand/brand.entity';
import { Product } from '../products/product.entity';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @OneToMany(() => Brand, (brand) => brand.category, { cascade: true })
    brands: Brand[];

    @OneToMany(() => Product, (product) => product.category, { cascade: true })
    products: Product[];
}
