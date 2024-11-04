import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiTags, ApiBody, ApiParam, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard} from '../users/JwtAuthGuard'; 

@ApiTags('address')
@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) {}

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @ApiOperation({ summary: 'Create a new address' })
    @ApiBody({ type: CreateAddressDto })
    @Post()
    create(@Body() createAddressDto: CreateAddressDto) {
        return this.addressService.create(createAddressDto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @ApiOperation({ summary: 'Get all addresses' })
    @Get()
    findAll() {
        return this.addressService.findAll();
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @ApiOperation({ summary: 'Get a specific address by ID' })
    @ApiParam({ name: 'id', type: 'string', description: 'The ID of the address' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.addressService.findOne(id);
    }  

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @ApiOperation({ summary: 'Update an existing address' })
    @ApiParam({ name: 'id', type: 'string', description: 'The ID of the address' })
    @ApiBody({ type: UpdateAddressDto })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
        return this.addressService.update(id, updateAddressDto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @ApiOperation({ summary: 'Delete an address' })
    @ApiParam({ name: 'id', type: 'string', description: 'The ID of the address' })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.addressService.remove(id);
    }
}
