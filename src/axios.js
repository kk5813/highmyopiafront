import axios from "axios"
import ElementUI from 'element-ui'
import store from './store'
import router from "./router";
import JSONBig from 'json-bigint'
const JSONBigIntStr = JSONBig({ storeAsString: true });
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL + '/api/v1',
  transformResponse: [function(data){
    try {
      // 如果转换成功则返回转换的数据结果
      return JSONBigIntStr.parse(data)
    } catch (err) {
      // 如果转换失败，则包装为统一数据格式并返回
      return {
        data
      }
    }
  }],
  timeout: 7 * 10000 // request timeout
})

service.interceptors.request.use(
  config => {
    if (sessionStorage.getItem("token")) {
      config.headers['authorization'] = sessionStorage.getItem("token")
    }
    return config
  },
  // 智能诊断请求超时重发
  async error => {
    const config = error.config;
    // 仅处理超时错误
    if (
      error.code === 'ECONNABORTED' && 
      error.message.includes('timeout') &&
      !config.__isRetryRequest  // 防止重复重试
    ) {
      // 初始化重试次数和超时时间
      config.__retryCount = config.__retryCount || 0;
      const MAX_RETRY = 3; // 最大重试次数
      
      if (config.__retryCount >= MAX_RETRY) {
        return Promise.reject(error);
      }
      
      config.__retryCount += 1;
      // 超时时间翻倍（首次70s -> 第二次140s -> 第三次280s）
      const newTimeout = config.timeout * 2 || 70000;
      const newConfig = { 
        ...config, 
        timeout: newTimeout,
        __isRetryRequest: true // 标记为正在重试
      };
      
      // 延迟1秒后重试（可选）
      await new Promise(resolve => setTimeout(resolve, 1000));
      return service(newConfig);
    }
    return Promise.reject(error);
  }
)

// axios.interceptors.response.use(response => {
//         if(response.data.code === 200) {
//             return response
//         } else {
//             ElementUI.Message({
//                 showClose: false,
//                 message: response.data.msg,
//                 type: 'error',
//                 duration: 1500
//             })
//             return Promise.reject(response.data.msg)
//         }
//     },
//     error => {
//         if(error.response.data) {
//             error.message = error.response.data.msg
//         }
//         ElementUI.Message({
//             showClose: false,
//             message: error.message,
//             type: 'error',
//             duration: 1500
//         })
//         return Promise.reject(error)
//     }
// )
export default service