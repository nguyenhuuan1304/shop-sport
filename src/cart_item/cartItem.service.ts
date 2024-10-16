import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { CartItem } from './cartItem.entity';
import { CreateCartItemDto } from './dto/create-cartItem.dto';
import { UpdateCartItemDto } from './dto/update-cartItem.dto';
import { Product } from '../products/product.entity';
import { Size } from '../size/size.entity';
import { CartService } from '../cart/cart.service';

@Injectable()
export class CartItemService {
    constructor(
        @InjectRepository(CartItem)
        private cartItemRepository: Repository<CartItem>,

        private cartService: CartService, // Inject CartService

        @InjectRepository(Product)
        private productRepository: Repository<Product>,

        @InjectRepository(Size)
        private sizeRepository: Repository<Size>,

        private connection: Connection, // Để thực hiện transaction
    ) {}

    // Tạo CartItem mới với kiểm tra stock
    async create(createCartItemDto: CreateCartItemDto, userId: string): Promise<CartItem> {
        const { product_id, size_id, quantity } = createCartItemDto;

        // Sử dụng transaction để đảm bảo tính nhất quán
        return await this.connection.transaction(async manager => {
            // Lấy hoặc tạo giỏ hàng của người dùng
            const cart = await this.cartService.getUserCart(userId);

            // Tìm Product
            const product = await manager.findOne(Product, { where: { _id: product_id } });
            if (!product) {
                throw new NotFoundException('Product not found');
            }

            // Tìm Size
            const size = await manager.findOne(Size, { where: { _id: size_id, product: { _id: product_id } } });
            if (!size) {
                throw new NotFoundException('Size not found for the specified product');
            }

            // Kiểm tra stock
            if (quantity > size.stock) {
                throw new BadRequestException(`Quantity ${quantity} exceeds available stock of size ${size.size_name} (${size.stock})`);
            }

            // Kiểm tra nếu CartItem đã tồn tại cho cùng product và size trong cart
            const existingCartItem = await manager.findOne(CartItem, {
                where: {
                    cart: { _id: cart._id },
                    product: { _id: product_id },
                    size: { _id: size_id },
                },
            });

            if (existingCartItem) {
                throw new BadRequestException('CartItem with the same product and size already exists in the cart');
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

            return await manager.save(cartItem);
        });
    }

    // Các phương thức CRUD khác
    async findAll(): Promise<CartItem[]> {
        return await this.cartItemRepository.find({ relations: ['cart', 'product', 'size'] });
    }

    async findOne(id: string, userId: string): Promise<CartItem> {
        const cartItem = await this.cartItemRepository.findOne({
            where: { _id: id },
            relations: ['cart', 'product', 'size'],
        });
        if (!cartItem) {
            throw new NotFoundException(`CartItem with ID ${id} not found`);
        }

        // Kiểm tra quyền truy cập
        if (cartItem.cart.user.id !== userId) {
            throw new ForbiddenException('You do not have access to this CartItem');
        }

        return cartItem;
    }

    async update(id: string, updateCartItemDto: UpdateCartItemDto, userId: string): Promise<CartItem> {
        const { quantity } = updateCartItemDto;

        if (quantity === undefined) {
            throw new BadRequestException('Quantity is required for update');
        }

        return await this.connection.transaction(async manager => {
            const cartItem = await manager.findOne(CartItem, { where: { _id: id }, relations: ['size', 'cart'] });
            if (!cartItem) {
                throw new NotFoundException('CartItem not found');
            }

            // Kiểm tra quyền truy cập
            if (cartItem.cart.user.id !== userId) {
                throw new ForbiddenException('You do not have access to update this CartItem');
            }

            const size = await manager.findOne(Size, { where: { _id: cartItem.size._id } });
            if (!size) {
                throw new NotFoundException('Size not found');
            }

            // Tính sự khác biệt giữa quantity mới và cũ
            const quantityDifference = quantity - cartItem.quantity;

            if (quantityDifference > 0) {
                // Nếu tăng số lượng, kiểm tra stock
                if (quantityDifference > size.stock) {
                    throw new BadRequestException(`Additional quantity ${quantityDifference} exceeds available stock of size ${size.size_name} (${size.stock})`);
                }
                size.stock -= quantityDifference;
            } else if (quantityDifference < 0) {
                // Nếu giảm số lượng, tăng stock
                size.stock += Math.abs(quantityDifference);
            }

            // Cập nhật stock
            await manager.save(size);

            // Cập nhật quantity
            cartItem.quantity = quantity;

            return await manager.save(cartItem);
        });
    }

    async remove(id: string, userId: string): Promise<void> {
        return await this.connection.transaction(async manager => {
            const cartItem = await manager.findOne(CartItem, { where: { _id: id }, relations: ['size', 'cart'] });
            if (!cartItem) {
                throw new NotFoundException('CartItem not found');
            }

            // Kiểm tra quyền truy cập
            if (cartItem.cart.user.id !== userId) {
                throw new ForbiddenException('You do not have access to delete this CartItem');
            }

            // Tăng stock khi xóa CartItem
            const size = await manager.findOne(Size, { where: { _id: cartItem.size._id } });
            if (size) {
                size.stock += cartItem.quantity;
                await manager.save(size);
            }

            // Xóa CartItem
            await manager.remove(cartItem);
        });
    }
}
