<template>
    <div>
        <el-header>
            <Header
                    active-index="/NotCompletedCase"></Header>
        </el-header>
        <el-main>
            <!--                            待完善病历表格-->
            <el-table
                    :data="dataSelect.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                    style="width: 100%">
                <el-table-column
                        label="病历号"
                        prop="id">
                </el-table-column>
                <el-table-column
                        label="患者卡号"
                        prop="patientId">
                </el-table-column>
                <el-table-column
                        label="患者姓名"
                        prop="patientName">
                </el-table-column>

<!--                <el-table-column-->
<!--                        label="诊断结论"-->
<!--                        prop="diagnosis">-->
<!--                </el-table-column>-->

                <el-table-column
                        label="确诊时间"
                        prop="checktime">
                </el-table-column>
                <el-table-column
                        width="400 px"
                        align="right">
                    <template slot="header" slot-scope="scope">
                        <el-button
                                style="margin-right: 20px"
                                @click="showIOLRange()">眼轴范围筛选</el-button>
                        <el-select v-model="la" placeholder="检查结果筛选" @change="selectChange()">
                            <el-option label="重置" value="0"></el-option>
                            <el-option label="IOL Master" value="1"></el-option>
                            <el-option label="OCT" value="2"></el-option>
                            <el-option label="超广角" value="3"></el-option>
                        </el-select>
                    </template>
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
                            患者信息</el-button>
                        <el-button
                                size="mini"
                                @click="patientShortInfo(scope.$index, scope.row)">
                            病情</el-button>
                        <el-button
                                size="mini"
                                @click="patientPastCase(scope.$index, scope.row)">
                            过往病历</el-button>
                        <el-button
                                size="mini"
                                type="success"
                                @click="handleEdit(scope.$index, scope.row)">详细病历</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination align='center'
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="currentPage"
                           :page-sizes="[1,5,10,20]"
                           :page-size="pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="dataSelect.length">
            </el-pagination>
            <!--                                患者基本信息          -->
            <el-dialog :title="currentPatientName + '基本信息'" :visible.sync="dialogFormVisible" width="30%">
                <el-form :model="infoForm">
                    <el-form-item label="患者卡号" :label-width="formLabelWidth">
                        <el-input v-model="infoForm.patientId" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="患者姓名" :label-width="formLabelWidth">
                        <el-input v-model="infoForm.patientName" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="患者性别" :label-width="formLabelWidth">
                        <el-radio-group v-model="infoForm.gender" disabled>
                            <el-radio-button label="男性"></el-radio-button>
                            <el-radio-button label="女性"></el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="患者地址" :label-width="formLabelWidth">
                        <el-input v-model="infoForm.address" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="出生日期" :label-width="formLabelWidth">
                        <el-input v-model="infoForm.birthday" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="患者电话" :label-width="formLabelWidth">
                        <el-input v-model="infoForm.telephone" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="患者单位" :label-width="formLabelWidth">
                        <el-input v-model="infoForm.unit" autocomplete="off" placeholder="未填写" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号" :label-width="formLabelWidth">
                        <el-input v-model="infoForm.idcard" autocomplete="off" disabled></el-input>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!--                                患者简要病情          -->
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
            <!--                                患者过往病历-->
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
            <el-dialog title="眼轴长度筛选" :visible.sync="dialogFormVisibleIOL" width="30%">
                <span>选择眼轴长度范围<br></span>
                <span>{{alValue[0]}}-{{alValue[1]}}</span>
                <div class="block">
                    <el-slider
                            v-model="alValue"
                            range
                            show-stops
                            :min="20"
                            :max="38">
                    </el-slider>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="selectIOLRange()">确 定</el-button>
                </span>
            </el-dialog>
        </el-main>
        <el-footer>爱尔眼科慢病管理系统(  推荐使用Edge,Firefox、Chrome 浏览器访问   )</el-footer>
    </div>
</template>

