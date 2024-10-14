import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from '../category/category.entity';
import { Brand } from '../brand/brand.entity';
import { UserService } from '../users/user.service';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,

        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,

        @InjectRepository(Brand)
        private brandRepository: Repository<Brand>,

        private userService: UserService, 
    ) {}

    async generateUniqueSku(): Promise<string> {
        let sku: string;
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 5;

        do {
            const randomNumber = Math.floor(100000 + Math.random() * 900000);
            sku = `SP${randomNumber}master`;

            const existingProduct = await this.productRepository.findOne({ where: { sku } });
            if (!existingProduct) {
                isUnique = true;
            }

            attempts += 1;
            if (attempts >= maxAttempts) {
                throw new BadRequestException('Không thể tạo SKU duy nhất, vui lòng thử lại sau.');
            }
        } while (!isUnique);

        return sku;
    }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const { category_id, brand_id, name, price, color, material, description } = createProductDto;

        const category = await this.categoryRepository.findOne({ where: { id: category_id } });
        if (!category) {
            throw new NotFoundException('Category không tồn tại');
        }

        const brand = await this.brandRepository.findOne({ where: { _id: brand_id } });
        if (!brand) {
            throw new NotFoundException('Brand không tồn tại');
        }

        const sku = await this.generateUniqueSku();

        const product = this.productRepository.create({
            sku,
            category,
            brand,
            name,
            price,
            color,
            material,
            description,
        });

        return await this.productRepository.save(product);
    }

    async findAll(): Promise<Product[]> {
        return await this.productRepository.find({ relations: ['category', 'brand', 'sizes', 'images'] });
    }

    /**
     * Lấy sản phẩm theo ID và cập nhật danh sách đã xem của người dùng
     * @param id ID của sản phẩm
     * @param userId ID của người dùng
     * @returns Sản phẩm
     */
    async findOne(id: string, userId: string): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { _id: id },
            relations: ['category', 'brand', 'sizes', 'images'],
        });
        if (!product) {
            throw new NotFoundException('Product không tồn tại');
        }

        // Cập nhật danh sách sản phẩm đã xem gần đây của người dùng
        await this.userService.updateRecentlyViewed(userId, id);

        return product;
    }

    async getLatestProducts(): Promise<Product[]> {
        return await this.productRepository.find({
            order: { created_at: 'DESC' },
            relations: ['category', 'brand', 'sizes', 'images'],
        });
    }

    async getProductsByLowPrice(): Promise<Product[]> {
        return await this.productRepository.find({
            order: { price: 'ASC' },
            relations: ['category', 'brand', 'sizes', 'images'],
        });
    }

    async getProductsByHighPrice(): Promise<Product[]> {
        return await this.productRepository.find({
            order: { price: 'DESC' },
            relations: ['category', 'brand', 'sizes', 'images'],
        });
    }

    async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
        const { category_id, brand_id, name, price, color, material, description } = updateProductDto;

        const product = await this.productRepository.findOne({ where: { _id: id }, relations: ['category', 'brand', 'sizes', 'images'] });
        if (!product) {
            throw new NotFoundException('Product không tồn tại');
        }

        if (category_id) {
            const category = await this.categoryRepository.findOne({ where: { id: category_id } });
            if (!category) {
                throw new NotFoundException('Category không tồn tại');
            }
            product.category = category;
        }

        if (brand_id) {
            const brand = await this.brandRepository.findOne({ where: { _id: brand_id } });
            if (!brand) {
                throw new NotFoundException('Brand không tồn tại');
            }
            product.brand = brand;
        }

        if (updateProductDto.name !== undefined) product.name = name;
        if (updateProductDto.price !== undefined) product.price = price;
        if (updateProductDto.color !== undefined) product.color = color;
        if (updateProductDto.material !== undefined) product.material = material;
        if (updateProductDto.description !== undefined) product.description = description;

        return await this.productRepository.save(product);
    }

    async remove(id: string): Promise<void> {
        const product = await this.productRepository.findOne({ where: { _id: id } });
        if (!product) {
            throw new NotFoundException('Product không tồn tại');
        }
        await this.productRepository.remove(product);
    }
    
    /**
     * Lấy các sản phẩm đã xem gần đây của người dùng
     * @param userId ID của người dùng
     * @returns Danh sách các sản phẩm đã xem gần đây
     */
    async getRecentlyViewedProducts(userId: string): Promise<Product[]> {
        const productIds = await this.userService.getRecentlyViewedProducts(userId);
        if (productIds.length === 0) {
            return [];
        }

        const products = await this.productRepository.find({
            where: { _id: In(productIds) },
            relations: ['category', 'brand', 'sizes', 'images'],
        });

        // Đảm bảo sắp xếp theo thứ tự của productIds
        const sortedProducts = productIds
            .map(id => products.find(p => p._id === id))
            .filter(p => p !== undefined);

        return sortedProducts;
    }
}
