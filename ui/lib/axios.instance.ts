import { AxiosInstance } from "axios";
import axios from "axios";
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 5000,
});
axiosInstance.interceptors.request.use(function (config) {
  const accessToken = window.localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
