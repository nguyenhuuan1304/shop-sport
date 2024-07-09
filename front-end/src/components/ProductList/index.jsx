import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductList } from "../../features/productSlice";
import ProductCard from "../ProductCard/";

export default function ProductList() {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.products?.productList);
  const loading = useSelector((state) => state.products?.loading);
  const error = useSelector((state) => state.products?.error);

  useEffect(() => {
    dispatch(fetchProductList()); 
  }, [dispatch]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        productList?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))
      )}
    </div>
  );
}
