import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { User } from '../users/user.entity';
import { CartItem } from '../cart_item/cartItem.entity';
import { ProductModule } from '../products/product.module';
import { OrderModule } from '../order/order.module';

@Module({
imports: [
    TypeOrmModule.forFeature([Cart, User, CartItem]),
    forwardRef(() => OrderModule),
    ProductModule,
    ],
    providers: [CartService],
    controllers: [CartController],
    exports: [CartService, TypeOrmModule],
})
export class CartModule {}