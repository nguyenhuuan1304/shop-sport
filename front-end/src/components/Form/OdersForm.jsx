import { Table, Tag } from "antd";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders } from "../../redux/slices/orderSlice";
import { format } from "date-fns";
import { Link } from "react-router-dom";

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
      return `${price?.toLocaleString()}₫`;
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
    render: (status) => {
      let tagColor, tagText;

      switch (status) {
        case "pending":
          tagColor = "processing";
          tagText = "Pending";
          break;
        case "completed":
          tagColor = "success";
          tagText = "Đã giao";
          break;
        case "shipping":
          tagColor = "warning";
          tagText = "Đang giao";
          break;
        default:
          tagColor = "default";
          tagText = "Unknown";
      }

      return <Tag color={tagColor}>{tagText}</Tag>;
    },
  },

  {
    title: "Chi tiết",
    dataIndex: "cart",
    key: "cart",
    render: (cart) => (
      <div>
        {cart?.map((item, index) => (
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
  {
    title: "Thanh toán",
    dataIndex: "payment_url",
    key: "payment_url",
    render: (payment_url) => <Link to={payment_url}>Link thanh toán</Link>,
  },
];

export default function OdersForm() {
  const dispatch = useDispatch();
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  const orders = useSelector((state) => state.order?.orders);
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
