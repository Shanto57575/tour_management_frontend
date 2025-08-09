import { envConfig } from "@/config";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: envConfig.baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  function (config) {
    // console.log("AXIOS", config);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function onFulfilled(response) {
    // console.log("AXIOS", response);
    return response;
  },
  function onRejected(error) {
    return Promise.reject(error);
  }
);
