<template>
  <div>
    <el-container>
      <el-header>
        <Header active-index="/AIdiagnosis"></Header>
      </el-header>
      <el-main>
        <el-steps :active="active" align-center>
          <el-step
            title="输入患者ID"
            description="请输入患者ID(非就诊号)"
          ></el-step>
          <el-step
            title="选择模型"
            description="请选择需要使用的诊断模型"
          ></el-step>
          <el-step
            title="识图结果展示"
            description="根据最新检查图像生成智能诊断结果(点击图像可查看大图)"
          ></el-step>
          <el-step title="诊断结果确认" description="请确认诊断结果"></el-step>
        </el-steps>
        <div v-show="activeName == 'inputId'">
          <el-input placeholder="请输入内容" v-model="patientId" clearable>
          </el-input>
          <el-button style="margin-top: 12px" @click="next">下一步</el-button>
        </div>
        <div>
          <div v-show="activeName == 'selectModel'">
            <el-collapse v-model="modelId" accordion>
              <el-collapse-item title="糖尿病黄斑水肿" name="1">
                <div>
                  该模型需要使用患者的超广角图像以及OCT图像进行诊断，将输出患者是否患有糖尿病黄斑水肿或其他眼科疾病。
                  若患有糖尿病黄斑水肿则进一步对患者OCT图像中的病灶进行分割。
                </div>
                <el-tag type="success" effect="dark" @click="next"
                  >选择该模型</el-tag
                >
              </el-collapse-item>
              <el-collapse-item title="视网膜静脉阻塞" name="2">
                <div>
                  该模型需要使用患者的超广角图像以及OCT图像进行诊断，将输出患者是否患有视网膜静脉阻塞，以及视网膜静脉阻塞的类型。
                  若患有视网膜静脉阻塞则进一步对患者OCT图像中的病灶进行分割。
                </div>
                <el-tag type="success" effect="dark" @click="next"
                  >选择该模型</el-tag
                >
              </el-collapse-item>
              <el-collapse-item title="病理性近视" name="3">
                <div>
                  该模型需要使用患者的超广角图像以及OCT图像进行诊断，将输出患者是否患有视网膜静脉阻塞，以及视网膜静脉阻塞的类型。
                  若患有视网膜静脉阻塞则进一步对患者OCT图像中的病灶进行分割。
                </div>
                <el-tag type="success" effect="dark" @click="next"
                  >选择该模型</el-tag
                >
              </el-collapse-item>
              <el-collapse-item title="青光眼" name="4">
                <div>
                  该模型需要使用患者的超广角图像以及OCT图像进行诊断，将输出患者是否患有视网膜静脉阻塞，以及视网膜静脉阻塞的类型。
                  若患有视网膜静脉阻塞则进一步对患者OCT图像中的病灶进行分割。
                </div>
                <el-tag type="success" effect="dark" @click="next"
                  >选择该模型</el-tag
                >
              </el-collapse-item>
              <el-collapse-item title="角膜炎" name="5">
                <div>
                  该模型需要使用患者的超广角图像以及OCT图像进行诊断，将输出患者是否患有视网膜静脉阻塞，以及视网膜静脉阻塞的类型。
                  若患有视网膜静脉阻塞则进一步对患者OCT图像中的病灶进行分割。
                </div>
                <el-tag type="success" effect="dark" @click="next"
                  >选择该模型</el-tag
                >
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        <div>
          <div v-show="activeName == 'showOutput'">
            <el-row :gutter="20">
              <el-col :span="6" v-for="img in userdImgs" :key="img">
                <el-card :body-style="{ padding: '0px' }">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="img.path"
                    :preview-src-list="img.path"
                    class="image"
                  >
                  </el-image>
                  <div style="padding: 14px">
                    <span>{{ img.type }}</span>
                    <div class="bottom clearfix">
                      <el-tag effect="dark" class="tag">原影像</el-tag>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6" v-for="img in outputImgs" :key="img">
                <el-card :body-style="{ padding: '0px' }">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="img.path"
                    :preview-src-list="img.path"
                    class="image"
                  >
                  </el-image>
                  <div style="padding: 14px">
                    <span>{{ img.type }}</span>
                    <div class="bottom clearfix">
                      <el-tag effect="dark" class="tag">AI处理影像</el-tag>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <el-button type="text" @click="AIadvice"
              >点击查看AI诊断结果</el-button
            >
            <el-button style="margin-top: 12px" @click="next">下一步</el-button>
          </div>
        </div>
        <div>
          <div v-show="activeName == 'confirmOutput'">
            <el-form class="diagnosis-result">
              <el-form-item label="诊断结论">
                <el-input v-model="diagData.diagName"></el-input>
              </el-form-item>
              <el-form-item label="治疗建议">
                <el-input v-model="diagData.recommend"></el-input>
              </el-form-item>
              <el-form-item label="诊断医生">
                <el-input
                  v-model="diagData.doctorName"
                  placeholder="暂无"
                ></el-input>
              </el-form-item>
              <el-form-item label="复诊计划">
                <el-select v-model="diagData.plan">
                  <el-option label="一周" value="7"></el-option>
                  <el-option label="两周" value="14"></el-option>
                  <el-option label="一月" value="30"></el-option>
                  <el-option label="三月" value="90"></el-option>
                  <el-option label="半年" value="180"></el-option>
                  <el-option label="一年" value="365"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <el-button style="margin-top: 12px" @click="next">确认</el-button>
          </div>
        </div>
      </el-main>
      <el-footer
        >爱尔眼科慢病管理系统( 推荐使用IE9+,Firefox、Chrome 浏览器访问
        )</el-footer
      >
    </el-container>
  </div>
