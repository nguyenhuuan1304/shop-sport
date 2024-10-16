import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './cartItem.entity';
import { CartItemService } from './cartItem.service';
import { CartItemController } from './cartItem.controller';
import { Product } from '../products/product.entity';
import { Size } from '../size/size.entity';
import { CartModule } from '../cart/cart.module'; 

@Module({
    imports: [
        TypeOrmModule.forFeature([CartItem, Product, Size]),
        CartModule, 
    ],
    providers: [CartItemService],
    controllers: [CartItemController],
    exports: [CartItemService],
})
export class CartItemModule {}
