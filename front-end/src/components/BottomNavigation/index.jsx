import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "antd";
import {
  CiShoppingBasket,
  CiViewTable,
  CiUser,
  CiViewList,
  CiMenuBurger,
} from "react-icons/ci";

const navLinks = [
  {
    Icon: CiMenuBurger,
    title: "Trang chủ",
    to: "/",
  },
  {
    Icon: CiViewTable,
    title: "Danh mục",
    to: "",
  },
  {
    Icon: CiShoppingBasket,
    title: "Giỏ hàng",
    to: "cart",
  },
  {
    Icon: CiViewList,
    title: "Đơn hàng",
    to: "",
  },
  {
    Icon: CiUser,
    title: "Tài khoản",
    to: "profile",
  },
];

const NavigationLink = ({ Icon, title, to }) => {
  return (
    <Link
      className=" flex flex-col hover:text-blue-500 items-center p-2"
      to={to}
    >
      {title === "Giỏ hàng" ? (
        <>
          <Badge showZero count={0}>
            <Icon size={25} />
          </Badge>
          <span className="text-xs ">{title}</span>
        </>
      ) : (
        <>
          <Icon size={25} />
          <span className="text-xs">{title}</span>
        </>
      )}
    </Link>
  );
};

export default function BottomNavigation({ className }) {
  return (
    <div className="border-t border-black p-1 fixed bottom-0 z-50 left-0 right-0 flex flex-row justify-between overflow-hidden bg-white gap-2 sm:hidden">
      {navLinks.map((item, index) => {
        return (
          <NavigationLink
            key={index}
            Icon={item.Icon}
            title={item.title}
            to={item.to}
          />
        );
      })}
    </div>
  );
}
