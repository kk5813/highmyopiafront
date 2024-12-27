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
                            <el-input v-model="infoForm.patientName" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="患者性别" :label-width="formLabelWidth">
                            <el-radio-group v-model="infoForm.sex">
                                <el-radio-button :label="1">男</el-radio-button>
                                <el-radio-button :label="0">女</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="出生日期" :label-width="formLabelWidth">
                            <el-input v-model="infoForm.birthday" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="患者电话" :label-width="formLabelWidth">
                            <el-input v-model="infoForm.idNumber" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="身份证号" :label-width="formLabelWidth">
                            <el-input v-model="infoForm.phone" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-button style="display: flex;margin-left: 100px;" type="primary" @click="editPatientInfo()" round>确认修改</el-button>
                </el-tab-pane>
                <el-tab-pane label="门诊病历" name="second">
                    <el-form :model="caseData">
                        <el-form-item label="左眼视力" :label-width="formLabelWidth">
                            <el-row :gutter="20">
                                <el-col :span="8">
                                    <el-input v-model="caseData.eyesightOS" autocomplete="off" style="width: 100px;"></el-input>
                                </el-col >
                                <el-col style="color: #606266;" class="line" :span="7">右眼视力</el-col>
                                <el-col :span="8">
                                    <el-input v-model="caseData.eyesightOD" autocomplete="off" style="width: 100px;"></el-input>
                                </el-col>
                            </el-row>
                        </el-form-item>

                        <el-form-item label="左眼眼压" :label-width="formLabelWidth">
                            <el-row :gutter="20">
                                <el-col :span="8">
                                    <el-input v-model="caseData.iopod" autocomplete="off" style="width: 100px;"></el-input>
                                </el-col >
                                <el-col style="color: #606266;" class="line" :span="7">右眼眼压</el-col>
                                <el-col :span="8">
                                    <el-input v-model="caseData.iopos" autocomplete="off" style="width: 100px;"></el-input>
                                </el-col>
                            </el-row>
                        </el-form-item>
<!--                        <el-form-item label="主述" :label-width="formLabelWidth">
                            <el-input v-model="caseData.mainAppeal" autocomplete="off" style="width: 500px;"></el-input>
                        </el-form-item>
                        <el-form-item label="既往史" :label-width="formLabelWidth">
                            <el-input v-model="caseData.pastHistory" autocomplete="off" style="width: 500px;"></el-input>
                        </el-form-item>
                        <el-form-item label="现病史" :label-width="formLabelWidth">
                            <el-input v-model="caseData.presentIllness" autocomplete="off" style="width: 500px;"></el-input>
                        </el-form-item>
                        <el-form-item label="过敏史" :label-width="formLabelWidth">
                            <el-input v-model="caseData.allergy" autocomplete="off" style="width: 500px;"></el-input>
                        </el-form-item>-->
                      <el-form-item label="主述" :label-width="formLabelWidth">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 1 }"
                            v-model="caseData.mainAppeal"
                            autocomplete="off"
                            style="width: 500px;"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="既往史" :label-width="formLabelWidth">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 1 }"
                            v-model="caseData.pastHistory"
                            autocomplete="off"
                            style="width: 500px;"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="现病史" :label-width="formLabelWidth">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 1 }"
                            v-model="caseData.presentIllness"
                            autocomplete="off"
                            style="width: 500px;"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="过敏史" :label-width="formLabelWidth">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 1 }"
                            v-model="caseData.allergy"
                            autocomplete="off"
                            style="width: 500px;"
                        ></el-input>
                      </el-form-item>
