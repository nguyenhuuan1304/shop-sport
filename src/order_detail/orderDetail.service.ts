import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDetail } from './orderDetail.entity';
import { CreateOrderDetailDto } from './dto/create-orderDetail.dto';
import { UpdateOrderDetailDto } from './dto/update-orderDetail.dto';
import { Product } from '../products/product.entity';
import { Order } from '../order/order.entity';

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

    /**
     * Tạo chi tiết đơn hàng mới
     * @param createOrderDetailDto Dữ liệu chi tiết đơn hàng
     * @param orderId ID của đơn hàng
     * @returns Chi tiết đơn hàng đã tạo
     */
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
            price: calculatedPrice, // Đặt giá tự động
        });

        return await this.orderDetailRepository.save(orderDetail);
    }

    /**
     * Cập nhật chi tiết đơn hàng
     * @param id ID của chi tiết đơn hàng
     * @param updateOrderDetailDto Dữ liệu cập nhật
     * @returns Chi tiết đơn hàng đã cập nhật
     */
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

        // Không cho phép cập nhật price trực tiếp để đảm bảo tính nhất quán
        // Nếu muốn cho phép, hãy bỏ dòng này
        // orderDetail.price = calculatedPrice;

        return await this.orderDetailRepository.save(orderDetail);
    }


    /**
     * Xóa chi tiết đơn hàng
     * @param id ID của chi tiết đơn hàng
     */
    async remove(id: string): Promise<void> {
        const orderDetail = await this.orderDetailRepository.findOne({ where: { _id: id } });

        if (!orderDetail) {
            throw new NotFoundException('OrderDetail not found');
        }

        await this.orderDetailRepository.remove(orderDetail);
    }
}
