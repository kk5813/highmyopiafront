<template>
  <div>
    <el-menu
      router
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#0099cc"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <span>慢病管理系统</span>
      <el-menu-item index="/illStatistic">
        <i class="el-icon-data-analysis"></i>病种统计
      </el-menu-item>
      <el-menu-item index="/AIdiagnosis">
        <i class="el-icon-monitor"></i>智能诊断
      </el-menu-item>
      <el-menu-item index="/Followupvisit"
        ><i class="el-icon-phone-outline"></i>随访管理</el-menu-item
      >
      <el-menu-item index="/patientmanagement"
        ><i class="el-icon-folder"></i>患者档案</el-menu-item
      >
      <el-menu-item index="/Main" v-if="withPermission"
        ><i class="el-icon-user"></i>用户管理</el-menu-item
      >
      <div class="menu-right">
        <div
          style="
            float: left;
            margin-right: 20px;
            width: 200px;
            color: white;
            font-size: 16px;
            text-align:right;
          "
        >
          <i class="el-icon-user-solid"></i>{{ userName }}
        </div>
        <el-button @click="userLogout()" type="primary" icon="el-icon-close"
          >退出</el-button
        >
      </div>
    </el-menu>
  </div>
</template>

<script>
import api from "@/api/apiManage";
import { removeSession } from "@/auth";
export default {
  name: "Header",
  props: {
    activeIndex: "",
  },
  data() {
    return {
      withPermission: false,
      first: true,
      userName: "admin",
    };
  },
  created(){
    if(sessionStorage.getItem('userName')){
      this.userName = sessionStorage.getItem('userName')
    }
    api
      .findUserById(sessionStorage.getItem("userId"))
      .then((res) => {
        if (res.data.data && res.data.data.userStatus === 0)
          this.withPermission = true;
      })
      .catch((error) => {})
      .finally(() => {});
  },
  methods: {
    userLogout() {
      api.logout().then((res) => {
        if (res.data.code == 200) {
          // removeSession();
          sessionStorage.removeItem('token')
          sessionStorage.removeItem('userName')
          this.$message({
            message: "您已成功退出！",
            type: "success",
          });
          this.$router.push({ path: "login" });
        } else {
          this.$message.error("退出失败！");
        }
      });
    },
  },
  mounted(){

  },
};
</script>

<style scoped>
.el-menu--horizontal > .el-menu-item {
  height: 65px;
  line-height: 65px;
}
.el-menu span {
  float: left;
  color: #eeeeee;
  font-size: 20px;
  margin-left: 20px;
  margin-right: 20px;
}
.el-menu span:hover,
.el-menu span:focus {
  color: #333333;
}
.el-menu .el-menu-item {
  font-size: 18px;
}
.el-menu .menu-right {
  float: right;
}
.el-menu .el-button {
  background-color: #0099cc;
  border-color: #0099cc;
}
.el-menu .el-button:hover {
  background-color: #ffd04b;
  border-color: #0099cc;
}
.el-icon-user {
  color: #fff;
}
.el-icon-folder {
  color: #fff;
}
.el-icon-phone-outline {
  color: #fff;
}
.el-icon-monitor {
  color: #fff;
}
.el-icon-data-analysis {
  color: #fff;
}
</style>