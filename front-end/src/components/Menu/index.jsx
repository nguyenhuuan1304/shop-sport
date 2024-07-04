import React from "react";
import { NavLink } from "react-router-dom";
import { IoIosMenu } from "react-icons/io";

export default function Menu() {
  return (
    <div className="flex flex-row items-center justify-evenly gap-5 mt-5 sticky top-0 z-10 bg-white">
      <NavLink className="bg-blue-500 text-white text-sm p-3 rounded-md flex flex-row gap-2 items-center">
        <IoIosMenu size={20} className="text-black" />
        Danh mục sản phẩm
      </NavLink>
      <NavLink className="bg-blue-500 text-white text-sm p-3 rounded-md flex flex-row gap-2 items-center">
        <IoIosMenu size={20} className="text-black" />
        CHẤT LƯỢNG SẢN PHẨM
      </NavLink>
      <NavLink className="bg-blue-500 text-white text-sm p-3 rounded-md flex flex-row gap-2 items-center">
        <IoIosMenu size={20} className="text-black" />
        PHÂN PHỐI SỈ TOÀN QUỐC
      </NavLink>
      <NavLink className="bg-blue-500 text-white text-sm p-3 rounded-md flex flex-row gap-2 items-center">
        <IoIosMenu size={20} className="text-black" />
        MẶT HÀNG ĐA DẠNG
      </NavLink>
      <NavLink className="bg-blue-500 text-white text-sm p-3 rounded-md flex flex-row gap-2 items-center">
        <IoIosMenu size={20} className="text-black" />
        GIAO HÀNG NHANH CHÓNG
      </NavLink>
    </div>
  );
}
