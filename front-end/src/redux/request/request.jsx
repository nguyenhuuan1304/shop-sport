import axios from "axios";
import axiosInstance from "../../axios/axios";
import errorHandler from "../request/errorHandler";
import successHandler from "./successHandler";
const request = {
  List: async () => {
    try {
      const response = await axiosInstance.get("/products?populate=*");
      console.log("Response data:", response.data);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },

  ListSort: async ({ sort, title }) => {
    console.log("listsort ", sort);
    try {
      let url = "/products?populate=*";
      if (sort != "true" && sort != "false") {
        url += `&sort=${sort}`;
      } else {
        console.log("title  ", title);
        if (title == "Hot") {
          title = "isHot";
        } else {
          title = "is_discount_active";
        }
        url += `&filters[${title}][$eq]=${sort}`;
      }
      const response = await axiosInstance.get(url);
      console.log("Response data:", response.data);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },

  ListSaleProduct: async () => {
    console.log("listsort ", sort);
    try {
      const response = await axiosInstance.get(
        `/products?populate=*&is_discount_active=true`
      );
      console.log("Response data:", response.data);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },

  ProductDetail: async (productId) => {
    try {
      const response = await axiosInstance.get(
        `/products/${productId}?populate=*`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching product detail data:", error);
      throw error;
    }
  },
  UserDetail: async (userId) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      return response;
    } catch (error) {
      console.error("Error fetching user detail data:", error);
      throw error;
    }
  },
  Cart: async (userId) => {
    try {
      const response = await axiosInstance.get(
        `/users/${userId}?fields[0]=cart`
      );
      return response;
    } catch (error) {
      console.error("Error fetching cart data:", error);
      throw error;
    }
  },
  //add a product to cart
  AddToCart: async (userId, product) => {
    try {
      //get current user cart
      const userCart = await axiosInstance.get(
        `/users/${userId}?fields[0]=cart`
      );
      //check product is in cart (size === size and id === id)
      let existingProduct = userCart?.data?.cart?.products.find((item) => {
        return (
          item.product?.id === product?.id &&
          item.size &&
          item.product?.attributes?.size_list?.some(
            (sizeItem) => sizeItem.size === item.size
          )
        );
      });
      let updatedProducts;
      //if exist
      if (existingProduct) {
        existingProduct = {
          ...existingProduct,
          count: existingProduct.count + 1,
        };
        updatedProducts = userCart.data.cart.products.map((item) =>
          item.product.id === existingProduct.product.id
            ? existingProduct
            : item
        );
      } else {
        updatedProducts = [...userCart.data.cart.products, product];
      }
      //updated total value
      const updatedTotal =
        userCart?.data?.cart?.total + product?.attributes?.price;

      //updated cart
      const response = await axiosInstance.put(
        `/users/${userId}?fields[0]=cart`,
        {
          cart: {
            products: updatedProducts,
            total: updatedTotal,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  RemoveFromCart: async (userId, product) => {
    try {
      //get current user cart
      const userCart = await axiosInstance.get(
        `/users/${userId}?fields[0]=cart`
      );
      //check product is in cart (size === size and id === id)
      let existingProduct = userCart?.data?.cart?.products.find((item) => {
        return (
          item.product?.id === product?.id &&
          item.size &&
          item.product?.attributes?.size_list?.some(
            (sizeItem) => sizeItem.size === item.size
          )
        );
      });
      let updatedProducts;
      //if exist
      if (existingProduct) {
        existingProduct = {
          ...existingProduct,
          count: existingProduct.count - 1,
        };
        updatedProducts = userCart.data.cart.products.map((item) =>
          item.product.id === existingProduct.product.id
            ? existingProduct
            : item
        );
      } else {
        updatedProducts = [...userCart.data.cart.products, product];
      }
      //updated total value
      const updatedTotal =
        userCart?.data?.cart?.total - product?.attributes?.price;

      //updated cart
      const response = await axiosInstance.put(
        `/users/${userId}?fields[0]=cart`,
        {
          cart: {
            products: updatedProducts,
            total: updatedTotal,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
export default request;