<script>
    import Header from "../components/Header";
    export default {
        name: "NotCompletedCase",
        components: {Header},
        data() {
            return {
                la:'',
                alValue: [24, 28],
                tableData: [],
                //搜索词
                search: '',
                currentPage: 1,
                pageSize: 10,
                // 当前页用户数据
                dataSelect: [],
                formLabelWidth: '100px',
                //      患者基本信息
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
                currentPatientName: '',
                dialogFormVisible: false,
                dialogFormVisibleShortInfo: false,
                dialogFormVisiblePastCase: false,
                dialogFormVisibleIOL: false,
            }
        },
        created() {
            const _this = this
            //          查询未完善病历
            _this.$axios.get("/caselist/caseList", {
                headers: {
                    "Authorization": _this.$store.getters.getToken
                }
            }).then(res => {
                _this.tableData = res.data.data
                _this.dataSelect = _this.tableData
            })
        },
        methods: {
            handleEdit(index, row) {
                const _this = this
                _this.$router.push({name: "CaseDetail", params: {id: row.id}})
                // let routeData = this.$router.resolve({
                //     name: 'CaseDetail',
                //     params: { id: row.id }
                // })
                // window.open(routeData.href, '_blank')
            },
            //      患者基本信息
            patientInfo(index, row) {
                const _this = this
                _this.$axios.get("/patient/patientIndex/" + row.patientId, {
                    headers: {
                        "Authorization": _this.$store.getters.getToken
                    }
                }).then(res => {
                    console.log(res)
                    this.currentPatientName = res.data.data.patientName
                    this.infoForm.patientName = res.data.data.patientName
                    this.infoForm.patientId = row.patientId
                    this.infoForm.gender = res.data.data.gender
                    this.infoForm.birthday = res.data.data.birthday
                    this.infoForm.telephone = res.data.data.telephone
                    this.infoForm.address = res.data.data.address
                    this.infoForm.unit = res.data.data.unit
                    this.infoForm.idcard = res.data.data.idcard
                })
                this.dialogFormVisible = true
            },
            //      患者简要病情
            patientShortInfo(index, row) {
                this.currentPatientName = row.patientName
                this.shortInfoForm.patientName = row.patientName
                this.shortInfoForm.patientId = row.patientId
                const _this = this
                _this.$axios.get("/patient/shortinfoByPid/" + row.patientId, {
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
            //      患者过往病历
            patientPastCase(index, row) {
                this.currentPatientName = row.patientName
                this.dialogFormVisiblePastCase = true
                console.log(row.id)
                const _this = this
                _this.$axios.get("/caselist/pastCaselistByPatientId/" + row.patientId, {
                    headers: {
                        "Authorization": _this.$store.getters.getToken
                    }
                }).then(res => {
                    console.log(res)
                    _this.caseData = res.data.data;

                })
            },
            pastCase(index, row) {
                const _this = this
                _this.$router.push({name: "PostCaseDetail", params: {id: row.id}})
            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.currentPage = 1;
                this.pageSize = val;
            },
            //当前页改变时触发 跳转其他页
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
                this.currentPage = val;
            },
            dataSizeChange() {
                this.dataSelect = this.tableData.filter(data => !this.search
                    || data.id && data.id.toString().includes(this.search.toLowerCase())
                    || data.patientId && data.patientId.toLowerCase().includes(this.search.toLowerCase())
                    || data.patientName && data.patientName.toLowerCase().includes(this.search.toLowerCase())
                    || data.diagnosis && data.diagnosis.toLowerCase().includes(this.search.toLowerCase())
                );
            },
            selectChange() {
                const _this = this
                if(_this.la == 0) {
                    _this.dataSelect = _this.tableData
                } else {
                    _this.$axios.get("/caselist/caseListHave/" + _this.la, {
                        headers: {
                            "Authorization": _this.$store.getters.getToken
                        }
                    }).then(res => {
                        console.log(res)
                        // _this.tableData = res.data.data
                        _this.dataSelect = res.data.data
                    })
                }

            },
            showIOLRange() {
                this.dialogFormVisibleIOL = true;
            },
            selectIOLRange() {
                const _this = this
                _this.$axios.get("/caselist/caseListRange/" + _this.alValue[0] + '/' + _this.alValue[1], {
                    headers: {
                        "Authorization": _this.$store.getters.getToken
                    }
                }).then(res => {
                    console.log(res)
                    _this.dataSelect = res.data.data
                })
                _this.dialogFormVisibleIOL = false
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
    .el-main {
        width: 100%;
        margin-top: 60px;
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        height: 850px;
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
</style>