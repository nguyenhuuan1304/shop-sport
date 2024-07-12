import React, { useEffect, useState } from "react";
import {
  Button,
  Drawer,
  Image,
  InputNumber,
  Input,
  Space,
  Popconfirm,
} from "antd";
import { FaTrashAlt, FaPlus, FaMinus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CiWarning } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartData } from "../../features/cartSlice";
const DeleteConfirmButton = () => {
  return (
    <Popconfirm
      title="Xóa sản phẩm này khỏi giỏ hàng?"
      placement="left"
      // description="Xác nhận xóa sản phẩm ra khỏi giỏ hàng?"
      // onConfirm={confirm}
      // onCancel={cancel}
      icon={
        <CiWarning
          size={25}
          style={{
            color: "red",
          }}
        />
      }
      okText="Xóa"
      cancelText="Hủy"
    >
      <Button size="small" type="text" danger>
        <FaTrashAlt size={15} />
      </Button>
    </Popconfirm>
  );
};

const QuantityEditor = () => {
  const [value, setValue] = useState(1);

  const increment = () => {
    setValue((prevValue) => prevValue + 1);
  };

  const decrement = () => {
    setValue((prevValue) => (prevValue > 0 ? prevValue - 1 : 0));
  };

  return (
    <Space className="flex items-center">
      <Button icon={<FaMinus />} onClick={decrement} disabled={value <= 1} />
      <InputNumber min={1} value={value} className="text-center" />
      <Button icon={<FaPlus />} onClick={increment} />
    </Space>
  );
};

const CartProduct = () => {
  return (
    <div className="flex flex-row gap-3">
      <div className="grow">
        <Image
          className="rounded-2xl"
          width={150}
          height={200}
          src="https://cdn-images.kiotviet.vn/locsporthcm/7271554fd6af4a0ca26858ddf8b6c1a5.jpg"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between items-center gap-2">
          <span className="font-semibold">
            ARSENAL XANH DA TRẺ EM 2024-2025 CP
          </span>
          {/* <Button size="small" type="text" danger>
            <FaTrashAlt size={15} />
          </Button> */}
          <DeleteConfirmButton />
        </div>
        <span>7</span>
        <span className="text-xs text-green-600">
          Số lượng sản phẩm trong kho còn <span className="font-bold">14</span>
        </span>
        <span className="font-semibold text-red-500">47,000đ</span>
        <div className="flex flex-row justify-between items-center">
          <QuantityEditor />
        </div>
      </div>
    </div>
  );
};

const DrawerFooter = () => {
  return (
    <div className="flex flex-row gap-2 items-center justify-center">
      <Button size="large" type="primary" className="w-full">
        Chọn thêm
      </Button>
      <Button size="large" danger type="primary" className="w-full">
        Đặt ngay
      </Button>
    </div>
  );
};

export default function CartDrawer({ open, onClose }) {
  const products = useSelector((state) => state.cart.products);
  return (
    <>
      <Drawer
        loading={false}
        title="GIỎ HÀNG"
        footer={<DrawerFooter />}
        onClose={onClose}
        open={open}
      >
        {/* Product Area */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col items-center gap-2">
            <CartProduct />
          </div>
        </div>
      </Drawer>
    </>
  );
}
