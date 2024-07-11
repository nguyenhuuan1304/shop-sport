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
        console.log("title  ", title)
        if(title=="Hot"){
          title = "isHot";
        }else{
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
};
export default request;
