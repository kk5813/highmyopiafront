<template>
    <div>
        <el-header>
            <Header
                active-index=""></Header>
        </el-header>
        <el-main>
            <el-page-header @back="goBack" :content="caseData.patientName + '的病历详情'">
            </el-page-header>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="患者信息" name="first">
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
                </el-tab-pane>
                <el-tab-pane label="检查项目" name="second">
                    <el-form :model="caseData">
                        <el-form-item label="左眼视力" :label-width="formLabelWidth">
                            <el-row :gutter="20">
                                <el-col :span="8">
                                    <el-input v-model="caseData.eyesightOS" autocomplete="off" style="width: 100px;" disabled></el-input>
                                </el-col >
                                <el-col class="line" :span="7">右眼视力</el-col>
                                <el-col :span="8">
                                    <el-input v-model="caseData.eyesightOD" autocomplete="off" style="width: 100px;" disabled></el-input>
                                </el-col>
                            </el-row>
                        </el-form-item>

                        <el-form-item label="左眼眼压" :label-width="formLabelWidth">
                            <el-row :gutter="20">
                                <el-col :span="8">
                                    <el-input v-model="caseData.iopod" autocomplete="off" style="width: 100px;" disabled></el-input>
                                </el-col >
                                <el-col class="line" :span="7">右眼眼压</el-col>
                                <el-col :span="8">
                                    <el-input v-model="caseData.iopos" autocomplete="off" style="width: 100px;" disabled></el-input>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="现病史" :label-width="formLabelWidth">
                            <el-input v-model="caseData.retCAMOS" autocomplete="off" style="width: 500px;" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="既往史" :label-width="formLabelWidth">
                            <el-input v-model="caseData.retCAMresult" autocomplete="off" style="width: 500px;" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="体格检查" :label-width="formLabelWidth">
                            <el-input v-model="caseData.retCAMremarks" autocomplete="off" style="width: 500px;" type="textarea" :rows="5" disabled></el-input>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="IOL Master" name="third">
                    <el-form :model="caseData">
                        <el-form-item label="左眼眼轴" :label-width="formLabelWidth">
                            <el-row :gutter="20">
                                <el-col :span="8">
                                    <el-input v-model="caseData.alos" autocomplete="off" style="width: 100px;"></el-input>
                                </el-col >
                                <el-col class="line" :span="7">右眼眼轴</el-col>
                                <el-col :span="8">
                                    <el-input v-model="caseData.alod" autocomplete="off" style="width: 100px;"></el-input>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-form>
            </el-tab-pane>
                <el-tab-pane label="扫描激光眼底检查" name="fourth">
                </el-tab-pane>
                <el-tab-pane label="光学相干断层OCT" name="fifth">
                </el-tab-pane>
                <el-tab-pane label="欧宝图" name="sixth">
                </el-tab-pane>
            </el-tabs>
            <el-form class="diagnosis-result">
                <el-form-item label="诊断结论">
                    <el-input v-model="caseData.diagnosis" disabled></el-input>
                </el-form-item>
                <el-form-item label="治疗建议" placeholder="暂无">
                    <el-input v-model="caseData.recommend" disabled></el-input>
                </el-form-item>
                <el-form-item label="就诊时间">
                    {{caseData.checktime}}
                </el-form-item>
                <el-form-item label="就诊医生">
                    <el-select v-model="value" filterable placeholder="暂无" disabled>
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="复诊计划">
                    <el-select v-model="caseData.plan" placeholder="暂无" disabled>
                        <el-option label="一周" value="7"></el-option>
                        <el-option label="两周" value="14"></el-option>
                        <el-option label="一月" value="30"></el-option>
                        <el-option label="三月" value="90"></el-option>
                        <el-option label="半年" value="180"></el-option>
                        <el-option label="一年" value="365"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div v-show="activeName=='third'" v-for="item in iolmaster">
                <pdf
                        class="case-pdf"
                        style="width: 900px; height: 100%; margin-top: -480px; margin-left: 500px;"
                        ref="pdf"
                        :src="item.localpath">
                </pdf>
            </div>
            <div class="opt-img">
                <div v-show="activeName=='fourth'" v-for="item in opt">
                    <div @click="onPreview(item)" v-if="item.type ==='JPG'">
                        <img
                                class="case-img"
                                :src="item.localpath" alt="">
                    </div>
                </div>
            </div>
            <el-image-viewer
                    v-if="showViewer"
                    :on-close="closeViewer"
                    :url-list="[optimg]" />
            <div v-show="activeName=='fifth'" v-for="item in oct">
                <pdf
                        style="width: 900px; height: 120%; margin-top: 0px; margin-left: 500px;"
                        ref="pdf"
                        :src="item.localpath">
                </pdf>
            </div>
            <div v-show="activeName=='sixth'" v-for="item in opt">
                <pdf
                        style="width: 900px; height: 120%; margin-top: 0px; margin-left: 500px;"
                        ref="pdf"
                        :src="item.localpath">
                </pdf>
            </div>
        </el-main>
        <el-footer>爱尔眼科高度近视智能诊断系统(  推荐使用IE9+,Firefox、Chrome 浏览器访问   )</el-footer>
    </div>
