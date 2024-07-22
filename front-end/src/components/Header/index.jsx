import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.jpg";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { Divider } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { FaHome, FaHeadphones, FaShoppingCart, FaUser } from "react-icons/fa";
import { IoPersonCircle, IoPersonAddSharp } from "react-icons/io5";
import { PiNotepadFill } from "react-icons/pi";
import { Input, Space, Badge } from "antd";
import { fetchUserDetail, logout } from "../../features/authSlice";
import { fetchCartData, setTotalProduct } from "../../features/cartSlice";
import { IoLogOut } from "react-icons/io5";
import { motion } from "framer-motion";
import useRedirectToLogin from "../../custom hooks/useRedirectToLogin";
const { Search } = Input;

const menuItems = [
  {
    Icon: FaHome,
    title: "TRANG CHỦ",
    to: "/",
  },
  {
    title: "SẢN PHẨM",
    to: "products",
  },
  {
    Icon: FaHeadphones,
    title: "LIÊN HỆ",
    to: "contact",
  },
];

function NavigationLink({ Icon, title, to, count }) {
  const redirectToLogin = useRedirectToLogin();

  const handleClick = () => {
    redirectToLogin();
  };

  return (
    <>
      {title === "Đăng nhập" ? (
        <div
          className="text-sm flex flex-row gap-2 items-center cursor-pointer"
          onClick={handleClick}
        >
          <Icon size={30} className="text-red-500" />
          {title}
        </div>
      ) : (
        <Link className="text-sm flex flex-row gap-2 items-center" to={to}>
          {title === "Giỏ hàng" ? (
            <Badge count={count} showZero>
              <Icon size={30} className="text-red-500" />
            </Badge>
          ) : (
            <Icon size={30} className="text-red-500" />
          )}
          {title}
        </Link>
      )}
    </>
  );
}

function MenuLink({ Icon, title, to }) {
  return (
    <>
      <NavLink
        to={to}
        className={({ isActive }) =>
          isActive
            ? "text-blue-400 p-2 flex items-center gap-2  duration-200 font-medium"
            : " hover:text-blue-400 p-2 flex items-center gap-2 text-white duration-200 font-medium"
        }
      >
        {Icon && <Icon className="text-red-600" size={20} />}
        {title}
      </NavLink>
      <Divider className="border-white h-7" type="vertical" />
    </>
  );
}

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const number_of_product = useSelector(
    (state) => state.cart.number_of_product
  );
  const products = useSelector((state) => state.cart.products);
  console.log(location.pathname);
  //fetch cart data để tính số lượng sản phẩm trong giỏ hàng
  useEffect(() => {
    dispatch(fetchCartData(currentUser?.id));
  }, [dispatch, currentUser]);

  return (
    <div className="sm:flex hidden border-b flex-row h-32 w-full gap-10 items-center justify-between">
      <Link to="/">
        <motion.img
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.7, 0.8, 0.9, 1],
            scale: [1.4, 1.3, 1.2, 1],
          }}
          whileHover={{ scale: 1.4 }}
          transition={{ duration: 0.4 }}
          className="w-32 scale-105 h-auto ml-8 object-cover grow"
          src={logo}
          alt=""
        />
      </Link>
      <div className=" gap-6 flex flex-col p-4 grow">
        <div className="flex flex-row gap-10 flex-auto items-center justify-between">
          <Search
            placeholder="Nhập sản phẩm tìm kiếm"
            enterButton
            className="w-96 h-auto"
          />
          <div className="flex flex-row items-center gap-5">
            <NavigationLink
              title="Kiểm tra đơn hàng"
              Icon={PiNotepadFill}
              to=""
            />
            {isAuthenticated && currentUser ? (
              <NavigationLink
                title={`Xin chào, ${currentUser?.username}`}
                Icon={FaUser}
                to="profile"
              />
            ) : (
              <NavigationLink title="Đăng ký" Icon={IoPersonAddSharp} to="" />
            )}
            {isAuthenticated && currentUser ? (
              <Link
                className="text-sm flex flex-row gap-2 items-center"
                onClick={() => dispatch(logout())}
              >
                <IoLogOut size={35} className="text-red-500" />
                Đăng xuất
              </Link>
            ) : (
              <NavigationLink title="Đăng nhập" Icon={IoPersonCircle} />
            )}
            <NavigationLink
              count={number_of_product ? number_of_product : 0}
              title="Giỏ hàng"
              Icon={FaShoppingCart}
              to="cart"
            />
          </div>
        </div>
        <div className="bg-blue-800 flex flex-row items-center">
          {menuItems.map((item, index) => {
            return (
              <MenuLink
                key={index}
                Icon={item.Icon}
                title={item.title}
                to={item.to}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
