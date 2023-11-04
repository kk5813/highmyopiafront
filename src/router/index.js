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
  {
    path: '/notcompletedcase',
    name: 'NotCompletedCase',
    component: NotCompletedCase
  },
  {
    path: '/completedcase',
    name: 'CompletedCase',
    component: CompletedCase
  },
  {
    path: '/postcasedetail/:id',
    name: 'PostCaseDetail',
    component: PostCaseDetail
  },
  {
    path: '/casedetail/:id',
    name: 'CaseDetail',
    component: CaseDetail
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
