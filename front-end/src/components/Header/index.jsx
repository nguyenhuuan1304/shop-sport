import React from "react";
import logo from "../../assets/logo.jpg";
import { NavLink, Link } from "react-router-dom";
import { Divider } from "antd";
import { FaHome, FaHeadphones, FaShoppingCart } from "react-icons/fa";
import { IoPersonCircle, IoPersonAddSharp } from "react-icons/io5";
import { PiNotepadFill } from "react-icons/pi";
import { Input, Space } from "antd";
import { Badge } from "antd";
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

const navElements = [
  {
    Icon: PiNotepadFill,
    title: "Kiểm tra đơn hàng",
    to: "",
  },
  {
    Icon: IoPersonAddSharp,
    title: "Đăng ký",
    to: "",
  },
  {
    Icon: IoPersonCircle,
    title: "Đăng nhập",
    to: "login",
  },
  {
    Icon: FaShoppingCart,
    title: "Giỏ hàng",
    to: "cart",
  },
];

function NavigationLink({ Icon, title, to }) {
  return (
    <Link className="text-sm flex flex-row gap-2 items-center" to={to}>
      {title === "Giỏ hàng" ? (
        <Badge count={0} showZero>
          <Icon size={30} className="text-red-500" />
        </Badge>
      ) : (
        <Icon size={30} className="text-red-500" />
      )}
      {title}
    </Link>
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
  return (
    <div className=" border-b flex flex-row h-32 w-full gap-10 items-center justify-center">
      <Link to="/">
        <img
          className="w-32 scale-105 h-auto ml-8 object-cover"
          src={logo}
          alt=""
        />
      </Link>
      <div className=" gap-6 flex flex-col p-4">
        <div className="flex flex-row gap-10 flex-auto items-center justify-between">
          <Search
            placeholder="Nhập sản phẩm tìm kiếm"
            enterButton
            className="w-96 h-auto"
          />
          <div className="flex flex-row items-center gap-5">
            {navElements.map((item, index) => {
              return (
                <NavigationLink
                  key={index}
                  title={item.title}
                  Icon={item.Icon}
                  to={item.to}
                />
              );
            })}
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
