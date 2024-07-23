import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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


const AddressForm = () => {
  const currentUser = useSelector((state) => state.auth?.currentUser)
  const [data, setData] = useState([]);
  // console.log("currenUser",currentUser)
  useEffect(() => {
    if (currentUser) {
      const formattedData = currentUser.order_addresses?.map((item) => ({
        key: item.id.toString(),
        name: item.name,
        address: item.address,
        defaultAddress: item.isDefault ? 'v' : '',
        action: item.isDefault ? 'Cửa hàng mặc định' : ''
      }));
      setData(formattedData);
    }
  }, [currentUser]);
  
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <>
      <div className="container mx-auto  p-5">
        <div className="size-full">
          <AddAddressForm />
        </div>
        <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} onChange={onChange} scroll={{ y: 240 }}/>
      </div>
    </>
  );
};

export default AddressForm;
