import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDetail } from './orderDetail.entity';
import { CreateOrderDetailDto } from './dto/create-orderDetail.dto';
import { CreateOrderDetailWithOrderIdDto } from './dto/create-orderDetailWithOrderId.dto';
import { Order } from '../order/order.entity';
import { Product } from '../products/product.entity';
import { UpdateOrderDetailDto } from './dto/update-orderDetail.dto';


@Injectable()
export class OrderDetailService {
    constructor(
        @InjectRepository(OrderDetail)
        private orderDetailRepository: Repository<OrderDetail>,

        @InjectRepository(Product)
        private productRepository: Repository<Product>,

        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
    ) {}

    async create(createOrderDetailDto: CreateOrderDetailDto, orderId: string): Promise<OrderDetail> {
        const { product_id, quantity } = createOrderDetailDto;

        // Kiểm tra sản phẩm tồn tại
        const product = await this.productRepository.findOne({ where: { _id: product_id } });
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Kiểm tra đơn hàng tồn tại
        const order = await this.orderRepository.findOne({ where: { _id: orderId }, relations: ['orderDetails'] });
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // Tính tổng giá = price_product * quantity
        const calculatedPrice = parseFloat(product.price.toString()) * quantity;

        // Kiểm tra nếu sản phẩm đã có trong đơn hàng chưa
        const existingDetail = await this.orderDetailRepository.findOne({
            where: { order: { _id: orderId }, product: { _id: product_id } },
        });

        if (existingDetail) {
            throw new BadRequestException('Product already exists in the order');
        }

        const orderDetail = this.orderDetailRepository.create({
            order,
            product,
            quantity,
            price: calculatedPrice,
        });

        return await this.orderDetailRepository.save(orderDetail);
    }

    async createWithOrderId(createOrderDetailWithOrderIdDto: CreateOrderDetailWithOrderIdDto): Promise<OrderDetail> {
        const { order_id, product_id, quantity } = createOrderDetailWithOrderIdDto;

        // Kiểm tra sản phẩm tồn tại
        const product = await this.productRepository.findOne({ where: { _id: product_id } });
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Kiểm tra đơn hàng tồn tại
        const order = await this.orderRepository.findOne({ where: { _id: order_id }, relations: ['orderDetails'] });
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // Tính tổng giá = price_product * quantity
        const calculatedPrice = parseFloat(product.price.toString()) * quantity;

        // Kiểm tra nếu sản phẩm đã có trong đơn hàng chưa
        const existingDetail = await this.orderDetailRepository.findOne({
            where: { order: { _id: order_id }, product: { _id: product_id } },
        });

        if (existingDetail) {
            throw new BadRequestException('Product already exists in the order');
        }

        const orderDetail = this.orderDetailRepository.create({
            order,
            product,
            quantity,
            price: calculatedPrice, 
        });

        return await this.orderDetailRepository.save(orderDetail);
    }

    // Hàm lấy tất cả OrderDetails
    async findAll(): Promise<OrderDetail[]> {
        return await this.orderDetailRepository.find({ relations: ['order', 'product'] });
    }

    // Hàm lấy một OrderDetail theo ID
    async findOne(id: string): Promise<OrderDetail> {
        const orderDetail = await this.orderDetailRepository.findOne({ 
            where: { _id: id }, 
            relations: ['order', 'product'] 
        });

        if (!orderDetail) {
            throw new NotFoundException(`OrderDetail with ID ${id} not found`);
        }

        return orderDetail;
    }

    async update(id: string, updateOrderDetailDto: UpdateOrderDetailDto): Promise<OrderDetail> {
        const orderDetail = await this.orderDetailRepository.findOne({ where: { _id: id }, relations: ['product', 'order'] });

        if (!orderDetail) {
            throw new NotFoundException('OrderDetail not found');
        }

        if (updateOrderDetailDto.quantity !== undefined) {
            orderDetail.quantity = updateOrderDetailDto.quantity;
            // Cập nhật giá nếu quantity thay đổi
            orderDetail.price = parseFloat(orderDetail.product.price.toString()) * orderDetail.quantity;
        }

        return await this.orderDetailRepository.save(orderDetail);
    }

    async remove(id: string): Promise<void> {
        const orderDetail = await this.orderDetailRepository.findOne({ where: { _id: id } });

        if (!orderDetail) {
            throw new NotFoundException('OrderDetail not found');
        }

        await this.orderDetailRepository.remove(orderDetail);
    }
}
