<template>
  <div>
    <el-container>
      <el-header>
        <Header active-index="/AIdiagnosis"></Header>
      </el-header>
      <el-main>
        <!-- 搜索框行 -->
        <el-row>
          <el-col :span="6" style="position: fixed; top: 70px; z-index: 999">
            <el-input placeholder="患者ID" v-model="search" clearable>
              <template slot="prepend">请输入患者ID</template>
              <template slot="append" style="background-color: blue"
                ><el-button
                  type="primary"
                  @click="handleOriginImg()"
                  icon="el-icon-search"
                  >确 定</el-button
                ></template
              >
            </el-input>
          </el-col>
        </el-row>

        <!-- 原图图片展示行 -->
        <el-empty
          v-if="!showOriginImage"
          description="暂无数据"
          style="width: 100vw; margin-top: 20px"
        ></el-empty>
        <el-row
          type="flex"
          justify="center"
          style="margin-top: 50px; align-items: center"
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
                  label="图像(点击图片查看)"
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
                  label="图像(点击图片查看)"
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
                this.search
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
      <el-footer
        >爱尔眼科慢病管理系统( 推荐使用IE9+,Firefox、Chrome 浏览器访问
        )</el-footer
      >
    </el-container>
  </div>
</template>

<script>
import originImage from "../components/originImage";
import Header from "../components/Header";
import api from "@/api/apiManage";
export default {
  name: "AIdiagnosis",
  components: { Header, originImage },
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
      search: "",
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
      this.addFollowForm.patientId = this.search;
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
        patientId: this.search,
      };
      console.log(allObj);
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
                  urlList[index] = "http://43.136.178.202:8088/images/" + item;
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
      // 处理按钮点击后不恢复颜色的bug
      let target = event.target;
      if (target.nodeName == "SPAN") {
        target = event.target.parentNode;
      }
      target.blur();
      api
        .getPatientTodayReport(this.search)
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
            // console.log(originData.keys())
            // originData.forEach((item,index) => {
            //   console.log()
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
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: Arial, Helvetica, sans-serif;
}
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
.bottom {
  margin-top: 13px;
  line-height: 12px;
}

/* 定义了如何计算一个元素的总宽高： border-box不包含margin */
* {
  box-sizing: border-box;
}

/* 采用flex布局 */
body {
  font-family: "Muli", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow: hidden;
  margin: 0;
}

.container {
  display: flex;
  width: 90vw;
}

.panel {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 80vh;
  border-radius: 50px;
  color: #fff;
  cursor: pointer;
  flex: 0.5;
  margin: 10px;
  position: relative;
  -webkit-transition: all 700ms ease-in;
}

.panel h3 {
  font-size: 24px;
  position: absolute;
  bottom: 20px;
  left: 20px;
  margin: 0;
  opacity: 0;
}

.panel.active {
  flex: 5;
}

.panel.active h3 {
  opacity: 1;
  transition: opacity 0.3s ease-in 0.4s;
}

@media (max-width: 480px) {
  .container {
    width: 100vw;
  }

  .panel:nth-of-type(4),
  .panel:nth-of-type(5) {
    display: none;
  }
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