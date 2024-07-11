import axios from "axios";
import axiosInstance from "../../axios/axios";

const request = {
  List: async () => {
    try {
      const response = await axiosInstance.get("/products");
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
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
  AddToCart: async (userId, product, total) => {
    try {
      //get current user cart
      const userCart = await axiosInstance.get(
        `/users/${userId}?fields[0]=cart`
      );
      //add product to cart
      const updatedProducts = [...userCart.cart.products, product];
      const updatedTotal = userCart.cart.total + total;
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
    } catch (error) {
      throw error;
    }
  },
};
export default request;
