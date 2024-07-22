import { useDebounce } from "@uidotdev/usehooks";
import { Avatar, Divider, Input, List } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import placeholder from "../../assets/playholder.png";
import { fetchProductList } from "../../features/productSlice";
import { fetchFiveProduct } from "../../features/searchSlice";
const { Search } = Input;

export default function SearchBar({ keyWord }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [isOpenDropDown, setIsOpenDropDown] = useState(false);

  const [keyWordSearch, setKeyWordSearch] = useState(keyWord);
  const [keyWordSearchListProducts, setKeyWordSearchListProducts] =
    useState(keyWord);
  const productList = useSelector((state) => state.Search?.productListSearch);
  const loading = useSelector((state) => state.Search?.loading);
  const error = useSelector((state) => state.Search?.error);

  const pageSize = useSelector((state) => state.products?.pageSize) || 4;

  const useDebounceSearchTerm = useDebounce(keyWordSearch, 300);

  const handleSearch = (value) => {
    setIsOpenDropDown(true);
    setKeyWordSearchListProducts(value);
    navigate(`/products?search=${value}`);
  };
  useEffect(() => {
    if (keyWordSearchListProducts) {
      dispatch(
        fetchProductList({
          sortParam: "",
          titleParam: "",
          keyWordSearchListProducts,
          currentPage: 1,
          pageSize,
        })
      );
    }
  }, [dispatch, keyWordSearchListProducts, pageSize]);
  const hamdleOnChange = (value) => {
    setIsOpenDropDown(true);
    setKeyWordSearch(value);
  };

  const handleInputFocus = () => {
    setIsOpenDropDown(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsOpenDropDown(false);
    }, 300);
  };

  useEffect(() => {
    if (useDebounceSearchTerm) {
      dispatch(fetchFiveProduct({ keyWord: useDebounceSearchTerm }));
    }
  }, [dispatch, useDebounceSearchTerm]);

  const urlImg = (item) => {
    return item?.attributes?.image?.data?.[0]?.attributes?.url
      ? import.meta.env.VITE_IMG_URL +
          item?.attributes?.image?.data?.[0]?.attributes?.url
      : placeholder;
  };

  return (
    <div
      className=" gap-6 flex flex-col p-4 grow"
    >
      <div className="flex flex-row gap-10 flex-auto items-center justify-between">
        <div className="flex flex-col relative">
          <Search
            placeholder="Nhập sản phẩm tìm kiếm"
            enterButton
            className="w-96 h-auto"
            onSearch={handleSearch}
            onChange={(e) => hamdleOnChange(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            value={keyWordSearch}
          />
          {isOpenDropDown && keyWordSearch && (
            <div className="absolute top-10 w-full z-50 bg-white rounded-lg border opacity-100">
              <div className="p-2 sticky top-0 bg-gray-100 z-10 w-full rounded-t-lg">
                Sản phẩm gợi ý
              </div>
              <div className="bg-white w-full border opacity-100 overflow-auto h-80 rounded-b-lg border-b last:border-b">
                <List
                  className="bg-white p-3"
                  itemLayout="vertical"
                  dataSource={productList}
                  split={true} 
                  renderItem={(item, index) => (
                    <Link
                      to={`/product/${item?.id}`}
                      key={item?.id}
                      onClick={handleInputBlur}
                    >
                      <List.Item className="w-full border-b border-gray-300 last:border-b-0">
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              src={urlImg(item)}
                              className="w-20 h-20 rounded-full shadow-xl border-4 border-neutral-100"
                            />
                          }
                          title={<p>{item?.attributes?.name}</p>}
                          description={
                            isAuthenticated ? (
                              <p>{item?.attributes?.price} $</p>
                            ) : (
                              <p className="font-semibold">
                                Đăng nhập để xem giá
                              </p>
                            )
                          }
                        />
                        <Divider />
                      </List.Item>
                    </Link>
                  )}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
SearchBar.propTypes = {
  keyWord: PropTypes.string,
};