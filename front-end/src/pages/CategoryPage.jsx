import React from "react";
import { Image } from "antd";
import { Link } from "react-router-dom";

export default function CategoryPage() {
  return (
    <div className="flex flex-col">
      <div className="bg-blue-500 text-white p-2 text-lg">
        QUẦN ÁO BÓNG ĐÁ THƯƠNG HIỆU
      </div>
      <div className="flex sm:flex-row flex-col p-2 gap-2">
        <Link className="flex flex-col items-center">
          <Image
            width={250}
            height={250}
            src="https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png"
          />
          NIKE
        </Link>
        <Link className="flex flex-col items-center">
          <Image
            width={250}
            height={250}
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/2560px-Adidas_Logo.svg.png"
          />
          ADIDAS
        </Link>
      </div>
      <div className="bg-blue-500 text-white p-2 text-lg">
        QUẦN ÁO BÓNG ĐÁ CÂU LẠC BỘ, ĐỘI TUYỂN
      </div>
      <div className="sm:flex-row flex-col flex">
        <Link className="flex flex-col items-center">
          <Image
            width={250}
            height={250}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZENlgnByqGFByv3_gy87iSyeUQX7uLmbnHw&s"
          />
          MANCHESTER UNITED
        </Link>
        <Link className="flex flex-col items-center">
          <Image
            width={250}
            height={250}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbnXMytTr9yV_Sp3cQvZkYxWAqsJeoIlQvAQ&s"
          />
          REAL MARID
        </Link>
      </div>
    </div>
  );
}
