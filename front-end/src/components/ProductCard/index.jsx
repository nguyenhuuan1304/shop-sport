import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import playholder from "../../assets/playholder.png";
import saletag from "../../assets/saleTag.png";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDisCountActive, setIsDisCountActibe] = useState(false);
  let isSale = product?.attributes?.is_discount_active;
  let islogIN = useSelector((state) => state.auth.isAuthenticated);

  console.log(product);
  const imageUrl = product?.attributes?.image?.data?.[0]?.attributes?.url
    ? import.meta.env.VITE_IMG_URL +
      product?.attributes?.image?.data?.[0]?.attributes?.url
    : playholder;

  return (
    <div
      className="pt-4 pb-4 justify-center items-start h-full rounded-xl text-center flex-row inline-flex shadow-xl ring-1 ring-gray-300 ring-opacity-50"
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col gap-3 flex-basis-2/3 flex-grow-2">
        <div className="relative inline-block">
          <img
            id="img-product"
            src={imageUrl}
            className="w-60 h-64 transition-transform duration-1000 block ${
            isHovered ? 'scale-110' : 'scale-100'"
            alt={
              product?.attributes?.image?.data?.[0]?.attributes?.name ||
              "default alt text"
            }
          />
          {isSale && (
            <img
              id="img-product "
              src={saletag}
              className="absolute top-0 right-0 w-16 h-16 transition-transform duration-1000"
            />
          )}
        </div>

        <div className="">
          <div className="text-base truncate overflow-hidden w-52 font-bold">
            {product?.attributes?.name}
          </div>

          <div>
            {islogIN ? (
              isSale ? (
                <p className="text-left text-red-500 text-sm font-semibold">
                  <span className="text-red-500 line-through">Giá gốc:</span>{" "}
                  <span className="line-through text-red-400">
                    {product?.attributes?.price} VND
                  </span>
                  {product?.attributes?.is_discount_active && (
                    <p className="text-left text-green-500 text-sm font-semibold">
                      {product?.attributes?.discounted_price} VND
                    </p>
                  )}
                </p>
              ) : (
                <div className="text-left">
                  <span className="text-left text-green-500">
                    Giá gốc: {product?.attributes?.price} VND
                  </span>
                </div>
              )
            ) : (
              <p className="text-left text-sm text-red-500 font-semibold">
                Đăng nhập để xem giá
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-row-reverse">
          <Link
            to={`/product/${product?.id}`}
            className="bg-blue-400 text-white py-1 px-2 rounded whitespace-nowrap hover:underline-opacity-75 hover:scale-105"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
      <div className="w-40 h-50 rounded-md text-center flex flex-col justify-between flex-basis-1/3">
        <div className="flex items-center justify-center h-full">
          <div>
            <p className="bg-red-500 text-white font-bold p-1 rounded-sm text-xs w-16 text-center">
              Tồn kho
            </p>
          </div>
        </div>
        <div className="rounded-md text-center flex flex-col justify-center items-center h-full gap-2">
          <ul className="">
            {product?.attributes?.size_list?.map((size, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="flex-grow">{size.size}</span>
                <span className="ml-16">&#128065;</span>
              </li>
            ))}
          </ul>
          <button className="bg-blue-400 rounded-md p-2 text-white hover:text-blue-400 hover:bg-white border-blue-400 border duration-500">
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
