import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  fetchProductList,
  fetchProductListWithSearch,
  fetchProductListWithSortOrTitle,
  setActiveFilter,
} from "../../redux/slices/productSlice";
import ProductCard from "../ProductCard/";

function ProductList({ sortParam, titleParam, searchParam }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const productListByPage = useSelector(
    (state) => state.products?.combinedProductList
  );
  const error = useSelector((state) => state.products?.error);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = useSelector((state) => state.products?.pageSize) || 4;
  const totalProductItems = useSelector(
    (state) => state.products?.totalProductItems
  );
  const [currentPage, setCurrentPage] = useState(1);
  console.log("productListByPage ", productListByPage);
  // Fetch products when filters or currentPage change
  useEffect(() => {
    // Reset currentPage and fetch products when filters change
    setCurrentPage(1);
    dispatch(setActiveFilter({ title: titleParam, sort: sortParam }));
    getProductList(1);
    console.log("object");
  }, [sortParam, titleParam, searchParam]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     // Reset state
  //     dispatch(setActiveFilter({ title: titleParam, sort: sortParam }));
      
  //     // Wait for state to reset
  //     await new Promise((resolve) => setTimeout(resolve, 500));
      
  //     // Fetch products
  //     getProductList(1);
  //   };
  
  //   fetchData();
  // }, [sortParam, titleParam, searchParam]);
  

  // useEffect(() => {
  //   dispatch(setActiveFilter({ title: titleParam, sort: sortParam }));
  // }, [location]);

  useEffect(() => {
    // Update hasMore based on totalProductItems and current data length
    if (productListByPage.length >= totalProductItems) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [totalProductItems, productListByPage.length]);

  const fetchMoreData = () => {
    if (productListByPage.length < totalProductItems) {
      setCurrentPage((prevPage) => {
        const nextPage = prevPage + 1;
        getProductList(nextPage);
        return nextPage;
      });
      // console.log("crrent page ", currentPage)
    } else {
      setHasMore(false);
    }
  };

  const getProductList = (page) => {
    console.log("Fetching product list for page", page);
    if (sortParam) {
      if (titleParam === "Hot" || titleParam === "Sale") {
        dispatch(
          fetchProductListWithSortOrTitle({
            sortParam,
            titleParam,
            currentPage: page,
            pageSize,
          })
        );
      } else {
        dispatch(
          fetchProductListWithSortOrTitle({
            sortParam,
            titleParam: "",
            currentPage: page,
            pageSize,
          })
        );
      }
    } else if (searchParam) {
      dispatch(
        fetchProductListWithSearch({
          searchParam,
          currentPage: page,
          pageSize,
        })
      );
    } else {
      dispatch(
        fetchProductList({
          sortParam: "",
          titleParam: "",
          searchParam: "",
          currentPage: page,
          pageSize,
        })
      );
    }
  };

  return (
    <div className="p-9">
      {productListByPage.length === 0 ? (
        <p className="text-center text-sm p-5">
          Không có sản phẩm nào trong danh sách.
        </p>
      ) : (
        <InfiniteScroll
          dataLength={productListByPage.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<p>Loading...</p>}
          endMessage={
            <p className="text-center text-sm p-5">
              Bạn đã xem hết danh sách sản phẩm
            </p>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 justify-center">
            {Array.isArray(productListByPage) &&
              productListByPage.map((product, index) => (
                <ProductCard
                  key={product._id || index}
                  product={product}
                  displayQuantity={true}
                />
              ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}

ProductList.propTypes = {
  sortParam: PropTypes.string,
  titleParam: PropTypes.string,
  searchParam: PropTypes.string,
};

export default React.memo(ProductList);
