import { Table, Tag } from "antd";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders } from "../../redux/slices/orderSlice";
import { format } from "date-fns";

const columns = [
  {
    title: "Mã đơn hàng",
    dataIndex: "_id",
    key: "_id",
    width: 90,
  },
  {
    title: "Tổng tiền",
    dataIndex: "total_of_price",
    key: "total_of_price",
    render: (price) => {
      return `${price.toLocaleString()}₫`;
    },
  },
  {
    title: "Ngày mua",
    dataIndex: "created_at",
    key: "created_at",
    render: (created_at) => {
      return created_at ? format(new Date(created_at), "dd/MM/yyyy") : "";
    },
  },
  {
    title: "Tình trạng",
    dataIndex: "status",
    key: "status",
    render: (status) =>
      status ? (
        <Tag color="success">Đã giao</Tag>
      ) : (
        <Tag color="processing">Đang giao hàng</Tag>
      ),
  },

  {
    title: "Chi tiết",
    dataIndex: "cart",
    key: "cart",
    render: (cart) => (
      <div>
        {cart.map((item, index) => (
          <div key={index}>
            <span>- Sản phẩm: {item.product.name}</span>
            <br />
            <span>Kích thước: {item.size}</span>
            <br />
            <span>Số lượng: {item.count}</span>
          </div>
        ))}
      </div>
    ),
  },
];

const data = [
  {
    key: "1",
    orderId: "DH001",
    totalAmount: "1,200,000 VNĐ",
    purchaseDate: "2024-07-18",
    status: "Đã giao hàng",
    details: "Xem chi tiết",
  },
];

export default function OdersForm() {
  const dispatch = useDispatch();
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  const orders = useSelector((state) => state.order?.orders);
  console.log("orders", orders);
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);
  return (
    <>
      <div className="container mx-auto p-5">
        {/* <div className="flex justify-end mb-4">
          <button className="duration-300 h-12 w-40 hover:border-2 hover:border-green-600 bg-green-600 hover:bg-white hover:text-green-500 text-white font-bold text-xs py-2 px-4 rounded-xl">
            THÊM ĐỊA CHỈ
          </button>
        </div> */}
        <Table columns={columns} dataSource={orders} onChange={onChange} />
      </div>
    </>
  );
}
