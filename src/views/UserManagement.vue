<template>
    <div>
        <el-container>
            <el-header>
                <el-menu
                        router
                        :default-active="activeIndex"
                        class="el-menu-demo"
                        mode="horizontal"
                        @select="handleSelect"
                        background-color="#0099cc"
                        text-color="#fff"
                        active-text-color="#ffd04b">
                    <span>高度近视智能诊断系统</span>
                    <el-menu-item index="/usermanagement"><i class="el-icon-user"></i>用户管理</el-menu-item>
                    <el-menu-item index="/patientmanagement"><i class="el-icon-folder"></i>患者档案</el-menu-item>
                    <el-menu-item index="/followupvisit"><i class="el-icon-phone-outline"></i>随访管理</el-menu-item>
                    <el-menu-item index="/notcompletedcase">
                        <!--                        <a href="#" target="_blank">-->
                        <i class="el-icon-document"></i>待完善病历
                        <!--                        </a>-->
                    </el-menu-item>
                    <el-menu-item index="/completedcase">
                        <!--                        <a href="#" target="_blank">-->
                        <i class="el-icon-document-checked"></i>已完善病历
                        <!--                        </a>-->
                    </el-menu-item>
                    <div class="menu-right">
                        <el-button type="primary" icon="el-icon-edit">我的</el-button>
                        <el-button type="primary" icon="el-icon-lock">锁屏</el-button>
                        <el-button type="primary" icon="el-icon-close">退出</el-button>
                    </div>

                </el-menu>
            </el-header>
            <el-main>
                Main
            </el-main>
            <el-footer>Footer</el-footer>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "UserManagement",
        data() {
            return {
                activeIndex: '/usermanagent'
            }
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            getUserTableData() {
                const _this = this
                this.$axios.get('/user/list', {
                    headers: {
                        "Authorization": _this.$store.getters.getToken
                    }
                }).then(res => {
                    console.log(res)

                })
            }
        },
        created() {
        }
    }
</script>

<style scoped>
    .el-header, .el-footer {
        width: 100%;
        position:fixed;
        left: 0;
        padding: 0;
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 65px;
    }
    .el-footer {
        bottom: 0;
    }
    .el-header {
        top: 0;
    }
    .el-main {
        width: 100%;
        margin-top: 60px;
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        height: 300px;
    }
    .el-menu--horizontal>.el-menu-item {
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
</style>