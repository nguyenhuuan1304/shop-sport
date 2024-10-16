import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { Cart } from './cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
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

    // Tạo giỏ hàng mới cho người dùng
    async createForUser(userId: string): Promise<Cart> {
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['carts'] });

        // Kiểm tra xem người dùng đã có giỏ hàng chưa
        let cart = await this.cartRepository.findOne({ where: { user: { id: userId } }, relations: ['cartItems'] });
        if (cart) {
            return cart;
        }

        // Tạo giỏ hàng mới
        cart = this.cartRepository.create({
            user,
        });

        return await this.cartRepository.save(cart);
    }

    // Lấy giỏ hàng của người dùng
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

    // Tạo giỏ hàng cùng với các mục giỏ hàng và tạo Order
    async create(createCartDto: CreateCartDto, userId: string): Promise<Order> {
        const { cartItems } = createCartDto;
    
        // Gộp cartItems theo product_id và size_id
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
    
            // Thêm các mục giỏ hàng
            for (const item of groupedItems) {
                const { product_id, size_id, quantity } = item;
    
                // Kiểm tra sản phẩm
                const product = await manager.findOne(Product, { where: { _id: product_id } });
                if (!product) {
                    throw new NotFoundException(`Product with ID ${product_id} not found`);
                }
    
                // Kiểm tra size
                const size = await manager.findOne(Size, { where: { _id: size_id, product: { _id: product_id } } });
                if (!size) {
                    throw new NotFoundException(`Size with ID ${size_id} not found for product ${product_id}`);
                }
    
                // Kiểm tra stock
                if (quantity > size.stock) {
                    throw new BadRequestException(`Quantity ${quantity} exceeds available stock for size ${size.size_name}`);
                }
    
                // Giảm stock
                size.stock -= quantity;
                await manager.save(size);
    
                // Tạo CartItem
                const cartItem = manager.create(CartItem, {
                    cart,
                    product,
                    size,
                    quantity,
                });
                await manager.save(cartItem);
            }
    
            // Tạo Order dựa trên Cart vừa tạo
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

    // Các phương thức CRUD khác như trước
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

    async update(id: string, updateCartDto: UpdateCartDto): Promise<Cart> {
        const cart = await this.cartRepository.findOne({ where: { _id: id }, relations: ['user'] });
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        if (updateCartDto.user_id) {
            const user = await this.userRepository.findOne({ where: { id: updateCartDto.user_id }, relations: ['carts'] });
            if (!user) {
                throw new NotFoundException('User not found');
            }
            // Kiểm tra nếu người dùng đã có giỏ hàng khác
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