</template>

<script>
import Header from "../components/Header";
export default {
  name: "AIdiagnosis",
  components: { Header },
  inject: ["reload"],
  data() {
    return {
      modelId: "1",
      active: 0,
      patientId: "",
      activeName: "inputId",
      //   这里每张图片中地址path使用list是因为el-image对需要预览图片的输入需要是list ==> preview-src-list
      outputImgs: [
        {
          path: ["/img/OPT/000805-20190727@090508-L2-S.jpg"],
          type: "超广角",
        },
        {
          path: ["/img/OPT/011339-20201124@111236-L3-S.jpg"],
          type: "OCT",
        },
      ],
      userdImgs: [
        {
          path: ["/img/OPT/000805-20190727@090508-L2-S.jpg"],
          type: "超广角",
        },
        {
          path: ["/img/OPT/011339-20201124@111236-L3-S.jpg"],
          type: "OCT",
        },
      ],
      diagData: {
        diagName: "干眼综合征",
        doctorName: "AI",
        plan: "",
        recommend: "",
      },
      aiDiagResult: "白内障",
    };
  },
  created() {
    // this.getPatientData();
  },
  methods: {
    next() {
      if (this.active++ > 2) this.active = 0;
      if (this.active == 0) this.activeName = "inputId";
      else if (this.active == 1) this.activeName = "selectModel";
      else if (this.active == 2) this.activeName = "showOutput";
      else if (this.active == 3) this.activeName = "confirmOutput";
      else this.activeName == "inputId";
      console.log(this.activeName);
    },
    AIadvice() {
      this.$alert(this.aiDiagResult, "AI诊断结果", {
        confirmButtonText: "确定",
        callback: (action) => {
          this.$message({
            type: "info",
            message: `action: ${action}`,
          });
        },
      });
    },
  },
};
</script>

<style scoped>
.el-header,
.el-footer {
  width: 100%;
  position: fixed;

  left: 0;
  padding: 0;
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 65px;
}
.el-footer {
  bottom: 0;
  font-size: 10px;
}
.el-header {
  top: 0;
}
.el-main {
  width: 100%;
  margin-top: 60px;
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  height: 850px;
}
.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.tag {
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>