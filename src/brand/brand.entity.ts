import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Category } from '../category/category.entity';
import { Product } from '../products/product.entity';

@Entity('brands')
export class Brand {
    @PrimaryGeneratedColumn('uuid')
    _id: string;

    @ManyToOne(() => Category, (category) => category.brands, { onDelete: 'SET NULL' }) 
    @JoinColumn({ name: 'category_id' }) 
    category: Category;

    @Column()
    name: string;

    @OneToMany(() => Product, (product) => product.brand, { cascade: true })
    products: Product[];
}
