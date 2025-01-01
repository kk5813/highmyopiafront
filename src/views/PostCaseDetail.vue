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
        <el-tab-pane label="门诊病历" name="second" style="float: left">
          <el-empty v-if="!caseDataList" description="暂无数据" style="width:100vw;"></el-empty>
          <el-timeline>
            <el-timeline-item
              placement="top"
              color="#409EFF"
              v-for="caseData in caseDataList"
              :key="caseData.patiendId"
              :timestamp="caseData.diagTime"
            >
              <el-card
                :id="caseData.patiendId"
                style="margin: 5px 5px 0px 0px; width: 800px"
              >
                <div slot="header" class="header">
                  <span style="">{{ caseData.name }}</span>
                  <span style="margin-left: auto">男</span>
                </div>
                <div class="content">
                  <el-descriptions :column="1">
                    <el-descriptions-item label="视力">{{
                      caseData.eyeSummary
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
                  <el-button
                    style="display: flex; margin-left: 100px"
                    type="primary"
                    size="small"
                    @click="
                      handleCheckReport(
                        caseData.visitNumber
                      )
                    "
                    round
                    >查看检查报告</el-button
                  >
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
                    src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                    :preview-src-list="scope.row.url"
                  >
                  </el-image>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane @click="getLabData()" label="检验结果" name="labTest">
          <el-empty :v-if="!this.labData" description="暂无数据" style="width:100vw;"></el-empty>
          <el-descriptions
            v-for="(item, index) in labData"
            :key="index"
            style="width: 1000px; margin-top: 20px"
            title=""
            :column="1"
            border
          >
            <el-descriptions-item label="检验结果ID">{{
              item.id
            }}</el-descriptions-item>
            <el-descriptions-item label="患者姓名">{{
              item.patientName
            }}</el-descriptions-item>
            <el-descriptions-item label="是否危急">{{
              item.isUrgent
            }}</el-descriptions-item>
            <el-descriptions-item label="检验报告名称">{{
              item.reportName
            }}</el-descriptions-item>
            <el-descriptions-item label="检验项目">{{
              item.labItemName
            }}</el-descriptions-item>
            <el-descriptions-item label="参考范围">{{
              item.refRange
            }}</el-descriptions-item>
            <el-descriptions-item label="实际值">{{
              item.labFinalValue
            }}</el-descriptions-item>
            <el-descriptions-item label="检验结果单位名称">{{
              item.labResultUnitName
            }}</el-descriptions-item>
            <el-descriptions-item label="审核日期">{{
              item.auditDate
            }}</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
      </el-tabs>
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
      patientId: "",
      patientName: "",
      dialogCheckReportVisible: false,
      caseDataList: [
        // {
        //   patientId: 1,
        //   eye: "sss",
        //   name: "艾弗森",
        //   mainAppeal: "候除理说本些理七。",
        //   pastHistory: "及改流目飞。",
        //   presentIllness: "大则段马。",
        //   allergy: "天日然。",
        //   specialOs: "转步类以需感先在。",
        //   specialOd: "总员题据识式认。",
        //   visitNumber: "业成角花。",
        //   physicalExam:
        //     "2021年7月，作为强制碳市场的全国碳排放权交易市场启动上线交易，年覆盖二氧化碳排放量约51亿吨，占全国二氧化碳排放总量的40%以上。然而，目前全国碳排放权交易市场仅在发电企业开展，按计划将逐步覆盖其他重点排放行业，但仍有可再生能源、林业碳汇等行业无法通过市场机制获得减排经济收益。启动自愿碳市场，有利于统筹全国碳资源，激励更广泛的行业、企业参与温室气体减排行动。2021年7月，作为强制碳市场的全国碳排放权交易市场启动上线交易，年覆盖二氧化碳排放量约51亿吨，占全国二氧化碳排放总量的40%以上。然而，目前全国碳排放权交易市场仅在发电企业开展，按计划将逐步覆盖其他重点排放行业，但仍有可再生能源、林业碳汇等行业无法通过市场机制获得减排经济收益。启动自愿碳市场，有利于统筹全国碳资源，激励更广泛的行业、企业参与温室气体减排行动。2021年7月，作为强制碳市场的全国碳排放权交易市场启动上线交易，年覆盖二氧化碳排放量约51亿吨，占全国二氧化碳排放总量的40%以上。然而，目前全国碳排放权交易市场仅在发电企业开展，按计划将逐步覆盖其他重点排放行业，但仍有可再生能源、林业碳汇等行业无法通过市场机制获得减排经济收益。启动自愿碳市场，有利于统筹全国碳资源，激励更广泛的行业、企业参与温室气体减排行动。",
        //   dispose: "低交如九年。",
        //   date: "2021-02-02",
        // },
        // {
        //   patientId: 2,
        //   eye: "sss",
        //   name: "艾弗森",
        //   mainAppeal: "候除理说本些理七。",
        //   pastHistory: "及改流目飞。",
        //   presentIllness: "大则段马。",
        //   allergy: "天日然。",
        //   specialOs: "转步类以需感先在。",
        //   specialOd: "总员题据识式认。",
        //   visitNumber: "业成角花。",
        //   physicalExam:
        //     "2021年7月，作为强制碳市场的全国碳排放权交易市场启动上线交易，年覆盖二氧化碳排放量约51亿吨，占全国二氧化碳排放总量的40%以上。然而，目前全国碳排放权交易市场仅在发电企业开展，按计划将逐步覆盖其他重点排放行业，但仍有可再生能源、林业碳汇等行业无法通过市场机制获得减排经济收益。启动自愿碳市场，有利于统筹全国碳资源，激励更广泛的行业、企业参与温室气体减排行动。2021年7月，作为强制碳市场的全国碳排放权交易市场启动上线交易，年覆盖二氧化碳排放量约51亿吨，占全国二氧化碳排放总量的40%以上。然而，目前全国碳排放权交易市场仅在发电企业开展，按计划将逐步覆盖其他重点排放行业，但仍有可再生能源、林业碳汇等行业无法通过市场机制获得减排经济收益。启动自愿碳市场，有利于统筹全国碳资源，激励更广泛的行业、企业参与温室气体减排行动。2021年7月，作为强制碳市场的全国碳排放权交易市场启动上线交易，年覆盖二氧化碳排放量约51亿吨，占全国二氧化碳排放总量的40%以上。然而，目前全国碳排放权交易市场仅在发电企业开展，按计划将逐步覆盖其他重点排放行业，但仍有可再生能源、林业碳汇等行业无法通过市场机制获得减排经济收益。启动自愿碳市场，有利于统筹全国碳资源，激励更广泛的行业、企业参与温室气体减排行动。",
        //   dispose: "低交如九年。",
        //   date: "2020-02-02",
        // },
      ],
      pdfDataList: [
        {
          checkReports: {
            itemName: "slo",
            checkTime: "2020-02-02",
          },
          url: [
            "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
            "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg",
          ],
        },
        {
          checkReports: {
            itemName: "slo",
            checkTime: "2020-02-02",
          },
          url: [
            "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
            "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg",
          ],
        },
        {
          checkReports: {
            itemName: "slo",
            checkTime: "2020-02-02",
          },
          url: [
            "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
            "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg",
          ],
        },
      ],
      value: "",
      formLabelWidth: "120px",
      iolmaster: "",
      labData: [{}],
    };
  },
  created() {
    // this.patientId = this.$route.query.id;
    this.patientName = this.$route.query.name;
    this.getHistoryCase();
    this.getLabData();
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleCheckReport(visitNumber) {
      let obj = {
        patientId: this.$route.query.id,
        visitNumber: visitNumber,
      };
      console.log(obj)
      this.dialogCheckReportVisible = true;
      api
        .getCaseTimelineReport(obj)
        .then((res) => {
          if (res.data.code == 200) {
            console.log(res);
          }
        })
        .catch((error) => {})
        .finally(() => {});
    },
    getLabData() {
      api.getCheckResult(this.$route.query.id).then((res) => {
        if (res.data.code == 200) {
          let data = res.data.data;
          data.forEach((item, index) => {
            data[index].patientName = this.patientName;
          });
          this.labData = data;
        }
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    getHistoryCase() {
      // this.patientId
      let obj = {
        patientId: "1809970417345019907",
      };
      api.getCaseTimeline(obj).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          let cases = res.data.data.records;
          cases.forEach((item, index) => {
            cases[index].eyeSummary =
              "左/右眼眼压：(" +
              item.iopOs +
              "/" +
              item.iopOd +
              ")  |  " +
              "左/右眼裸眼视力：(" +
              item.scdOsValue +
              "/" +
              item.scdOdValue +
              ")  |  " +
              "左/右眼矫正视力：(" +
              item.ccdOsValue +
              "/" +
              item.ccdOdValue +
              ")  ";
          });
          this.caseDataList = cases;
        }
      });
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
</style>