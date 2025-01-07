import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Main from '../views/Main'
import UserManagement from "../views/UserManagement";
import PatientManagement from "../views/PatientManagement";
import Followupvisit from "../views/Followupvisit";
import NotCompletedCase from "../views/NotCompletedCase";
import CompletedCase from "../views/CompletedCase";
import PostCaseDetail from "../views/PostCaseDetail";
import CaseDetail from "../views/CaseDetail";
import AIdiagnosis from "../views/AIdiagnosis";
import illStatistic from "../views/illStatistic";
import test from "../views/test";
import {
  getSession
} from '@/auth'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    redirect: {name: "Login"}
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/main',
    name: 'Main',
    component: Main
  },
  {
    path: '/usermanagement',
    name: 'UserManagement',
    component: UserManagement
  },
  {
    path: '/patientmanagement',
    name: 'PatientManagement',
    component: PatientManagement
  },
  {
    path: '/followupvisit',
    name: 'Followupvisit',
    component: Followupvisit
  },
  // {
  //   path: '/notcompletedcase',
  //   name: 'NotCompletedCase',
  //   component: NotCompletedCase
  // },
  // {
  //   path: '/completedcase',
  //   name: 'CompletedCase',
  //   component: CompletedCase
  // },
  {
    path: '/postcasedetail',
    name: 'PostCaseDetail',
    component: PostCaseDetail
  },
  // {
  //   path: '/casedetail/:id',
  //   name: 'CaseDetail',
  //   component: CaseDetail
  // },
  // {
  //   path: '/test/',
  //   name: 'test',
  //   component: test
  // },
  {
    path: '/AIdiagnosis',
    name: 'AIdiagnosis',
    component: AIdiagnosis
  },
  {
    path: '/illStatistic',
    name: 'illStatistic',
    component: illStatistic
  },
  
]

const router = new VueRouter({
  mode: 'history',
  routes
})

var whiteArr = ['/login'];

router.beforeEach((to,from,next) => {
  // 当前路由
  var path = to.path;
  // 获取到token
  var token = sessionStorage.getItem('token');
  if (token) { // 有token说明已经登录
    if (path == '/login') { // 如果是登录页
      next('/illStatistic');  // 进入到首页
    }
  } else { // 没有token说明没有登录
    if (whiteArr.includes(path)) { // 当前路由在白名单里
      next();  // 放行
    } else { // 不在白名单上
      next('/login'); // 去登录
    }
  }
  next();
})

export default router
