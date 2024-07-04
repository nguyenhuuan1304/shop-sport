import React from "react";
import { Carousel } from "antd";
import AdsCard from "../components/AdsCard";
import homeImage1 from "../assets/home-image1.jpg";
import homeImage2 from "../assets/home-image2.png";
import carousel1 from "../assets/carousel1.jpg";
import carousel2 from "../assets/carousel2.jpg";
import carousel3 from "../assets/carousel3.jpg";
import carousel4 from "../assets/carousel4.jpg";
import { CiMedal } from "react-icons/ci";
import CategoryDropdown from "../components/CategoryDropdown";
import { Button } from "antd";

const adsList = [
  {
    icon: CiMedal,
    title: "CHIẾT KHẤU SỈ HẤP DẪN",
    description:
      "Lấy hàng sỉ tại kawin.vn bạn sẽ được áp dụng mức chiết khấu hấp dẫn.",
  },
  {
    icon: CiMedal,
    title: "GIÁ CẢ CẠNH TRANH",
    description:
      "Giá sỉ tốt nhất đối với các mặt hàng thể thao đang kinh doanh.",
  },
  {
    icon: CiMedal,
    title: "HÀNG HÓA ĐA DẠNG, SẴN KHO",
    description: "Bạn có thể xem tồn kho và đặt hàng tiện lợi.",
  },
  {
    icon: CiMedal,
    title: "HÀNG GIAO NHANH CHÓNG",
    description: "Tất cả đơn hàng được xử lý ngay sau khi khách đặt hàng.",
  },
];

export default function HomePage() {
  const contentStyle = {
    height: "320px",
    color: "#fff",
    lineHeight: "320px",
    textAlign: "center",
    background: "#364d79",
  };

  return (
    <div>
      <div className="flex flex-row justify-between gap-5">
        <div className="w-48">
          <CategoryDropdown />
        </div>
        <div className="flex flex-col items-center justify-around">
          <Carousel className="max-w-screen-sm h-auto" arrows autoplay>
            <div className="bg-red-100 flex items-center justify-center">
              <img
                src={carousel1}
                alt=""
                className="h-96 w-full rounded-lg object-none"
              />
            </div>
            <div className="bg-red-100 flex items-center justify-center">
              <img
                src={carousel2}
                alt=""
                className="h-96 w-full rounded-lg object-none"
              />
            </div>
            <div className="bg-red-100 flex items-center justify-center">
              <img
                src={carousel3}
                alt=""
                className="h-96 w-full rounded-lg object-none"
              />
            </div>
            <div className="bg-red-100 flex items-center justify-center">
              <img
                src={carousel4}
                alt=""
                className="h-96 w-full rounded-lg object-none"
              />
            </div>
          </Carousel>
          <div className="flex flex-col items-center mt-32">
            <span className="text-red-500">Quần áo thể thao KAWIN</span>
            <span className="text-2xl font-semibold">
              Chào mừng quý khách đã đến trang đặt hàng.
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <img src={homeImage1} alt="" className="w-72 h-60 rounded-lg" />
          <img src={homeImage2} alt="" className="w-72 h-60 rounded-lg" />
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
            <Button type="primary" size={"large"}>
              Đăng nhập
            </Button>
            <Button danger size={"large"}>
              Đăng ký
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
