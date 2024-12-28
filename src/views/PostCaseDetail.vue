<template>
  <div>
    <el-header>
      <Header active-index=""></Header>
    </el-header>
    <el-main>
      <el-page-header @back="goBack" :content="'test' + '的病历详情'">
      </el-page-header>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="门诊病历" name="second" style="float: left">
          <el-timeline>
            <el-timeline-item
              placement="top"
              color="#409EFF"
              v-for="caseData in caseDataList"
              :key="caseData.patiendId"
              :timestamp="caseData.date"
            >
              <el-card
                :id="caseData.patiendId"
                style="margin: 5px 5px 0px 0px; width: 600px"
              >
                <div slot="header" class="header">
                  <span style="">{{ caseData.name }}</span>
                  <span style="margin-left: auto">男</span>
                </div>
                <div class="content">
                  <el-descriptions :column="1">
                    <el-descriptions-item label="视力">{{
                      caseData.eye
                    }}</el-descriptions-item>
                    <el-descriptions-item label="主述">{{
                      caseData.mainAppeal
                    }}</el-descriptions-item>
                    <el-descriptions-item label="既往史">{{
                      caseData.pastHistory
                    }}</el-descriptions-item>
                    <el-descriptions-item label="过敏史">{{
                      caseData.allergy
                    }}</el-descriptions-item>
                    <el-descriptions-item label="左眼专科检查">{{
                      caseData.specialOs
                    }}</el-descriptions-item>
                    <el-descriptions-item label="右眼专科检查">{{
                      caseData.specialOd
                    }}</el-descriptions-item>
                    <el-descriptions-item label="体格检查">{{
                      caseData.physicalExam
                    }}</el-descriptions-item>
                    <el-descriptions-item label="处理意见">{{
                      caseData.dispose
                    }}</el-descriptions-item>
                  </el-descriptions>
                </div>
                <el-divider></el-divider>
                <div class="cardFooter">
                  <el-button
                    size="mini"
                    @click="handleEditCase()"
                    type="primary"
                    >修改</el-button
                  >
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>

          <el-dialog
            title="修改病历"
            :visible.sync="dialogEditFormVisible"
            width="40%"
            :append-to-body="true"
          >
            <el-form :model="editCase">
              <el-form-item label="主述" :label-width="formLabelWidth">
                <el-input
                  v-model="editCase.mainAppeal"
                  type="textarea"
                  autocomplete="off"
                  style="width: 400px"
                  :rows="2"
                ></el-input>
              </el-form-item>
              <el-form-item label="既往史" :label-width="formLabelWidth">
                <el-input
                  v-model="editCase.pastHistory"
                  type="textarea"
                  autocomplete="off"
                  style="width: 400px"
                  :rows="2"
                ></el-input>
              </el-form-item>
              <el-form-item label="现病史" :label-width="formLabelWidth">
                <el-input
                  v-model="editCase.presentIllness"
                  type="textarea"
                  autocomplete="off"
                  style="width: 400px"
                  :rows="2"
                ></el-input>
              </el-form-item>
              <el-form-item label="过敏史" :label-width="formLabelWidth">
                <el-input
                  v-model="editCase.allergy"
                  type="textarea"
                  autocomplete="off"
                  style="width: 400px"
                  :rows="2"
                ></el-input>
              </el-form-item>
              <el-form-item label="左眼专科检查" :label-width="formLabelWidth">
                <el-input
                  v-model="editCase.specialOs"
                  autocomplete="off"
                  type="textarea"
                  style="width: 400px"
                  :rows="2"
                ></el-input>
              </el-form-item>
              <el-form-item label="右眼专科检查" :label-width="formLabelWidth">
                <el-input
                  v-model="editCase.specialOd"
                  autocomplete="off"
                  type="textarea"
                  style="width: 400px"
                  :rows="2"
                ></el-input>
              </el-form-item>
              <el-form-item label="体格检查" :label-width="formLabelWidth">
                <el-input
                  v-model="editCase.physicalExam"
                  autocomplete="off"
                  type="textarea"
                  style="width: 400px"
                  :rows="2"
                ></el-input>
              </el-form-item>
              <el-form-item label="体格检查" :label-width="formLabelWidth">
                <el-input
                  v-model="editCase.dispose"
                  autocomplete="off"
                  type="textarea"
                  style="width: 400px"
                  :rows="2"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitEditUser()"
                >确 定</el-button
              >
            </div>
          </el-dialog>
          <!-- <el-button
            style="display: flex; margin-left: 100px"
            type="primary"
            @click="editPatientCase()"
            round
            >确认修改</el-button
          > -->
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
          <el-descriptions
            :model="labData"
            style="width: 1000px; height: 100"
            title=""
            :column="1"
            border
          >
            <el-descriptions-item label="检验结果ID">{{
              labData.id
            }}</el-descriptions-item>
            <el-descriptions-item label="患者姓名">{{
              labData.patientName
            }}</el-descriptions-item>
            <el-descriptions-item label="是否危急">{{
              labData.isUrgent
            }}</el-descriptions-item>
            <el-descriptions-item label="检验报告名称">{{
              labData.reportName
            }}</el-descriptions-item>
            <el-descriptions-item label="检验项目">{{
              labData.labItemName
            }}</el-descriptions-item>
            <el-descriptions-item label="参考范围">{{
              labData.refRange
            }}</el-descriptions-item>
            <el-descriptions-item label="实际值">{{
              labData.labFinalValue
            }}</el-descriptions-item>
            <el-descriptions-item label="检验结果单位名称">{{
              labData.labResultUnitName
            }}</el-descriptions-item>
            <el-descriptions-item label="审核日期">{{
              labData.auditDate
            }}</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
        <el-tab-pane label="扫描激光眼底检查" name="fourth"> </el-tab-pane>
        <el-tab-pane label="光学相干断层OCT" name="fifth"> </el-tab-pane>
        <el-tab-pane label="欧宝图" name="sixth"> </el-tab-pane>
        <el-tab-pane label="诊疗意见" name="advice">
          <!-- <el-form class="diagnosis-result">
            <el-form-item label="诊断结论">
              <el-input v-model="caseData.diagnosis" disabled></el-input>
            </el-form-item>
            <el-form-item label="治疗建议" placeholder="暂无">
              <el-input v-model="caseData.recommend" disabled></el-input>
            </el-form-item>
            <el-form-item label="就诊时间">
              {{ caseData.checktime }}
            </el-form-item>
            <el-form-item label="就诊医生">
              <el-select v-model="value" filterable placeholder="暂无" disabled>
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
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
          </el-form> -->
        </el-tab-pane>
      </el-tabs>
      <!-- v-for="item in iolmaster" -->
      <div v-show="activeName == 'third'">
        <pdf
          class="case-pdf"
          style="width: 600px; height: 700px; margin-top: 0; margin-left: 500px"
          ref="pdf"
          :src="pdfUrl"
        >
        </pdf>
      </div>
      <div class="opt-img">
        <div v-show="activeName == 'fourth'" v-for="item in opt">
          <div @click="onPreview(item)" v-if="item.type === 'JPG'">
            <img class="case-img" :src="item.localpath" alt="" />
          </div>
        </div>
      </div>
      <el-image-viewer
        v-if="showViewer"
        :on-close="closeViewer"
        :url-list="[optimg]"
      />
      <div
        style="margin-bottom: 30px"
        v-show="activeName == 'fifth'"
        v-for="item in oct"
      >
        <pdf
          style="width: 300px; height: 60%; margin-top: 0px; margin-left: 500px"
          ref="pdf"
          :src="item.localpath"
        >
        </pdf>
      </div>
      <div v-show="activeName == 'sixth'" v-for="item in opt">
        <pdf
          style="
            width: 900px;
            height: 120%;
            margin-top: 0px;
            margin-left: 500px;
          "
          ref="pdf"
          :src="item.localpath"
        >
        </pdf>
      </div>
    </el-main>
    <el-footer
      >爱尔眼科慢病管理系统( 推荐使用IE9+,Firefox、Chrome 浏览器访问
      )</el-footer
    >
  </div>
