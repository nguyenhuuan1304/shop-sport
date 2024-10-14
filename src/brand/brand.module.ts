import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './brand.entity';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { Category } from '../category/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Brand, Category])],
    providers: [BrandService],
    controllers: [BrandController],
})
export class BrandModule {}
