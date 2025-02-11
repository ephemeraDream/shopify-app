// utils/shopifyAxios.js
import axios from "axios";
import { getSessionToken } from "@shopify/app-bridge-utils";

export function createShopifyAxios(app) {
  const instance = axios.create();

  // 请求拦截器：自动添加 Session Token
  instance.interceptors.request.use(async (config) => {
    const token = await getSessionToken(app);
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  });

  // 响应拦截器：统一处理错误
  instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      console.error("API Error:", error.response?.data || error.message);
      return Promise.reject(error);
    }
  );

  return instance;
}