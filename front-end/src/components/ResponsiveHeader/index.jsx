import React, { useState, useCallback } from "react";
import logo from "../../assets/logo.jpg";
import { Button, Drawer, Input, List } from "antd";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CiLogout, CiUser } from "react-icons/ci";
import { logout } from "../../features/authSlice";
import { useDispatch } from "react-redux";
const { Search } = Input;

// List data
const ListData = [
  {
    title: "Trang chủ",
    to: "/",
  },
  {
    title: "Sản phẩm",
    to: "/products",
  },
];
// Header Menu Content
const HeaderMenu = ({ username, onClose, logout }) => {
  const handleLogout = () => {
    logout();
    onClose();
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <span className="text-neutral-400 font-light text-lg">{username}</span>
      <div className="flex flex-row gap-4">
        <div className="flex flex-row gap-1 items-center">
          <CiUser size={20} />
          <Link
            to="profile"
            onClick={onClose}
            className="text-blue-600 font-normal"
          >
            Thông tin
          </Link>
        </div>
        <div className="flex flex-row gap-1 items-center">
          {" "}
          <CiLogout size={20} />
          <Link
            to="/"
            className="text-blue-600 font-normal"
            onClick={handleLogout}
          >
            Đăng xuất
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function ResponsiveHeader() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);

  const showMenuDrawer = () => {
    setMenuOpen(true);
  };

  const closeMenuDrawer = () => {
    setMenuOpen(false);
  };

  const showSearchDrawer = () => {
    setSearchOpen(true);
  };

  const closeSearchDrawer = () => {
    setSearchOpen(false);
  };

  return (
    <div className="sm:hidden sticky top-0 w-full z-50 flex flex-row items-center justify-between h-auto bg-black text-white pl-4 pr-4">
      {/* MENU */}
      <div className="cursor-pointer" onClick={showMenuDrawer}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </div>
      {/* LOGO */}
      <Link to="">
        <img className="w-32 " src={logo} alt="logo" />
      </Link>
      {/* SEARCH */}
      <div className="cursor-pointer" onClick={showSearchDrawer}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>
      {/* Menu Drawer  */}
      <Drawer
        className="opacity-90"
        title={
          isAuthenticated ? (
            <HeaderMenu
              username={currentUser.username}
              onClose={closeMenuDrawer}
              logout={() => {
                dispatch(logout());
              }}
            />
          ) : (
            <div className="flex flex-row gap-5 items-center justify-center text-blue-600 font-base">
              <Link to="login">Đăng nhập</Link>
              <Link to="">Đăng ký</Link>
            </div>
          )
        }
        closeIcon
        placement="left"
        size="large"
        onClose={closeMenuDrawer}
        open={isMenuOpen}
      >
        <List
          size="small"
          dataSource={ListData}
          renderItem={(item) => (
            <List.Item className="text-lg">
              <Link to={item.to}>{item.title}</Link>
            </List.Item>
          )}
        />
      </Drawer>
      {/* Search Drawer  */}
      <Drawer
        className="opacity-90"
        title={
          <Search
            size="large"
            placeholder="Tìm kiếm..."
            //  onSearch={onSearch}
            enterButton
          />
        }
        closeIcon
        placement="right"
        size="large"
        onClose={closeSearchDrawer}
        open={isSearchOpen}
      ></Drawer>
    </div>
  );
}
