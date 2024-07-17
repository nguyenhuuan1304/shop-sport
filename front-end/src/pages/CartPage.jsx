import React, { useState, useEffect } from "react";
import {
  Divider,
  Input,
  Button,
  Popconfirm,
  Image,
  Space,
  InputNumber,
} from "antd";
import { Link } from "react-router-dom";
import { CiWarning } from "react-icons/ci";
import {
  fetchCartData,
  addToCart,
  removeFromCart,
  setTotalProduct,
  deleteFromCart,
} from "../features/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaTrashAlt, FaPlus, FaMinus } from "react-icons/fa";
import { motion } from "framer-motion";
const { TextArea } = Input;
import {
  CiShoppingBasket,
  CiViewTable,
  CiUser,
  CiViewList,
  CiMenuBurger,
} from "react-icons/ci";

//Trang sẽ hiển thị nếu chưa đăng nhập
const NotLoginScreen = () => {
  return (
    <div className="flex flex-col items-center gap-5 h-screen">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.7 }}
      >
        <CiShoppingBasket className="text-neutral-500" size={150} />
      </motion.div>
      <span className="font-semibold text-xl">
        Chưa có sản phẩm nào trong giỏ hàng.
      </span>
      <span className="text-sm">
        Hãy quay lại và chọn cho mình sản phẩm yêu thích bạn nhé
      </span>
      <Link to="/products" className="underline">
        TIẾP TỤC MUA HÀNG
      </Link>
    </div>
  );
};

const QuantityEditor = ({ max, min, value, onIncrement, onDecrement }) => {
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const increment = () => {
    if (currentValue < max) {
      const newValue = currentValue + 1;
      setCurrentValue(newValue);
      onIncrement(newValue);
    }
  };

  const decrement = () => {
    if (currentValue > min) {
      const newValue = currentValue - 1;
      setCurrentValue(newValue);
      onDecrement(newValue);
    }
  };

  return (
    <Space className="flex items-center">
      <Button
        icon={<FaMinus />}
        onClick={decrement}
        disabled={currentValue <= min}
      />
      <InputNumber
        min={min}
        max={max}
        value={currentValue}
        readOnly
        className="text-center"
      />
      <Button
        icon={<FaPlus />}
        onClick={increment}
        disabled={currentValue >= max}
      />
    </Space>
  );
};

