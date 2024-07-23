import axiosInstance from "../../axios/axios";
import errorHandler from "../request/errorHandler";
import successHandler from "./successHandler";

const request = {
  List: async (currentPage, pageSize) => {
    try {
      const response = await axiosInstance.get(
        `/products?populate=*&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`
      );
      console.log("Response data:", response.data);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },
  searchFiveProduct: async (keyWord) => {
    try {
      const response = await axiosInstance.get(
        `/products?populate=*&filters[name][$containsi]=${keyWord.toUpperCase()}&pagination[limit]=5&sort[0]=createdAt:asc`
      );
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },
  listProductSearch: async ({ keyWord, currentPage, pageSize }) => {
    try {
      const response = await axiosInstance.get(
        `/products?populate=*&filters[name][$containsi]=${keyWord.toUpperCase()}&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`
      );
      // console.log("Response data:", response.data);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },

  ListSort: async ({ sort, title, currentPage, pageSize }) => {
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
      const response = await axiosInstance.get(
        url +
          `&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`
      );
      console.log("Response data:", response.data);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },

  ListSaleProduct: async () => {
    // console.log("listsort ", sort);
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
      const response = await axiosInstance.get(`/users/${userId}?populate=*`);
      return response;
    } catch (error) {
      console.error("Error fetching user detail data:", error);
      throw error;
    }
  },
  createOderAddress: async ({ data }) => {
    try {
      const newOrderAddressData = {
        data,
      };
      console.log("request", newOrderAddressData);
      const response = await axiosInstance.post(
        `/order-addresses`,
        newOrderAddressData
      );
      return response.data;
    } catch (error) {
      return errorHandler(error);
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
  updateUser: async ({ data }) => {
    try {
      const response = await axiosInstance.put(`/users/${data.id}`, data);
      return response;
    } catch (error) {
      console.error("Error fetching cart data:", error);
      throw error;    }
  },
  updateRelationUser: async ({ userId, oderAddressId }) => {
    try {
      const data = {
        order_addresses: {
          connect: [oderAddressId],
        },
      };
      const response = await axiosInstance.put(`/users/${userId}`, data);
      return response;
    } catch (error) {
      console.error("Error fetching user detail data:", error);
      throw error;
    }
  },
  changePassword: async ({data})=>{
    try {
      const reponse = await axiosInstance.post(`/auth/change-password`, data);
      return reponse;
    } catch (error) {
      console.error("error change password");
      throw error;
    }
  },
  AddToCart: async (userId, product, total) => {
    // try {
    //   //get current user cart
    //   const userCart = await axiosInstance.get(
    //     `/users/${userId}?fields[0]=cart`
    //   );
    //   //add product to cart
    //   const updatedProducts = [...userCart.cart.products, product];
    //   const updatedTotal = userCart.cart.total + total;
    //   //updated cart
    //   const response = await axiosInstance.put(
    //     `/users/${userId}?fields[0]=cart`,
    //     {
    //       cart: {
    //         products: updatedProducts,
    //         total: updatedTotal,
    //       },
    //     }
    //   );
    // } catch (error) {
    //   throw error;
    // }
  },
};
export default request;
