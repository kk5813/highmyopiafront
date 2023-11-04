import axios from "axios"
import ElementUI from 'element-ui'
import store from './store'
import router from "./router";

// axios.defaults.baseURL = 'http://10.12.5.29:8081'
// axios.defaults.baseURL = 'http://192.168.31.53:8081'
axios.defaults.baseURL = 'http://localhost:8081'
// axios.defaults.baseURL = '/api'

//      前置拦截
axios.interceptors.request.use(config => {
    return config
})

//      后置拦截

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