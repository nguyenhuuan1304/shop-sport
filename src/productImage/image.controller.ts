import { Controller, Post, Body, Get, Param, Patch, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductImageService } from './image.service';
import { UpdateProductImageDto } from './dto/update-image.dto';
import { ProductImage } from './image.entity';
import { CreateProductImageDto } from './dto/create-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
// import { multerOptions } from '../cloudinary/multer-config'

@Controller('product-images')
export class ProductImageController {
    constructor(private readonly productImageService: ProductImageService) {}

    // @Post()
    // @UseInterceptors(FileInterceptor('file', multerOptions))
    // async create(
    // @Body() createProductImageDto: CreateProductImageDto,
    // @UploadedFile() file: Express.Multer.File,
    // ) {
    // return this.productImageService.create(createProductImageDto, file);
    // }

    @Post('upload')
    @UseInterceptors(FileInterceptor('image'))
    async uploadImage(@UploadedFile() file: Express.Multer.File, @Body() createProductImageDto: CreateProductImageDto): Promise<ProductImage> {
      return this.productImageService.create(createProductImageDto, file);
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
