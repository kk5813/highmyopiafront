import request from '@/axios'
import qs from 'qs'

export default {

  // 用户登录  ==>  /account
  login(data) {
    return request({
      url: `/account/login`,
      method: 'post',
      data
    })
  },

  logout() {
    return request({
      url: `/account/logout`,
      method: 'get'
    })
  },

  // 用户管理  ==>  /user
  addUser(data) {
    return request({
      url: '/user/add',
      method: 'post',
      data // 传递form表单类型的数据关键字是data
    })
  },

  searchUser(data) {
    return request({
      url: "/user/search",
      method: 'post',
      data
    })
  },

  findUserById(userId) {
    return request({
      url: "/user/find/" + userId,
      method: 'get',
    })
  },

  editUser(data) {
    return request({
      url: '/user/edit',
      method: 'post',
      data // 传递form表单类型的数据关键字是data
    })
  },

  deleteUser(userId) {
    return request({
      url: '/user/invalid/' + userId,
      method: 'get',
    })
  },

  getUserList(pageSize, pageNumber) {
    return request({
      url: '/user/page',
      method: 'get',
      params: {
        pageSize,
        pageNumber
      }
    })
  },

  // 患者信息管理  ==>  /patient
  getPatientById(patientId) {
    return request({
      url: '/patients/find/' + patientId,
      method: 'get',
    })
  },

  getPatientList(data) {
    return request({
      url: '/patient/list',
      method: 'get',
      data
    })
  },

  importPatient(data) {
    return request({
      url: '/patient/edit',
      method: 'put',
      data
    })
  },

  importPatients(data) {
    return request({
      url: '/patient/import',
      method: 'post',
      data
    })
  },

  editPatient(data) {
    return request({
      url: '/patients/edit',
      method: 'post',
      data
    })
  },

  exportPatients(data) {
    return request({
      url: '/patient/export',
      method: 'get',
      data
    })
  },

  // 病历管理  ==>  /medicalRecord
  addMedicalRecord(data) {
    return request({
      url: '/medicalRecord/add',
      method: 'post',
      data
    })
  },

  editMedicalRecord(data) {
    return request({
      url: '/medicalRecord/edit',
      method: 'put',
      data
    })
  },

  maintenanceMedicalRecord(data) {
    return request({
      url: '/medicalRecord/maintenance',
      method: 'get',
      data
    })
  },

  getIllCount(data) {
    return request({
      url: '/today/CategoryCount',
      method: 'post',
      data
    })
  },

  getDeptsName(data) {
    return request({
      url: '/dept/page',
      method: 'get',
      data
    })
  },

  getVisitList(data) {
    return request({
      url: '/visits/page/',
      method: 'get',
      params: data,
    })
  },

  getVisitById(patientId) {
    return request({
      url: '/visits/find/' + patientId,
      method: 'get'
    })
  },

  getCaseById(elementId) {
    return request({
      url: '/element/find/' + elementId,
      method: 'get'
    })
  },

  getCaseByCondition(data) {
    return request({
      url: '/element/search',
      method: 'post',
      data
    })
  },

  getPatientCheckReport(patientId,data) {
    return request({
      url: '/check_reports/find/' + patientId,
      method: 'get',
      params: data,
    })
  },

  getRecipeById(patientId) {
    return request({
      url: '/recipe/find/' + patientId,
      method: 'get'
    })
  },

  getTodayUndo() {
    return request({
      url: '/followup/todayUndo/',
      method: 'get'
    })
  },

  getOverdue() {
    return request({
      url: '/followup/overdue',
      method: 'get'
    })
  },

  getUndo() {
    return request({
      url: '/followup/undo/',
      method: 'get'
    })
  },

  editFollowup(data) {
    return request({
      url: '/followup/editFollowup',
      method: 'post',
      data
    })
  },

  addFollowup(data) {
    return request({
      url: '/followup/addFollowup',
      method: 'post',
      data
    })
  },

  searchFollowup(data) {
    return request({
      url: '/followup/search',
      method: 'get',
      params: data
    })
  },

  getCheckResult(patienId) {
    return request({
      url: '/check_result/find/' + patienId,
      method: 'get',
    })
  },

  getCaseTimeline(data) {
    return request({
      url: '/patients/element_time_line/',
      method: 'get',
      params: data
    })
  },

  getCaseTimelineReport(data) {
    return request({
      url: '/check_reports/reportFiles/',
      method: 'get',
      params: data
    })
  },

  getAiDiagnose(data) {
    return request({
      url: '/disease/diagnose',
      method: 'post',
      data
    })
  },

  getAiDiagnoseByVisitnumber(data) {
    return request({
      url: '/disease/onlySearchByVisitNumber',
      method: 'post',
      data
    })
  },

  getPatientTodayReport(patientId) {
    return request({
      url: '/today/onlySearch/' + patientId,
      method: 'get'
    })
  },

  downloadPatientInfo() {
    return request({
      url: '/patients/export',
      method: 'get',
      responseType: 'blob'
    })
  },
  getPatientReport(visitNumber) {
    return request({
      url: '/patients/getReport/' + visitNumber,
      method: 'get'
    })
  },
  getAiDisease() {
    return request({
      url: '/config/get_disease',
      method: 'get'
    })
  },
  getAiNode() {
    return request({
      url: '/config/get_node',
      method: 'get'
    })
  },
  getAiLine() {
    return request({
      url: '/config/get_line',
      method: 'get'
    })
  },
  delAiDisease(diseaseId) {
    return request({
      url: '/config/del_disease/' + diseaseId,
      method: 'delete'
    })
  },
  delAiNode(nodeId) {
    return request({
      url: '/config/del_node/' + nodeId,
      method: 'delete'
    })
  },
  delAiLine(lineId) {
    return request({
      url: '/config/del_line/' + lineId,
      method: 'delete'
    })
  },
  modAiDisease(data) {
    return request({
      url: '/config/mod_disease',
      method: 'post',
      data
    })
  },
  modAiNode(data) {
    return request({
      url: '/config/mod_node',
      method: 'post',
      data
    })
  },
  modAiLine(data) {
    return request({
      url: '/config/mod_line',
      method: 'post',
      data
    })
  },
  addAiDisease(data) {
    return request({
      url: '/config/add_disease',
      method: 'post',
      data
    })
  },
  addAiNode(data) {
    return request({
      url: '/config/add_node',
      method: 'post',
      data
    })
  },
  addAiLine(data) {
    return request({
      url: '/config/add_line',
      method: 'post',
      data
    })
  },
}