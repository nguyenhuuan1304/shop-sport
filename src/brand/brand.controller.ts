import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiTags, ApiBody, ApiParam, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard} from '../users/JwtAuthGuard'; 

@ApiTags('brands')
@Controller('brands')
export class BrandController {
    constructor(private readonly brandService: BrandService) {}

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @ApiOperation({ summary: 'Create a new brand' })
    @ApiBody({ type: CreateBrandDto })
    @Post()
    create(@Body() createBrandDto: CreateBrandDto) {
        return this.brandService.create(createBrandDto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @ApiOperation({ summary: 'Get all brands' })
    @Get()
    findAll() {
        return this.brandService.findAll();
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @ApiOperation({ summary: 'Get a specific brand by ID' })
    @ApiParam({ name: 'id', type: 'string', description: 'The ID of the brand' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.brandService.findOne(id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @ApiOperation({ summary: 'Update an existing brand' })
    @ApiParam({ name: 'id', type: 'string', description: 'The ID of the brand' })
    @ApiBody({ type: UpdateBrandDto })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
        return this.brandService.update(id, updateBrandDto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @ApiOperation({ summary: 'Delete a brand' })
    @ApiParam({ name: 'id', type: 'string', description: 'The ID of the brand' })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.brandService.remove(id);
    }
}
