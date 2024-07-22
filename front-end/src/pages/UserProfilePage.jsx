import {
  faArrowRightFromBracket,
  faCartShopping,
  faLockOpen,
  faNewspaper,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
const iconMap = {
  user: faUser,
  newspaper: faNewspaper,
  "lock-open": faLockOpen,
  "cart-shopping": faCartShopping,
  "arrow-right-from-bracket": faArrowRightFromBracket,
};
const optionProfile = [
  {
    icon: "user",
    title: "Thông tin tài khoản",
    path: "account-info",
  },
  {
    icon: "newspaper",
    title: "Sổ địa chỉ",
    path: "address-book",
  },
  {
    icon: "lock-open",
    title: "Đổi mật khẩu",
    path: "change-password",
  },
  {
    icon: "cart-shopping",
    title: "Đơn hàng",
    path: "orders",
  },
  {
    icon: "arrow-right-from-bracket",
    title: "Đăng xuất",
    path: " logout",
  },
];

export default function UserProfilePage() {
  const currenUser = useSelector((state) => state.auth?.currentUser);
  return (
    <div className="bg-slate-50 w-full">
      <div className="flex flex-row justify-center gap-2 p-12">
        <div className="flex flex-col bg-white p-5 w-1/4 h-3/4 rounded-lg shadow-xl">
          <div className="flex flex-col text-center text-neutral-500 w-full">
            <span className="uppercase font-semibold">
              {currenUser?.username}
            </span>
            <span>{`${currenUser?.firstname || ''} ${currenUser?.lastname || ''}`}</span>
            <span className="text-base">{currenUser?.email}</span>
          </div>
          <Divider />

          <div className="flex flex-col space-y-2">
            {optionProfile.map((item, index) => {
              return (
                <Link
                  key={index}
                  to={item?.path}
                  className="text-black hover:text-white hover:bg-blue-400 hover:font-semibold p-2 rounded-lg"
                >
                  <div className="flex flex-row gap-4 items-center">
                    <FontAwesomeIcon icon={iconMap[item?.icon]} className="" />
                    <span>{item.title}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="bg-white w-3/4 rounded-lg shadow-xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
