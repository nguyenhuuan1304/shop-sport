import axiosInstance from "../axios/axios";

export const loginService = (payload) => {
  return axiosInstance({
    url: "auth/local",
    method: "post",
    data: payload,
  });
};
