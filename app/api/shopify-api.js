import API from 'Plugins/api';

// 【本地接口】上传图片
export async function $uploadImages(data, options = {}) {
  return API({
    isLocal: true, // 本地接口时 isLocal必须为true，否则闪退！
    url: '/apps/api/reviews/upload',
    method: 'POST',
    data,
    ...options,
  });
}