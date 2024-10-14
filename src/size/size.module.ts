import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Size } from './size.entity';
import { SizeService } from './size.service';
import { SizeController } from './size.controller';
import { Product } from '../products/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Size, Product])],
    providers: [SizeService],
    controllers: [SizeController],
})
export class SizeModule {}
