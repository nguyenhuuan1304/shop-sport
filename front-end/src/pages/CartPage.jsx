import { Button, Divider, Input, notification } from "antd";
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
import { createCheckoutSession, createOrder } from "../redux/slices/orderSlice";
const { TextArea } = Input;

export default function CartPage() {
  const [api, contextHolder] = notification.useNotification();
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
      const order = {
        email: orderForm.email,
        number_phone: orderForm.number_phone,
        notes: orderForm.notes || "",
        order_address: default_address,
        cart: cartData,
        total_of_price: total,
      };

      // dispatch(createOrder(order));
      dispatch(createCheckoutSession(order));
      if (message) {
        api.warning({
          message: "Thông báo",
          description: (
            <div>
              {message}
              <br />
              <Link className="underline text-blue-600" to={prevPaymentUrl}>
                Đơn hàng chưa thanh toán
              </Link>
            </div>
          ),
          duration: 0,
        });
      }
    } else alert("Số lượng sản phẩm trong giỏ hạn vượt quá sản phẩm tồn kho");
  };

  const message = useSelector((state) => state.order?.error);
  //link thanh toán đơn hàng trước đó đang có trạng thái pending
  const prevPaymentUrl = useSelector((state) => state.order?.prevPaymentUrl);
  //link chuyển hướng đến stripe
  const paymentUrl = useSelector((state) => state.order?.paymentUrl);
  const isLoading = useSelector((state) => state.order?.loading);
  useEffect(() => {
    if (currentUser && isAuthenticated) {
      dispatch(fetchOrderAddress());
      dispatch(fetchCartData(userId));
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      setOrderForm({
        number_phone: currentUser?.number_phone,
        email: currentUser?.email,
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  }, [paymentUrl]);

  return (
    <>
      {" "}
      {!isAuthenticated || cartData?.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          {isLoading && (
            <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
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
                  {/* <Link to="" className="text-blue-600">
                    Địa chỉ khác
                  </Link> */}
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
            {contextHolder}
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
        </>
      )}
    </>
  );
}
