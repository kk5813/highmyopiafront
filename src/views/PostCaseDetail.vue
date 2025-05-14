<template>
  <div>
    <el-header>
      <Header active-index=""></Header>
    </el-header>
    <el-main>
      <el-page-header
        @back="goBack"
        :content="patientName + '的病历详情'"
        style="margin: 0px"
      >
      </el-page-header>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="门诊病历" name="case" style="float: left">
          <el-empty
            :image-size="300"
            description="暂无数据"
            v-if="noTimelineData"
          ></el-empty>
          <el-timeline>
            <el-timeline-item
              placement="top"
              color="#409EFF"
              v-for="caseData in caseDataList"
              :key="caseData.patiendId"
              :timestamp="caseData.diagTime"
            >
              <el-button type="primary" @click="handleCard(caseData.diagName)"
                >展开/收起病历</el-button
              >
              <el-card
                v-show="cardList[caseData.diagName]"
                :id="caseData.diagName"
                style="margin: 5px 5px 0px 0px; width: 800px"
              >
                <div slot="header" class="header">
                  <span style="">{{ caseData.name }}</span>
                  <span style="margin-left: auto"></span>
                </div>
                <div class="content">
                  <el-descriptions :column="1">
                    <el-descriptions-item label="裸眼视力">
                      左眼：{{ caseData.scdOsValue }} 右眼：{{
                        caseData.scdOsValue
                      }}</el-descriptions-item
                    >
                    <el-descriptions-item label="矫正视力"
                      >左眼：{{ caseData.ccdOsValue }} 右眼：{{
                        caseData.ccdOdValue
                      }}</el-descriptions-item
                    >
                    <el-descriptions-item label="眼压"
                      >左眼：{{ caseData.iopOs }} 右眼：{{
                        caseData.iopOd
                      }}</el-descriptions-item
                    >
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
                    <el-descriptions-item label="诊断">{{
                      caseData.diagName
                    }}</el-descriptions-item>
                    <el-descriptions-item label="处理意见">{{
                      caseData.dispose
                    }}</el-descriptions-item>
                  </el-descriptions>
                </div>
                <el-divider></el-divider>
                <div class="cardFooter">
                  <!-- handleCheckReport(
                        caseData.visitNumber
                      ) -->
                  <!-- <el-button
                    style="display: flex; margin-left: 100px"
                    type="primary"
                    size="small"
                    @click="handleCheckReport(caseData.diagTime)"
                    round
                    >查看检查报告</el-button
                  > -->
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>

          <el-dialog
            title="检查报告资料"
            :visible.sync="dialogCheckReportVisible"
            width="40%"
            :append-to-body="true"
          >
            <el-table :data="pdfDataList" max-height="500">
              <el-table-column
                prop="checkReports.itemName"
                label="名称"
                width="180"
              ></el-table-column>
              <el-table-column
                prop="checkReports.checkTime"
                label="检查时间"
                width="180"
              ></el-table-column>
              <el-table-column
                prop="url"
                label="报告资料(点击图片查看)"
                width="300"
              >
                <template #default="scope">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="scope.row.url[0]"
                    :preview-src-list="scope.row.url"
                  >
                  </el-image>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane @click="getLabData()" label="检验结果" name="labTest">
          <el-empty description="暂无数据" v-if="noLabData"></el-empty>
          <el-descriptions
            v-for="(item, index) in labData"
            :key="index"
            style="width: 50%; margin-top: 10px"
            title=""
            :column="1"
            border
          >
            <el-descriptions-item label="检验结果ID" :labelStyle="labelStyle">{{
              item.id
            }}</el-descriptions-item>
            <el-descriptions-item label="患者姓名" :labelStyle="labelStyle">{{
              item.patientName
            }}</el-descriptions-item>
            <el-descriptions-item label="是否危急" :labelStyle="labelStyle">{{
              item.isUrgent
            }}</el-descriptions-item>
            <el-descriptions-item
              label="检验报告名称"
              :labelStyle="labelStyle"
              >{{ item.reportName }}</el-descriptions-item
            >
            <el-descriptions-item label="检验项目" :labelStyle="labelStyle">{{
              item.labItemName
            }}</el-descriptions-item>
            <el-descriptions-item label="参考范围" :labelStyle="labelStyle">{{
              item.refRange
            }}</el-descriptions-item>
            <el-descriptions-item label="实际值" :labelStyle="labelStyle">{{
              item.labFinalValue
            }}</el-descriptions-item>
            <el-descriptions-item
              label="检验结果单位名称"
              :labelStyle="labelStyle"
              >{{ item.labResultUnitName }}</el-descriptions-item
            >
            <el-descriptions-item label="审核日期" :labelStyle="labelStyle">{{
              item.auditDate
            }}</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
        <el-tab-pane @click="getLabData()" label="处方" name="recipe">
          <el-table
            :data="orderData"
            border
            style="width: 100%; border-radius: 20px"
            v-loading="loading"
          >
            <el-table-column label="医嘱内容" prop="recipeName" align="center">
            </el-table-column>
            <el-table-column
              width="200px"
              label="规格"
              prop="specif"
              align="center"
            ></el-table-column>
            <el-table-column
              width="50px"
              label="剂量"
              prop="totalDose"
              align="center"
            >
            </el-table-column>
            <el-table-column
              width="100px"
              label="剂量单位"
              prop="dosageUnitName"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="给药途径"
              prop="adminRouteName"
              align="center"
            >
            </el-table-column>
            <el-table-column
              width="100px"
              label="眼别"
              prop="eyeTypeName"
              align="center"
            >
            </el-table-column>
            <el-table-column
              width="100px"
              label="频率"
              prop="frequencyName"
              align="center"
            >
            </el-table-column>
            <el-table-column
              width="50px"
              label="滴速"
              prop="dripSpeedName"
              align="center"
            >
            </el-table-column>
            <el-table-column
              width="50px"
              label="天数"
              prop="medicDays"
              align="center"
            >
            </el-table-column>
            <el-table-column
              width="50px"
              label="总量"
              prop="usableDays"
              align="center"
            >
            </el-table-column>
            <el-table-column
              width="50px"
              label="单位"
              prop="packingUnitName"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="执行科室"
              prop="execDeptName"
              align="center"
            ></el-table-column>
            <el-table-column
              label="附加执行科室"
              prop="addExecDeptName"
              align="center"
            ></el-table-column>
            <el-table-column
              width="100px"
              label="是否皮试"
              prop="skinTest"
              align="center"
            ></el-table-column>
            <el-table-column
              label="开立医生"
              prop="doctorName"
              align="center"
            ></el-table-column>
            <el-table-column label="开立时间" prop="billingTime" align="center">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="影像资料" name="pdfs">
          <el-row :gutter="20" style="padding: 20px">
            <el-col>
              <el-date-picker
                style="width: 300px"
                v-model="timeRange"
                value-format="yyyy-MM-dd"
                @change="timeChange()"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-col>
          </el-row>
          <el-empty description="暂无数据" v-if="noPdfs"></el-empty>
          <el-row :gutter="20" style="padding: 20px">
            <el-col
              v-for="(item, index) in pdfList"
              :key="index"
              :xs="24"
              :sm="12"
              :md="8"
              :lg="6"
              style="margin-bottom: 20px; display: flex"
            >
              <el-card
                shadow="hover"
                style="
                  width: 100%;
                  height: 420px;
                  display: flex;
                  flex-direction: column;
                "
              >
                <div slot="header" class="header">
                  <span style="font-size: 14px"
                    >{{ item.itemName }} {{ item.checkTime }}</span
                  >
                  <span style="margin-left: auto"></span>
                </div>
                <div class="pdf_vw">
                  <!-- 正常显示 -->
                  <pdf
                    class="canvas_pdf"
                    :src="item.url"
                    :page="1"
                    style="width: 100%; max-height: 300px"
                  ></pdf>
                </div>
                <el-divider></el-divider>
                <div class="cardFooter">
                  <el-button
                    style="display: flex; margin-left: 100px"
                    type="primary"
                    size="small"
                    round
                    @click="handleViewPDF(item.url)"
                  >
                    查看完整报告
                  </el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <!-- PDF全屏查看对话框 -->
          <el-dialog
            :visible.sync="pdfDialogVisible"
            fullscreen
            :title="currentPDF.checkTime"
          >
            <pdf :src="currentPDF.url" style="width: 100%; height: 90vh"></pdf>
          </el-dialog>
        </el-tab-pane>

        <!-- <el-tab-pane label="智能诊断" name="ai">
          <AIComponent :patient-id="currentPatientId"/>
        </el-tab-pane> -->
      </el-tabs>
    </el-main>
    <el-footer
      >爱尔眼科慢病管理系统( 推荐使用Edge,Firefox、Chrome 浏览器访问
      )</el-footer
    >
  </div>
