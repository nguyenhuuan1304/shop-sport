import { Button, Divider, Input } from "antd";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import EmptyCart from "../components/EmptyCart";
import {
  addToCart,
  deleteFromCart,
  fetchCartData,
  removeFromCart,
} from "../redux/slices/cartSlice";
import { fetchOrderAddress } from "../redux/slices/orderAddressSlice";
const { TextArea } = Input;

export default function CartPage() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth?.currentUser);
  const [orderForm, setOrderForm] = useState({
    total_of_price: 0,
    order_address: {},
    cart: {},
    notes: "",
    number_phone: "",
    email: "",
  });
  const userId = useSelector((state) => state.auth?.currentUser?._id);
  const cartData = useSelector((state) => state.cart?.products);
  //tổng tiền của giỏ hàng
  const default_address = useSelector(
    (state) => state.orderAddress?.defaultOrderAddress
  );
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  //tổng giá tiền sản phẩm của giỏ hàng
  const total = useSelector((state) => state.cart?.total);
  // tổng số lượng sản phẩm có trong giỏ hàng (tính cả size)
  const totalProduct = useSelector((state) => state.cart?.number_of_product);
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };
  //kiểm tra số lượng sản phẩm trước khi thanh toán (số lương sp có vượt quá tồn kho hay ko)
  const checkQuantityCartItem = () => {
    return cartData.every((cartItem) =>
      cartItem.product?.size_list.some(
        (sizeItem) =>
          cartItem.size === sizeItem.size_name &&
          cartItem.count <= sizeItem.quantity
      )
    );
  };
  //xử lý nút đặt hàng
  const handleOrder = () => {
    if (checkQuantityCartItem()) {
      console.log(orderForm);
      console.log(cartData);
      console.log("order address", default_address);
      console.log("total price", total);
    } else alert("Số lượng sản phẩm trong giỏ hạn vượt quá sản phẩm tồn kho");
  };

  useEffect(() => {
    dispatch(fetchOrderAddress());
    dispatch(fetchCartData(userId));
  }, [currentUser]);
  useEffect(() => {
    if (currentUser) {
      setOrderForm({
        number_phone: currentUser?.number_phone,
        email: currentUser?.email,
      });
    }
  }, [currentUser]);
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
                  id="number_phone"
                  name="number_phone"
                  value={orderForm?.number_phone}
                  className="rounded-full pr-20"
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm">Email</span>
                <Input
                  id="number_phone"
                  name="email"
                  value={orderForm?.email}
                  className="rounded-full pr-20"
                  onChange={handleChange}
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
              <span className="font-semibold text-lg">
                {default_address?.name}
              </span>
              <p className="text-gray-500 text-base">
                {default_address?.address}
              </p>
            </div>
            {/* Ghi chú */}
            <div>
              <span className="text-sm">Ghi chú</span>
              <TextArea
                name="notes"
                allowClear
                className="rounded-lg"
                onChange={handleChange}
              />
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
            <Button onClick={handleOrder} danger type="primary">
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
