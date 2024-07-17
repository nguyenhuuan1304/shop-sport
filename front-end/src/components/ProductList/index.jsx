import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductList } from "../../features/productSlice";
import ProductCard from "../ProductCard/";

export default function ProductList({ sortParam, titleParam }) {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.products?.productList);
  const loading = useSelector((state) => state.products?.loading);
  const error = useSelector((state) => state.products?.error);

  useEffect(() => {
    if (sortParam) {
      // console.log("title ", titleParam)
      if (titleParam == "Hot" || titleParam == "Sale") {
        console.log("vào hot và sale");
        console.log("title ", titleParam, sortParam);
        dispatch(fetchProductList({ sortParam, titleParam }));
      } else {
        console.log("vào sort param");
        dispatch(fetchProductList({ sortParam, titleParam: "" }));
      }
    } else {
      console.log("vào get all");
      dispatch(fetchProductList({ sortParam: "", titleParam: "" }));
      // console.log(productList);
    }
    // console.log(productList);
  }, [dispatch, sortParam, titleParam]);
  // Thêm console.log để kiểm tra dữ liệu
  // console.log("Product List:", productList);
  // console.log("Loading:", loading);
  // console.log("Error:", error);
  // console.log("sortParam:", sortParam);
  // console.log("titleParam:", titleParam);

  return (
    <div className="p-9">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 justify-center">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          productList?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              displayQuantity={true}
            />
          ))
        )}
      </div>
    </div>
  );
}
// Khai báo propTypes để kiểm tra các props
ProductList.propTypes = {
  sortParam: PropTypes.string,
  titleParam: PropTypes.string,
};
