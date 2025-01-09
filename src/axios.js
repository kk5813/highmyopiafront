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
  error => {
    // do something with request error
    return Promise.reject(error)
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