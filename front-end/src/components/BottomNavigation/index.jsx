import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Drawer } from "antd";
import CartDrawer from "../../components/CartDrawer";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
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
    to: "",
    onClick: "showCartDrawer",
  },
  {
    Icon: CiViewList,
    title: "Đơn hàng",
    to: "",
  },
  {
    Icon: CiUser,
    title: "Tài khoản",
    to: "/profile",
  },
];

const NavigationLink = ({ Icon, title, to, count, onClick }) => {
  return (
    <div
      className="flex flex-col hover:text-blue-500 items-center p-2"
      onClick={onClick}
    >
      {title === "Giỏ hàng" ? (
        <>
          <Badge showZero count={count ? count : 0}>
            <Icon size={25} />
          </Badge>
          <span className="text-xs ">{title}</span>
        </>
      ) : (
        <Link to={to} className="flex flex-col items-center">
          <Icon size={25} />
          <span className="text-xs">{title}</span>
        </Link>
      )}
    </div>
  );
};

export default function BottomNavigation({ className }) {
  const [isCartDrawerOpen, setCartDrawOpen] = useState(false);
  const showCartDrawer = () => {
    setCartDrawOpen(true);
  };
  const closeCartDrawer = () => {
    setCartDrawOpen(false);
  };
  const products = useSelector((state) => state.cart.products);
  return (
    <div className="border-t border-black p-1 fixed bottom-0 z-50 left-0 right-0 flex flex-row justify-between overflow-hidden bg-white gap-2 sm:hidden">
      {navLinks.map((item, index) => {
        return (
          <NavigationLink
            key={index}
            Icon={item.Icon}
            title={item.title}
            to={item.to}
            count={products?.length}
            onClick={item.title === "Giỏ hàng" ? showCartDrawer : undefined}
          />
        );
      })}
      <CartDrawer
        open={isCartDrawerOpen}
        onClose={closeCartDrawer}
        size={"large"}
      />
    </div>
  );
}
