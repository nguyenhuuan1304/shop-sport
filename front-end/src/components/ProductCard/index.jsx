import Link from "antd/es/typography/Link";
import React from "react";

const onMouseEnterImg = () => {
    const imgElement = document.getElementById('img-product');
    console.log('a')
    if (imgElement) {
      imgElement.style.transform = 'scale(1.1)'; // Phóng to hình ảnh lên 110%
    }
  };

  const onMouseLeaveImg = () => {
    const imgElement = document.getElementById('img-product');
    console.log('b')

    if (imgElement) {
      imgElement.style.transform = 'scale(1)'; // Phục hồi kích thước ban đầu của hình ảnh
    }
  };

export default function ProductCard({ product }) {
  return (
    <div className="pt-8 pl-4 p-2 justify-between items-start h-2/4 rounded-xl text-center flex-row gap-3 inline-flex shadow-lg" onMouseEnter={onMouseEnterImg} onMouseLeave={onMouseLeaveImg}>
      <div className="flex flex-col gap-3 flex-basis-2/3 flex-grow-2">
        <img id="img-product"
          src="https://cdn2-retail-images.kiotviet.vn/locsporthcm/230ac5ac6e6344e98dcefac9d73043a3.jpg"
          className="w-60 h-64 transition-transform duration-500"
        ></img>
        <div className="">
          <div className=" text-base truncate overflow-hidden w-52 font-bold ">
            ARGENTINA SỌC XANH TRẺ EM 2024-2025 MK
          </div>
          <p className="text-left text-red-500 text-sm font-semibold">
            Đăng nhập để xem giá
          </p>
        </div>
        <div className=" flex  flex-row-reverse">
          <Link className="bg-blue-50 text-white py-1 px-2 rounded whitespace-nowrap hover:underline-opacity-75 hover:scale-105">
            Xem chi tiết
          </Link>
        </div>
      </div>
      <div className=" w-40 h-50 rounded-md text-center flex flex-col justify-between flex-basis-1/3">
        <div className="flex items-center justify-center h-full">
          <div>
            <p className="bg-red-500 text-white font-bold p-1 rounded-sm text-xs w-16 text-center">
              Tồn kho
            </p>
          </div>
        </div>
        <div className=" rounded-md text-center flex flex-col justify-center items-center h-full gap-2">
          <ul className="">
            <li className="flex justify-between items-center">
              <span className="flex-grow">L</span>
              <span className="ml-16">&#128065;</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="flex-grow">XL</span>
              <span className="ml-16">&#128065;</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="flex-grow">L</span>
              <span className="ml-16">&#128065;</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="flex-grow">S</span>
              <span className="ml-16">&#128065;</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="flex-grow">M</span>
              <span className="ml-16">&#128065;</span>
            </li>
          </ul>{" "}
          <button className="bg-blue-400 rounded-md p-2 text-white hover:text-blue-400 hover:bg-white border-blue-400 border duration-500">Đăng nhập</button>
        </div>
      </div>
    </div>
  );
}
