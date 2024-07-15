import { Avatar, Badge, Divider, Input, List } from "antd";
import React, { useEffect } from "react";
import { FaHeadphones, FaHome, FaShoppingCart, FaUser } from "react-icons/fa";
import { IoLogOut, IoPersonAddSharp, IoPersonCircle } from "react-icons/io5";
import { PiNotepadFill } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import { fetchUserDetail, logout } from "../../features/authSlice";
import { fetchCartData } from "../../features/cartSlice";
const { Search } = Input;

const data = [
  {
    title: "Ant Design Title 1",
  },
  {
    title: "Ant Design Title 2",
  },
  {
    title: "Ant Design Title 3",
  },
  {
    title: "Ant Design Title 4",
  },
];

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

function NavigationLink({ Icon, title, to, count }) {
  return (
    <Link className="text-sm flex flex-row gap-2 items-center" to={to}>
      {title === "Giỏ hàng" ? (
        <Badge count={count} showZero>
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [searchTerm, setSearchTeam] = useState("");
  const currentUser = useSelector((state) => state.auth.currentUser);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  
  const handleSearch = (value) => {
    // setSearchTeam(value);
    navigate(`/products?search=${value}`);
  };

  //số lượng sản phẩm có trong giỏ hàng
  const products = useSelector((state) => state.cart.products);
  useEffect(() => {
    dispatch(fetchUserDetail());
    dispatch(fetchCartData(currentUser?.id));
  }, [dispatch, currentUser?.id]);

  return (
    <div className="sm:flex hidden border-b flex-row h-32 w-full gap-10 items-center justify-between">
      <Link to="/">
        <img
          className="w-32 scale-105 h-auto ml-8 object-cover grow"
          src={logo}
          alt=""
        />
      </Link>
      <div className=" gap-6 flex flex-col p-4 grow">
        <div className="flex flex-row gap-10 flex-auto items-center justify-between">
          <div className="flex flex-col w-full relative">
            <Search
              placeholder="Nhập sản phẩm tìm kiếm"
              enterButton
              className="w-96 h-auto"
              onSearch={handleSearch}
            />
            <div className="absolute top-10 w-1/2 z-50">
            <List className=" bg-white w-full rounded-lg border border-blue-200 opacity-100  overflow-auto"
              itemLayout="vertical"
              dataSource={data}
              header={<span className="p-2">Sản phẩm gợi ý</span>}
              renderItem={(item, index) => (
                <List.Item className="">
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                      />
                    }
                    title={<a href="https://ant.design">{item.title}</a>}
                    description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                  />
                </List.Item>
              )}
            />
            </div>
          </div>

          <div className="flex flex-row items-center gap-5">
            <NavigationLink
              title="Kiểm tra đơn hàng"
              Icon={PiNotepadFill}
              to=""
            />
            {isAuthenticated && currentUser ? (
              <NavigationLink
                title={`Xin chào, ${currentUser?.username}`}
                Icon={FaUser}
                to="profile"
              />
            ) : (
              <NavigationLink title="Đăng ký" Icon={IoPersonAddSharp} to="" />
            )}
            {isAuthenticated && currentUser ? (
              <Link
                className="text-sm flex flex-row gap-2 items-center"
                onClick={() => dispatch(logout())}
              >
                <IoLogOut size={35} className="text-red-500" />
                Đăng xuất
              </Link>
            ) : (
              <NavigationLink
                title="Đăng nhập"
                Icon={IoPersonCircle}
                to="login"
              />
            )}
            <NavigationLink
              count={products?.length ? products?.length : 0}
              title="Giỏ hàng"
              Icon={FaShoppingCart}
              to="cart"
            />
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
