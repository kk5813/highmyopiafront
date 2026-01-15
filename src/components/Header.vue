<!-- Header.vue - 根据角色显示不同菜单 -->
<template>
  <div class="header-container">
    <!-- 通用导航栏 -->
    <el-menu
        router
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        :background-color="getHeaderBgColor()"
        :text-color="textColor"
        :active-text-color="getActiveTextColor()"
    >
      <div class="header-left">
        <div class="logo-area">
          <img src="../assets/logo.png" alt="爱尔眼科" class="logo" />
          <span class="system-name">{{ getSystemName() }}</span>
          <span class="role-badge" v-if="userRole">
            <i :class="getRoleIcon()"></i>{{ getRoleName() }}
          </span>
        </div>
      </div>

      <!-- 管理员菜单 (role = 1) -->
      <template v-if="userRole === 1">
        <el-menu-item index="/nurseDashboard">
          <i class="el-icon-search"></i>疾病初筛
        </el-menu-item>
        <el-menu-item index="/illStatistic">
          <i class="el-icon-data-line"></i>病种统计
        </el-menu-item>
        <el-menu-item index="/AIdiagnosis">
          <i class="el-icon-cpu"></i>智能诊断
        </el-menu-item>
        <el-menu-item index="/followupvisit">
          <i class="el-icon-phone-outline"></i>随访管理
        </el-menu-item>
        <el-menu-item index="/patientmanagement">
          <i class="el-icon-folder"></i>患者档案
        </el-menu-item>
        <el-menu-item index="/Main">
          <i class="el-icon-user"></i>用户管理
        </el-menu-item>
        <el-menu-item index="/ModelConfig">
          <i class="el-icon-user"></i>模型配置
        </el-menu-item>
      </template>

      <!-- 医生菜单 (role = 2) -->
      <template v-else-if="userRole === 2">
        <el-menu-item index="/illStatistic">
          <i class="el-icon-data-line"></i>病种统计
        </el-menu-item>
        <el-menu-item index="/AIdiagnosis">
          <i class="el-icon-cpu"></i>智能诊断
        </el-menu-item>
        <el-menu-item index="/patientmanagement">
          <i class="el-icon-folder"></i>患者档案
        </el-menu-item>
      </template>

      <!-- 护士菜单 (role = 3) -->
      <template v-else-if="userRole === 3">
        <el-menu-item index="/nurseDashboard">
          <i class="el-icon-search"></i>疾病初筛
        </el-menu-item>
      </template>

      <!-- 默认菜单（无角色或未知角色） -->
      <template v-else>
        <el-menu-item index="/illStatistic">
          <i class="el-icon-data-line"></i>病种统计
        </el-menu-item>
      </template>

      <div class="header-right">
        <!-- 用户信息区域 -->
        <div class="user-info">
          <span class="welcome-text">
            欢迎，{{ userName }}
          </span>
          <el-dropdown @command="handleCommand" class="user-dropdown">
            <span class="el-dropdown-link">
              <i class="el-icon-user"></i>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="profile">
                <i class="el-icon-user"></i>个人中心
              </el-dropdown-item>
              <el-dropdown-item command="settings">
                <i class="el-icon-setting"></i>系统设置
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <i class="el-icon-switch-button"></i>退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "Header",
  props: {
    activeIndex: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      systemName: "爱尔眼科慢病管理系统",
      textColor: "#ffffff",
      userName: sessionStorage.getItem("userName") || "用户",
      userRole: null
    };
  },
  created() {
    // 从sessionStorage获取用户角色
    const storedRole = sessionStorage.getItem("role");
    if (storedRole) {
      this.userRole = parseInt(storedRole);
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.$emit('select', key, keyPath);
    },

    handleCommand(command) {
      switch (command) {
        case "logout":
          this.handleLogout();
          break;
        case "profile":
          this.$router.push("/profile");
          break;
        case "settings":
          this.$message.info("系统设置功能开发中");
          break;
      }
    },

    handleLogout() {
      this.$confirm("确定要退出登录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        // 清除sessionStorage
        sessionStorage.clear();
        localStorage.clear();

        // 跳转到登录页
        this.$router.push("/login");

        this.$message({
          type: "success",
          message: "退出成功！"
        });
      }).catch(() => {});
    },

    // 获取系统名称（根据角色）
    getSystemName() {
      if (this.userRole === 3) {
        return "护理初筛工作站";
      }
      return "爱尔眼科慢病管理系统";
    },

    // 获取标题栏背景色（根据角色）
    getHeaderBgColor() {
      switch(this.userRole) {
        case 1: // 管理员
          return "#0099cc";
        case 2: // 医生
          return "#0077b6";
        case 3: // 护士
          return "#4CAF50";
        default:
          return "#0099cc";
      }
    },

    // 获取激活文本颜色
    getActiveTextColor() {
      if (this.userRole === 3) {
        return "#FFD700"; // 护士用金色
      }
      return "#ffd04b"; // 其他角色用黄色
    },

    // 获取角色名称
    getRoleName() {
      switch(this.userRole) {
        case 1:
          return "管理员";
        case 2:
          return "医生";
        case 3:
          return "护士";
        default:
          return "用户";
      }
    },

    // 获取角色图标
    getRoleIcon() {
      switch(this.userRole) {
        case 1:
          return "el-icon-s-custom";
        case 2:
          return "el-icon-s-custom";
        case 3:
          return "el-icon-user-solid";
        default:
          return "el-icon-user";
      }
    }
  }
};
</script>

<style scoped>
.header-container {
  width: 100%;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
}

/* 修改菜单项 */
.el-menu--horizontal > .el-menu-item {
  height: 45px;         /* 缩小高度 */
  line-height: 45px;    /* 文字对齐 */
  padding: 0 15px;      /* 左右宽度 */
  font-size: 14px;      /* 字体缩小 */
  margin-top: 10px;     /* 整体下移一点点，防止顶格 */
  border-radius: 4px;   /* 微小的圆角 */
}

/* 别忘了调整左侧 Logo 区域的高度，保持水平对齐 */
.logo-area {
  height: 65px;         /* 保持外层容器高度不变 */
  display: flex;
  align-items: center;  /* 关键：让 Logo 在 65px 的容器里上下居中 */
}

.header-left {
  float: left;
  margin-right: 30px;
}

.logo-area {
  display: flex;
  align-items: center;
  height: 65px;
  padding: 0 20px;
}

.logo {
  height: 40px;
  margin-right: 10px;
}

.system-name {
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
  margin-right: 15px;
}

.role-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  color: #ffffff;
}

.role-badge i {
  margin-right: 5px;
}

.header-right {
  float: right;
  height: 65px;
  display: flex;
  align-items: center;
  padding-right: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.welcome-text {
  color: #ffffff;
  font-size: 14px;
}

.user-dropdown {
  color: #ffffff;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background 0.3s;
}

.user-dropdown:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 响应式调整 */
@media (max-width: 992px) {
  .welcome-text {
    display: none;
  }

  .role-badge {
    display: none;
  }
}

@media (max-width: 768px) {
  .system-name {
    font-size: 16px;
  }
}

@media (max-width: 576px) {
  .system-name {
    display: none;
  }

  .logo-area {
    padding: 0 10px;
  }
}
</style>