<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img class="imgResize" src="../assets/logo.png" alt="" />
      </div>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="0px"
        class="login_form"
      >
        <!--用户名-->
        <el-form-item prop="userLoginName">
          <el-input
            v-model="ruleForm.userLoginName"
            prefix-icon="el-icon-user"
          />
        </el-form-item>
        <!--密码-->
        <el-form-item prop="userPassword">
          <el-input
            ref="input"
            v-model="ruleForm.userPassword"
            prefix-icon="el-icon-lock"
            type="password"
          />
        </el-form-item>
        <el-form-item prop="code" class="form-item-code">
          <el-input
            ref="input"
            placeholder="验证码"
            v-model="ruleForm.code"
            prefix-icon="el-icon-check"
            type="password"
          />
          <div id="v_container" class="codeImg"></div>
        </el-form-item>
        <el-form-item class="btns">
          <el-button
            :plain="true"
            type="primary"
            @click="submitForm('ruleForm')"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import api from "@/api/apiManage";
import { GVerify } from "@/assets/js/verifyCode";
import {setSession,getSession} from '@/auth'
export default {
  // 离开login页面时删除canvas
  beforeRouteLeave(to, from, next) {
    if (this.canvasFlag) {
      this.deleteCanvas();
    }
    next();
  },

  name: "Login",
  data() {
    return {
      ruleForm: {
        userLoginName: "zcc",
        userPassword: "2287996531",
        code: "",
      },
      rules: {
        userLoginName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 15, message: "长度在 2 到 5 个字符", trigger: "blur" },
        ],
        userPassword: [
          { required: true, message: "请输入密码", trigger: "change" },
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 4, max: 4, message: "验证码为4位字符", trigger: "blur" },
        ],
      },
      bannerH: 200,
      BannerImg: [
        { url: require("../assets/img/login-bg1.jpg") },
        { url: require("../assets/img/login-bg2.jpg") },
        { url: require("../assets/img/login-bg3.jpg") },
      ],
      code: null,
      canvasFlag: false,
    };
  },
  created() {
    // console.log(this.$moment.init());
    this.$canvas.init();
    this.$canvas.animate();
    this.canvasFlag = true;
  },
  methods: {

    submitForm(formName) {
      const _this = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.code.validate(this.ruleForm.code)) {
            // this.ruleForm.userPassword=this.$md5(this.ruleForm.userPassword)
            // console.log("用户输入的密码是：" , this.ruleForm.userPassword)
            api.login(this.ruleForm).then((res) => {
              if (res.data.code == 200) {
                const userInfo = res.data.data;
                setSession(res.headers.authorization)
                _this.$store.commit("SET_USERINFO", userInfo);
                console.log(userInfo)
                this.$router.push({ path: "main" });
              } else _this.$message.error("用户不存在或密码错误！");
            });
          } else {
            const _this = this;
            _this.$message.error("验证码错误");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    deleteCanvas() {
      document.getElementById("wall-bg").remove();
      this.canvasFlag = false;
    },
  },
  mounted() {
    this.code = new GVerify("v_container");
  },
};
</script>

<style scoped>
.login_container {
  height: 100%;
  margin-top: -50px;
}

.form-item-code .el-input {
  width: 150px;
}

.codeImg {
  width: 200px;
  height: 5px;
  float: right;
}

.login_box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 450px;
  height: 340px;
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 0 10px 0 rgb(0 33 79 / 11%);
  transform: translate(-50%, -50%);
}

.login_box .avatar_box {
  position: absolute;
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #eee;
}

.login_box .avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>