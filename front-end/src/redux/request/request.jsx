import axiosInstance from "../../axios/axios";
import errorHandler from "./errorHandler";
import successHandler from "./successHandler";

const request = {
  List: async (entity, option = {}) => {
    try {
      let query = "";
      if (option !== {}) {
        let page = option.page ? "page=" + option.page : "";
        let items = option.items ? "&items=" + option.items : "";
        query = `?${page}${items}`;
      }

      const response = await axiosInstance.get(entity + "/product" + query);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },
};
export default request;