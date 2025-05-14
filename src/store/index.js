import Vue from 'vue'
import Vuex from 'vuex'
import patientState from './modules/patientState';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: sessionStorage.getItem("token"),
    userInfo: JSON.parse(sessionStorage.getItem("userInfo")),
    diagnosisResult: sessionStorage.getItem("diagnosisResult")
  },
  mutations: {
    // 相当于set方法

    SET_TOKEN: (state, token) => {
      state.token = token;
      // 存入浏览器缓存，浏览器关闭后也能保持
      sessionStorage.setItem("token", token);
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo;
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
    },
    REMOVE_INFO: (state) => {
      state.token = '';
      state.userInfo = {};
      sessionStorage.setItem("token", '');
      sessionStorage.setItem("userInfo", JSON.stringify(''));
    },
    SET_DIAGRES: (state, diagnosisResult) => {
      state.diagnosisResult = diagnosisResult;
      // 存入浏览器缓存，浏览器关闭后也能保持
      sessionStorage.setItem("diagnosisResult", diagnosisResult);

    },
  },
  getters: {
    getUser: state => {
      return state.userInfo;
    },
    getToken: state => {
      return state.token;
    },
    getDiagRes: state => {
      return state.diagnosisResult;
    }
  },
  actions: {
  },
  modules: {
    // 解决在PatientManagement页面点击病人详细病历并返回PatientManagement页面时原筛选条件丢失的问题
    patientState
  }
})
