import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SizeService } from './size.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { Size } from './size.entity';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard} from '../users/JwtAuthGuard'; 

@ApiTags('sizes')
@Controller('sizes')
export class SizeController {
    constructor(private readonly sizeService: SizeService) {}

    /**
     * Create a new size
     * URL: POST /sizes
     */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @ApiOperation({ summary: 'Create a new size' })
    @ApiBody({ description: 'Data for creating a new size', type: CreateSizeDto })
    @ApiResponse({ status: 201, description: 'The size has been successfully created.', type: Size })
    @Post()
    create(@Body() createSizeDto: CreateSizeDto) {
        return this.sizeService.create(createSizeDto);
    }

    /**
     * Retrieve all sizes
     * URL: GET /sizes
     */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @ApiOperation({ summary: 'Retrieve all sizes' })
    @ApiResponse({ status: 200, description: 'List of all sizes', type: [Size] })
    @Get()
    findAll() {
        return this.sizeService.findAll();
    }

    /**
     * Retrieve a size by ID
     * URL: GET /sizes/:id
     */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @ApiOperation({ summary: 'Retrieve a size by ID' })
    @ApiParam({ name: 'id', description: 'Size ID' })
    @ApiResponse({ status: 200, description: 'Size details', type: Size })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.sizeService.findOne(id);
    }

    /**
     * Update a size by ID
     * URL: PATCH /sizes/:id
     */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @ApiOperation({ summary: 'Update a size by ID' })
    @ApiParam({ name: 'id', description: 'Size ID' })
    @ApiBody({ description: 'Data for updating the size', type: UpdateSizeDto })
    @ApiResponse({ status: 200, description: 'The size has been successfully updated.', type: Size })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateSizeDto: UpdateSizeDto) {
        return this.sizeService.update(id, updateSizeDto);
    }

    /**
     * Delete a size by ID
     * URL: DELETE /sizes/:id
     */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @ApiOperation({ summary: 'Delete a size by ID' })
    @ApiParam({ name: 'id', description: 'Size ID' })
    @ApiResponse({ status: 204, description: 'The size has been successfully deleted.' })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.sizeService.remove(id);
    }
}
