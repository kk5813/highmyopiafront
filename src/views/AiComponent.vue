<template>
  <div class="ai-diagnosis-container">
      <el-main style="margin-top:0">

        <el-row
          type="flex"
          justify="center"
          style="margin-top: 20px; align-items: center"
        >
          <!-- 原图表格 -->
          <el-col
            :span="12"
            style="display: flex; justify-content: center"
            v-loading="loadOriginImage"
            v-if="showOriginImage"
          >
            <div style="width: 80%">
              <div>
                
                <el-select
                  style="width: 200px; margin-bottom: 20px; font-size: 16px"
                  v-model="selectedModel"
                  placeholder="请选择疑似病症"
                  v-on:change="handleAiImg()"
                  :disabled="showOriginImage == false"
                >
                  <el-option
                    v-for="item in modelOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <el-table
                :max-height="tableHeight"
                class="elTable" 
                :data="imgList"
                border
                :cell-style="{
                  borderColor: '#409eff',
                  borderWidth: '2px',
                }"
                :header-cell-style="{
                  fontSize: '20px',
                  borderColor: '#409eff',
                  borderWidth: '2px',
                }"
                style="width: 100%; border-radius: 10px; font-size: 20px"
              >
                <el-table-column
                  min-width="20%"
                  prop="description"
                  label="原始图像"
                  align="center"
                  class-name="columnHead"
                ></el-table-column>
                <el-table-column
                  min-width="80%"
                  prop="url"
                  label="图像(点击图片查看大图)"
                  align="center"
                >
                  <template #default="scope">
                    <el-image
                      :src="scope.row.url[0]"
                      :preview-src-list="scope.row.url"
                    >
                    </el-image>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>

          <!-- 自定义分割线 -->
          <div
            v-if="showAiImage"
            style="
              height: 70vh;
              width: 3px;
              background-color: #409eff;
              margin: 0 20px;
              align-self: center;
            "
          ></div>

          <!-- AI图片表格 -->
          <el-col
            :span="12"
            style="display: flex; justify-content: center"
            v-if="showAiImage"
            v-loading="loadAiImage"
          >
            <div style="width: 80%; display: flex; flex-direction: column">
              <el-table
                :max-height="tableHeight"
                class="elTable"
                :data="AiImgList"
                :cell-style="{ borderColor: '#409eff', borderWidth: '2px' }"
                :header-cell-style="{
                  fontSize: '20px',
                  borderColor: '#409eff',
                  borderWidth: '2px',
                }"
                style="width: 100%; border-radius: 10px; font-size: 20px"
                border
              >
                <el-table-column
                  min-width="20%"
                  prop="resultInfo"
                  label="AI诊断结果"
                  align="center"
                ></el-table-column>
                <el-table-column
                  min-width="80%"
                  prop="url"
                  label="图像(点击图片查看大图)"
                  align="center"
                >
                  <template #default="scope">
                    <el-image
                      v-if="scope.row.url[0]"
                      :src="scope.row.url[0]"
                      :preview-src-list="scope.row.url"
                    >
                    </el-image>
                    <h4 v-if="!scope.row.url[0]">该阶段无图像输出</h4>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>

        <el-row
          type="flex"
          justify="center"
          style="margin-top: 50px; align-items: center"
          v-if="showAiImage"
        >
          <div style="width: 100%; margin-top: 20px; margin-left: -80px">
            <el-button type="primary" @click="addFollowup()"
              >添加随访<i class="el-icon-upload el-icon--right"></i
            ></el-button>
          </div>
        </el-row>

        <!--                            新增随访          -->
        <el-dialog
          title="添加随访"
          :visible.sync="dialogAddFormVisible"
          width="30%"
        >
          <el-form :model="addFollowForm">
            <el-form-item label="患者ID" :label-width="formLabelWidth">
              <el-input v-model="addFollowForm.patientId" autocomplete="off">{{
                this.patientId
              }}</el-input>
            </el-form-item>
            <el-form-item label="计划随访日期" :label-width="formLabelWidth">
              <el-date-picker
                style="float: left"
                v-model="addFollowForm.planVisitDate"
                align="left"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="随访计划" :label-width="formLabelWidth">
              <el-input
                v-model="addFollowForm.visitPlan"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAddFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitAddShortInfoForm()"
              >确 定</el-button
            >
          </div>
        </el-dialog>
      </el-main>
  </div>
</template>

