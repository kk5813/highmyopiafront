<template>
    <div>
        <el-container>
            <el-header>
                <!--        页面头部---Header组件        -->
                <Header
                    active-index="/Main"></Header>
            </el-header>
            <el-main>
<!--                            用户管理表格-->
                <el-table
                        :data="dataSelect.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                        :row-class-name="tableRowClassName"
                        style="width: 100%">
                    <el-table-column
                            label="登录名"
                            prop="userLoginName">
                    </el-table-column>
                    <el-table-column
                            label="用户名"
                            prop="userName">
                    </el-table-column>
                    <el-table-column
                            label="用户状态"
                            prop="userStatus">
                    </el-table-column>
                    <el-table-column
                            label="创建人"
                            prop="creator">
                    </el-table-column>
                    <el-table-column
                            label="创建时间"
                            prop="createTime">
                    </el-table-column>
                    <el-table-column
                            label="修改人"
                            prop="modifier">
                    </el-table-column>
                    <el-table-column
                            label="修改时间"
                            prop="updateTime">
                    </el-table-column>
                    <el-table-column
                            width="400 px"
                            align="right">
                        <template slot="header" slot-scope="scope">
                            <el-input
                                    v-on:input="dataSizeChange()"
                                    v-model="search"
                                    size="medium"
                                    placeholder="输入关键字搜索"/>
                        </template>
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                @click="dialogFormVisible = true"
                                type="primary" plain>添加</el-button>
                            <el-button
                                    size="mini"
                                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="handleDelete(scope.$index, scope.row)">失效</el-button>
                        </template>
                    </el-table-column>
                </el-table>
<!--                                表格分页-->
                <el-pagination align='center'
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :current-page="currentPage"
                               :page-sizes="[1,5,10,20]"
                               :page-size="pageSize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="dataSelect.length">
                </el-pagination>
<!--                添加用户的弹出对话框-->
                <el-dialog title="添加用户" :visible.sync="dialogFormVisible" width="30%">
                    <el-form :model="form">
                        <el-form-item label="用户登录名" :label-width="formLabelWidth">
                            <el-input v-model="form.userLoginName" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="用户密码" :label-width="formLabelWidth">
                            <el-input v-model="form.userPassword" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="用户姓名" :label-width="formLabelWidth">
                            <el-input v-model="form.userName" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="用户角色">
                            <el-radio-group v-model="form.userStatus">
                                <el-radio label="0">系统管理员</el-radio>
                                <el-radio label="1">医生</el-radio>
                                <el-radio label="2">护士</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="submitAddUser('form')">确 定</el-button>
                    </div>
                </el-dialog>
                <!--编辑用户的弹出对话框-->
                <el-dialog title="编辑用户" :visible.sync="dialogEditFormVisible" width="30%">
                    <el-form :model="editForm">
                        <el-form-item label="用户登录名" :label-width="formLabelWidth">
                            <el-input v-model="editForm.userLoginName" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="用户密码" :label-width="formLabelWidth">
                            <el-input v-model="editForm.userPassword" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="用户姓名" :label-width="formLabelWidth">
                            <el-input v-model="editForm.userName" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="用户角色">
                            <el-radio-group v-model="editForm.userStatus">
                                <el-radio label="0">系统管理员</el-radio>
                                <el-radio label="1">医生</el-radio>
                                <el-radio label="2">护士</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogEditFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="submitEditUser('editForm')">确 定</el-button>
                    </div>
                </el-dialog>
            </el-main>
            <el-footer>爱尔眼科高度近视智能诊断系统(  推荐使用IE9+,Firefox、Chrome 浏览器访问   )</el-footer>
        </el-container>
    </div>
</template>