</template>

<script>
import Header from "../components/Header";
import pdf from "vue-pdf";
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import api from "@/api/apiManage";
export default {
  name: "PostCaseDetail",
  components: { Header, pdf, ElImageViewer },
  data() {
    return {
      showViewer: false,
      activeName: "second",
      id: "",
      dialogEditFormVisible: false,
      editCase: {
        patientId: 1,
        eye: "sss",
        name: "艾弗森",
        mainAppeal: "候除理说本些理七。",
        pastHistory: "及改流目飞。",
        presentIllness: "大则段马。",
        allergy: "天日然。",
        specialOs: "转步类以需感先在。",
        specialOd: "总员题据识式认。",
        visitNumber: "业成角花。",
        physicalExam:
          "2021年7月，作为强制碳市场的全国碳排放权交易市场启动上线交易，年覆盖二氧化碳排放量约51亿吨，占全国二氧化碳排放总量的40%以上。然而，目前全国碳排放权交易市场仅在发电企业开展，按计划将逐步覆盖其他重点排放行业，但仍有可再生能源、林业碳汇等行业无法通过市场机制获得减排经济收益。启动自愿碳市场，有利于统筹全国碳资源，激励更广泛的行业、企业参与温室气体减排行动。2021年7月，作为强制碳市场的全国碳排放权交易市场启动上线交易，年覆盖二氧化碳排放量约51亿吨，占全国二氧化碳排放总量的40%以上。然而，目前全国碳排放权交易市场仅在发电企业开展，按计划将逐步覆盖其他重点排放行业，但仍有可再生能源、林业碳汇等行业无法通过市场机制获得减排经济收益。启动自愿碳市场，有利于统筹全国碳资源，激励更广泛的行业、企业参与温室气体减排行动。2021年7月，作为强制碳市场的全国碳排放权交易市场启动上线交易，年覆盖二氧化碳排放量约51亿吨，占全国二氧化碳排放总量的40%以上。然而，目前全国碳排放权交易市场仅在发电企业开展，按计划将逐步覆盖其他重点排放行业，但仍有可再生能源、林业碳汇等行业无法通过市场机制获得减排经济收益。启动自愿碳市场，有利于统筹全国碳资源，激励更广泛的行业、企业参与温室气体减排行动。",
        dispose: "低交如九年。",
        date: "2021-02-02",
      },
      caseDataList: [
        {
          patientId: 1,
          eye: "sss",
          name: "艾弗森",
          mainAppeal: "候除理说本些理七。",
          pastHistory: "及改流目飞。",
          presentIllness: "大则段马。",
          allergy: "天日然。",
          specialOs: "转步类以需感先在。",
          specialOd: "总员题据识式认。",
          visitNumber: "业成角花。",
          physicalExam:
            "2021年7月，作为强制碳市场的全国碳排放权交易市场启动上线交易，年覆盖二氧化碳排放量约51亿吨，占全国二氧化碳排放总量的40%以上。然而，目前全国碳排放权交易市场仅在发电企业开展，按计划将逐步覆盖其他重点排放行业，但仍有可再生能源、林业碳汇等行业无法通过市场机制获得减排经济收益。启动自愿碳市场，有利于统筹全国碳资源，激励更广泛的行业、企业参与温室气体减排行动。2021年7月，作为强制碳市场的全国碳排放权交易市场启动上线交易，年覆盖二氧化碳排放量约51亿吨，占全国二氧化碳排放总量的40%以上。然而，目前全国碳排放权交易市场仅在发电企业开展，按计划将逐步覆盖其他重点排放行业，但仍有可再生能源、林业碳汇等行业无法通过市场机制获得减排经济收益。启动自愿碳市场，有利于统筹全国碳资源，激励更广泛的行业、企业参与温室气体减排行动。2021年7月，作为强制碳市场的全国碳排放权交易市场启动上线交易，年覆盖二氧化碳排放量约51亿吨，占全国二氧化碳排放总量的40%以上。然而，目前全国碳排放权交易市场仅在发电企业开展，按计划将逐步覆盖其他重点排放行业，但仍有可再生能源、林业碳汇等行业无法通过市场机制获得减排经济收益。启动自愿碳市场，有利于统筹全国碳资源，激励更广泛的行业、企业参与温室气体减排行动。",
          dispose: "低交如九年。",
          date: "2021-02-02",
        },
        {
          patientId: 2,
          eye: "sss",
          name: "艾弗森",
          mainAppeal: "候除理说本些理七。",
          pastHistory: "及改流目飞。",
          presentIllness: "大则段马。",
          allergy: "天日然。",
          specialOs: "转步类以需感先在。",
          specialOd: "总员题据识式认。",
          visitNumber: "业成角花。",
          physicalExam:
            "2021年7月，作为强制碳市场的全国碳排放权交易市场启动上线交易，年覆盖二氧化碳排放量约51亿吨，占全国二氧化碳排放总量的40%以上。然而，目前全国碳排放权交易市场仅在发电企业开展，按计划将逐步覆盖其他重点排放行业，但仍有可再生能源、林业碳汇等行业无法通过市场机制获得减排经济收益。启动自愿碳市场，有利于统筹全国碳资源，激励更广泛的行业、企业参与温室气体减排行动。2021年7月，作为强制碳市场的全国碳排放权交易市场启动上线交易，年覆盖二氧化碳排放量约51亿吨，占全国二氧化碳排放总量的40%以上。然而，目前全国碳排放权交易市场仅在发电企业开展，按计划将逐步覆盖其他重点排放行业，但仍有可再生能源、林业碳汇等行业无法通过市场机制获得减排经济收益。启动自愿碳市场，有利于统筹全国碳资源，激励更广泛的行业、企业参与温室气体减排行动。2021年7月，作为强制碳市场的全国碳排放权交易市场启动上线交易，年覆盖二氧化碳排放量约51亿吨，占全国二氧化碳排放总量的40%以上。然而，目前全国碳排放权交易市场仅在发电企业开展，按计划将逐步覆盖其他重点排放行业，但仍有可再生能源、林业碳汇等行业无法通过市场机制获得减排经济收益。启动自愿碳市场，有利于统筹全国碳资源，激励更广泛的行业、企业参与温室气体减排行动。",
          dispose: "低交如九年。",
          date: "2020-02-02",
        },
      ],
      options: [
        {
          value: "选项1",
          label: "秦小林",
        },
        {
          value: "选项2",
          label: "胡建斌",
        },
        {
          value: "选项3",
          label: "王杰",
        },
      ],
      value: "",
      infoForm: {
        id: "1796786711460069400",
        patientName: "杨奇韵",
        patientId: "1796786711460069400",
        sex: "1",
        birthday: "1919-01-01",
        phone: "08820",
        idNumber: "298452984941879",
      },
      formLabelWidth: "120px",
      iolmaster: "",
      opt: [],
      oct: [],
      optimg: "",
      labData: {
        patientName: "杨奇韵",
        isUrgent: 0,
        labItemName: "乙肝E抗体",
        reportName:
          "乙肝五项（定量分析法）+丙肝抗体发光法+HIV抗体检查+梅毒抗体发光法",
        patientId: 1796786711460069400,
        labItemCode: "Anti-HBe",
        refRange: "0-0.5",
        labResultSignName: null,
        labFinalValue: "0.01",
        visitingNo: "MZ202406010634",
        sexName: "男",
        patientBrithday: "1986-03-27 00:00:00",
        labResultUnitName: "S/CO",
        id: 1799240480341352400,
        auditDate: "2024-08-08 10:54:18",
      },
      pdfUrl: "/img/PDF/IOL-Haigis_408.pdf",
    };
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    toggleBody(isPin) {
      if (isPin) {
        document.body.style.height = '100vh'
        document.body.style['overflow-y'] = 'hidden'
      } else {
        document.body.style.height = 'unset'
        document.body.style['overflow-y'] = 'auto'
      }
    },

    handleEditCase() {
      this.dialogEditFormVisible = true;
    },
    editPatientInfo() {
      console.log(this.infoForm);
    },
    goBack() {
      this.$router.go(-1);
    },
    onPreview(item) {
      this.optimg = item.localpath;
      console.log(item.localpath);
      this.showViewer = true;
    },
    // 关闭查看器
    closeViewer() {
      this.showViewer = false;
    },

    getHistoryCase() {
      let obj = {
        dataEnd: "",
        dataStart: "",
        patientName: "",
        patientId: "1809970417345019907",
      };
      console.log(obj)
      api.getCaseByCondition(obj).then((res) => {
        console.log(res);
        // if (res.data.code == 200) {
        //   this.infoForm = res.data.data.records;
        //   this.loading = false;
        //   this.totalSize = res.data.data.total;
        // }
      });
    },
  },
  created() {
    this.visitNumber = this.$route.params.id;
    this.getHistoryCase();
  },
};
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
.el-main {
  /* display: flex(center, center, row); */
  height: calc(100vh - 60px);
  width: 100%;
  margin-top: 50px;
  background-color: #e9eef3;
  color: #333;

  /* text-align: center; */
  /* height: 1000px; */
  /* overflow: hidden; */
  padding-bottom: 100px;
  overflow: auto;
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
.case-img {
  width: 200px;
}

.el-timeline /deep/ .el-timeline-item__tail {
  border-left: 2px solid #409eff;
}

.cardFooter {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.el-card /deep/ .el-card__header {
  height: 30px;
  background-color: #f2f6fc;
  display: flex;
  align-items: center;
}
.el-card /deep/ .el-divider--horizontal {
  margin: 0px;
}
.el-card /deep/ .el-descriptions-item__container .el-descriptions-item__content,
.el-descriptions-item__container .el-descriptions-item__label {
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  /* display: inline-flex; */
  -webkit-box-align: baseline;
  -ms-flex-align: baseline;
  align-items: baseline;
}
.header {
  display: flex;
  justify-content: flex-end;
  flex: 2;
}
.content {
  height: 260px;
  overflow: auto;
}


</style>