</template>

<script>
import AIComponent from "../views/AiComponent.vue";
import Header from "../components/Header";
import pdf from "vue-pdf";
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import api from "@/api/apiManage";
export default {
  name: "PostCaseDetail",
  components: { Header, pdf, ElImageViewer, AIComponent },
  data() {
    return {
      noTimelineData: false,
      labelStyle: { width: "200px" },
      noLabData: false,
      noPdfs: false,
      pdfDialogVisible: false,
      currentPDF: {},
      pdfList: [],
      timeRange: ["", ""],
      currentPatientId: 9344,
      isOpen1: false,
      loading: false,
      activeName: "case",
      id: "",
      patientId: "",
      patientName: "",
      dialogCheckReportVisible: false,
      caseDataList: [],
      pdfDataList: [],
      value: "",
      formLabelWidth: "120px",
      iolmaster: "",
      labData: [],
      orderData: [],
      cardList: {},
    };
  },
  created() {
    this.caseDataList.forEach((item, index) => {
      if (index == 0) this.$set(this.cardList, item.diagName, true);
      else this.$set(this.cardList, item.diagName, false);
    });
    this.patientId = this.$route.query.id;
    this.patientName = this.$route.query.name;
    this.getHistoryCase();
    this.getLabData();
    this.getRecipe();
    this.getPdfs();
  },
  methods: {
    handleViewPDF(url) {
      this.currentPDF = this.pdfList.find((item) => item.url === url);
      this.pdfDialogVisible = true;
    },
    handleCard(index) {
      this.$set(this.cardList, index, !this.cardList[index]);

      // this.cardList[index] = !this.cardList[index]
    },
    getLabData() {
      api
        .getCheckResult(this.$route.query.id)
        .then((res) => {
          this.noLabData = false;
          if (res.data.code == 200) {
            let data = res.data.data;
            data.forEach((item, index) => {
              data[index].patientName = this.patientName;
            });
            this.labData = data;
          }
        })
        .catch((error) => {})
        .finally(() => {
          if (!this.labData.length) this.noLabData = true;
        });
    },
    goBack() {
      // this.$router.go(-1);
      this.$router.push({
        path: "/patientmanagement",
      });
    },
    getHistoryCase() {
      let obj = {
        patientId: this.$route.query.id,
      };
      api
        .getCaseTimeline(obj)
        .then((res) => {
          this.noTimelineData = false;
          if (res.data.code == 200) {
            this.caseDataList = res.data.data.records;
          }
        })
        .catch((error) => {})
        .finally(() => {
          if (!this.caseDataList.length) this.noTimelineData = true;
        });
    },
    getRecipe() {
      api
        .getRecipeById(this.$route.query.id)
        .then((res) => {
          if (res.data.code == 200) {
            this.orderData = res.data.data.records;
          }
        })
        .catch((error) => {})
        .finally(() => {});
    },
    getPdfs() {
      this.timeRange = this.timeRange ? this.timeRange : ["", ""];
      let obj = {
        startTime: this.timeRange[0],
        endTime: this.timeRange[1],
      };
      api
        .getPatientCheckReport(this.$route.query.id, obj)
        .then((res) => {
          this.noPdfs = false;
          if (res.data.code == 200) {
            let items = res.data.data;
            this.pdfList = items.map(function (item) {
              return {
                itemName: item.itemName,
                // 只取日期 不含具体时间
                checkTime: item.checkTime.slice(0, 10),
                url:
                  process.env.VUE_APP_API_BASE_URL +
                  "/images/" +
                  item.files[0].filePath,
              };
            });
          }
        })
        .catch((error) => {})
        .finally(() => {
          if (!this.pdfList.length) this.noPdfs = true;
        });
    },
    timeChange() {
      this.getPdfs();
    },

    // 处理控制台handleClick警告
    handleClick(tab, event) {
      // console.log(tab, event);
    },
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
  /* height: 260px; */
  overflow: auto;
}
/* 添加统一高度 */
.pdf-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 420px; /* 固定最小高度 */
}

/* 内容区域自适应 */
.pdf-content {
  flex: 1;
  min-height: 300px;
  max-height: 300px;
  position: relative;
}
/* PDF卡片统一高度 */
.el-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* PDF容器滚动优化 */
.pdf-container {
  overflow-y: auto;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.pdf_vw {
  height: 100%;
}

::v-deep .pdf_vw canvas {
  height: 250px !important;
}
</style>