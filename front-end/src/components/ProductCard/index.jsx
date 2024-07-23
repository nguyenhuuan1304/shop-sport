import { Badge, Button } from "antd";
import { motion } from "framer-motion";
import { default as React, useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import placeholder from "../../assets/playholder.png";
import useSessionStorage from "../../custom hooks/useSessionStorage";

//thuộc tính displayQuantity = true : hiển thị số lượng tồn kho của sản phẩm
const ProductCard = React.memo(function ProductCard({ product, displayQuantity }) {
  const [viewedProduct, setViewedProduct] = useSessionStorage(
    "viewedProducts",
    []
  );
  const addViewedProduct = () => {
    setViewedProduct(product);
    console.log(viewedProduct);

    navigate(`/product/${product?.id}`);
  };
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isDisCountActive, setIsDisCountActive] = useState(false);
  let isSale = product?.attributes?.is_discount_active;
  let islogIN = useSelector((state) => state.auth.isAuthenticated);

  // console.log(product);
  const imageUrl = product?.attributes?.image?.data?.[0]?.attributes?.url
    ? import.meta.env.VITE_IMG_URL +
      product?.attributes?.image?.data?.[0]?.attributes?.url
    : placeholder;
  console.log(product);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      // animate={{ opacity: 1, scale: 1, x: 1 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.1 }}
      whileHover={{ y: -10 }}
      viewport={{ once: true }}
      className="hover:shadow-black duration-500 p-4 gap-4 justify-center items-start h-full rounded-xl text-center flex-row inline-flex shadow-md  ring-1 ring-gray-300 ring-opacity-50 bg-white"
    >
      <div className="flex flex-col gap-3 flex-basis-2/3 flex-grow-2">
        <div className="relative block w-full">
          <img
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            id="img-product"
            src={imageUrl}
            className={`w-64 h-60 duration-500 rounded-s-3xl shadow-neutral-500 shadow-md transition-transform
            
            `}
            alt={
              product?.attributes?.image?.data?.[0]?.attributes?.name ||
              "default alt text"
            }
          />

          {isSale && (
            // <img
            //   id="img-product "
            //   src={saletag}
            //   className="absolute bottom-0 right-0 w-16 h-16 transition-transform duration-1000"
            // />
            <Badge.Ribbon
              className="absolute -top-10 duration-500"
              text="Sale"
              color="red"
              placement="end"
            />
          )}
        </div>
        {/* Divider */}
        <div className="border-b"></div>
        <div className="flex flex-col">
          <span className="text-left text-orange-800 font-semibold">
            {product?.attributes?.brand.toUpperCase()}
          </span>
          <div className="text-base text-left truncate w-52 font-bold">
            {product?.attributes?.name}
          </div>

          <div>
            {islogIN ? (
              isSale ? (
                <div className="text-left text-red-500 text-sm font-semibold">
                  <span className="text-red-500 line-through">Giá gốc:</span>{" "}
                  <span className="line-through text-red-400">
                    {product?.attributes?.price.toLocaleString()}₫
                  </span>
                  {product?.attributes?.is_discount_active && (
                    <span className="text-left text-green-500 text-sm font-semibold block">
                      {product?.attributes?.discounted_price.toLocaleString()}₫
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-left">
                  <span className="text-left text-green-500">
                    Giá gốc: {product?.attributes?.price.toLocaleString()}₫
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
        {
          <div className="flex flex-row-reverse">
            <Button
              // to={`/product/${product?.id}`}
              onClick={addViewedProduct}
            >
              Xem chi tiết
            </Button>
          </div>
        }
      </div>
      {displayQuantity ? (
        <div className="w-40 h-50 gap-2 rounded-md text-center flex flex-col justify-between flex-basis-1/3">
          <div className="flex items-center justify-center h-full">
            <span className="bg-red-500 text-white font-bold p-1 rounded-sm text-xs w-16 text-center">
              Tồn kho
            </span>
          </div>
          <div className="rounded-md text-center gap-5 flex flex-col justify-between items-center h-full">
            <ul>
              {product?.attributes?.size_list ? (
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-2 h-40 overflow-y-auto">
                    {product?.attributes?.size_list?.map((item, index) => (
                      <li key={index} className="flex flex-row gap-5 text-left">
                        <span className="flex-grow">{item.size}</span>
                        {islogIN ? (
                          item.quantity === 0 ? (
                            <span className="text-right text-red-600 px-2 opacity-40">
                              {item.quantity}
                            </span>
                          ) : (
                            <span className="text-right text-green-600 px-2">
                              {item.quantity}
                            </span>
                          )
                        ) : (
                          <FaRegEyeSlash />
                        )}
                      </li>
                    ))}
                  </div>
                  {/* <Button size="small">Thêm giỏ hàng</Button> */}
                </div>
              ) : (
                <span className="text-red-500 text-xs">Không có size nào</span>
              )}
            </ul>
            {islogIN ? (
              ""
            ) : (
              <Link to="/login">
                <button className="bg-blue-400 text-xs sm:text-sm rounded-full p-1 px-2 text-white hover:text-blue-400 hover:bg-white border-blue-400 border duration-500">
                  Đăng nhập
                </button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </motion.div>
  );
});

export default ProductCard;
