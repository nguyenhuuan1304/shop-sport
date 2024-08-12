import React, { useEffect, lazy, Suspense } from "react";
import _Carousel from "../components/Carousel";
import AdsCard from "../components/AdsCard";
import homeImage1 from "../assets/home-image1.jpg";
import homeImage2 from "../assets/home-image2.png";
import { CiMedal } from "react-icons/ci";
import CategoryDropdown from "../components/CategoryDropdown";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, message } from "antd";
import { motion } from "framer-motion";

const adsList = [
  {
    icon: CiMedal,
    to: "#",
    title: "CHIẾT KHẤU SỈ HẤP DẪN",
    description:
      "Lấy hàng sỉ tại kawin.vn bạn sẽ được áp dụng mức chiết khấu hấp dẫn.",
  },
  {
    icon: CiMedal,
    title: "GIÁ CẢ CẠNH TRANH",
    to: "#",
    description:
      "Giá sỉ tốt nhất đối với các mặt hàng thể thao đang kinh doanh.",
  },
  {
    icon: CiMedal,
    title: "HÀNG HÓA ĐA DẠNG, SẴN KHO",
    to: "#",
    description: "Bạn có thể xem tồn kho và đặt hàng tiện lợi.",
  },
  {
    icon: CiMedal,
    title: "HÀNG GIAO NHANH CHÓNG",
    to: "#",
    description: "Tất cả đơn hàng được xử lý ngay sau khi khách đặt hàng.",
  },
];

export default function HomePage() {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <motion.div
      initial={{ opacity: 0, x: -window.innerHeight }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col justify-between gap-2 sm:flex-row">
        <div className="hidden sm:block w-56">
          <CategoryDropdown isbordered={true} />
        </div>
        <div className="flex flex-col items-center justify-around">
          <_Carousel />
          <div className="flex flex-col items-center mt-32 justify-center">
            <span className="text-red-500">Quần áo thể thao KAWIN</span>
            <span className="text-2xl font-semibold text-neutral-700 text-center">
              Chào mừng quý khách đã đến trang đặt hàng.
            </span>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col justify-center gap-2">
          <img
            src={homeImage1}
            alt=""
            className="sm:w-72 w-52 h-full rounded-lg"
          />
          <img
            src={homeImage2}
            alt=""
            className="sm:w-72 w-52 h-full rounded-lg"
          />
        </div>
      </div>
      <div className="sm:flex-row flex flex-col items-center sm:items-stretch justify-between gap-5 mt-5">
        {adsList.map((item, index) => (
          <AdsCard
            key={index}
            Icon={item.icon}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
      {!isAuthenticated ? (
        <div className="my-2">
          <div className="bg-gradient-to-r from-red-500 to-slate-400 p-10 gap-5 flex flex-col items-center">
            <span className="text-white text-3xl drop-shadow-lg text-center">
              Đăng ký, đăng nhập để mua hàng sỉ
            </span>
            <div className="flex gap-5">
              <Link to="login">
                <Button type="primary" size={"large"}>
                  Đăng nhập
                </Button>
              </Link>
              <Link to="register">
                <Button type="primary" danger size={"large"}>
                  Đăng ký
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </motion.div>
  );
}
