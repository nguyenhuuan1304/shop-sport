import { Table, Badge, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddAddressForm from "./addAddressForm";
import { fetchOrderAddress } from "../../redux/slices/orderAddressSlice";
const columns = [
  {
    title: "ID",
    dataIndex: "_id",
    key: "_id",
  },
  {
    title: "Họ và tên",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Địa chỉ",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Đặt làm mặc định",
    dataIndex: "is_default",
    key: "is_default",
    render: (isDefault) =>
      isDefault ? (
        <Badge status="success" text="Mặc định" />
      ) : (
        <Badge status="default" text="Không" />
      ),
  },
  {
    title: "#",
    dataIndex: "action",
    key: "action",
    render: (_, record) => (
      <Button type="primary" onClick={() => handleEdit(record._id)}>
        Đặt làm mặc định
      </Button>
    ),
  },
];

const AddressForm = () => {
  const dispatch = useDispatch();
  // const currentUser = useSelector((state) => state.auth?.currentUser);
  const order_addresses = useSelector(
    (state) => state.orderAddress?.order_addresses
  );
  useEffect(() => {
    // if (currentUser) {
    //   const formattedData = currentUser.order_addresses?.map((item) => ({
    //     key: item._id?.toString(),
    //     name: item.name,
    //     address: item.address,
    //     defaultAddress: item.isDefault ? "v" : "",
    //     action: item.isDefault ? "Cửa hàng mặc định" : "",
    //   }));
    //   setData(formattedData);
    // }
    dispatch(fetchOrderAddress());
  }, [dispatch]);

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <>
      <div className="container mx-auto  p-5">
        <div className="size-full">
          <AddAddressForm />
        </div>
        <Table
          columns={columns}
          dataSource={order_addresses}
          pagination={{ pageSize: 5 }}
          onChange={onChange}
          scroll={{ y: 240 }}
        />
      </div>
    </>
  );
};

export default AddressForm;
