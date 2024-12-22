import axios from "axios"
import ElementUI from 'element-ui'
import store from './store'
import router from "./router";
import {getSession} from '@/auth'


const service = axios.create({
    // baseURL: 'http://8.140.145.137',
    baseURL: 'http://localhost:8081/api/v1', 
    timeout: 6 * 1000 // request timeout
  })
  

//      前置拦截
// axios.interceptors.request.use(config => {
//     return config
// })

service.interceptors.request.use(
  config => {
    if (getSession()) {
      config.headers['authorization'] = getSession()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
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