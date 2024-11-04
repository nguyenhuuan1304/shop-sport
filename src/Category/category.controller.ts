import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags, ApiBody, ApiParam, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard} from '../users/JwtAuthGuard'; 

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    /*
     * URL: POST /categories
     * Tạo danh mục mới
     */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @ApiOperation({ summary: 'Create a new category' })
    @ApiBody({ type: CreateCategoryDto })
    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }

    /*
     * URL: GET /categories
     * Lấy tất cả danh mục
     */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @ApiOperation({ summary: 'Get all categories' })
    @Get()
    findAll() {
        return this.categoryService.findAll();
    }

    /*
     * URL: GET /categories/:id
     * Lấy danh mục theo ID
     */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @ApiOperation({ summary: 'Get a category by ID' })
    @ApiParam({ name: 'id', type: 'string', description: 'The ID of the category' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoryService.findOne(id);
    }

    /*
     * URL: PATCH /categories/:id
     * Cập nhật danh mục
     */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @ApiOperation({ summary: 'Update a category' })
    @ApiParam({ name: 'id', type: 'string', description: 'The ID of the category' })
    @ApiBody({ type: UpdateCategoryDto })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.update(id, updateCategoryDto);
    }

    /*
     * URL: DELETE /categories/:id
     * Xóa danh mục
     */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @ApiOperation({ summary: 'Delete a category' })
    @ApiParam({ name: 'id', type: 'string', description: 'The ID of the category' })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.categoryService.remove(id);
    }
}
