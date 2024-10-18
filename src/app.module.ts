import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './users/user.module';
import { AddressModule } from './address/address.module';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';
import { ProductModule } from './products/product.module';
import { SizeModule } from './size/size.module';
import { ProductImageModule } from './productImage/image.module';
import { OrderModule } from './order/order.module';
import { OrderDetailModule } from './order_detail/orderDetail.module';
import { CartModule } from './cart/cart.module';
import { CartItemModule } from './cart_item/cartItem.module';
import { PaymentModule } from './payment/payment.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
    imports: [
    ConfigModule.forRoot({
    isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        }),
    }),
    UserModule,
    AddressModule,
    CategoryModule,
    BrandModule,
    ProductModule,
    SizeModule,
    ProductImageModule,
    OrderModule,
    OrderDetailModule,
    CartModule,
    CartItemModule,
    PaymentModule,
    StripeModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
