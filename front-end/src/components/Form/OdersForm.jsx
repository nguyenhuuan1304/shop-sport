import { Table } from "antd";
import React from "react";

const columns = [
  {
    title: 'Mã đơn hàng',
    dataIndex: 'orderId',
    key: 'orderId',
  },
  {
    title: 'Tổng tiền',
    dataIndex: 'totalAmount',
    key: 'totalAmount',
  },
  {
    title: 'Ngày mua',
    dataIndex: 'purchaseDate',
    key: 'purchaseDate',
  },
  {
    title: 'Tình trạng',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Chi tiết',
    dataIndex: 'details',
    key: 'details',
  },
];

const data = [
  {
    key: '1',
    orderId: 'DH001',
    totalAmount: '1,200,000 VNĐ',
    purchaseDate: '2024-07-18',
    status: 'Đã giao hàng',
    details: 'Xem chi tiết',
  },
];

export default function OdersForm() {
  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  return (
    <>
      <div className="container mx-auto p-5">
        <div className="flex justify-end mb-4">
          <button className="duration-300 h-12 w-40 hover:border-2 hover:border-green-600 bg-green-600 hover:bg-white hover:text-green-500 text-white font-bold text-xs py-2 px-4 rounded-xl">
            THÊM ĐỊA CHỈ
          </button>
        </div>
        <Table columns={columns} dataSource={data} onChange={onChange} />
      </div>
    </>
  );
}
