/**
 * 请求成功拦截器
 * @param {Object} requestObj - 请求配置对象
 * @returns {Object} - 处理后的请求配置对象
 */
export function requestSuccessFunc(requestObj) {
  // 添加通用的请求头
  requestObj.headers['Authorization'] = `Bearer XXXXXXXXXXXXXXX`; // 示例，添加授权参数
  // 可以在此添加一些请求前的处理逻辑，如加载动画的开启
  return requestObj;
}

/**
 * 请求失败拦截器
 * @param {Object} requestError - 请求错误对象
 * @returns {Promise<never>} - 拒绝的Promise，包含错误对象
 */
export function requestFailFunc(requestError) {
  // 可以在此添加请求失败的处理逻辑，如提示用户网络错误等
  // 可以在此关闭加载动画
  return Promise.reject(requestError);
}

/**
 * 响应成功拦截器
 * @param {Object} responseObj - 响应对象
 * @returns {Object | Promise<never>} - 处理后的响应对象或拒绝的Promise
 */
export function responseSuccessFunc(responseObj) {
  // 根据业务逻辑处理响应数据
  if (responseObj.status === 200 && responseObj.data.result === 'success') {
    return responseObj.data;
  } else {
    // 可以在此处理业务上的失败，如提示用户操作失败
    console.error('业务失败', responseObj.data.message);
    return Promise.reject(responseObj);
  }
}

/**
 * 响应失败拦截器
 * @param {Object} responseError - 响应错误对象
 * @returns {Promise<never>} - 拒绝的Promise，包含错误对象
 */
export function responseFailFunc(responseError) {
  // 响应失败处理，如根据 responseError.response?.status 做不同的处理
  console.error('响应失败', responseError);
  if (responseError.response) {
    switch (responseError.response.status) {
      case 401:
        console.error('未授权，重定向到登录页');
        // 可以在此执行重定向到登录页的逻辑
        break;
      case 403:
        console.error('拒绝访问');
        break;
      case 404:
        console.error('请求地址出错');
        break;
      case 500:
        console.error('服务器内部错误');
        break;
      default:
        console.error('其他错误', responseError.response.status);
    }
  } else {
    console.error('请求失败', responseError.message);
  }
  // 可以在此关闭加载动画
  return Promise.reject(responseError);
}