<!--                        <el-form-item label="左眼专科检查" :label-width="formLabelWidth">-->
<!--                            <el-input v-model="caseData.specialOs" autocomplete="off" style="width: 500px;" type="textarea" :rows="5"></el-input>-->
<!--                        </el-form-item>-->
<!--                        <el-form-item label="右眼专科检查" :label-width="formLabelWidth">-->
<!--                            <el-input v-model="caseData.specialOd" autocomplete="off" style="width: 500px;" type="textarea" :rows="5"></el-input>-->
<!--                        </el-form-item>-->
<!--                        <el-form-item label="体格检查" :label-width="formLabelWidth">-->
<!--                            <el-input v-model="caseData.physicalExam" autocomplete="off" style="width: 500px;" type="textarea" :rows="5"></el-input>-->
<!--                        </el-form-item>-->
                      <el-form-item label="左眼专科检查" :label-width="formLabelWidth">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 1 }"
                            v-model="caseData.specialOs"
                            autocomplete="off"
                            style="width: 100%;"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="右眼专科检查" :label-width="formLabelWidth">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 1 }"
                            v-model="caseData.specialOd"
                            autocomplete="off"
                            style="width: 100%;"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="体格检查" :label-width="formLabelWidth">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 1 }"
                            v-model="caseData.physicalExam"
                            autocomplete="off"
                            style="width: 100%;"
                        ></el-input>
                      </el-form-item>
                    </el-form>
                    <el-button style="display: flex;margin-left: 100px;" type="primary" @click="editPatientCase()" round>确认修改</el-button>
                </el-tab-pane>
                <el-tab-pane label="IOL Master" name="third">
                    <!-- <el-form :model="caseData">
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
                    </el-form> -->
                </el-tab-pane>
                <el-tab-pane label="检验结果" name="labTest">
                    <el-descriptions :model="labData" style="width: 1000px; height:100px;" title="" :column="1" border>
                        <el-descriptions-item label="检验结果ID">{{labData.id}}</el-descriptions-item>
                        <el-descriptions-item label="患者姓名">{{labData.patientName}}</el-descriptions-item>
                        <el-descriptions-item label="是否危急">{{labData.isUrgent}}</el-descriptions-item>
                        <el-descriptions-item label="检验报告名称">{{labData.reportName}}</el-descriptions-item>
                        <el-descriptions-item label="检验项目">{{labData.labItemName}}</el-descriptions-item>
                        <el-descriptions-item label="参考范围">{{labData.refRange}}</el-descriptions-item>
                        <el-descriptions-item label="实际值">{{labData.labFinalValue}}</el-descriptions-item>
                        <el-descriptions-item label="检验结果单位名称">{{labData.labResultUnitName}}</el-descriptions-item>
                        <el-descriptions-item label="审核日期">{{labData.auditDate}}</el-descriptions-item>
                    </el-descriptions>
                </el-tab-pane>
                <el-tab-pane label="扫描激光眼底检查" name="fourth">
                </el-tab-pane>
                <el-tab-pane label="光学相干断层OCT" name="fifth">
                </el-tab-pane>
                <el-tab-pane label="欧宝图" name="sixth">
                </el-tab-pane>
                <el-tab-pane label="诊疗意见" name="advice">
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
                </el-tab-pane>
            </el-tabs>
             <!-- v-for="item in iolmaster" -->
            <div v-show="activeName=='third'">
                <pdf
                        class="case-pdf"
                        style="width: 600px; height: 700px; margin-top: 0; margin-left: 500px;"
                        ref="pdf"
                        :src="pdfUrl">
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
        <el-footer>爱尔眼科慢病管理系统(  推荐使用IE9+,Firefox、Chrome 浏览器访问   )</el-footer>
    </div>
</template>

<script>
    import Header from "../components/Header"
    import pdf from 'vue-pdf'
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    export default {
        name: "test",
        components: {Header, pdf, ElImageViewer},
        data() {
            return {
                showViewer: false,
                activeName: 'first',
                id: '',
                caseData: {
                    patientId: 1,
                    patientName: "艾弗森",
                    mainAppeal: "候除理说本些理七。",
                    pastHistory: "及改流目飞。",
                    presentIllness: "大则段马。",
                    allergy: "天日然。",
                    specialOs: "转步类以需感先在。",
                    specialOd: "总员题据识式认。",
                    visitNumber: "业成角花。",
                    physicalExam: "统总山。",
                    dispose: "低交如九年。"
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
                    id: '1796786711460069400',
                    patientName: '杨奇韵',
                    patientId: '1796786711460069400',
                    sex: '1',
                    birthday: '1919-01-01',
                    phone: '08820',
                    idNumber: '298452984941879',
                },
                formLabelWidth: '120px',
                iolmaster: '',
                opt: [],
                oct: [],
                optimg: '',
                labData: {
                    "patientName": "杨奇韵",
                    "isUrgent": 0,
                    "labItemName": "乙肝E抗体",
                    "reportName": "乙肝五项（定量分析法）+丙肝抗体发光法+HIV抗体检查+梅毒抗体发光法",
                    "patientId": 1796786711460069400,
                    "labItemCode": "Anti-HBe",
                    "refRange": "0-0.5",
                    "labResultSignName": null,
                    "labFinalValue": "0.01",
                    "visitingNo": "MZ202406010634",
                    "sexName": "男",
                    "patientBrithday": "1986-03-27 00:00:00",
                    "labResultUnitName": "S/CO",
                    "id": 1799240480341352400,
                    "auditDate": "2024-08-08 10:54:18"
                },
                pdfUrl: '/img/PDF/IOL-Haigis_408.pdf',
            }
        },
        methods: {
            handleClick(tab, event) {
                // console.log(tab, event);
            },
            editPatientInfo(){
                console.log(this.infoForm)
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
        },
        created() {
            window.addEventListener("resize", this.getHeight);
            this.getHeight();
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
        
    }
</script>


<style scoped>

.el-header {
        width: 100%;
        position:fixed;
        z-index: 1000;
        left: 0;
        padding: 0;
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 65px;
        top: 0;
    }
    .el-main {
      height: calc(100vh - 60px);
      width: 100%;
      margin-top: 50px;
      background-color: #E9EEF3;
      color: #333;
      padding-bottom: 100px;
      text-align: center;
      overflow: auto; /* 允许内容滚动 */
    }
    .el-footer {
        bottom: 0;
        width: 100%;
        position:fixed;
        left: 0;
        padding: 10px 0;
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 30px;
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