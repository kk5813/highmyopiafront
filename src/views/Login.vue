<template>
    <div class="main">
        <div class="log-content">
            <h1>欢迎登录高度近视智能诊断系统</h1>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-position="left">
                <el-form-item label="用户名" prop="userLoginName">
                    <el-input v-model="ruleForm.userLoginName"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="userPassword">
                    <el-input type="password" v-model="ruleForm.userPassword"></el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="code" class="form-item-code">
                    <el-input v-model="ruleForm.code"></el-input>
                    <div id="v_container"></div>
                </el-form-item>
                <el-form-item class="form-item-button">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-carousel indicator-position="none" trigger="click" arrow="always" :height="bannerH + 'px'">
            <el-carousel-item v-for="img in BannerImg" :key="img.url">
                <img :src="img.url" alt="">
            </el-carousel-item>
        </el-carousel>

    </div>
</template>

<script>
    import {GVerify} from '@/assets/js/verifyCode'
    export default {
        name: "Login",
        data() {
            return {
                ruleForm: {
                    userLoginName: 'zcc',
                    userPassword: '2287996531',
                    code: ''
                },
                rules: {
                    userLoginName: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 2, max: 15, message: '长度在 2 到 5 个字符', trigger: 'blur' }
                    ],
                    userPassword: [
                        { required: true, message: '请输入密码', trigger: 'change' }
                    ],
                    code: [
                        { required: true, message: '请输入验证码', trigger: 'blur' },
                        { min: 4, max: 4, message: '验证码为4位字符', trigger: 'blur' }
                    ]
                },
                bannerH:200,
                BannerImg: [
                    { url: require("../assets/img/login-bg1.jpg")},
                    { url: require("../assets/img/login-bg2.jpg")},
                    { url: require("../assets/img/login-bg3.jpg")}
                ],
                code: null
            }
        },
        methods:{
            setBannerH(){
                this.bannerH = document.documentElement.clientHeight
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.code.validate(this.ruleForm.code)) {
                            const _this = this;
                            this.ruleForm.userPassword=this.$md5(this.ruleForm.userPassword)
                            this.$axios.post('/login', this.ruleForm).then(res => {
                                console.log(res)
                                if(res.data.code === 400){
                                  _this.$message.error('用户名或密码错误');
                                  this.ruleForm.userPassword = "";
                                  this.ruleForm.code = "";
                                }else {
                                  const jwt = res.headers['authorization'];
                                  const userInfo = res.data.data;

                                  // 数据共享至整个前端项目
                                  _this.$store.commit("SET_TOKEN", jwt);
                                  _this.$store.commit("SET_USERINFO", userInfo);

                                  _this.$router.push("main");
                                }
                            })
                        } else {
                            const _this = this;
                            _this.$message.error('验证码错误');
                        }

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        },
        mounted(){
            this.setBannerH()
            window.addEventListener('resize', () => {
                this.setBannerH()
            }, false)
            this.code = new GVerify('v_container')
        },
    }
</script>

<style scoped>
  .el-carousel {
    width: 100%;
    max-width: 100%;
    position:absolute;
    left: 0!important;
    top: 0!important;
  }
  .el-carousel__item img {
    width: 100%;
    height: inherit;
  }
  .log-content {
    z-index: 10;
    position: relative;
    width: 450px;
    height: 300px;
    margin: 300px auto;
    background:rgba(0, 0, 0, .3)
  }
  .log-content h1 {
    line-height: 50px;
    font-size: 24px;
    text-align: center;
    color: #eeeeee;
  }
  /deep/ .el-form-item__label  {
    color: #eeeeee;
  }
  .el-input {
    margin-left: -30px;
  }
    .form-item-code {
  }
  #v_container {
    width: auto;
    height: auto;
    display: inline-flex;
    position: absolute;
    left: 150px;
    top: -5px;
  }
  .form-item-code .el-input{
    width: 150px;
  }
  .el-button{
    margin-left: 80px;
  }
</style>