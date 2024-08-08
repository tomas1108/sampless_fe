import axios, { type AxiosInstance } from "axios";
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "content-type": "application/json",
  },
});
axiosInstance.interceptors.request.use(
  (config: any) => {
    // Do something before request is sent
    const tokenStorage = localStorage.getItem('token');
    config.headers["Authorization"] = "Bearer " + tokenStorage;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;