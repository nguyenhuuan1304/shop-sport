import { Controller, Post, Body, Get, Param, Patch, Delete, UploadedFile, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ProductImageService } from './image.service';
import { UpdateProductImageDto } from './dto/update-image.dto';
import { ProductImage } from './image.entity';
import { CreateProductImageDto } from './dto/create-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('product-images')
export class ProductImageController {
    constructor(private readonly productImageService: ProductImageService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('image'))
    async uploadImage(
        @UploadedFile() file: Express.Multer.File, 
        @Body() createProductImageDto: CreateProductImageDto
        ): Promise<ProductImage> {
            console.log(file); 
            return this.productImageService.create(createProductImageDto, file);
    }

    @Post('upload-multiple')
    @UseInterceptors(FilesInterceptor('images', 10)) 
    async uploadMultipleImages(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() createProductImageDto: CreateProductImageDto
        ): Promise<any> {
            console.log(files); 
            const uploadResults = await Promise.all(
            files.map(file => this.productImageService.create(createProductImageDto, file))
            );
        return uploadResults; 
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