<script>
    /***
     *          表格展示的是用户数据表
     *          tableData是所有的数据
     *          dataSelect是当前页的数据
     *          同时search对应的input输入框的监听事件dataSizeChange（）会改变dataSelect,变为检索后数据
     *
     */
    import Header from "../components/Header";

    export default {
        name: "Main",
        components: {Header},
        data() {
            return {
                // 顶部导航栏默认选中
                activeIndex: '/Main',
                // 编辑和添加用户对话框
                dialogFormVisible: false,
                dialogEditFormVisible: false,
                //添加用户表格
                form: {
                    userName: '',
                    userLoginName: '',
                    userStatus: '',
                },
                //编辑用户表格
                editForm: {
                    userId: '',
                    userName: '',
                    userLoginName: '',
                    userPassword: '',
                    userStatus: '',
                },
                formLabelWidth: '100px',
                //用户数据
                tableData: [],
                //搜索词
                search: '',
                currentPage: 1,
                pageSize: 10,
                // 当前页用户数据
                dataSelect: [],
            }

        },
        created() {
            this.getUserTableData();
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            //编辑功能
            handleEdit(index, row) {
                console.log(index, row)
                const _this = this
                _this.$axios.get('/user/find/' + row.userId, {
                    headers: {
                        "Authorization": _this.$store.getters.getToken
                    }
                }).then(res => {
                    this.editForm.userPassword = res.data.data.userPassword
                })

                this.editForm.userLoginName = row.userLoginName
                this.editForm.userName = row.userName
                this.editForm.userPassword = row.userPassword
                if(row.userStatus === '医生') this.editForm.userStatus = '1'
                else if (row.userStatus === '护士') this.editForm.userStatus = '2'
                else if (row.userStatus === '系统管理员') this.editForm.userStatus = '0'
                this.dialogEditFormVisible = true
            },
            //失效某用户
            handleDelete(index, row) {
                const _this = this
                console.log(row.userId);
                _this.$confirm('您是否要失效用户' + row.userLoginName, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.$axios.get('/user/invalid/' + row.userId, {
                        headers: {
                            "Authorization": _this.$store.getters.getToken
                        }
                    }).then(res => {
                        console.log(res)
                        if(res.data.code === 200) {
                            _this.$message({
                                type: 'success',
                                message: '成功失效用户!'
                            });
                        } else {
                            _this.$message.error('操作失败');
                        }
                    })
                }).catch(() => {
                    _this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            //每页条数改变时触发 选择一页显示多少行
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.currentPage = 1;
                this.pageSize = val;
            },
            //当前页改变时触发 跳转其他页
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentPage = val;
            },
            //          搜索功能
            dataSizeChange() {

                this.dataSelect = this.tableData.filter(data => !this.search
                    || data.userName.toLowerCase().includes(this.search.toLowerCase())
                    || data.userLoginName.toLowerCase().includes(this.search.toLowerCase())
                );
                console.log(this.dataSelect)
            },
            //当前登录用户标绿
            tableRowClassName({row, rowIndex}) {
                if(row.userLoginName === this.$store.getters.getUser.userLoginName) {
                    return 'success-row';
                }
                else return '';
            },
            //      获得数据
            getUserTableData() {
                const _this = this
                this.$axios.get('/user/list', {
                    headers: {
                        "Authorization": _this.$store.getters.getToken
                    }
                }).then(res => {
                    _this.tableData = res.data.data;
                    _this.tableData.forEach(function(element) {
                        //console.log(element)
                        if(element.userStatus === 0) {
                            element.userStatus = '系统管理员'
                        } else if (element.userStatus === 1){
                            element.userStatus = '医生'
                        } else if (element.userStatus === 2){
                            element.userStatus = '护士'
                        } else {
                            element.userStatus = '无效用户'
                        }
                    });
                    _this.dataSelect = this.tableData
                })
            },
            //      添加用户
            submitAddUser(form) {
                const _this = this
                this.$axios.post('/user/add', this.form, {
                    headers: {
                        "Authorization": _this.$store.getters.getToken
                    }
                }).then(res => {
                    console.log(res)
                    if(res.data.code === 200) {
                        this.$message({
                            message: '成功创建用户' + _this.form.userName,
                            type: 'success'
                        });
                    } else {
                        this.$message.error('创建失败');
                    }
                    _this.dialogFormVisible = false;
                })
            },
            //      编辑用户
            submitEditUser(editForm) {
                const _this = this
                console.log(_this.editForm)
                _this.tableData.forEach(function(element) {
                    console.log(element.userLoginName + '/' + _this.editForm.userLoginName)
                    if(element.userLoginName === _this.editForm.userLoginName) {
                        _this.editForm.userId = element.userId;
                    }
                });
                _this.dialogEditFormVisible = false
                this.$axios.post('/user/edit', _this.editForm, {
                    headers: {
                        "Authorization": _this.$store.getters.getToken
                    }
                }).then(res => {
                    console.log(res)
                    if(res.data.code === 200) {
                        this.$message({
                            message: '编辑成功',
                            type: 'success'
                        });
                    } else {
                        this.$message.error('编辑失败');
                    }
                    _this.dialogFormVisible = false;
                })
            }
        }
    }
</script>

<style scoped>
    .el-header {
        width: 100%;
        position:absolute;
        left: 0;
        padding: 0;
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 65px;
        top: 0;
    }
    .el-footer {
        bottom: 0;
        width: 100%;
        position:fixed;
        left: 0;
        padding: 0;
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 65px;
        font-size: 10px;
    }
    .el-main {
        width: 100%;
        margin-top: 60px;
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        height: 850px;
    }
    .el-table /deep/ .success-row {
        background: #f0f9eb;
    }
</style>