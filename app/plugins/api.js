import axios from './axios';
import { API_DEFAULT_CONFIG } from 'Config/index';

// 根据当前环境设置baseUrl
const baseUrl = import.meta.env.DEV ? API_DEFAULT_CONFIG.mockBaseUrl : '';

// 封装API请求
const API = (option) => {
  // 如果是get请求，就将data作为params
  option.method?.toLowerCase() === 'get' && (option['params'] = option.data);
  if (typeof window === 'undefined') {
    // 服务端环境中
    if (option.isLocal) {
      // process.env.SHOPIFY_APP_URL拿到的当前访问地址，在非Shopify的Remix项目中，可以在root.tsx获取url保存到全局供此处使用
      option['url'] = process.env.SHOPIFY_APP_URL + option['url'];
    } else {
      // 服务端访问非本地接口，则使用对应接口地址或者用baseUrl反向代理
      !option['url']?.includes('http') && (option['url'] = process.env.SHOPIFY_APP_URL + baseUrl + option['url']);
    }
  } else {
    // 浏览器环境访问非本地接口，则使用baseUrl用于反向代理，否则直接访问即可
    !option.isLocal && (option['url'] = baseUrl + option['url']);
  }
  return new Promise((resolve) => {
    axios(option)
      .then((response) => {
        resolve([null, response.data]);
      })
      .catch((err) => {
        resolve([err, undefined]);
      });
  });
};

export default API;