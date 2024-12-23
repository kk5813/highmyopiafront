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
      url: '/patient/find/' + patientId,
      method: 'get'
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

  maintenanceMedicalRecord(data) {
    return request({
      url: '/medicalRecord/maintenance',
      method: 'get',
      data
    })
  },

  getIllCount(data) {
    return request({
      url: '/diagnosis',
      method: 'get',
      data
    })
  }
}