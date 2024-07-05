import React from "react";
import _Carousel from "../components/Carousel";
import AdsCard from "../components/AdsCard";
import homeImage1 from "../assets/home-image1.jpg";
import homeImage2 from "../assets/home-image2.png";
import { CiMedal } from "react-icons/ci";
import CategoryDropdown from "../components/CategoryDropdown";
import { Button } from "antd";
import { Link } from "react-router-dom";

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
  return (
    <div>
      <div className="flex flex-row justify-between gap-2">
        <div className="w-56">
          <CategoryDropdown />
        </div>
        <div className="flex flex-col items-center justify-around">
          <_Carousel />
          <div className="flex flex-col items-center mt-32">
            <span className="text-red-500">Quần áo thể thao KAWIN</span>
            <span className="text-2xl font-semibold text-neutral-700">
              Chào mừng quý khách đã đến trang đặt hàng.
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <img src={homeImage1} alt="" className="w-72 h-auto rounded-lg" />
          <img src={homeImage2} alt="" className="w-72 h-auto rounded-lg" />
        </div>
      </div>
      <div className="flex flex-row justify-around gap-5 mt-5">
        {adsList.map((item, index) => (
          <AdsCard
            key={index}
            Icon={item.icon}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
      <div className="mt-10 mb-40">
        <div className="bg-gradient-to-r from-red-500 to-white p-10 gap-5 flex flex-col items-center">
          <span className="text-white text-3xl drop-shadow-lg">
            Đăng ký, đăng nhập để mua hàng sỉ
          </span>
          <div className="flex gap-5">
            <Link to="login">
              <Button type="primary" size={"large"}>
                Đăng nhập
              </Button>
            </Link>
            <Button danger size={"large"}>
              Đăng ký
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
