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
import {
  fetchCartData,
  addToCart,
  removeFromCart,
  deleteFromCart,
} from "../../features/cartSlice";
import { motion } from "framer-motion";
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
  const handleAddToCart = (userId, product) => {
    dispatch(addToCart({ userId, product }));
  };
  const handleRemoveFromCart = (userId, product) => {
    dispatch(removeFromCart({ userId, product }));
  };
  const handleDeleteFromCart = (userId, cartItem) => {
    dispatch(deleteFromCart({ userId, cartItem }));
  };
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
            {cartData?.length > 0 ? (
              cartData.map((cartItem) => (
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
              ))
            ) : (
              <NotLoginScreen />
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
}
