import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import axios from "axios"
import "element-ui/lib/theme-chalk/index.css"
import './axios'
import md5 from 'js-md5'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.prototype.$axios = axios
Vue.prototype.$md5 = md5

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

