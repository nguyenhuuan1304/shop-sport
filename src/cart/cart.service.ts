import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { Cart } from './cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { User } from '../users/user.entity';
import { CartItem } from '../cart_item/cartItem.entity';
import { Product } from '../products/product.entity';
import { Size } from '../size/size.entity';
import { OrderService } from '../order/order.service';
import { Order } from '../order/order.entity';
import { CreateOrderDto } from '../order/dto/create-order.dto';
import { OrderStatus } from '../order/order.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,

        @InjectRepository(User)
        private userRepository: Repository<User>,

        private connection: Connection,

        private orderService: OrderService, 
    ) {}

    async createForUser(userId: string): Promise<Cart> {
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['carts'] });

        let cart = await this.cartRepository.findOne({ where: { user: { id: userId } }, relations: ['cartItems'] });
        if (cart) {
            return cart;
        }

        cart = this.cartRepository.create({ user });
        return await this.cartRepository.save(cart);
    }

    async getUserCart(userId: string): Promise<Cart> {
        let cart = await this.cartRepository.findOne({
            where: { user: { id: userId } },
            relations: ['cartItems', 'cartItems.product', 'cartItems.size'],
        });
        if (!cart) {
            cart = await this.createForUser(userId);
        }
        return cart;
    }

    async create(createCartDto: CreateCartDto, userId: string): Promise<Order> {
        const { cartItems } = createCartDto;
        const groupedItemsMap = new Map<string, { product_id: string, size_id: string, quantity: number }>();
        
        for (const item of cartItems) {
            const key = `${item.product_id}_${item.size_id}`;
            if (groupedItemsMap.has(key)) {
                const existingItem = groupedItemsMap.get(key);
                existingItem.quantity += item.quantity;
                groupedItemsMap.set(key, existingItem);
            } else {
                groupedItemsMap.set(key, { ...item });
            }
        }
        
    const groupedItems = Array.from(groupedItemsMap.values());
        
        return await this.connection.transaction(async manager => {
            const user = await manager.findOne(User, { where: { id: userId } });
            const cart = manager.create(Cart, { user });
            await manager.save(cart);
        
            for (const item of groupedItems) {
                const { product_id, size_id, quantity } = item;
        
                const product = await manager.findOne(Product, { where: { _id: product_id } });
                if (!product) {
                    throw new NotFoundException(`Product with ID ${product_id} not found`);
                }
        
                const size = await manager.findOne(Size, { where: { _id: size_id, product: { _id: product_id } } });
                if (!size) {
                    throw new NotFoundException(`Size with ID ${size_id} not found for product ${product_id}`);
                }
        
                const cartItem = manager.create(CartItem, {
                    cart,
                    product,
                    size,
                    quantity,
                });
                await manager.save(cartItem);
            }
            
            // Kiểm tra phone và email chỉ khi người dùng tương tác với giỏ hàng (cart)
            if (!user || !user.phone || !user.phone.trim() || !user.email || !user.email.trim()) {
                throw new BadRequestException('Please input your phone and email before proceeding to the order.');
            }

            const orderDto: CreateOrderDto = {
                status: OrderStatus.PENDING, 
                orderDetails: groupedItems.map(item => ({
                product_id: item.product_id,
                size_id: item.size_id,
                quantity: item.quantity,
                })),
            };
        
            const order = await this.orderService.create(orderDto, userId);
            return order;
        });
    }

    // Xoá giỏ hàng của người dùng
    async clearCart(userId: string): Promise<void> {
        await this.cartRepository.delete({ user: { id: userId } });
    }
        
        // // Phương thức xử lý thanh toán
        // async processPayment(orderId: string): Promise<void> {
        // return await this.connection.transaction(async manager => {
        // const order = await manager.findOne(Order, { where: { _id: orderId }, relations: ['orderDetails'] });
        // if (!order) {
        // throw new NotFoundException(`Order with ID ${orderId} not found`);
        // }
        
        // for (const detail of order.orderDetails) {
        // const size = await manager.findOne(Size, { where: { id: detail.size_id, product: { _id: detail.product_id } } });
        // if (!size) {
        // throw new NotFoundException(`Size with ID ${detail.size_id} not found for product ${detail.product_id}`);
        // }
        
        // if (detail.quantity > size.stock) {
        // throw new BadRequestException(`Quantity ${detail.quantity} exceeds available stock for size ${size.size_name}`);
        // }
        
        // size.stock -= detail.quantity;
        // await manager.save(size);
        // }
        
        // order.status = OrderStatus.COMPLETED;
        // await manager.save(order);
        // });
        // }

    async findAll(): Promise<Cart[]> {
        return await this.cartRepository.find({ relations: ['user', 'cartItems'] });
    }

    async findOne(id: string): Promise<Cart> {
        const cart = await this.cartRepository.findOne({ where: { _id: id }, relations: ['user', 'cartItems'] });
        if (!cart) {
            throw new NotFoundException(`Cart with ID ${id} not found`);
        }
        return cart;
    }

    async update(id: string, updateCartDto: any): Promise<Cart> {
        const cart = await this.cartRepository.findOne({ where: { _id: id }, relations: ['user'] });
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        if (updateCartDto.user_id) {
            const user = await this.userRepository.findOne({ where: { id: updateCartDto.user_id }, relations: ['carts'] });
            if (!user) {
                throw new NotFoundException('User not found');
            }
            if (user.carts && user.carts.length > 0) {
                throw new BadRequestException('User already has a cart');
            }
            cart.user = user;
        }

        return await this.cartRepository.save(cart);
    }

    async remove(id: string): Promise<void> {
        const cart = await this.cartRepository.findOne({ where: { _id: id }, relations: ['cartItems'] });
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }
        await this.cartRepository.remove(cart);
    }
}
