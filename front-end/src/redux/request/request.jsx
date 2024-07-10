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
  }
};
export default request;