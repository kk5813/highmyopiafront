<template>
  <div>
    <el-menu
        router
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#0099cc"
        text-color="#fff"
        active-text-color="#ffd04b">
      <span>高度近视智能诊断系统</span>
      <el-menu-item index="/Main"><i class="el-icon-user"></i>用户管理</el-menu-item>
      <el-menu-item index="/patientmanagement"><i class="el-icon-folder"></i>患者档案</el-menu-item>
      <el-menu-item index="/Followupvisit"><i class="el-icon-phone-outline"></i>随访管理</el-menu-item>
      <el-menu-item index="/NotCompletedCase">
        <i class="el-icon-document"></i>待完善病历
      </el-menu-item>
      <el-menu-item index="/CompletedCase">
        <i class="el-icon-document-checked"></i>已完善病历
      </el-menu-item>
      <div class="menu-right">
        <el-button type="primary" icon="el-icon-edit">我的</el-button>
        <el-button type="primary" icon="el-icon-lock" @click="handleLockScreen">锁屏</el-button>
        <el-button type="primary" icon="el-icon-close" @click="handleLogout">退出</el-button>
      </div>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "Header",
  props: {
    activeIndex: String,
  },
  methods: {
    // 退出处理逻辑
    handleLogout() {
      const _this = this;
      // this.$axios.get('/logout', {
      //   headers: {
      //     "Authorization": _this.$store.getters.getToken
      //   }
      // }).then(res => {
      //   console.log(res);
      //   this.$message.success('退出成功');
      //   localStorage.removeItem('token');
      //   this.$router.push('/login');
      // }).catch(error => {
      //   console.error(error);
      //   this.$message.error('退出失败，请重试');
      // });
        this.$message.success('退出成功');
        localStorage.removeItem('token');
        this.$router.push('/login');
    },
    // 锁屏处理逻辑
    handleLockScreen() {
      this.$message.warning('锁屏功能暂未实现');
      // 可以在此实现锁屏逻辑，比如跳转到锁屏页面或隐藏部分内容
    }
  }
}
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

.el-menu span:hover, .el-menu span:focus {
  color: #333333;
}

.el-menu .el-menu-item {
  font-size: 18px;
}

.menu-right {
  float: right;
}

.el-button {
  background-color: #0099cc;
  border-color: #0099cc;
}

.el-button:hover {
  background-color: #ffd04b;
  border-color: #0099cc;
}
</style>
