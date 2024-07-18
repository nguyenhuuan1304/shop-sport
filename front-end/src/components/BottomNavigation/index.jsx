import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Badge, Drawer } from "antd";
import CartDrawer from "../../components/CartDrawer";
import { motion } from "framer-motion";
import { fetchCartData } from "../../features/cartSlice";
import {
  CiShoppingBasket,
  CiViewTable,
  CiUser,
  CiViewList,
  CiMenuBurger,
} from "react-icons/ci";
import { useLocation, useNavigate } from "react-router-dom";
import useRedirectToLogin from "../../custom hooks/useRedirectToLogin";

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
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [totalProduct, setTotalProduct] = useState(0);
  const [isCartDrawerOpen, setCartDrawOpen] = useState(false);
  const products = useSelector((state) => state.cart.products);
  const redirectToLogin = useRedirectToLogin();
  const showCartDrawer = () => {
    setCartDrawOpen(true);
  };
  const closeCartDrawer = () => {
    setCartDrawOpen(false);
  };

  const handleProtectedAction = (to) => {
    // Kiểm tra nếu người dùng chưa đăng nhập //
    if (!currentUser) {
      redirectToLogin();
    } else {
      navigate(to);
    }
  };
  useEffect(() => {
    dispatch(fetchCartData(currentUser?.id));
  }, [dispatch, currentUser]);
  //tổng số lượng sản phẩm có trong giỏ hàng (tính cả size)
  useEffect(() => {
    const totalProductCount = products?.reduce((accumulator, product) => {
      return accumulator + product.count;
    }, 0);
    setTotalProduct(totalProductCount);
  }, [dispatch, products]);
  return (
    <div className="border-t border-black p-1 fixed bottom-0 z-50 left-0 right-0 flex flex-row justify-between overflow-hidden bg-white gap-2 sm:hidden">
      {navLinks.map((item, index) => {
        return (
          <NavigationLink
            key={index}
            Icon={item.Icon}
            title={item.title}
            to={item.to}
            count={totalProduct ? totalProduct : 0}
            onClick={
              item.title === "Giỏ hàng"
                ? showCartDrawer
                : item.title === "Tài khoản"
                ? () => handleProtectedAction(item.to)
                : undefined
            }
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
