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
import { motion, AnimatePresence } from "framer-motion";
const { TextArea } = Input;
import {
  CiShoppingBasket,
  CiViewTable,
  CiUser,
  CiViewList,
  CiMenuBurger,
} from "react-icons/ci";
import CartItem, {
  QuantityEditor,
  DeleteConfirmButton,
} from "../components/CartItem";
import EmptyCart from "../components/EmptyCart";

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
        <EmptyCart />
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
            {cartData?.map((cartItem, index) => (
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
            ))}
            {/* tổng tiền */}
            <div>
              <Divider />
              <div className="flex flex-row items-center justify-between">
                <span>Tạm tính</span>
                <motion.span
                  key={total}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1.2, 1.3, 1] }}
                  transition={{ duration: 0.4 }}
                >
                  {total?.toLocaleString()}đ
                </motion.span>
              </div>
              <div className="flex flex-row items-center justify-between">
                <span>Tổng</span>
                <motion.span
                  key={total}
                  initial={{ scale: 1 }}
                  animate={{
                    scale: [1.2, 1.3, 1],
                    fontWeight: [800, 500],
                  }}
                  transition={{ duration: 0.3 }}
                  className="text-red-500 text-lg font-semibold"
                >
                  {total?.toLocaleString()}đ
                </motion.span>
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
