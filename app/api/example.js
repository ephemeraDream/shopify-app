import API from 'Plugins/api';

// 这里约定所有的接口方法名前加个“$”前缀，跟普通方法名区分开

// 【本地接口】获取本地信息
export async function $getLocalInfo(data, options = {}) {
  return API({
    isLocal: true, // 本地接口时 isLocal必须为true，否则闪退！
    url: '/api/local/info',
    method: 'GET',
    data,
    ...options,
  });
}

// 【其他项目接口】获取其他项目信息
export async function $getAnotherInfo(data, options = {}) {
  return API({
    url: '/api/info',
    method: 'GET',
    data,
    ...options,
  });
}
