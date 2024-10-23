import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { Cart } from './cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { User } from '../users/user.entity';
import { CartItem } from '../cart_item/cartItem.entity';
import { Product } from '../products/product.entity';
import { Size } from '../size/size.entity';


@Injectable()
export class CartService {
    constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,

    @InjectRepository(Size)
    private sizeRepository: Repository<Size>,

    private connection: Connection,
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

    async addToCart(userId: string, createCartDto: CreateCartDto): Promise<Cart> {
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
            let cart = await manager.findOne(Cart, { where: { user: { id: userId } }, relations: ['cartItems'] });
            
            if (!cart) {
                cart = manager.create(Cart, { user });
                await manager.save(cart);
            }
        
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
                
                if (size.stock < quantity) {
                    throw new Error(`Not enough stock for size ID ${size_id} of product ID ${product_id}`);
                }
                
                let cartItem = await manager.findOne(CartItem, {
                    where: { cart: { _id: cart._id }, size: { _id: size_id } },
                });
                
                if (cartItem) {
                    cartItem.quantity += quantity;
                } else {
                    cartItem = manager.create(CartItem, {
                    cart,
                    product,
                    size,
                    quantity,
                });
                }
                
                // Save the cart item without reducing the stock
                await manager.save(cartItem);
                }
            
            return cart;
        });
    }


    async clearCart(userId: string): Promise<void> {
        await this.cartRepository.delete({ user: { id: userId } });
    }

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