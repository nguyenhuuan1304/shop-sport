import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    config.headers["Authorization"] = token
      ? `Bearer ${token}`
      : delete config.headers["Authorization"];
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    console.log(response);
    if (response && (response.status === 401 || response.status === 403)) {
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
