// axios 默认配置
export const AXIOS_DEFAULT_CONFIG = {
  timeout: 50000,
  maxContentLength: 2000,
}

// API 默认配置
export const API_DEFAULT_CONFIG = {
  mockBaseUrl: '/API', // 本地开发mock接口地址前缀，会被vite.config.ts中设置的proxy替换掉
}