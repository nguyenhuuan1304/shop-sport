import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Size } from './size.entity';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { Product } from '../products/product.entity';

@Injectable()
export class SizeService {
    constructor(
        @InjectRepository(Size)
        private sizeRepository: Repository<Size>,

        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {}

    // Tạo Size mới
    async create(createSizeDto: CreateSizeDto): Promise<Size> {
        const { product_id, size_name, stock } = createSizeDto;

        // Kiểm tra Product tồn tại
        const product = await this.productRepository.findOne({ where: { _id: product_id } });
        if (!product) {
            throw new NotFoundException('Product không tồn tại');
        }

        // Kiểm tra nếu Size_name đã tồn tại cho Product này
        const existingSize = await this.sizeRepository.findOne({ where: { product: { _id: product_id }, size_name } });
        if (existingSize) {
            throw new BadRequestException('Size đã tồn tại cho sản phẩm này');
        }

        const size = this.sizeRepository.create({
        product,
        size_name,
        stock,
        });

        return await this.sizeRepository.save(size);
    }

    // Lấy tất cả Sizes
    async findAll(): Promise<Size[]> {
        return await this.sizeRepository.find({ relations: ['product'] });
    }

    // Lấy Size theo ID
    async findOne(id: string): Promise<Size> {
        const size = await this.sizeRepository.findOne({ where: { _id: id }, relations: ['product'] });
        if (!size) {
            throw new NotFoundException('Size không tồn tại');
        }
        return size;
    }

    // Cập nhật Size
    async update(id: string, updateSizeDto: UpdateSizeDto): Promise<Size> {
        const { product_id, size_name, stock } = updateSizeDto;

        const size = await this.sizeRepository.findOne({ where: { _id: id }, relations: ['product'] });
        if (!size) {
            throw new NotFoundException('Size không tồn tại');
        }

        if (product_id) {
            const product = await this.productRepository.findOne({ where: { _id: product_id } });
            if (!product) {
                throw new NotFoundException('Product không tồn tại');
            }
            size.product = product;
        }

        if (size_name) {
            // Kiểm tra nếu Size_name đã tồn tại cho Product này
            const existingSize = await this.sizeRepository.findOne({
                where: {
                product: { _id: size.product._id },
                size_name,
                _id: Not(id),
                },
            });
            if (existingSize) {
                throw new BadRequestException('Size đã tồn tại cho sản phẩm này');
            }
            size.size_name = size_name;
        }

        if (stock !== undefined) {
            size.stock = stock;
        }

        return await this.sizeRepository.save(size);
    } 

    // Xóa Size
    async remove(id: string): Promise<void> {
        const size = await this.findOne(id);
        await this.sizeRepository.remove(size);
    }
}
