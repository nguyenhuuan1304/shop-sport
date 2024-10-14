import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Category } from '../category/category.entity';

@Injectable()
export class BrandService {
    constructor(
        @InjectRepository(Brand)
        private brandRepository: Repository<Brand>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) {}

    async create(createBrandDto: CreateBrandDto): Promise<Brand> {
        const { Category_id, name } = createBrandDto;
        const category = await this.categoryRepository.findOne({ where: { id: Category_id } });
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        const brand = this.brandRepository.create({
            name,
            category,
        });
        return await this.brandRepository.save(brand);
    }

    async findAll(): Promise<Brand[]> {
        return await this.brandRepository.find({ relations: ['category'] });
    }

    async findOne(id: string): Promise<Brand> {
        const brand = await this.brandRepository.findOne({
        where: { _id: id },
        relations: ['category'],
        });
        if (!brand) {
            throw new NotFoundException('Brand not found');
        }
        return brand;
    }

    async update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {
        const brand = await this.brandRepository.preload({
            _id: id,
            ...updateBrandDto,
        });
        if (!brand) {
            throw new NotFoundException('Brand not found');
        }

        if (updateBrandDto.Category_id) {
            const category = await this.categoryRepository.findOne({ where: { id: updateBrandDto.Category_id } });
        if (!category) {
            throw new NotFoundException('Category not found');
        }
            brand.category = category;
        }

        return await this.brandRepository.save(brand);
    }

    async remove(id: string): Promise<void> {
        const brand = await this.findOne(id);
        await this.brandRepository.remove(brand);
    }
}
