<template>
  <div>
    <el-container>
      <el-header>
        <Header active-index="/AIdiagnosis"></Header>
      </el-header>
      <el-main>
        <!-- 搜索框行 -->
        <!-- <el-row>
          <el-col :span="6" style="position: fixed; top: 70px; z-index: 999">
            <el-input placeholder="患者ID" v-model="search" clearable>
              <template slot="prepend">请输入患者就诊号</template>
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
        </el-row> -->

        <!-- 原图图片展示行 -->
        <!-- <el-empty
          v-if="!showOriginImage"
          description="暂无数据"
          style="width: 100vw; margin-top: 20px"
        ></el-empty>
        <el-row
          type="flex"
          justify="center"
          style="margin-top: 50px; align-items: center"
        > -->
        <!-- 原图表格 -->
        <!-- <el-col
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
          </el-col> -->

        <!-- 自定义分割线 -->
        <!-- <div
            v-if="showAiImage"
            style="
              height: 70vh;
              width: 3px;
              background-color: #409eff;
              margin: 0 20px;
              align-self: center;
            "
          ></div> -->
        <!-- <div style="width: 80%">
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
        </div> -->
        <!-- AI图片表格 -->
        <!-- <el-row
          type="flex"
          justify="center"
          style="margin-top: 50px; align-items: center"
        >
          <el-col
            :span="16"
            style="display: flex; justify-content: center"
            v-if="showAiImage"
            v-loading="loadAiImage"
          >
            <div style="width: 80%; display: flex; flex-direction: column">
              <el-carousel
                indicator-position="outside"
                :autoplay="false"
                height="700px"
                @change="changeEyes()"
              >
                <el-carousel-item v-for="item in 2" :key="item">
                  <el-table
                    :max-height="tableHeight"
                    class="elTable"
                    :data="AiImgList[item]"
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
                </el-carousel-item>
              </el-carousel> -->
        <!-- <el-table
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
              </el-table> -->
        <!-- </div>
          </el-col>
        </el-row> -->

        <!-- <el-row
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
        </el-row> -->

        <el-steps
          :active="activeStep"
          align-center
          class="steps-container"
          finish-status="success"
        >
          <el-step
            title="输入门诊号"
            description="请输入患者门诊号码"
          ></el-step>
          <el-step title="选择病症" description="请选择疑似病症类型"></el-step>
          <el-step title="诊断结果" description="查看AI诊断分析结果"></el-step>
        </el-steps>

        <!-- 步骤内容容器 -->
        <div class="step-content">
          <!-- 第一步：输入门诊号 -->
          <div v-show="activeStep === 0" class="step-pane">
            <el-card class="input-card" shadow="never">
              <div class="input-container">
                <el-input
                  v-model="search"
                  placeholder="请输入患者门诊号(MZ···)"
                  clearable
                  size="large"
                  class="custom-input"
                >
                  <template #prepend>
                    <span class="input-prepend">门诊号</span>
                  </template>
                </el-input>
                <el-button
                  type="primary"
                  size="large"
                  class="next-btn"
                  @click="handleNextStep(0)"
                >
                  下一步
                  <i class="el-icon-arrow-right el-icon--right"></i>
                </el-button>
              </div>
            </el-card>
          </div>

          <!-- 第二步：选择病症 -->
          <div v-show="activeStep === 1" class="step-pane">
            <el-card class="select-card" shadow="never">
              <div class="select-container">
                <el-select
                  v-model="selectedModel"
                  placeholder="请选择疑似病症"
                  size="large"
                  class="custom-select"
                >
                  <el-option
                    v-for="item in modelOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <div class="action-btns">
                  <el-button size="large" @click="activeStep--">
                    上一步
                  </el-button>
                  <el-button
                    type="primary"
                    size="large"
                    @click="
                      handleNextStep(1);
                      handleAiImg();
                    "
                  >
                    下一步
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>

          <!-- 第三步：显示结果 -->
          <div
            v-show="activeStep === 2"
            class="result-pane"
            v-loading="loadAiImage"
          >
            <el-button
              size="large"
              @click="activeStep--"
              class="back-btn"
              v-show="!loadAiImage"
            >
              返回
            </el-button>
            <!-- 原有轮播表格内容 -->
            <div class="result-container">
              <el-empty description="暂无数据" v-if="!(AiImgList.length > 0)"></el-empty>
              <el-carousel
                trigger="click"
                :arrow="arrowStatus"
                type="card"
                height="90vh"
                indicator-position="none"
                :autoplay="false"
                style="--el-carousel-arrow-font-color: #ff4949"
              >
                <el-carousel-item
                  v-for="(item, index) in AiImgList"
                  :key="index"
                >
                  <el-table
                    :max-height="tableHeight"
                    class="elTable"
                    :data="item"
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
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
        </div>

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
        >爱尔眼科慢病管理系统( 推荐使用Edge,Firefox、Chrome 浏览器访问
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
      arrowStatus: "never",
      tableHeight: 0,
      activeStep: 0,
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
      modelOptions: [],
    };
  },
  created() {
    // this.test();
    this.getAiDisease();
  },
  methods: {
    handleNextStep(step) {
      // 验证逻辑
      if (step === 0 && !this.search) {
        this.$message.warning("请输入有效的就诊号");
        return;
      }
      if (step === 1 && !this.selectedModel) {
        this.$message.warning("请选择疑似病症");
        return;
      }
      this.activeStep++;
    },
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
      if (!this.selectedModel) return;
      this.loadAiImage = true;
      const _this = this;
      let allObj = {
        diseaseId: this.selectedModel,
        userId: sessionStorage.getItem("userId"),
        visitNumber: this.search,
      };
      api
        .getAiDiagnose(allObj)
        .then((res) => {
          let aiResults = [];
          let urlList = [];
          if (res.data.code === 200) {
            aiResults = res.data.data;
            if (Array.isArray(aiResults)) {
              aiResults.forEach((singleEye, index) => {
                singleEye.forEach((item, index) => {
                  urlList = item.url.split(",");
                  urlList.forEach((item, index) => {
                    if (item)
                      urlList[index] =
                        process.env.VUE_APP_API_BASE_URL + "/images/" + item;
                  });
                  singleEye[index].url = urlList;
                });
                aiResults[index] = singleEye;
              });
            }
            _this.AiImgList = aiResults;
          }
        })
        .catch((error) => {})
        .finally(() => {
          if (_this.AiImgList.length > 1) this.arrowStatus = "always";
          this.loadAiImage = false;
        });
    },
    // handleOriginImg() {
    //   // 处理按钮点击后不恢复颜色的bug
    //   let target = event.target;
    //   if (target.nodeName == "SPAN") {
    //     target = event.target.parentNode;
    //   }
    //   target.blur();
    //   api
    //     .getPatientTodayReport(this.search)
    //     .then((res) => {
    //       let originData;
    //       let originImgList = [];
    //       if (res.data.code == 200) {
    //         this.imgList = [];
    //         this.showAiImage = false;
    //         this.loadAiImage = false;
    //         this.selectedModel = "";
    //         this.showOriginImage = true;
    //         this.loadOriginImage = true;
    //         originData = res.data.data;
    //         if (Array.isArray(originData)) {
    //           let urls = [];
    //           originData.forEach((item, index) => {
    //             let imgsUrl = item.split(",");
    //             imgsUrl.forEach((item, index) => {
    //               urls[index] =
    //                 process.env.VUE_APP_API_BASE_URL + "images/" + item;
    //             });
    //             this.imgList.push({
    //               description: index,
    //               url: urls,
    //             });
    //             urls = [];
    //           });
    //         } else {
    //           let urls = [];
    //           if (Object.values(originData)[0].split(",").length > 1) {
    //             let imgs = Object.values(originData)[0].split(",");
    //             imgs.forEach((item, index) => {
    //               urls[index] = process.env.VUE_APP_API_BASE_URL + item;
    //             });
    //           } else {
    //             urls = [
    //               process.env.VUE_APP_API_BASE_URL +
    //                 "/images/" +
    //                 Object.values(originData)[0],
    //             ];
    //           }
    //           this.imgList.push({
    //             description: Object.keys(originData)[0],
    //             url: urls,
    //           });
    //         }
    //       }
    //     })
    //     .catch((error) => {
    //       this.$message.error("加载失败");
    //     })
    //     .finally(() => {
    //       this.loadOriginImage = false;
    //     });
    // },

    test() {
      let aiResults = [];
      let urlList = [];
      aiResults = [
        [
          {
            resultInfo: "右眼",
            url: "slo1.png",
          },
          {
            resultInfo: "非四期",
            url: "",
          },
          {
            resultInfo: "视盘划分",
            url: "bingzao.jpg,oct.png,bingzao.jpg,iol.png",
          },
          {
            resultInfo: "检测病灶输出",
            url: "a.png,iol.png,oct.png,475a1279-71c7-47c0-ba69-8481f4eb2daf.png",
          },
        ],
        [
          {
            resultInfo: "左眼",
            url: "bingzao.jpg",
          },
          {
            resultInfo: "非四期",
            url: "",
          },
          {
            resultInfo: "视盘划分",
            url: "bingzao.jpg,oct.png,bingzao.jpg,iol.png",
          },
          {
            resultInfo: "检测病灶输出",
            url: "a.png,iol.png,oct.png,475a1279-71c7-47c0-ba69-8481f4eb2daf.png",
          },
        ],
      ];
      if (Array.isArray(aiResults)) {
        aiResults.forEach((singleEye, index) => {
          singleEye.forEach((item, index) => {
            urlList = item.url.split(",");
            urlList.forEach((item, index) => {
              if (item)
                urlList[index] =
                  process.env.VUE_APP_API_BASE_URL + "/images/" + item;
            });
            singleEye[index].url = urlList;
          });
          aiResults[index] = singleEye;
        });
      }
      if (aiResults.length > 1) this.arrowStatus = "always";
      this.AiImgList = aiResults;
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
  border-radius: 10px;
}

