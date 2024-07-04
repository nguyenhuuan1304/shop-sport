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

export default function Header() {
  return (
    <div className=" border-b-2 flex flex-row h-32 w-full gap-10 items-center justify-center">
      <img className="w-36 h-20 p-2" src={logo} alt="" />
      <div className="grow gap-6 flex flex-col p-5">
        <div className="flex flex-row gap-10 grow flex-auto items-center justify-between">
          <Search
            placeholder="Nhập sản phẩm tìm kiếm"
            enterButton
            className="w-96 h-auto"
          />
          <div className="flex flex-row items-center gap-5">
            <Link className="text-sm flex flex-row gap-2 items-center">
              <PiNotepadFill size={30} className="text-red-500" />
              Kiểm tra đơn hàng
            </Link>
            <Link className="text-sm flex flex-row gap-2 items-center">
              <IoPersonAddSharp size={30} className="text-red-500" />
              Đăng ký
            </Link>
            <Link className="text-sm flex flex-row gap-2 items-center">
              <IoPersonCircle size={30} className="text-red-500" />
              Đăng nhập
            </Link>

            <Link className="text-sm flex flex-row gap-2 items-center">
              <Badge count={0} showZero>
                <FaShoppingCart size={30} className="text-red-500" />
              </Badge>
              Giỏ hàng
            </Link>
          </div>
        </div>
        <div className="bg-blue-800 flex flex-row items-center">
          <NavLink className="text-white p-2 flex items-center gap-2 hover:text-blue-400 duration-200">
            <FaHome className="text-red-600" size={20} />
            TRANG CHỦ
          </NavLink>
          <Divider className="border-white h-7" type="vertical" />
          <NavLink className="text-white p-2 flex hover:text-blue-400 duration-200">
            SẢN PHẨM
          </NavLink>
          <Divider className="border-white h-7" type="vertical" />
          <NavLink className="text-white p-2 flex items-center gap-2 hover:text-blue-400 duration-200">
            <FaHeadphones className="text-red-600" size={20} />
            LIÊN HỆ
          </NavLink>
          <Divider className="border-white h-7" type="vertical" />
        </div>
      </div>
    </div>
  );
}
