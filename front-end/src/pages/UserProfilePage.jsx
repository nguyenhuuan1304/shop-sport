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
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, NavLink } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
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
    path: "logout",
  },
];

export default function UserProfilePage() {
  const dispatch = useDispatch();
  const currenUser = useSelector((state) => state.auth?.currentUser);

  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <div className="bg-slate-50 w-full">
      <div className="flex flex-col sm:flex-row justify-center gap-2 p-12">
        {/* left side */}
        <div className="flex flex-col bg-white p-5 sm:w-1/4 sm:h-3/4 w-full rounded-lg shadow-xl">
          <div className="flex flex-col text-center text-neutral-500 w-full">
            <span className="uppercase font-semibold">
              {currenUser?.username}
            </span>
            <span>{`${currenUser?.first_name || ""} ${
              currenUser?.last_name || ""
            }`}</span>
            <span className="text-base">{currenUser?.email}</span>
          </div>
          <Divider />

          <div className="flex flex-col space-y-2">
            {optionProfile.map((item, index) => {
              if (item.path === "logout") {
                return (
                  <div
                    key={index}
                    onClick={handleLogout}
                    className="text-black hover:text-white hover:bg-blue-400 hover:font-semibold p-2 rounded-lg cursor-pointer"
                  >
                    <div className="flex flex-row gap-4 items-center">
                      <FontAwesomeIcon icon={iconMap[item.icon]} />
                      <span>{item.title}</span>
                      <Link to={`/`}></Link>
                    </div>
                  </div>
                );
              }
              return (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive, isPending }) =>
                    isPending
                      ? "text-black hover:text-white hover:bg-blue-400 hover:font-semibold p-2 rounded-lg duration-300"
                      : isActive
                      ? " text-white bg-blue-400 font-semibold p-2 rounded-lg"
                      : "text-black hover:text-white hover:bg-blue-400 hover:font-semibold p-2 rounded-lg duration-300"
                  }
                >
                  <div className="flex flex-row gap-4 items-center">
                    <FontAwesomeIcon icon={iconMap[item.icon]} />
                    <span>{item.title}</span>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>
        {/* right side */}
        <div className="bg-white sm:w-3/4 w-full rounded-lg shadow-xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
