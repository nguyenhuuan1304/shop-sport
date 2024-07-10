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
};
export default request;
