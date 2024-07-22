import { Table } from "antd";
import React, { useState } from "react";
import AddAddressForm from "./addAddressForm";
const columns = [
  {
    title: "ID",
    dataIndex: "key",
    key: "key",
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
    dataIndex: "defaultAddress",
    key: "defaultAddress",
  },
  {
    title: "#",
    dataIndex: "action",
    key: "action",
  },
];

const data = [
  {
    key: "1",
    name: "TÌNH TRẦN",
    address: "79 biên cương, Xã Quảng Nghĩa, Thành phố Móng Cái, Quảng Ninh",
    defaultAddress: "v",
    action: "Cửa hàng mặc định",
  },
];

const AddressForm = () => {
  const [isOpenAddAddress, setisOpenAddAddress] = useState(false);
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const hanldeOpen = () => {
    setisOpenAddAddress(!isOpenAddAddress);
  };

  return (
    <>
      <div className="container mx-auto  p-5">
        <div className="size-full">
          <AddAddressForm />
        </div>
        <Table columns={columns} dataSource={data} onChange={onChange} />
      </div>
    </>
  );
};

export default AddressForm;
