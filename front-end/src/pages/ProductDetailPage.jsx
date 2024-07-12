import React, { useEffect, useState } from "react";
import { Input, Button, Rate, Image, Table, InputNumber, Carousel } from "antd";
import { Link, useParams } from "react-router-dom";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetail,
  fetchProductList,
  fetchSaleProductList,
} from "../features/productSlice";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import CartDrawer from "../components/CartDrawer";
const { Search } = Input;

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

const QuantityEditor = ({ max, min, onChange }) => {
  const [value, setValue] = useState(0);

  const handleIncrease = () => {
    if (value < max) {
      setValue(value + 1);
      onChange(value + 1);
    }
  };

  const handleDecrease = () => {
    if (value > min) {
      setValue(value - 1);
      onChange(value - 1);
    }
  };

  return (
    <div className="flex flex-row gap-1 items-center justify-center">
      <InputNumber
        readOnly
        className="w-28 text-center"
        min={min}
        max={max}
        value={value}
        onChange={(val) => {
          setValue(val);
          onChange(val);
        }}
      />
      <Button
        type="primary"
        shape="circle"
        icon={<FaPlus />}
        onClick={handleIncrease}
        disabled={value >= max}
      />
      <Button
        type="primary"
        shape="circle"
        icon={<FaMinus />}
        onClick={handleDecrease}
        disabled={value <= min}
      />
    </div>
  );
};

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
  const { productId } = useParams();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.products?.productDetails);
  const saleProducts = useSelector((state) => state.products?.productList);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const loading = useSelector((state) => state.products?.loading);
  const dataSource = product?.attributes?.size_list?.map((item, index) => ({
    ...item,
    key: `${item.size}-${index}`,
    count: 0,
  }));
  const [cart, setCart] = useState([]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const showDrawer = () => {
    setDrawerOpen(true);
  };
  const closeDrawer = () => {
    setDrawerOpen(false);
  };
  useEffect(() => {
    dispatch(fetchProductDetail(productId));
    dispatch(fetchProductList({ sortParam: "true", titleParam: "NoHot" }));
    console.log(saleProducts);
  }, [dispatch, productId]);

  // +/ sản phẩm để thêm vào giỏ hàng
  const handleQuantityChange = (key, count) => {
    // Kiểm tra xem sản phẩm có trong cart chưa
    const existingItem = cart.find((item) => item.key === key);

    if (existingItem) {
      // Nếu sản phẩm đã có trong cart, cập nhật count
      const updatedCart = cart
        .map((item) =>
          item.key === key
            ? {
                ...item,
                product: product,
                count: item.count + 1,
                size: item.key?.split("-")[0],
              }
            : item
        )
        .filter((item) => item.count > 0); // Lọc ra các mục có count > 0
      setCart(updatedCart);
    } else {
      // Nếu sản phẩm chưa có trong cart, thêm mới vào
      // key là "M-1" , tạo trường size để lấy size M
      const newItem = {
        key,
        count: 1,
        product: product,
        size: key?.split("-")[0],
      };
      const updatedCart = [...cart, newItem].filter((item) => item.count > 0); // Lọc ra các mục có count > 0
      setCart(updatedCart);
    }
  };

  //xử lý thêm sản phẩm đã chọn vào giỏ hàng
  const addToCart = () => {
    showDrawer();
    console.log(cart);
    // console.log(dataSource);
  };

  const columns = [
    {
      title: "Sản phẩm",
      width: 120,
      dataIndex: "size",
      align: "center",
      key: "size",
    },
    {
      title: "Tồn kho",
      dataIndex: "quantity",
      width: 150,
      align: "center",
      key: "quantity",
    },
    {
      title: "Số lượng",
      dataIndex: "count",
      width: 150,
      align: "center",
      key: "count",
      render: (text, record) => (
        <QuantityEditor
          min={0}
          max={record.quantity}
          onChange={() => handleQuantityChange(record.key, 1)}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      {loading && <div className="flex flex-col items-center">Loading...</div>}
      {!loading && !product ? (
        <div>Không có sản phẩm này!</div>
      ) : (
        <>
          <div className="flex flex-col gap-5 sm:flex-row">
            <motion.div
              initial={{ opacity: 0, x: -200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                height={600}
                width={600}
                className="rounded-xl"
                src={
                  import.meta.env.VITE_IMG_URL +
                  product?.attributes?.image?.data?.[0]?.attributes?.url
                }
                alt=""
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-5"
            >
              <span className="text-2xl font-semibold">
                {product?.attributes?.name}
              </span>
              <div className="flex flex-row gap-1 items-center">
                <Rate defaultValue={0} />{" "}
                <span className="text-sm text-yellow-400">(0 đánh giá)</span>
              </div>
              <span className="text-red-500 font-semibold text-lg">
                {isAuthenticated
                  ? `${product?.attributes?.price.toLocaleString()}đ`
                  : "Đăng nhập để xem giá"}
              </span>
              <span className="text-sm">
                Tình trạng:{" "}
                {product?.attributes.state ? (
                  <span className="rounded-full bg-green-300 text-green-700 px-2 p-1 text-xs">
                    Còn hàng
                  </span>
                ) : (
                  <span className="rounded-full bg-red-300 text-red-700 px-2 p-1 text-xs">
                    Hết hàng
                  </span>
                )}
              </span>
              {isAuthenticated && (
                <>
                  <Table
                    columns={columns}
                    dataSource={dataSource}
                    bordered
                    pagination={false}
                  />
                  <div className="flex flex-row gap-2 w-full items-center justify-center absolute sm:static bottom-20 z-40">
                    <Button
                      onClick={addToCart}
                      className="w-full"
                      type="primary"
                      size="large"
                    >
                      <div className="flex flex-col">
                        <span>Thêm vào giỏ</span>
                        <span className="text-xs pb-1">
                          và mua sản phẩm khác
                        </span>
                      </div>
                    </Button>
                    <Button
                      className="w-full"
                      type="primary"
                      danger
                      size="large"
                    >
                      <div className="flex flex-col">
                        <span>Đặt ngay</span>
                        <span className="text-xs pb-1">Thanh toán ngay</span>
                      </div>
                    </Button>
                  </div>
                </>
              )}
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
            </motion.div>
          </div>
        </>
      )}
      <div className="flex flex-col justify-between gap-5 sm:flex-row">
        <div className="flex flex-col gap-5 basis-2/3">
          <div className="mt-9 flex justify-center sm:block">
            <span className="font-semibold text-white text-lg bg-blue-400 p-2 px-3 rounded-full">
              Nội dung Chi Tiết
            </span>
          </div>
          <span className="border bg-gray-100 rounded-lg p-2">
            {product?.attributes?.description}
          </span>
        </div>
        <div className=" flex flex-col shadow-xl rounded-lg sm:w-1/3 basis-1/3">
          <span className="bg-blue-500 text-white p-3 text-center rounded-t-lg">
            Sản phẩm đã xem
          </span>
          <div className=" flex flex-col hover:overflow-y-auto overflow-hidden gap-2 p-6">
            <div className="flex flex-row items-start gap-2">
              <img
                className="w-20 h-auto"
                src="https://cdn2-retail-images.kiotviet.vn/locsporthcm/0026340ac87c4ffabb9b767698bf4c0b.jpg"
                alt=""
              />
              <div className="flex flex-col">
                <span className="text-slate-700">EAGLE HỒNG</span>
                <span className="text-red-500 text-lg font-semibold">
                  {isAuthenticated ? "89,000đ" : "Đăng nhập để xem giá"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col rounded-lg border-b shadow-xl bg-blue-500">
        <span className="text-lg font-semibold p-2 text-white">
          SẢN PHẨM SALE
        </span>
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
            {saleProducts.map((item) => {
              return (
                <div className="w-full flex justify-center">
                  <ProductCard product={item} displayQuantity={false} />
                </div>
              );
            })}
          </div>
        </Carousel>
      </div>
      <CartDrawer open={drawerOpen} onClose={closeDrawer} />
    </div>
  );
}
