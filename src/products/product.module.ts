import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Category } from '../category/category.entity';
import { Brand } from '../brand/brand.entity';
import { Size } from 'src/size/size.entity';
import { ProductImage } from 'src/productImage/image.entity';
import { UserModule } from '../users/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([Product, Category, Brand, Size, ProductImage]),
    UserModule,
],
    providers: [ProductService],
    controllers: [ProductController],
    exports: [TypeOrmModule],
})
export class ProductModule {}