::v-deep .el-carousel__arrow {
  background-color: #409eff;
  color: #fff;
}

::v-deep .el-carousel__arrow:hover {
  background-color: #67c23a;
  color: #fff;
}

/* 步骤条样式 */
.steps-container {
  margin: 20px auto;
  max-width: 800px;
  padding: 20px 0;
}

/* 步骤内容容器 */
.step-content {
  margin: 40px auto;
  max-width: 80%;
}

/* 输入卡片样式 */
.input-card,
.select-card {
  background: transparent;
  border: none;
}

.input-container,
.select-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.custom-input {
  width: 500px;
}

.custom-input :deep(.el-input-group__prepend) {
  background: #f5f7fa;
  border: none;
  padding: 0 20px;
}

.input-prepend {
  font-size: 16px;
  color: #606266;
}

.custom-select {
  width: 500px;
}

.next-btn {
  width: 200px;
}

.action-btns {
  display: flex;
  gap: 20px;
  justify-content: center;
  width: 100%;
}

/* 结果容器 */
.result-pane {
  position: relative;
}

.back-btn {
  position: absolute;
  left: 70vw;
  top: -60px;
}

.result-container {
  margin-top: 30px;
  border-radius: 8px;
  overflow: hidden;
  /* box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); */
}

/* 响应式调整 */
@media (max-width: 768px) {
  .custom-input,
  .custom-select {
    width: 100%;
  }

  .steps-container {
    padding: 10px;
  }
}
</style>