import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { User } from 'src/users/user.entity';
import { Address } from './address.entity';

@Injectable()
export class AddressService {
    constructor(
        @InjectRepository(Address)
        private addressRepository: Repository<Address>,
    ) {}

    async create(createAddressDto: CreateAddressDto) {
        const address = this.addressRepository.create(createAddressDto);

        if (createAddressDto.userId) {
            address.user = { id: createAddressDto.userId.toString() } as User;
        }

         await this.addressRepository.save(address);
    }

    async findAll() {
        return await this.addressRepository.find();
    }

    async findOne(id: string) {
        const address = await this.addressRepository.findOneBy({ id });
        if (!address) {
            throw new NotFoundException('Address Not Found');
        }
        return address;
    }  

    async update(id: string, updateAddressDto: UpdateAddressDto) {
        const address = await this.addressRepository.findOneBy({ id });
        if (!address) {
            throw new NotFoundException('Address Not Found');
    }

    const updatedAddress = this.addressRepository.merge(address, updateAddressDto);
        return await this.addressRepository.save(updatedAddress);
    }  

    async remove(id: string) {
        const address = await this.addressRepository.findOneBy({ id });
        if (!address) {
            throw new NotFoundException('Address Not Found');
        }
        return await this.addressRepository.remove(address);
    }  
}