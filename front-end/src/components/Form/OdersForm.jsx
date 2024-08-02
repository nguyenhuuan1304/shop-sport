import { Table } from "antd";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders } from "../../redux/slices/orderSlice";

const columns = [
  {
    title: "Mã đơn hàng",
    dataIndex: "_id",
    key: "_id",
  },
  {
    title: "Tổng tiền",
    dataIndex: "total_of_price",
    key: "total_of_price",
  },
  {
    title: "Ngày mua",
    dataIndex: "created_at",
    key: "created_at",
  },
  {
    title: "Tình trạng",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Chi tiết",
    dataIndex: "cart",
    key: "cart",
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
    dispatch(fetchOrders);
  }, [dispatch]);
  return (
    <>
      <div className="container mx-auto p-5">
        {/* <div className="flex justify-end mb-4">
          <button className="duration-300 h-12 w-40 hover:border-2 hover:border-green-600 bg-green-600 hover:bg-white hover:text-green-500 text-white font-bold text-xs py-2 px-4 rounded-xl">
            THÊM ĐỊA CHỈ
          </button>
        </div> */}
        <Table columns={columns} dataSource={data} onChange={onChange} />
      </div>
    </>
  );
}
