import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImage } from './image.entity';
import { CreateProductImageDto } from './dto/create-image.dto';
import { UpdateProductImageDto } from './dto/update-image.dto';
import { Product } from '../products/product.entity';
import { Express } from 'express'; 
import cloudinary from '../cloudinary/cloudinary.provider';


@Injectable()
export class ProductImageService {
    constructor(
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    ) {}

    async uploadToCloudinary(file: Express.Multer.File): Promise<string> {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'product_images',
        });
        return result.secure_url; // URL của ảnh sau khi upload lên Cloudinary
    }
    async create(createProductImageDto: CreateProductImageDto, file: Express.Multer.File): Promise<ProductImage> {
        const { product_id } = createProductImageDto;
    
        const product = await this.productRepository.findOne({ where: { _id: product_id } });
        if (!product) {
          throw new NotFoundException('Product không tồn tại');
        }
    
        // Upload file lên Cloudinary
        const imageUrl = await this.uploadToCloudinary(file);
    
        const productImage = this.productImageRepository.create({
          product,
          link: imageUrl, 
        });
    
        return await this.productImageRepository.save(productImage);
    }

    async findAll(): Promise<ProductImage[]> {
        return await this.productImageRepository.find({ relations: ['product'] });
    }

    // Lấy ProductImage theo ID
    async findOne(id: string): Promise<ProductImage> {
        const productImage = await this.productImageRepository.findOne({
            where: { _id: id },
            relations: ['product'],
        });
        if (!productImage) {
            throw new NotFoundException('ProductImage không tồn tại');
        }
        return productImage;
    }

    // Cập nhật ProductImage
    async update(id: string, updateProductImageDto: UpdateProductImageDto): Promise<ProductImage> {
        const { product_id, link } = updateProductImageDto;
        
        const productImage = await this.productImageRepository.findOne({
        where: { _id: id },
        relations: ['product'],
        });
        if (!productImage) {
        throw new NotFoundException('ProductImage không tồn tại');
        }
        
        if (product_id) {
        const product = await this.productRepository.findOne({ where: { _id: product_id } });
        if (!product) {
        throw new NotFoundException('Product không tồn tại');
        }
        productImage.product = product;
        }
        
        if (link !== undefined) {
        //productImage.link = link;
        }
        
        return await this.productImageRepository.save(productImage);
    }
        

    // Xóa ProductImage
    async remove(id: string): Promise<void> {
        const productImage = await this.findOne(id);
        await this.productImageRepository.remove(productImage);
    }
}
