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
      <InputNumber min={1} value={value} readOnly className="text-center" />
      <Button icon={<FaPlus />} onClick={increment} />
    </Space>
  );
};

const CartProduct = ({ product, size }) => {
  const foundItem = product?.attributes?.size_list?.find(
    (item) => item.size === size
  );
  return (
    <div className="flex flex-row gap-3">
      <div className="">
        <Image
          className="rounded-2xl"
          width={150}
          height={150}
          src={
            import.meta.env.VITE_IMG_URL +
            product?.attributes?.image?.data?.[0]?.attributes?.url
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between items-center gap-2">
          <span className="font-semibold">{product?.attributes?.name}</span>
          {/* <Button size="small" type="text" danger>
            <FaTrashAlt size={15} />
          </Button> */}
          <DeleteConfirmButton />
        </div>
        <span>{size}</span>
        <span className="text-xs text-green-600">
          Số lượng sản phẩm trong kho còn{" "}
          <span className="font-bold">
            {foundItem ? foundItem.quantity : 0}
          </span>
        </span>
        <span className="font-semibold text-red-500">
          {product?.attributes?.price?.toLocaleString()}đ
        </span>
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
        <Link to="/products">Chọn thêm</Link>
      </Button>
      <Button size="large" danger type="primary" className="w-full">
        <Link to="/cart">Đặt ngay</Link>
      </Button>
    </div>
  );
};

export default function CartDrawer({ open, onClose, size }) {
  // const products = useSelector((state) => state.cart.products);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth?.currentUser?.id);
  const cartData = useSelector((state) => state.cart?.products);
  //tổng giá tiền sản phẩm của giỏ hàng
  const total = useSelector((state) => state.cart.total);
  return (
    <>
      <Drawer
        loading={false}
        title="GIỎ HÀNG"
        footer={<DrawerFooter />}
        onClose={onClose}
        open={open}
        size={size}
      >
        {/* Product Area */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col items-center gap-2">
            {cartData?.map((item) => (
              <CartProduct
                key={item.product.id}
                product={item.product}
                size={item.size}
              />
            ))}
          </div>
        </div>
      </Drawer>
    </>
  );
}
