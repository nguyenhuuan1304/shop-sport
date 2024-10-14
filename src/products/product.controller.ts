import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards, NotFoundException } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { JwtAuthGuard } from '../users/JwtAuthGuard';
import { RolesGuard } from '../users/rolesGuard';
import { Roles } from '../users/rolesDecorator';
import { UserRole } from '../users/user.entity';
import { Request } from 'express';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    /**
     * Tạo sản phẩm mới (Chỉ dành cho ADMIN và SUPER_ADMIN)
     * URL: POST /products
     */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Post()
    create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }

    /**
     * Lấy danh sách sản phẩm mới nhất
     * URL: GET /products/latest
     */
    @UseGuards(JwtAuthGuard)
    @Get('latest')
    async getLatestProducts(): Promise<Product[]> {
        return await this.productService.getLatestProducts();
    }

    /**
     * Lấy danh sách sản phẩm theo giá thấp đến cao
     * URL: GET /products/low-price
     */
    @UseGuards(JwtAuthGuard)
    @Get('low-price')
    async getProductsByLowPrice(): Promise<Product[]> {
        return await this.productService.getProductsByLowPrice();
    }

    /**
     * Lấy danh sách sản phẩm theo giá cao đến thấp
     * URL: GET /products/high-price
     */
    @UseGuards(JwtAuthGuard)
    @Get('high-price')
    async getProductsByHighPrice(): Promise<Product[]> {
        return await this.productService.getProductsByHighPrice();
    }

    /**
     * Endpoint để lấy các sản phẩm đã xem gần đây
     * URL: GET /products/recently-viewed
     */
    @UseGuards(JwtAuthGuard)
    @Get('recently-viewed')
    async getRecentlyViewedProducts(@Req() req: Request): Promise<Product[]> {
        const user = req.user as any; // Đảm bảo rằng user đã được gắn bởi JwtStrategy
        if (!user || !user.id) {
            throw new NotFoundException('User không tồn tại');
        }
        return await this.productService.getRecentlyViewedProducts(user.id);
    }

    /**
     * Lấy chi tiết sản phẩm theo ID và cập nhật danh sách đã xem
     * URL: GET /products/:id
     */
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string, @Req() req: Request): Promise<Product> {
        const user = req.user as any; // Đảm bảo rằng user đã được gắn bởi JwtStrategy
        if (!user || !user.id) {
            throw new NotFoundException('User không tồn tại');
        }
        return this.productService.findOne(id, user.id);
    }

    /**
     * Cập nhật sản phẩm (Chỉ dành cho ADMIN và SUPER_ADMIN)
     * URL: PATCH /products/:id
     */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productService.update(id, updateProductDto);
    }

    /**
     * Xóa sản phẩm (Chỉ dành cho SUPER_ADMIN)
     * URL: DELETE /products/:id
     */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.productService.remove(id);
    }

    /**
     * Tùy chọn: Sử dụng query params để xử lý sorting
     * URL: GET /products?sort=latest|low-price|high-price
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Query('sort') sort: string) {
        if (sort === 'latest') {
            return this.productService.getLatestProducts();
        } else if (sort === 'low-price') {
            return this.productService.getProductsByLowPrice();
        } else if (sort === 'high-price') {
            return this.productService.getProductsByHighPrice();
        }
        return this.productService.findAll();
    }
}