</template>

<script>
    import Header from "../components/Header"
    import pdf from 'vue-pdf'
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    export default {
        name: "PostCaseDetail",
        components: {Header, pdf, ElImageViewer},
        data() {
            return {
                showViewer: false,
                activeName: 'first',
                id: '',
                caseData: {
                    diagnosis: '',
                    recommend: '',
                    checktime: '',
                    plan: '',
                    iolmaster: ''
                },
                options: [{
                    value: '选项1',
                    label: '秦小林'
                }, {
                    value: '选项2',
                    label: '胡建斌'
                }, {
                    value: '选项3',
                    label: '王杰'
                }],
                value: '',
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
                formLabelWidth: '120px',
                iolmaster: '',
                opt: [],
                oct: [],
                optimg: ''
            }
        },
        created() {
            this.id = this.$route.params.id
            const _this = this
            _this.$axios.get("/caselist/pastCase/" + _this.id, {
                headers: {
                    "Authorization": _this.$store.getters.getToken
                }
            }).then(res => {
                // console.log(res.data.data)
                _this.caseData = res.data.data;
                //      患者基本信息
                _this.$axios.get("/patient/patientIndex/" + res.data.data.patientId, {
                    headers: {
                        "Authorization": _this.$store.getters.getToken
                    }
                }).then(res1 => {
                    _this.infoForm = res1.data.data
                })

                _this.$axios.get("/examdetail/getIOLByCaseId/" + _this.id, {
                    headers: {
                        "Authorization": _this.$store.getters.getToken
                    }
                }).then(res2 => {
                    console.log(res2)
                    _this.iolmaster = res2.data.data
                    console.log(_this.iolmaster)
                })

                _this.$axios.get("/examdetail/getOPTByCaseId/" + _this.id, {
                    headers: {
                        "Authorization": _this.$store.getters.getToken
                    }
                }).then(res3 => {
                    console.log(res3)
                    _this.opt = res3.data.data
                    // console.log(_this.opt)
                })
                _this.$axios.get("/examdetail/getOCTByCaseId/" + _this.id, {
                    headers: {
                        "Authorization": _this.$store.getters.getToken
                    }
                }).then(res4 => {
                    console.log(res4)
                    _this.oct = res4.data.data
                    // console.log(_this.oct)
                })
            })

        },
        methods: {
            handleClick(tab, event) {
                // console.log(tab, event);
            },
            goBack() {
                this.$router.go(-1);
            },
            onPreview(item) {
                this.optimg = item.localpath
                console.log(item.localpath)
                this.showViewer = true
            },
            // 关闭查看器
            closeViewer() {
                this.showViewer = false
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
        height: 840px;
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
    .el-form {
        width: 400px;
    }
    .el-main .el-form .el-form-item .el-input {
        width: 210px;
    }
    .el-page-header {
        margin-bottom: 20px;
    }
    .el-tab-pane {
        font-size: 24px;
    }
    .case-img {
        /*width: 80%;*/
        /*height: 100%;*/
        margin-top: 25px;
        margin-left: 20px;

    }
    .opt-img {
        width: 1000px;
        display: flex;
        flex-direction: row;
        margin-top: -350px;
        margin-left: 400px;
        flex-wrap: wrap;
        /*justify-content: flex-start;*/
    }
    .case-img{
        width: 200px;
    }
</style>