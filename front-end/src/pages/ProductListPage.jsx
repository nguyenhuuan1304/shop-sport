import React from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import _Breadcrumb from "../components/Breadcrumb";
import ProductList from "../components/ProductList";
const className =
  "hover:text-blue-500 duration-150 border-b-2 hover:border-blue-500 border-transparent p-4";

const FilterOption = [
  {
    title: "Mới nhất",
    sort: "createdAt:DESC",
  },
  {
    title: "New",
    sort: "createdAt:ASC",
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
    sort: "price:ASC",
  },
  {
    title: "Giá cao",
    sort: "price:DESC",
  },
];

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export default function ProductPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortParam = searchParams.get("sort");
  const titleParam = searchParams.get("title");
  // console.log("aaa",sortParam + titleParam)
  const searchParam = useQuery().get('search') || '';
  // console.log(searchParam)
  const handleFilterChange = (item) => {
    setSearchParams(item);
  };

  return (
    <div>
      <_Breadcrumb title={"a"}></_Breadcrumb>
      <div className="flex gap-10 border-b">
        <span className="p-4">Sắp xếp theo</span>
        {FilterOption.map((item, index) => {
          return (
            <button
              key={index}
              onClick={() => handleFilterChange(item)}
              className={className}
            >
              {item.title}
            </button>
          );
        })}
      </div>
      <ProductList sortParam={sortParam} titleParam={titleParam} searchParam={searchParam} />
    </div>
  );
}
