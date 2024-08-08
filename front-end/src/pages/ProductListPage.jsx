import { FloatButton } from "antd";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import _Breadcrumb from "../components/Breadcrumb";
// import ProductList from "../components/ProductList";
import Loading from "../components/Loading";
import { lazy, Suspense } from "react";

const ProductList = lazy(() => import("../components/ProductList"));
const className =
  "hover:text-blue-500 hover:opacity-100 hover:font-semibold hover:text-2xl duration-200 border-b-2 hover:border-blue-500 border-transparent p-4";

const FilterOption = [
  {
    title: "New",
    sort: "created_at:1",
  },
  {
    title: "Sale",
    sort: "true",
  },
  {
    title: "Hot",
    sort: "true",
  },
  {
    title: "Giá Thấp",
    sort: "price:1",
  },
  {
    title: "Giá cao",
    sort: "price:-1",
  },
];

export default function ProductPage() {
  const [activeButton, setActiveButton] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const sortParam = searchParams.get("sort");
  const titleParam = searchParams.get("title");
  const search = searchParams.get("search");
  // console.log("aaa",sortParam + titleParam)
  const handleFilterChange = (item, index) => {
    //lưu id button
    setActiveButton(index);
    setSearchParams(item);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: window.innerHeight }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <_Breadcrumb title={"Sản phẩm"}></_Breadcrumb>
      <div className="flex sm:gap-10 border-b text-xs sm:text-base">
        <span className="p-4 hidden sm:block">Sắp xếp theo</span>
        {FilterOption.map((item, index) => {
          return (
            <button
              key={index}
              onClick={() => handleFilterChange(item, index)}
              className={`${className} ${
                activeButton === index
                  ? "text-blue-500 border-blue-500 font-semibold text-2xl"
                  : "opacity-60"
              }`}
            >
              {item.title}
            </button>
          );
        })}
      </div>
      <Suspense fallback={<Loading />}>
        <ProductList
          sortParam={sortParam}
          titleParam={titleParam}
          searchParam={search}
        />
      </Suspense>
      <FloatButton.BackTop type="primary" />
    </motion.div>
  );
}
