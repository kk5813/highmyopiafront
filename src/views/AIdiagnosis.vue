<template>
  <div>
    <el-container>
      <el-header>
        <Header active-index="/AIdiagnosis"></Header>
      </el-header>
      <el-main>
        <!-- 搜索框行 -->
        <el-row>
          <el-col
            :span="6"
            style="width: 200px; position: fixed; top: 70px; z-index: 999"
          >
            <el-input
              style="width: 200px"
              placeholder="请输入患者ID"
              v-model="search"
              clearable
            >
            </el-input>
          </el-col>
          <el-col
            :span="2"
            style="position: fixed; top: 70px; left: 210px; z-index: 999"
          >
            <el-button
              type="primary"
              @click="handleOriginImg()"
              icon="el-icon-search"
              >确 定</el-button
            >
          </el-col>
          <el-col
            :span="2"
            style="position: fixed; top: 70px; z-index: 999; left: 400px"
          >
            <el-select
              style="width: 200px"
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
          style="margin-top: 50px"
          v-loading="loadOriginImage"
          v-show="showOriginImage"
        >
          <el-col :span="12">
            <el-table
              :data="imgList"
              max-height="500"
              style="width: 73%; border-radius: 20px"
            >
              <el-table-column
                prop="description"
                label="原始图像"
                width="200"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="url"
                label="图像(点击图片查看)"
                width="200"
                align="center"
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

            <!-- <div style="width: 90vw; color: #606266">
              <h3>患者原始图像</h3>
            </div>
            <div class="container">
              <div
                v-for="(item, index) in imgList"
                :key="index"
                class="panel active"
                :style="{ 'background-image': 'url(' + item.imgUrl + ')' }"
              >
                <h3>{{ item.content }}</h3>
              </div>
            </div> -->
          </el-col>
        </el-row>

        <el-divider v-if="showAiImage"></el-divider>

        <!-- AI处理图片行列 -->
        <el-row
          type="flex"
          justify="center"
          style="margin-top: 50px"
          v-show="showAiImage"
          v-loading="loadAiImage"
        >
          <el-col :span="12">
            <el-table
              :data="AiImgList"
              max-height="500"
              style="padding: 0; width: 73%; border-radius: 20px"
            >
              <el-table-column
                prop="resultInfo"
                label="AI诊断结果"
                width="200"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="url"
                label="图像(点击图片查看)"
                width="200"
                align="center"
              >
                <template #default="scope">
                  <el-image
                    v-if="scope.row.url[0]"
                    style="width: 100px; height: 100px"
                    :src="scope.row.url[0]"
                    :preview-src-list="scope.row.url"
                  >
                  </el-image>
                </template>
              </el-table-column>
            </el-table>
            <!-- <div style="width: 90vw; color: #606266">
              <h3 style="width: 90vw;display:block;">AI生成图像</h3>
            </div>
            <div class="container">
              <div
                v-for="(item, index) in AiImgList"
                :key="index"
                class="panel active"
                :style="{ 'background-image': 'url(' + item.imgUrl + ')' }"
              >
                <h3>{{ item.content }}</h3>
              </div>
            </div> -->

            <div style="width: 100%; margin-top: 20px; margin-left: -80px">
              <el-button type="primary" @click="addFollowup()"
                >添加随访<i class="el-icon-upload el-icon--right"></i
              ></el-button>
            </div>
          </el-col>
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
      api
        .getAiDiagnose(allObj)
        .then((res) => {
          let aiResult = [];
          let urlList = [];
          if (res.data.code == 200) {
            console.log(res);
            aiResult = res.data.data;
            aiResult.forEach((item, index) => {
              urlList = item.url.split(",");
              urlList.forEach((item, index) => {
                if (item)
                  urlList[index] = "http://localhost:8081/images/" + item;
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
            this.selectedModel = ""
            this.showOriginImage = true;
            this.loadOriginImage = true;
            originData = res.data.data;
            // console.log(originData.keys())
            // originData.forEach((item,index) => {
            //   console.log()
            //   let imgsUrl = item.split(',')
            //   imgsUrl.forEach((item,index) => {
            //     imgsUrl[index] = 'http://localhost:8081/images/' + item
            //   })
            //   originImgList.push({description: index,url: imgsUrl})
            // })
            this.imgList.push({
              description: Object.keys(originData)[0],
              url: [
                "http://localhost:8081/images/" + Object.values(originData)[0],
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
    const panels = document.querySelectorAll(".panel");
    panels.forEach((panel) => {
      panel.addEventListener("click", () => {
        removeActiveClasses();
        panel.classList.add("active");
      });
    });

    function removeActiveClasses() {
      panels.forEach((panel) => {
        panel.classList.remove("active");
      });
    }
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
</style>