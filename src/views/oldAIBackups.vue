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
          <div id="sss" class="search_container">   
          </div>
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
            <!-- <div class="container">
              <div class="box" style="--clr: #00a6bc">
                <div class="content">
                  <div class="icon"><i class="fa fa-paint-brush"></i></div>
                  <div class="text">
                    <h3>UI设计</h3>
                    <p>
                      UI设计（或称界面设计）UI即User
                      Interface(用户界面)的简称，它分为实体UI和虚拟UI，互联网常用的UI设计是虚拟UI。
                    </p>
                    <a href="http://www.webqdkf.com" target="_blank"
                      >了解更多</a
                    >
                  </div>
                </div>
              </div>
              <div class="box" style="--clr: #f75bea">
                <div class="content">
                  <div class="icon"><i class="fa fa-file-code-o"></i></div>
                  <div class="text">
                    <h3>前端开发</h3>
                    <p>
                      前端开发,是通过HTML，CSS及JavaScript以及衍生出来的各种技术、框架、解决方案，来实现互联网产品的用户界面交互。
                    </p>
                    <a href="http://www.webqdkf.com" target="_blank"
                      >了解更多</a
                    >
                  </div>
                </div>
              </div>
              <div class="box" style="--clr: #e9ca18">
                <div class="content">
                  <div class="icon"><i class="fa fa-random"></i></div>
                  <div class="text">
                    <h3>后端开发</h3>
                    <p>
                      后端开发即“服务器端”开发，主要涉及软件系统“后端”的东西。比如，用于托管网站、App数据的服务器、放置在后端服务器与浏览器。
                    </p>
                    <a href="http://www.webqdkf.com" target="_blank"
                      >了解更多</a
                    >
                  </div>
                </div>
              </div>
            </div> -->
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
import api from "@/api/apiManage";
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
    
    
    api.getPatientCheckReport("1").then((res) => {
      console.log(res);
      // if (res.data.code == 200) {
      //   this.infoForm = res.data.data.records;
      //   this.loading = false;
      //   this.totalSize = res.data.data.total;
      // }
    });
    // this.getPatientData();
  },
  methods: {
    handle(){
      
      
    },
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
  mounted(){
    
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



<div class="originImageContainer">
              <!-- 3 * 3图片行列   第1行-->
              <el-row type="flex" class="row-bg" justify="center">
                <el-col :span="6"
                  ><div class="grid-content bg-purple">
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="url"
                      :preview-src-list="srcList"
                    >
                    </el-image></div
                ></el-col>
                <el-col :span="6"
                  ><div class="grid-content bg-purple-light">
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="url"
                      :preview-src-list="srcList"
                    >
                    </el-image></div
                ></el-col>
                <el-col :span="6"
                  ><div class="grid-content bg-purple">
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="url"
                      :preview-src-list="srcList"
                    >
                    </el-image></div
                ></el-col>
              </el-row>
              <!-- 第2行 -->
              <el-row type="flex" class="row-bg" justify="center">
                <el-col :span="6"
                  ><div class="grid-content bg-purple">
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="url"
                      :preview-src-list="srcList"
                    >
                    </el-image></div
                ></el-col>
                <el-col :span="6"
                  ><div class="grid-content bg-purple-light">
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="url"
                      :preview-src-list="srcList"
                    >
                    </el-image></div
                ></el-col>
                <el-col :span="6"
                  ><div class="grid-content bg-purple">
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="url"
                      :preview-src-list="srcList"
                    >
                    </el-image></div
                ></el-col>
              </el-row>
              <!-- 第3行 -->
              <el-row type="flex" class="row-bg" justify="center">
                <el-col :span="6"
                  ><div class="grid-content bg-purple">
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="url"
                      :preview-src-list="srcList"
                    >
                    </el-image></div
                ></el-col>
                <el-col :span="6"
                  ><div class="grid-content bg-purple-light">
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="url"
                      :preview-src-list="srcList"
                    >
                    </el-image></div
                ></el-col>
                <el-col :span="6"
                  ><div class="grid-content bg-purple">
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="url"
                      :preview-src-list="srcList"
                    >
                    </el-image></div
                ></el-col>
              </el-row>
            </div>