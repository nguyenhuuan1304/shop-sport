import React from "react";
import { Outlet, Link } from "react-router-dom";
import Footer from "../components/Footer";
import logo from "../assets/logo.jpg";
import BottomNavigation from "../components/BottomNavigation";
import ResponsiveHeader from "../components/ResponsiveHeader";

export default function CartLayout() {
  return (
    <div>
      <ResponsiveHeader />
      <header className="shadow-md sm:flex hidden flex-row items-center justify-between p-2">
        <div>
          <Link to="/">
            <img src={logo} alt="logo" className="w-32 h-auto" />
          </Link>
        </div>
        <div className="flex flex-row gap-10 text-lg text-gray-500">
          <span>1 Giỏ hàng</span>
          <span className=" text-black font-medium">2 Thanh toán</span>
          <span>3 Hoàn tất</span>
        </div>
      </header>
      <Outlet />
      <BottomNavigation />
      <Footer />
    </div>
  );
}
