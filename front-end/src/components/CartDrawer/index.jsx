import {
  Button,
  Drawer
} from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addToCart,
  deleteFromCart,
  removeFromCart
} from "../../redux/slices/cartSlice";
import CartItem from "../CartItem";
import EmptyCart from "../EmptyCart";
//Trang sẽ hiển thị nếu chưa đăng nhập

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
              cartData.map((cartItem, index) => (
                <CartItem
                  key={index}
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
              <EmptyCart />
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
}
