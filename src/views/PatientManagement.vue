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
                            label="患者卡号"
                            prop="patientId">
                    </el-table-column>
                    <el-table-column
                            label="患者姓名"
                            prop="patientName">
                    </el-table-column>
                    <el-table-column
                            label="性别"
                            prop="gender">
                    </el-table-column>
                    <el-table-column
                            label="手机号"
                            prop="telephone">
                    </el-table-column>
                    <el-table-column
                            label="生日"
                            prop="birthday">
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
                                    @click="patientShortInfo(scope.$index, scope.row)">
                                    病情</el-button>
                            <el-button
                                    size="mini"
                                    type="success"
                                    @click="handleEdit(scope.$index, scope.row)">过往病历</el-button>
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
                        <el-form-item label="患者地址" :label-width="formLabelWidth">
                            <el-input v-model="infoForm.address" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="出生日期" :label-width="formLabelWidth">
                            <el-input v-model="infoForm.birthday" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="患者电话" :label-width="formLabelWidth">
                            <el-input v-model="infoForm.telephone" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="患者单位" :label-width="formLabelWidth">
                            <el-input v-model="infoForm.unit" autocomplete="off" placeholder="请输入患者单位"></el-input>
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
                <!--                            患者简要病情          -->
                <el-dialog :title="currentPatientName +'简要病情'" :visible.sync="dialogFormVisibleShortInfo" width="30%">
                    <el-form :model="shortInfoForm">
                        <el-form-item label="患者卡号" :label-width="formLabelWidth">
                            <el-input v-model="shortInfoForm.patientId" autocomplete="off" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="患者姓名" :label-width="formLabelWidth">
                            <el-input v-model="shortInfoForm.patientName" autocomplete="off" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="患者视力" :label-width="formLabelWidth">
                            <el-col :span="2">左眼</el-col>
                            <el-col :span="9">
                                <el-input v-model="shortInfoForm.eyesightOS" autocomplete="off"></el-input>
                            </el-col>
                            <el-col :span="2">右眼</el-col>
                            <el-col :span="9">
                                <el-input v-model="shortInfoForm.eyesightOD" autocomplete="off"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="诊断病名" :label-width="formLabelWidth">
                            <el-radio-group v-model="shortInfoForm.diagnosis">
                                <el-radio-button label="视力正常"></el-radio-button>
                                <el-radio-button label="普通近视"></el-radio-button>
                                <el-radio-button label="高度近视"></el-radio-button>
                                <el-radio-button label="病理性近视"></el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="家族史" :label-width="formLabelWidth">
                            <el-radio v-model="shortInfoForm.hereditary" :label="false">无</el-radio>
                            <el-radio v-model="shortInfoForm.hereditary" :label="true">有</el-radio>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisibleShortInfo = false">取 消</el-button>
                        <el-button type="primary" @click="submitEditShortInfo('shortInfoForm')">确 定</el-button>
                    </div>
                </el-dialog>
<!--                                            患者过往病历-->
                <el-dialog :title="currentPatientName + '的过往病历'" :visible.sync="dialogFormVisiblePastCase" width="30%">
                    <el-table
                            :data="caseData"
                            style="width: 100%">
                        <el-table-column
                                label="病历号"
                                width="180"
                                prop="id">
                        </el-table-column>
                        <el-table-column
                                label="诊断结论"
                                width="180"
                                prop="diagnosis">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                        size="mini"
                                        type="success"
                                        @click="pastCase(scope.$index, scope.row)">详细病历</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-dialog>
            </el-main>
            <el-footer>爱尔眼科高度近视智能诊断系统(  推荐使用IE9+,Firefox、Chrome 浏览器访问   )</el-footer>
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
                // 当前页用户数据
                dataSelect: [],
                //   患者基本信息
                infoForm: {
                    id: '',
                    patientName: '',
                    patientId: '',
                    gender: '',
                    birthday: '',
                    telephone: '',
                    address: '',
                    unit: '',
                    idcard: '',
                },
                //      患者简要病情
                shortInfoForm: {
                    id: '',
                    patientName: '',
                    patientId: '',
                    diagnosis: '',
                    eyesightOD: '',
                    eyesightOS: '',
                    hereditary: 'false',
                    doctorId: '',
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
            this.getPatientData()
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            //          患者过往病历
            handleEdit(index, row) {
                // console.log(index, row)
                this.currentPatientName = row.patientName
                this.dialogFormVisiblePastCase = true;
                console.log(row.patientId)
                const _this = this
                _this.$axios.get("/caselist/pastCaselist/" + row.patientId, {
                    headers: {
                        "Authorization": _this.$store.getters.getToken
                    }
                }).then(res => {
                    console.log(res)
                    _this.caseData = res.data.data;

                })
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
            //          患者简要病情
            patientShortInfo(index, row) {
                this.currentPatientName = row.patientName
                this.shortInfoForm.id = row.id
                this.shortInfoForm.patientName = row.patientName
                this.shortInfoForm.patientId = row.patientId
                const _this = this
                _this.$axios.get("/patient/shortinfo/" + row.id, {
                    headers: {
                        "Authorization": _this.$store.getters.getToken
                    }
                }).then(res => {
                    if(res.status === 200) {
                        this.dialogFormVisibleShortInfo = true
                        _this.shortInfoForm.diagnosis = res.data.data.diagnosis
                        _this.shortInfoForm.doctorId = res.data.data.doctorId
                        _this.shortInfoForm.eyesightOD = res.data.data.eyesightOD
                        _this.shortInfoForm.eyesightOS = res.data.data.eyesightOS
                        _this.shortInfoForm.hereditary = res.data.data.hereditary
                    }
                })
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
            //          去过往病历详情页
            pastCase(index, row) {
                const _this = this
                _this.$router.push({name: "PostCaseDetail", params: {id: row.id}})
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
            //          编辑患者简要病情
            submitEditShortInfo() {
                this.dialogFormVisibleShortInfo = false
                const _this = this
                console.log(this.infoForm)
                _this.$axios.post('/patient/editshortinfo', _this.shortInfoForm, {
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
            }
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
        font-size: 10px;
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
        height: 850px;
    }

</style>