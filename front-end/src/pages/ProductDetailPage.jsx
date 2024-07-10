import React, { useState } from "react";
import { Input, Button, Rate, Image } from "antd";
const { Search } = Input;
import ProductCard from "../components/ProductCard";
import { Carousel, Table, InputNumber, FloatButton } from "antd";

import { Link } from "react-router-dom";
import { FaPlus, FaMinus } from "react-icons/fa";

const carouselResponsiveSetting = [
  {
    breakpoint: 640,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: true,
      dots: false,
    },
  },
];

const QuantityEditor = () => {
  const [value, setValue] = useState(0);
  return (
    <div className="flex flex-row gap-1">
      <InputNumber
        max={10}
        min={0}
        controls
        className="w-40"
        defaultValue={value}
        value={value}
        onChange={setValue}
      />
      <Button
        type="primary"
        shape="circle"
        icon={<FaPlus />}
        onClick={() => {
          setValue(value + 1);
        }}
      />
      <Button
        shape="circle"
        icon={<FaMinus />}
        onClick={() => {
          setValue(value - 1);
        }}
      />
    </div>
  );
};

const columns = [
  {
    title: "Sản phẩm",
    dataIndex: "name",
    align: "center",
  },
  {
    title: "Tồn kho",
    dataIndex: "quantity",
    align: "center",
  },
  {
    title: "Số lượng",
    width: 300,
    render: () => <QuantityEditor />,
    dataIndex: "count",
  },
];
const data = [
  {
    key: "1",
    name: "S",
    quantity: 32,
    count: 0,
  },
  {
    key: "2",
    name: "L",
    quantity: 26,
    count: 0,
  },
];

function CustomArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        background: "#3498db",
        borderRadius: "10px",
        padding: "5px",
      }}
      onClick={onClick}
    />
  );
}

export default function ProductDetailPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5 sm:flex-row">
        <Image
          className="rounded-xl h-2/4"
          src="https://cdn2-retail-images.kiotviet.vn/locsporthcm/d6135fce51b0423990bb1d1db2295754.jpg"
          alt=""
        />
        <div className="flex flex-col gap-5">
          <span className="text-2xl font-semibold">
            ARGENTINA SỌC TRẺ EM 2024-2025 CP
          </span>
          <div className="flex flex-row gap-1 items-center">
            <Rate defaultValue={0} />{" "}
            <span className="text-sm text-yellow-400">(0 đánh giá)</span>
          </div>
          <span className="text-red-500 font-semibold text-base">
            Đăng nhập để xem giá
          </span>

          <span className="text-sm">
            Tình trạng:{" "}
            <span className="rounded-full bg-green-300 text-green-700 px-2 p-1 text-xs">
              Còn hàng
            </span>
            <span className="rounded-full bg-red-300 text-red-700 px-2 p-1 text-xs">
              Hết hàng
            </span>
          </span>
          <Table
            columns={columns}
            dataSource={data}
            bordered
            pagination={false}
          />
          <div className="flex flex-row gap-2">
            <Button className="w-full" type="primary" size="large">
              <div className="flex flex-col">
                <span>Thêm vào giỏ</span>
                <span className="text-xs pb-1">và mua sản phẩm khác</span>
              </div>
            </Button>
            <Button className="w-full" type="primary" danger size="large">
              <div className="flex flex-col">
                <span>Đặt ngay</span>
                <span className="text-xs pb-1">Thanh toán ngay</span>
              </div>
            </Button>
          </div>
          <span className="text-sm font-medium">
            Quý khách vui lòng để lại số điện thoại để được tư vấn sỉ
          </span>
          <div className="flex flex-row items-center gap-1">
            <Input
              className="border-blue-600 border-2"
              placeholder="Số điện thoại của bạn"
            />
            <Button type="primary">Gửi</Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row">
        <div className="flex flex-col gap-5">
          <div className="mt-9">
            <span className=" font-semibold text-white text-lg bg-blue-400 p-2 px-3 rounded-full">
              Nội dung Chi Tiết
            </span>
          </div>
          <span className=" border bg-gray-100 rounded-lg p-2">
            Vậy thì anh xin chết vì người anh thương Có biết bao nhiêu điều còn
            đang vấn vương Dành cho em, dành hết ân tình anh mang một đời Đừng
            làm trái tim anh đau
          </span>
        </div>
        <div className="grow flex flex-col shadow-xl rounded-lg sm:w-1/3">
          <span className="bg-blue-500 text-white p-3 text-center rounded-t-lg">
            Sản phẩm đã xem
          </span>
          <div className="flex flex-col hover:overflow-y-auto overflow-hidden gap-2 p-6">
            <div className="flex flex-row items-start gap-2">
              <img
                className="w-20 h-auto"
                src="https://cdn2-retail-images.kiotviet.vn/locsporthcm/0026340ac87c4ffabb9b767698bf4c0b.jpg"
                alt=""
              />
              <div className="flex flex-col">
                <span className="text-slate-700">EAGLE HỒNG</span>
                <span className="text-red-500 text-lg font-semibold">
                  Đăng nhập để xem giá
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col rounded-lg border-b shadow-xl bg-blue-500">
        <span className=" text-lg font-semibold p-2 text-white">
          SẢN PHẨM SALE
        </span>
        {/* <div className="flex flex-row gap-2 p-2 bg-red-100"> */}
        <Carousel
          responsive={carouselResponsiveSetting}
          className="w-full h-auto pb-3 bg-white"
          autoplay
          arrows
          infinite={true}
          speed={1000}
          dots={false}
          slidesToShow={4}
          slidesToScroll={1}
          nextArrow={<CustomArrow />}
          prevArrow={<CustomArrow />}
        >
          <div className="flex justify-center items-center pb-2">
            <div className="w-full flex justify-center">
              <ProductCard />
            </div>
          </div>
          <div className="flex justify-center items-center pb-2">
            <div className="w-full flex justify-center">
              <ProductCard />
            </div>
          </div>
          <div className="flex justify-center items-center pb-2">
            <div className="w-full flex justify-center">
              <ProductCard />
            </div>
          </div>
          <div className="flex justify-center items-center pb-2">
            <div className="w-full flex justify-center">
              <ProductCard />
            </div>
          </div>
        </Carousel>
        {/* </div> */}
      </div>
    </div>
  );
}
