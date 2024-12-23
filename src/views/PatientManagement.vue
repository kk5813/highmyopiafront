<template>
    <div>
        <el-container>
            <el-header>
                <Header
                    active-index="/patientmanagement"></Header>
            </el-header>
            <el-main>
                <!--                            患者档案表格-->
                <el-table
                        :data="dataSelect.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                        style="width: 100%">
                    <el-table-column
                            label="就诊号"
                            prop="visitNumber">
                    </el-table-column>
                    <el-table-column
                            label="患者姓名"
                            prop="patientName">
                    </el-table-column>
                    <el-table-column
                            label="年龄"
                            prop="age">
                    </el-table-column>
                    <el-table-column
                            label="诊断"
                            prop="diagName">
                    </el-table-column>
                    <el-table-column
                            label="诊断时间"
                            prop="diagTime">
                    </el-table-column>
                    <el-table-column
                            label="眼别"
                            prop="siteName">
                    </el-table-column>
                    <el-table-column
                            label="科室"
                            prop="deptName">
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
                        <template slot-scope="scope" class="table-operate">
                            <el-button
                                    size="mini"
                                    @click="patientInfo(scope.$index, scope.row)"
                                    type="primary" plain>
                                    基本信息</el-button>
                            <el-button
                                    size="mini"
                                    type="success"
                                    @click="toCaseDetail">详细病历</el-button>
                        </template>
                    </el-table-column>
                </el-table>
<!--                                            表格分页-->
                <el-pagination align='center'
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :current-page="currentPage"
                               :page-sizes="[1,5,10,20]"
                               :page-size="pageSize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="dataSelect.length">
                </el-pagination>
<!--                                            患者信息编辑-->
                <el-dialog :title="currentPatientName + '基本信息'" :visible.sync="dialogFormVisible" width="30%">
                    <el-form :model="infoForm">
                        <el-form-item label="患者卡号" :label-width="formLabelWidth">
                            <el-input v-model="infoForm.patientId" autocomplete="off" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="患者姓名" :label-width="formLabelWidth">
                            <el-input v-model="infoForm.patientName" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="患者性别" :label-width="formLabelWidth">
                            <el-radio-group v-model="infoForm.gender">
                                <el-radio-button label="男性"></el-radio-button>
                                <el-radio-button label="女性"></el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="出生日期" :label-width="formLabelWidth">
                            <el-input v-model="infoForm.birthday" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="患者电话" :label-width="formLabelWidth">
                            <el-input v-model="infoForm.telephone" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="身份证号" :label-width="formLabelWidth">
                            <el-input v-model="infoForm.idcard" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="submitEditPatient('form')">确 定</el-button>
                    </div>
                </el-dialog>
            </el-main>
            <el-footer>爱尔眼科慢病管理系统(  推荐使用IE9+,Firefox、Chrome 浏览器访问   )</el-footer>
        </el-container>
    </div>
</template>

<script>
    import Header from "../components/Header";
    export default {
        name: "PatientManagement",
        components: {Header},
        inject: ['reload'],
        data() {
            return {
                formLabelWidth: '100px',
                //用户数据
                tableData: [],
                //搜索词
                search: '',
                currentPage: 1,
                pageSize: 10,
                
                dataSelect: [{
                        visitNumber: 'MZ202405210003',
                        patientName: '周印',
                        age: '53',
                        diagName: '干眼综合征',
                        diagTime: '2024-05-21 14:25:29',
                        siteName: '双眼',
                        deptName: '白内障科',
                    },
                    {
                        visitNumber: 'MZ202405210003',
                        patientName: '周印2',
                        age: '53',
                        diagName: '干眼综合征',
                        diagTime: '2024-05-21 14:25:29',
                        siteName: '双眼',
                        deptName: '白内障科',
                    },
                    {
                        visitNumber: 'MZ202405210003',
                        patientName: '周印3',
                        age: '53',
                        diagName: '干眼综合征',
                        diagTime: '2024-05-21 14:25:29',
                        siteName: '双眼',
                        deptName: '白内障科',
                    },
                    ],
                //   患者基本信息
                infoForm: {
                    id: '123',
                    patientName: '123',
                    patientId: '123',
                    gender: '123',
                    birthday: '123',
                    telephone: '123',
                    address: '123',
                    unit: '123',
                    idcard: '123',
                },
                //      患者简要病情
                shortInfoForm: {
                    id: '123',
                    patientName: '123',
                    patientId: '123',
                    diagnosis: '123',
                    eyesightOD: '123',
                    eyesightOS: '123',
                    hereditary: 'false',
                    doctorId: '123',
                },
                //      患者过往病历
                caseData: [{
                }],
                dialogFormVisible: false,
                dialogFormVisibleShortInfo: false,
                dialogFormVisiblePastCase: false,
                currentPatientName: ''
            }
        },
        created() {
            // this.getPatientData()
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            toCaseDetail(){
                this.$router.push({name: "PostCaseDetail", params: {id: 123}})
            },
            //          患者基本信息
            patientInfo(index, row) {
                this.currentPatientName = row.patientName
                this.infoForm.id = row.id;
                this.infoForm.patientName = row.patientName.substring(0,1) + row.patientName.substring(2,3)
                this.infoForm.patientId = row.patientId
                this.infoForm.gender = row.gender
                this.infoForm.birthday = row.birthday
                this.infoForm.telephone = row.telephone
                this.infoForm.address = row.address
                this.infoForm.unit = row.unit
                this.infoForm.idcard = row.idcard
                this.dialogFormVisible = true
            },
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
            //          页面加载，获取数据
            getPatientData() {
                const _this = this
                this.$axios.get('/patient/list', {
                    headers: {
                        "Authorization": _this.$store.getters.getToken
                    }
                }).then(res => {
                    _this.tableData = res.data.data;
                    _this.dataSelect = this.tableData
                })
            },
            dataSizeChange() {
                this.dataSelect = this.tableData.filter(data => !this.search
                    || data.patientId && data.patientId.toLowerCase().includes(this.search.toLowerCase())
                    || data.patientName && data.patientName.toLowerCase().includes(this.search.toLowerCase())
                    || data.telephone && data.telephone.toLowerCase().includes(this.search.toLowerCase())
                );
            },
            //          编辑患者基本信息
            submitEditPatient() {
                this.dialogFormVisible = false
                const _this = this
                console.log(this.infoForm)
                _this.$axios.post('/patient/edit', _this.infoForm, {
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
                        this.reload()
                    } else {
                        this.$message.error('编辑失败');
                    }
                })
            },
        }
    }
</script>

<style scoped>
    .el-header {
  width: 100%;
  position: fixed;
  z-index: 1000;
  left: 0;
  padding: 0;
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 65px;
  top: 0;
}

.el-footer {
  bottom: 0;
  width: 100%;
  position: fixed;
  left: 0;
  padding: 0;
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 65px;
  font-size: 10px;
}
.el-main {
  /* display: flex(center, center, row); */
  height: calc(100vh - 60px - 65px);
  width: 100%;
  margin-top: 50px;
  background-color: #e9eef3;
  color: #333;

  text-align: center;
  /* height: 1000px; */
  /* overflow: hidden; */
  overflow: auto;
}

</style>