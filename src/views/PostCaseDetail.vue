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
          <el-empty
            v-if="!caseDataList"
            description="暂无数据"
            style="width: 100vw"
          ></el-empty>
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
                  <span style="margin-left: auto"></span>
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
                  <!-- handleCheckReport(
                        caseData.visitNumber
                      ) -->
                  <el-button
                    style="display: flex; margin-left: 100px"
                    type="primary"
                    size="small"
                    @click="handleCheckReport(caseData.diagTime)"
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
          <el-empty
            v-if="!this.labData"
            description="暂无数据"
            style="width: 100vw"
          ></el-empty>
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
        {
          patientId: "1309689045627559938",
          eyeSummary:
            "左/右眼眼压：(" +
            10 +
            "/" +
            10 +
            ")  |  " +
            "左/右眼裸眼视力：(" +
            0.1 +
            "/" +
            0.1 +
            ")  |  " +
            "左/右眼矫正视力：(" +
            "1.0" +
            "/" +
            "1.0" +
            ")  ",
          name: "艾弗森",
          mainAppeal: "视力逐渐下降2年，要求检查",
          pastHistory: "高度近视",
          presentIllness:
            "2年前开始出现视力逐渐下降，无眼红、眼痛，于当地眼镜店自行配镜。半年前开始视力下降加重，配镜视力无提高，现来我院就诊",
          allergy: "无特殊",
          specialOs: "双眼外观未见异常，屈光介质透明眼底呈近视改变",
          specialOd: "双眼外观未见异常，屈光介质透明眼底呈近视改变",
          visitNumber: "MZ202402020111",
          physicalExam: "无",
          dispose: "随诊",
          diagName: "高度近视",
          diagTime: "2024-02-02",
        },
        {
          patientId: "1309689045627559938",
          eyeSummary:
            "左/右眼眼压：(" +
            10 +
            "/" +
            10 +
            ")  |  " +
            "左/右眼裸眼视力：(" +
            0.1 +
            "/" +
            0.1 +
            ")  |  " +
            "左/右眼矫正视力：(" +
            "1.0" +
            "/" +
            "1.0" +
            ")  ",
          name: "艾弗森",
          mainAppeal: "视力逐渐下降2年，要求检查",
          pastHistory: "高度近视",
          presentIllness:
            "2年前开始出现视力逐渐下降，无眼红、眼痛，于当地眼镜店自行配镜。半年前开始视力下降加重，配镜视力无提高，现来我院就诊",
          allergy: "无特殊",
          specialOs: "双眼外观未见异常，屈光介质透明眼底呈近视改变",
          specialOd: "双眼外观未见异常，屈光介质透明眼底呈近视改变",
          visitNumber: "MZ202302020111",
          physicalExam: "无",
          dispose: "随诊",
          diagName: "高度近视",
          diagTime: "2023-02-02",
        },
        {
          patientId: "1309689045627559938",
          eyeSummary:
            "左/右眼眼压：(" +
            10 +
            "/" +
            10 +
            ")  |  " +
            "左/右眼裸眼视力：(" +
            0.1 +
            "/" +
            0.1 +
            ")  |  " +
            "左/右眼矫正视力：(" +
            "1.0" +
            "/" +
            "1.0" +
            ")  ",
          name: "艾弗森",
          mainAppeal: "视力逐渐下降2年，要求检查",
          pastHistory: "高度近视",
          presentIllness:
            "2年前开始出现视力逐渐下降，无眼红、眼痛，于当地眼镜店自行配镜。半年前开始视力下降加重，配镜视力无提高，现来我院就诊",
          allergy: "无特殊",
          specialOs: "双眼外观未见异常，屈光介质透明眼底呈近视改变",
          specialOd: "双眼外观未见异常，屈光介质透明眼底呈近视改变",
          visitNumber: "MZ202202020047",
          physicalExam: "无",
          dispose: "随诊",
          diagName: "高度近视",
          diagTime: "2022-02-02",
        },
      ],
      pdfDataList: [],
      value: "",
      formLabelWidth: "120px",
      iolmaster: "",
      labData: [
        {
          patientName: "艾弗森",
          isUrgent: 0,
          labItemName: "乙肝E抗体",
          reportName:
            "乙肝五项（定量分析法）+丙肝抗体发光法+HIV抗体检查+梅毒抗体发光法",
          patientId: "1796786711460069400",
          labItemCode: "Anti-HBe",
          refRange: "0-0.5",
          labResultSignName: null,
          labFinalValue: "0.01",
          visitingNo: "MZ202406010634",
          sexName: "男",
          patientBrithday: "1986-03-27 00:00:00",
          labResultUnitName: "S/CO",
          id: "1799240480341352400",
          auditDate: "2024-08-08 10:54:18",
        },
        {
          patientName: "艾弗森",
          isUrgent: 0,
          labItemName: "乙肝表面抗体",
          reportName:
            "乙肝五项（定量分析法）+丙肝抗体发光法+HIV抗体检查+梅毒抗体发光法",
          patientId: "1796786711460069400",
          labItemCode: "Anti-HBs",
          refRange: "0-10",
          labResultSignName: null,
          labFinalValue: "6.33",
          visitingNo: "MZ202406010634",
          sexName: "男",
          patientBrithday: "1986-03-27 00:00:00",
          labResultUnitName: "mIU/mL",
          id: "1799240480341352400",
          auditDate: "2024-08-08 10:54:18",
        },
      ],
    };
  },
  created() {
    // this.patientId = this.$route.query.id;
    this.patientName = this.$route.query.name;
    // this.getHistoryCase();
    // this.getLabData();
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleCheckReport(visitNumber) {
      // let obj = {
      //   patientId: this.$route.query.id,
      //   visitNumber: visitNumber,
      // };
      this.dialogCheckReportVisible = true;
      if (visitNumber === "2024-02-02")
        this.pdfDataList = [
          {
            checkReports: {
              itemName: "眼底扫描激光图",
              checkTime: "2024-02-02",
            },
            url: [
              "http://43.136.178.202:8088/images/slo1.png",
              "http://43.136.178.202:8088/images/slo2.png",
            ],
          },
          {
            checkReports: {
              itemName: "光学相干断层成像（OCT）",
              checkTime: "2024-02-02",
            },
            url: [
              "http://43.136.178.202:8088/images/oct.png",
            ],
          },
          {
            checkReports: {
              itemName: "IOL",
              checkTime: "2024-02-02",
            },
            url: [
              "http://43.136.178.202:8088/images/iol.png",
            ],
          },
        ] 
        else if (visitNumber === "2023-02-02")
        this.pdfDataList = [
          {
            checkReports: {
              itemName: "眼底扫描激光图",
              checkTime: "2023-02-02",
            },
            url: [
              "http://43.136.178.202:8088/images/slo1.png",
              "http://43.136.178.202:8088/images/slo2.png",
            ],
          },
          {
            checkReports: {
              itemName: "光学相干断层成像（OCT）",
              checkTime: "2023-02-02",
            },
            url: [
              "http://43.136.178.202:8088/images/oct.png",
            ],
          }
        ]
        else 
        this.pdfDataList = [
          {
            checkReports: {
              itemName: "眼底扫描激光图",
              checkTime: "2022-02-02",
            },
            url: [
              "http://43.136.178.202:8088/images/slo1.png",
              "http://43.136.178.202:8088/images/slo2.png",
            ],
          },
          {
            checkReports: {
              itemName: "光学相干断层成像（OCT）",
              checkTime: "2022-02-02",
            },
            url: [
              "http://43.136.178.202:8088/images/oct.png",
            ],
          },
          {
            checkReports: {
              itemName: "光学相干断层成像（OCT）",
              checkTime: "2022-02-02",
            },
            url: [
              "http://43.136.178.202:8088/images/oct.png"
            ],
          }
        ]
      // api
      //   .getCaseTimelineReport(obj)
      //   .then((res) => {
      //     if (res.data.code == 200) {
      //       // console.log(res);
      //     }
      //   })
      //   .catch((error) => {})
      //   .finally(() => {});
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