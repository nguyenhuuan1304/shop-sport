import { Pagination } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductList } from "../../features/productSlice";
import ProductCard from "../ProductCard/";

function ProductList({ sortParam, titleParam, searchParam }) {
  // console.log("rrender")
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.products?.productList);
  const loading = useSelector((state) => state.products?.loading);
  const error = useSelector((state) => state.products?.error);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = useSelector((state) => state.products?.pageSize) || 4;
  const totalProductItems = useSelector((state) => state.products?.totalProductItems)

  // console.log("pageSize ", pageSize+ " totalProductItems "+ totalProductItems +" currentPage "+ currentPage)

  useEffect(() => {
    if (sortParam) {
      // console.log("title ", titleParam)
      if (titleParam == "Hot" || titleParam == "Sale") {
        console.log("vào hot và sale");
        // console.log("title ", titleParam, sortParam);
        dispatch(fetchProductList({ sortParam, titleParam, searchParam: "" ,currentPage ,pageSize}));
      } else {
        // console.log("vào sort param");
        dispatch(
          fetchProductList({ sortParam, titleParam: "", searchParam: "" ,currentPage ,pageSize})
        );
      }
    } else if (searchParam) {
      // console.log("đã vào search");
      dispatch(
        fetchProductList({ sortParam: "", titleParam: "", searchParam ,currentPage ,pageSize})
      );
    } else {
      // console.log("vào get all");
      dispatch(
        fetchProductList({ sortParam: "", titleParam: "", searchParam: "" ,currentPage ,pageSize})
      );
      // console.log(productList);
    }
    // console.log(productList);
  }, [dispatch, sortParam, titleParam, searchParam, pageSize, currentPage]);

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
      <div className="p-6">
        <Pagination
          total={totalProductItems}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} items`
          }
          pageSize={pageSize}
          current={currentPage}
          onChange={(page, pageSize) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
// Khai báo propTypes để kiểm tra các props
ProductList.propTypes = {
  sortParam: PropTypes.string,
  titleParam: PropTypes.string,
  searchParam: PropTypes.string,
};
export default ProductList;
