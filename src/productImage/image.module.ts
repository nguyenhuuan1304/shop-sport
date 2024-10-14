import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImage } from './image.entity';
import { ProductImageService } from './image.service';
import { ProductImageController } from './image.controller';
import { Product } from '../products/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ProductImage, Product])],
    providers: [ProductImageService],
    controllers: [ProductImageController],
})
export class ProductImageModule {}