const DeleteConfirmButton = ({ onConfirm }) => {
  return (
    <Popconfirm
      title="Xóa sản phẩm này khỏi giỏ hàng?"
      placement="left"
      // description="Xác nhận xóa sản phẩm ra khỏi giỏ hàng?"
      onConfirm={onConfirm}
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

const CartItem = ({
  productQuantity,
  cartItem,
  size,
  addToCart,
  removeFromCart,
  deleteFromCart,
}) => {
  const [quantity, setQuantity] = useState(productQuantity);
  const foundItem = cartItem?.product?.attributes?.size_list?.find(
    (item) => item.size === size
  );
  const handleIncrement = (newValue) => {
    if (newValue <= foundItem.quantity) {
      setQuantity(newValue);
      addToCart(cartItem, newValue);
    }
  };

  const handleDecrement = (newValue) => {
    if (newValue >= 1) {
      setQuantity(newValue);
      removeFromCart(cartItem, newValue);
    }
  };
  const handleDeleteCartItem = () => {
    deleteFromCart(cartItem);
  };

  console.log("cart item count", quantity);
  return (
    <div className="flex flex-row gap-3">
      <div className="">
        <Image
          className="rounded-2xl"
          width={170}
          height={170}
          src={
            import.meta.env.VITE_IMG_URL +
            cartItem?.product?.attributes?.image?.data?.[0]?.attributes?.url
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between items-center gap-2">
          <span className="font-semibold">
            {cartItem?.product?.attributes?.name}
          </span>
          {/* <Button size="small" type="text" danger>
            <FaTrashAlt size={15} />
          </Button> */}
          <DeleteConfirmButton onConfirm={handleDeleteCartItem} />
        </div>
        <span>{size}</span>
        {quantity > foundItem.quantity ? (
          <span className="text-xs text-red-600">
            Số lượng sản phẩm trong kho còn{" "}
            <span className="font-bold ">
              {foundItem ? foundItem.quantity : 0}
            </span>{" "}
            (vượt quá sản phẩm)
          </span>
        ) : (
          <span className="text-xs text-green-600">
            Số lượng sản phẩm trong kho còn{" "}
            <span className="font-bold ">
              {foundItem ? foundItem.quantity : 0}
            </span>
          </span>
        )}

        <span className="font-semibold text-red-500">
          {cartItem?.product?.attributes?.price?.toLocaleString()}đ
        </span>
        <div className="flex flex-row justify-between items-center">
          <QuantityEditor
            max={foundItem?.quantity}
            min={1}
            value={productQuantity}
            setValue={setQuantity}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
          />
        </div>
      </div>
    </div>
  );
};

export default function CartPage() {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth?.currentUser?.id);
  const cartData = useSelector((state) => state.cart?.products);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  //tổng giá tiền sản phẩm của giỏ hàng
  const total = useSelector((state) => state.cart.total);
  // tổng số lượng sản phẩm có trong giỏ hàng (tính cả size)
  const totalProduct = useSelector((state) => state.cart.totalProduct);
  // xử lý thêm sản phẩm vào giỏ hàng trên strapi
  const handleAddToCart = (userId, product) => {
    dispatch(addToCart({ userId, product }));
  };
  const handleRemoveFromCart = (userId, product) => {
    dispatch(removeFromCart({ userId, product }));
  };
  const handleDeleteFromCart = (userId, cartItem) => {
    dispatch(deleteFromCart({ userId, cartItem }));
  };

  useEffect(() => {
    dispatch(fetchCartData(userId));
  }, [dispatch, userId]);

  return (
    <>
      {" "}
      {!isAuthenticated || cartData?.length === 0 ? (
        <NotLoginScreen />
      ) : (
        <div className="flex flex-col sm:flex-row gap-2 p-5">
          {/* thông tin vận chuyển */}
          <div className="flex flex-col gap-5 basis-1/2 h-full">
            <div>
              <span className="text-xl text-neutral-700 font-semibold">
                THÔNG TIN VẬN CHUYỂN
              </span>
              <Divider />
            </div>

            <div className="flex sm:flex-row flex-col gap-3 text-xs">
              <div className="flex flex-col gap-2">
                <span className="text-sm">Số điện thoại</span>
                <Input
                  placeholder="Điện thoại liên lạc với bạn."
                  className="rounded-full pr-20"
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm">Email</span>
                <Input
                  placeholder="Địa chỉ email của bạn."
                  className="rounded-full pr-20"
                />
              </div>
            </div>
            {/* Địa chỉ  */}
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex flex-row gap-2">
                <span>Địa chỉ</span>
                <Link to="" className="text-blue-600">
                  Địa chỉ khác
                </Link>
              </div>
              <span className="font-semibold text-lg">Tiền Vệ Football</span>
              <p className="text-gray-500 text-base">
                83/5 Huỳnh Văn Luỹ, P.Phú Lợi, TP. Thủ Dầu Một, Bình Dương,
                Phường Phú Lợi, Thành phố Thủ Dầu Một, Bình Dương
              </p>
            </div>
            {/* Ghi chú */}
            <div>
              <span className="text-sm">Ghi chú</span>
              <TextArea allowClear className="rounded-lg" />
            </div>
          </div>
          {/* divider */}
          {/* giỏ hàng */}
          <div className=" basis-1/2 flex flex-col sm:border-l border-l-0 border-gray-300 pl-3">
            <div>
              <span className="text-xl text-neutral-700 font-semibold">
                GIỎ HÀNG
              </span>
              <Divider />
            </div>
            {cartData?.map((cartItem) => (
              <CartItem
                key={cartItem.id}
                cartItem={cartItem}
                size={cartItem.size}
                productQuantity={cartItem.count}
                addToCart={(cartItem) => handleAddToCart(userId, cartItem)}
                removeFromCart={(cartItem) =>
                  handleRemoveFromCart(userId, cartItem)
                }
                deleteFromCart={(cartItem) =>
                  handleDeleteFromCart(userId, cartItem)
                }
              />
            ))}
            {/* tổng tiền */}
            <div>
              <Divider />
              <div className="flex flex-row items-center justify-between">
                <span>Tạm tính</span>
                <span>{total?.toLocaleString()}đ</span>
              </div>
              <div className="flex flex-row items-center justify-between">
                <span>Tổng</span>
                <span className="text-red-500 text-lg font-semibold">
                  {total?.toLocaleString()}đ
                </span>
              </div>
              <Divider />
            </div>
            <Button danger type="primary">
              <span size="large" className="text-lg">
                Đặt hàng
              </span>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
