import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { User } from '../users/user.entity';
import { CartItem } from '../cart_item/cartItem.entity';
import { OrderModule } from '../order/order.module'; 

@Module({
    imports: [
        TypeOrmModule.forFeature([Cart, User, CartItem]),
        OrderModule, 
    ],
    providers: [CartService],
    controllers: [CartController],
    exports: [CartService],
})
export class CartModule {}
