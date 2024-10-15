import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Category } from '../category/category.entity';
import { Brand } from '../brand/brand.entity';
import { Size } from '../size/size.entity';
import { ProductImage } from '../productImage/image.entity';
import { OrderDetail } from '../order_detail/orderDetail.entity';
import { CartItem } from '../cart_item/cartItem.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    _id: string;

    @Column({ unique: true })
    sku: string;

    @ManyToOne(() => Category, (category) => category.products, { onDelete: 'SET NULL' }) 
    @JoinColumn({ name: 'category_id' }) 
    category: Category;

    @ManyToOne(() => Brand, (brand) => brand.products, { onDelete: 'SET NULL' }) 
    @JoinColumn({ name: 'brand_id' }) 
    brand: Brand;

    @Column()
    name: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column()
    color: string;

    @Column()
    material: string; 

    @Column()
    description: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date; 

    @OneToMany(() => Size, (size) => size.product, { cascade: true })
    sizes: Size[];

    @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
    images: ProductImage[];

    @OneToMany(() => OrderDetail, orderDetail => orderDetail.product)
    orderDetails: OrderDetail[];

    @OneToMany(() => CartItem, cartItem => cartItem.product)
    cartItems: CartItem[];

}
