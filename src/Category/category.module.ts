import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Brand } from '../brand/brand.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Category, Brand])],
    providers: [CategoryService],
    controllers: [CategoryController],
})
export class CategoryModule {}
