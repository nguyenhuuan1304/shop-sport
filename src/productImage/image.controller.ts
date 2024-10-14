import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { ProductImageService } from './image.service';
import { CreateProductImageDto } from './dto/create-image.dto';
import { UpdateProductImageDto } from './dto/update-image.dto';
import { ProductImage } from './image.entity';

@Controller('product-images')
export class ProductImageController {
    constructor(private readonly productImageService: ProductImageService) {}

    @Post()
    async create(@Body() createProductImageDto: CreateProductImageDto): Promise<ProductImage> {
        return this.productImageService.create(createProductImageDto);
    }

    @Get()
    async findAll(): Promise<ProductImage[]> {
        return this.productImageService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ProductImage> {
        return this.productImageService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateProductImageDto: UpdateProductImageDto,
    ): Promise<ProductImage> {
        return this.productImageService.update(id, updateProductImageDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.productImageService.remove(id);
    }
}
