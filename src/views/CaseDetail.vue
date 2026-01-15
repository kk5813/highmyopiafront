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
                                <el-input v-model="caseData.eyesightOS" autocomplete="off" style="width: 100px;"></el-input>
                            </el-col >
                            <el-col class="line" :span="7">右眼视力</el-col>
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
                            <el-col class="line" :span="7">右眼眼压</el-col>
                            <el-col :span="8">
                                <el-input v-model="caseData.iopos" autocomplete="off" style="width: 100px;"></el-input>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="现病史" :label-width="formLabelWidth">
                        <el-input v-model="caseData.retCAMOS" autocomplete="off" style="width: 500px;"></el-input>
                    </el-form-item>
                    <el-form-item label="既往史" :label-width="formLabelWidth">
                        <el-input v-model="caseData.retCAMresult" autocomplete="off" style="width: 500px;"></el-input>
                    </el-form-item>
                    <el-form-item label="体格检查" :label-width="formLabelWidth">
                        <el-input v-model="caseData.retCAMremarks" autocomplete="off" style="width: 500px;" type="textarea" :rows="5"></el-input>
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
                    <el-input v-model="caseData.diagnosis"></el-input>
                </el-form-item>
                <el-form-item label="治疗建议" placeholder="暂无">
                    <el-input v-model="caseData.recommend"></el-input>
                </el-form-item>
                <el-form-item label="就诊时间">
                    {{caseData.checktime}}
                </el-form-item>
                <el-form-item label="就诊医生">
                    <el-select v-model="value" filterable placeholder="暂无" >
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="复诊计划">
                    <el-select v-model="caseData.plan" placeholder="暂无" >
                        <el-option label="一周" value="7"></el-option>
                        <el-option label="两周" value="14"></el-option>
                        <el-option label="一月" value="30"></el-option>
                        <el-option label="三月" value="90"></el-option>
                        <el-option label="半年" value="180"></el-option>
                        <el-option label="一年" value="365"></el-option>
                    </el-select>
                </el-form-item>
                <el-button type="primary" icon="el-icon-check" @click="submitCaseData">修改完成</el-button>
            </el-form>
            <div v-show="activeName=='third'" v-for="item in iolmaster" :key="item.id || item.localpath">
                <pdf
                        class="case-pdf"
                        style="width: 900px; height: 100%; margin-top: -480px; margin-left: 500px;"
                        ref="pdf"
                        :src="item.localpath">
                </pdf>
            </div>
            <div class="opt-img">
                <div v-show="activeName=='fourth'" v-for="item in opt" :key="item.id || item.localpath">
                    <div @click="onPreview(item)" @dblclick="sendToPredict(item)" @v-if="item.type ==='JPG'">
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
            <div v-show="activeName=='fifth'" v-for="item in oct" :key="item.id || item.localpath">
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
<!--            <el-dialog-->
<!--                title="诊断结论"-->
<!--                :visible.sync="diagnosisDialogVisible"-->
<!--                width="30%">-->
<!--              <span>{{ diagnosisResult }}</span>-->
<!--              <span slot="footer" class="dialog-footer">-->
<!--              <el-button @click="diagnosisDialogVisible = false">取 消</el-button>-->
<!--              <el-button type="primary" @click="diagnosisDialogVisible = false">确 定</el-button>-->
<!--              </span>-->
<!--          </el-dialog>-->
        </el-main>
        <el-footer>爱尔眼科慢病管理系统(  推荐使用Edge,Firefox、Chrome 浏览器访问   )</el-footer>
    </div>
</template>

<script>
    let timer = null
    import Header from "../components/Header"
    import pdf from 'vue-pdf'
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    export default {
        name: "CaseDetail",
        components: {Header, pdf, ElImageViewer },
        inject: ['reload'],
        data() {
            return {
                diagnosisDialogVisible: true,
                diagnosisResult: '',
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
                iolmaster: [],
                opt: [],
                oct: [],
                optimg: ''
            }
        },
        created() {
            this.id = this.$route.params.id
            const _this = this
            _this.diagnosisResult = _this.$store.getters.getDiagRes
            _this.$axios.get("/caselist/pastCase/" + _this.id, {
                headers: {
                    "Authorization": _this.$store.getters.getToken
                }
            }).then(res => {
                // console.log(res.data.data)
                _this.caseData = res.data.data;
                // 患者基本信息
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
                    console.log(_this.opt)
                })
                _this.$axios.get("/examdetail/getOCTByCaseId/" + _this.id, {
                    headers: {
                        "Authorization": _this.$store.getters.getToken
                    }
                }).then(res4 => {
                    console.log(res4)
                    _this.oct = res4.data.data
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
            fileUpload(file) {
                const _this = this
                console.log(file)
                const data = new FormData();
                data.append('file', file.file);
                _this.caseData.iolmaster = file.file.name
                console.log(_this.caseData)
                _this.$axios.post('/examdetail/uploadIOLMaster', data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }).then(res => {
                    console.log(res);
                    if(res.status === 200) {

                        _this.iolmaster = res.data.data.filepath
                        _this.caseData.iolmaster = res.data.data.examid
                        // _this.caseData.iolmaster = _this.iolmaster
                        _this.iol = true;
                        _this.caseData.alod = res.data.data.alod
                        _this.caseData.alos = res.data.data.alos
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            submitCaseData() {
                const _this = this
                _this.$axios.post('caselist/submitCase', _this.caseData, {
                    headers: {
                        'Authorization': _this.$store.getters.getToken,
                    },
                }).then(res => {
                    console.log(res);
                    if(res.data.code === 200) {
                        _this.$message({
                            type: 'success',
                            message: '完善病历成功!'
                        });
                        this.$router.go(-1);
                    }
                }).catch(err => {
                    console.log(err);
                    _this.$message.error('操作失败');
                });
            },
            onPreview(item) {
                console.log("onPreview")
                clearTimeout(timer)
                timer = setTimeout(() => {
                  this.optimg = item.localpath
                  console.log(item.localpath)
                  this.showViewer = true
                }, 300)
            },
          // 进行预测
            sendToPredict(item) {
              const _this = this
                clearTimeout(timer)
                console.log(item)
                console.log("dbclick")
              if(item.iolread === 1) {
                return
              }
              _this.$confirm('对这张图片进行智能诊断', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                console.log("确定")
                _this.$axios.get('http://127.0.0.1:4091/detect', {
                  params:{
                    "localpath": item.path,
                    "case_id": item.caseId,
                    "exam_id": item.examId,
                    "path": item.localpath,
                    "type": item.type,
                    "downfile": item.downfile,
                    "dev": item.dev
                  }
                }).then(
                    res => {
                      console.log(res)
                      // _this.$store.commit("SET_DIAGRES", res.data);
                      _this.diagnosisResult = res.data
                      // _this.diagnosisDialogVisible = true
                      _this.$confirm(res.data, '诊断成功',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        dangerouslyUseHTMLString: true,
                        type: 'warning'
                      }).then(() => {
                      }).catch(() => {
                      });
                    }
                )
              }).catch(() => {
                _this.$message({
                  type: 'info',
                  message: '已取消'
                });
              });
            },
            // 关闭查看器
            closeViewer() {
                this.showViewer = false
            },
            clicked(){
                console.log("点击确定")
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
        /*margin-top: -380px;*/
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