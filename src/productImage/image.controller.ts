import { Controller, Post, Body, Get, Param, Patch, Delete, UploadedFile, UseInterceptors, UploadedFiles, UseGuards } from '@nestjs/common';
import { ProductImageService } from './image.service';
import { UpdateProductImageDto } from './dto/update-image.dto';
import { ProductImage } from './image.entity';
import { CreateProductImageDto } from './dto/create-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiParam, ApiConsumes, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard} from '../users/JwtAuthGuard'; 

@ApiTags('product-images')
@Controller('product-images')
export class ProductImageController {
    constructor(private readonly productImageService: ProductImageService) {}

    /**
     * Upload a single product image
     * URL: POST /product-images/upload
     */
    
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @ApiOperation({ summary: 'Upload a single product image' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Image file and product image details',
        type: CreateProductImageDto,
    })
    @ApiResponse({ status: 201, description: 'The image has been successfully uploaded.', type: ProductImage })
    @UseInterceptors(FileInterceptor('image'))
    @Post('upload')
    async uploadImage(
        @UploadedFile() file: Express.Multer.File, 
        @Body() createProductImageDto: CreateProductImageDto
    ): Promise<ProductImage> {
        console.log(file); 
        return this.productImageService.create(createProductImageDto, file);
    }

    /**
     * Upload multiple product images
     * URL: POST /product-images/upload-multiple
     */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @ApiOperation({ summary: 'Upload multiple product images' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Multiple image files and product image details',
        schema: {
            type: 'object',
            properties: {
                images: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                },
                productId: {
                    type: 'string',
                    description: 'Product ID to which images belong',
                },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'The images have been successfully uploaded.', type: [ProductImage] })
    @UseInterceptors(FilesInterceptor('images', 10))
    @Post('upload-multiple')
    async uploadMultipleImages(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() createProductImageDto: CreateProductImageDto
    ): Promise<ProductImage[]> {
        console.log(files); 
        const uploadResults = await Promise.all(
            files.map(file => this.productImageService.create(createProductImageDto, file))
        );
        return uploadResults;
    }

    /**
     * Get all product images
     * URL: GET /product-images
     */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @ApiOperation({ summary: 'Retrieve all product images' })
    @ApiResponse({ status: 200, description: 'List of product images', type: [ProductImage] })
    @Get()
    async findAll(): Promise<ProductImage[]> {
        return this.productImageService.findAll();
    }

    /**
     * Get a product image by ID
     * URL: GET /product-images/:id
     */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @ApiOperation({ summary: 'Retrieve a product image by ID' })
    @ApiParam({ name: 'id', description: 'Product image ID' })
    @ApiResponse({ status: 200, description: 'Product image details', type: ProductImage })
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ProductImage> {
        return this.productImageService.findOne(id);
    }

    /**
     * Update a product image by ID
     * URL: PATCH /product-images/:id
     */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @ApiOperation({ summary: 'Update a product image by ID' })
    @ApiParam({ name: 'id', description: 'Product image ID' })
    @ApiResponse({ status: 200, description: 'Updated product image details', type: ProductImage })
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateProductImageDto: UpdateProductImageDto,
    ): Promise<ProductImage> {
        return this.productImageService.update(id, updateProductImageDto);
    }

    /**
     * Delete a product image by ID
     * URL: DELETE /product-images/:id
     */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @ApiOperation({ summary: 'Delete a product image by ID' })
    @ApiParam({ name: 'id', description: 'Product image ID' })
    @ApiResponse({ status: 204, description: 'Product image has been successfully deleted.' })
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.productImageService.remove(id);
    }
}