<script>
import api from "@/api/apiManage";
export default {
  name: "AIComponent",
  props: ['patientId'],
  inject: ["reload"],
  data() {
    return {
      tableHeight: 0,
      pdfDataList: [
        {
          checkReports: {
            itemName: "眼底扫描激光图",
            checkTime: "2024-02-02",
          },
          url: [
            "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
            "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg",
          ],
        },
        {
          checkReports: {
            itemName: "光学相干断层成像（OCT）",
            checkTime: "2024-02-02",
          },
          url: [
            "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
            "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg",
          ],
        },
        {
          checkReports: {
            itemName: "IOL",
            checkTime: "2024-02-02",
          },
          url: [
            "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
            "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg",
          ],
        },
      ],
      selectedModel: "",
      pickerOptions: {
        //          日期限制，只能选择今日以后的时间
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      formLabelWidth: "120px",
      loadOriginImage: false,
      loadAiImage: false,
      showOriginImage: false,
      showAiImage: false,
      imgList: [],
      AiImgList: [],
    //   search: "",
      dialogAddFormVisible: false,
      addFollowForm: {
        id: "",
        patientId: "",
        planVisitDate: "",
        visitPlan: "",
        visitRemark: "",
        visitResult: "",
        visitDate: "",
        visitContent: "",
        nextVisitDate: "",
      },
      modelOptions: [
        {
          value: "1",
          label: "糖网",
        },
        {
          value: "2",
          label: "高度近视",
        },
      ],
      aiDiagResult: "白内障",
    };
  },
  created() {
    this.handleOriginImg();
    this.getAiDisease();
  },
  methods: {
    tableCellClassName({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return "left-border";
      }
      return "";
    },
    getAiDisease() {
      const _this = this;
      this.handleOriginImg();
      api
        .getAiDisease()
        .then((res) => {
          if (res.data.code === 200) {
            let deseaseData = res.data.data;
            let opData = [];
            deseaseData.forEach((item, index) => {
              opData.push({
                label: item.name,
                value: item.id,
                description: item.description,
              });
            });
            _this.modelOptions = opData;
          }
        })
        .catch((error) => {})
        .finally(() => {});
    },
    addFollowup(index, row) {
      const _this = this;
      this.addFollowForm.patientId = this.patientId;
      _this.dialogAddFormVisible = true;
    },
    submitAddShortInfoForm() {
      this.dialogAddFormVisible = false;
      api
        .addFollowup(this.addFollowForm)
        .then((res) => {
          if (res.data.code === 200) {
            this.$message({
              message: "添加成功",
              type: "success",
            });
          }
        })
        .catch((error) => {
          this.$message.error("添加失败");
        })
        .finally(() => {});
    },
    handleAiImg() {
      this.showAiImage = true;
      this.loadAiImage = true;
      const _this = this;
      let allObj = {
        diseaseId: this.selectedModel,
        userId: sessionStorage.getItem("userId"),
        patientId: this.patientId,
      };
      console.log(allObj)
      api
        .getAiDiagnose(allObj)
        .then((res) => {
          let aiResult = [];
          let urlList = [];
          if (res.data.code === 200) {
            console.log(res);
            aiResult = res.data.data;
            aiResult.forEach((item, index) => {
              urlList = item.url.split(",");
              urlList.forEach((item, index) => {
                if (item)
                  urlList[index] = "http://43.136.178.202:8088" + "/images/" + item;
              });
              aiResult[index].url = urlList;
            });
            _this.AiImgList = aiResult;
          }
        })
        .catch((error) => {})
        .finally(() => {
          this.loadAiImage = false;
        });
    },
    handleOriginImg() {
      api
        .getPatientTodayReport(this.patientId)
        .then((res) => {
          let originData;
          let originImgList = [];
          if (res.data.code == 200) {
            this.imgList = [];
            this.showAiImage = false;
            this.loadAiImage = false;
            this.selectedModel = "";
            this.showOriginImage = true;
            this.loadOriginImage = true;
            originData = res.data.data;
            console.log(originData)
            // console.log(originData.keys())
            // originData.forEach((item,index) => {
            //   let imgsUrl = item.split(',')
            //   imgsUrl.forEach((item,index) => {
            //     imgsUrl[index] = 'process.env.VUE_APP_API_BASE_URL/images/' + item
            //   })
            //   originImgList.push({description: index,url: imgsUrl})
            // })
            this.imgList.push({
              description: Object.keys(originData)[0],
              url: [
                "http://43.136.178.202:8088" +
                  "/images/" +
                  Object.values(originData)[0],
              ],
            });
          }
        })
        .catch((error) => {
          this.$message.error("查找患者ID失败");
        })
        .finally(() => {
          this.loadOriginImage = false;
        });
    },

    AIadvice() {
      this.$alert(this.aiDiagResult, "AI诊断结果", {
        confirmButtonText: "确定",
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 120;
      //后面的50：根据需求空出的高度，自行调整
    });
  },
};
</script>

<style scoped>
/* 调整容器高度 */
.ai-diagnosis-container {
  height: calc(100vh - 160px);
  overflow: auto;
}

.el-main {
  /* display: flex(center, center, row); */
  height: calc(100vh - 60px - 50px);
  width: 100%;
  margin-top: 50px;
  background-color: #e9eef3;
  color: #333;

  text-align: center;
  /* height: 1000px; */
  /* overflow: hidden; */
  overflow: auto;
}

.el-divider {
  background-color: #409eff;
}

.elTable {
  border: 2px solid #409eff;
}

.el-Table /deep/ .el-table--border {
  border-radius: 10px
}

</style>