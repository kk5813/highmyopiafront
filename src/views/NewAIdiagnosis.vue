<template>
  <div class="analysis-page-container">
    <el-container class="full-height-container">
      <el-header height="65px" class="custom-header">
        <Header active-index="/NewAIdiagnosis"></Header>
      </el-header>

      <el-main class="main-wrapper">
        <el-steps :active="activeStep" align-center class="steps-nav" finish-status="success">
          <el-step title="输入就诊号" description="验证患者身份"></el-step>
          <el-step title="选择模型" description="指定AI分析病症"></el-step>
          <el-step title="诊断结果" description="查看多维度分析报告"></el-step>
        </el-steps>

        <div class="content-body">
          <div v-if="activeStep === 0" class="step-card-wrapper">
            <el-card shadow="always" class="fancy-card">
              <div class="card-inner-content">
                <div class="header-section">
                  <div class="icon-circle"><i class="el-icon-user"></i></div>
                  <h2 class="title">眼底AI诊断系统</h2>
                  <p class="subtitle">请输入患者就诊号（Visit Number）以调取原始影像</p>
                </div>
                <div class="interactive-section">
                  <div class="input-group-box">
                    <el-input
                        v-model="search"
                        placeholder="请输入患者门诊号/就诊号"
                        class="styled-input"
                        clearable
                        @keyup.enter.native="goToStepTwo"
                    >
                      <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                    <el-button type="primary" class="action-btn" @click="goToStepTwo">下一步</el-button>
                  </div>
                </div>
              </div>
            </el-card>
          </div>

          <div v-if="activeStep === 1" class="step-card-wrapper">
            <el-card shadow="always" class="fancy-card">
              <div class="card-inner-content">
                <div class="header-section">
                  <div class="icon-circle" style="background: #f0f5ff; color: #2f54eb;"><i class="el-icon-cpu"></i></div>
                  <h2 class="title">配置诊断模型</h2>
                </div>
                <div class="interactive-section">
                  <div class="input-group-box">
                    <el-select v-model="selectedModel" placeholder="请选择需要诊断的疑似病症" class="styled-input">
                      <el-option v-for="item in modelOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                    <div class="btn-group">
                      <el-button @click="activeStep = 0">返回修改</el-button>
                      <el-button type="primary" class="action-btn" @click="handleAiImg" :loading="loadingStep2">开始AI分析</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>

          <div v-if="activeStep === 2" class="result-display-wrapper">
            <div class="result-header-bar">
              <el-button icon="el-icon-back" size="mini" @click="resetProcess">重新诊断</el-button>
              <span class="patient-info">患者：{{ search }} | 诊断时间：{{ diagnosisTime }}</span>
            </div>

            <el-tabs v-model="activeEyeTab" type="border-card" class="eye-tabs">
              <el-tab-pane v-for="eye in diagnosisList" :key="eye.site" :name="eye.site">
                <span slot="label"><i class="el-icon-view"></i> {{ eye.site }}</span>

                <el-row :gutter="20" class="diagnosis-top-row">
                  <el-col :span="8">
                    <el-card class="status-card" shadow="never">
                      <div class="label">诊断结论</div>
                      <div class="value" :class="{'danger-text': !isHealthy(eye.result)}">{{ eye.result }}</div>
                    </el-card>
                  </el-col>
                  <el-col :span="16">
                    <el-card class="status-card" shadow="never">
                      <div class="label">分析说明</div>
                      <div class="info-text">{{ eye.resultInfo || '无详细分析描述' }}</div>
                    </el-card>
                  </el-col>
                </el-row>

                <div class="image-section">
                  <h4 class="section-title">影像分析结果</h4>
                  <el-row :gutter="20">
                    <el-col :span="12" v-for="(img, idx) in eye.parsedUrls" :key="idx">
                      <el-card shadow="hover" class="img-detail-card">
                        <div slot="header">{{ img.name }}</div>
                        <el-image
                            :src="img.url"
                            :preview-src-list="eye.parsedUrls.map(i => i.url)"
                            fit="contain"
                            class="fundus-img"
                        >
                          <div slot="error" class="image-slot"><i class="el-icon-picture-outline"></i></div>
                        </el-image>
                      </el-card>
                    </el-col>
                  </el-row>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-main>
      <el-footer class="page-footer">爱尔眼科慢病管理系统 - AI诊断终端</el-footer>
    </el-container>
  </div>
</template>

<script>
import Header from "../components/Header";
import api from "@/api/apiManage";

export default {
  name: "NewAIdiagnosis",
  components: { Header },
  data() {
    return {
      activeStep: 0,
      search: "",
      selectedModel: "",
      modelOptions: [],
      diagnosisList: [], // 存储处理后的结构化数据
      activeEyeTab: "",  // 当前选中的 site (如 "左眼")
      diagnosisTime: "",
      loadingStep2: false
    };
  },
  created() {
    this.fetchModelOptions();
  },
  methods: {
    // 获取模型列表 (参考 AIdiagnosis)
    fetchModelOptions() {
      api.getAiDisease().then((res) => {
        if (res.data.code === 200) {
          this.modelOptions = res.data.data.map(item => ({
            label: item.name,
            value: item.id
          }));
        }
      });
    },

    goToStepTwo() {
      if (!this.search) {
        this.$message.warning("请输入就诊号");
        return;
      }
      this.activeStep = 1;
    },

    // 核心逻辑：执行诊断并处理复杂的回参 (参考 NurseDashboard)
    async handleAiImg() {
      if (!this.selectedModel) {
        this.$message.warning("请选择疑似病症");
        return;
      }
      this.loadingStep2 = true;

      const params = {
        visitNumber: this.search,
        diseaseId: this.selectedModel,
        userId: sessionStorage.getItem("userId")
      };

      try {
        const res = await api.getNewAIDiagnose(params);
        if (res.data.code === 200) {
          const rawData = res.data.data;
          this.diagnosisTime = new Date().toLocaleString();

          if (Array.isArray(rawData) && rawData.length > 0) {
            // 关键：将后端 Map 结构转换为前端易读的数组格式
            this.diagnosisList = rawData.map(item => {
              const parsedUrls = [];
              if (item.urls && typeof item.urls === 'object') {
                for (const [key, value] of Object.entries(item.urls)) {
                  parsedUrls.push({
                    name: key,
                    url: this.resolveImageUrl(value)
                  });
                }
              }
              return {
                site: item.site,
                result: item.result,
                resultInfo: item.resultInfo,
                parsedUrls: parsedUrls
              };
            });

            this.activeEyeTab = this.diagnosisList[0].site;
            this.activeStep = 2;
            this.$message.success("AI诊断分析完成");
          } else {
            this.$message.warning("未找到匹配的眼底影像数据");
          }
        }
      } catch (error) {
        this.$message.error("诊断请求失败，请检查网络");
      } finally {
        this.loadingStep2 = false;
      }
    },

    // 路径处理 (参考 NurseDashboard)
    resolveImageUrl(path) {
      if (!path) return '';
      let cleanPath = path.replace(/\\/g, '/');
      if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
      return process.env.VUE_APP_API_BASE_URL + "/images" + cleanPath;
    },

    isHealthy(result) {
      return result && (result.includes('正常') || result.includes('健康'));
    },

    resetProcess() {
      this.activeStep = 0;
      this.selectedModel = "";
      this.diagnosisList = [];
    }
  }
};
</script>

<style scoped lang="scss">
.main-wrapper {
  background-color: #f0f2f5;
  padding: 24px;
}

.steps-nav {
  max-width: 800px;
  margin: 0 auto 40px;
}

.step-card-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.fancy-card {
  width: 100%;
  max-width: 600px;
  border-radius: 12px;

  .card-inner-content {
    padding: 30px;
    text-align: center;
  }
}

.icon-circle {
  width: 64px;
  height: 64px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  margin: 0 auto 20px;
}

.input-group-box {
  margin-top: 30px;
  .styled-input {
    margin-bottom: 20px;
    ::v-deep .el-input__inner {
      height: 45px;
      border-radius: 8px;
    }
  }
}

.result-display-wrapper {
  max-width: 1100px;
  margin: 0 auto;

  .result-header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    background: #fff;
    padding: 10px 20px;
    border-radius: 8px;
    .patient-info {
      font-weight: bold;
      color: #606266;
    }
  }
}

.diagnosis-top-row {
  margin-bottom: 20px;
  .status-card {
    height: 100px;
    background: #fafafa;
    border: 1px solid #ebeef5;
    .label { font-size: 13px; color: #909399; margin-bottom: 8px; }
    .value { font-size: 20px; font-weight: bold; color: #67C23A; }
    .danger-text { color: #F56C6C; }
    .info-text { font-size: 14px; color: #606266; line-height: 1.5; }
  }
}

.section-title {
  border-left: 4px solid #1890ff;
  padding-left: 12px;
  margin: 20px 0;
}

.img-detail-card {
  margin-bottom: 20px;
  ::v-deep .el-card__header { padding: 10px 15px; font-size: 14px; font-weight: bold; }
  .fundus-img {
    width: 100%;
    height: 300px;
    background: #000;
    border-radius: 4px;
  }
}

.page-footer {
  text-align: center;
  color: #909399;
  font-size: 12px;
  border-top: 1px solid #dcdfe6;
  line-height: 60px;
}
</style><template>
  <div class="analysis-page-container">
    <el-container class="full-height-container">
      <el-header height="65px" class="custom-header">
        <Header active-index="/NewAIdiagnosis"></Header>
      </el-header>

      <el-main class="main-wrapper">
        <el-steps :active="activeStep" align-center class="steps-nav" finish-status="success">
          <el-step title="输入就诊号" description="验证患者身份"></el-step>
          <el-step title="选择模型" description="指定AI分析病症"></el-step>
          <el-step title="诊断结果" description="查看多维度分析报告"></el-step>
        </el-steps>

        <div class="content-body">
          <div v-if="activeStep === 0" class="step-card-wrapper">
            <el-card shadow="always" class="fancy-card">
              <div class="card-inner-content">
                <div class="header-section">
                  <div class="icon-circle"><i class="el-icon-user"></i></div>
                  <h2 class="title">眼底AI诊断系统</h2>
                  <p class="subtitle">请输入患者就诊号（Visit Number）以调取原始影像</p>
                </div>
                <div class="interactive-section">
                  <div class="input-group-box">
                    <el-input
                        v-model="search"
                        placeholder="请输入患者门诊号/就诊号"
                        class="styled-input"
                        clearable
                        @keyup.enter.native="goToStepTwo"
                    >
                      <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                    <el-button type="primary" class="action-btn" @click="goToStepTwo">下一步</el-button>
                  </div>
                </div>
              </div>
            </el-card>
          </div>

          <div v-if="activeStep === 1" class="step-card-wrapper">
            <el-card shadow="always" class="fancy-card">
              <div class="card-inner-content">
                <div class="header-section">
                  <div class="icon-circle" style="background: #f0f5ff; color: #2f54eb;"><i class="el-icon-cpu"></i></div>
                  <h2 class="title">配置诊断模型</h2>
                </div>
                <div class="interactive-section">
                  <div class="input-group-box">
                    <el-select v-model="selectedModel" placeholder="请选择需要诊断的疑似病症" class="styled-input">
                      <el-option v-for="item in modelOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                    <div class="btn-group">
                      <el-button @click="activeStep = 0">返回修改</el-button>
                      <el-button type="primary" class="action-btn" @click="handleAiImg" :loading="loadingStep2">开始AI分析</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>

          <div v-if="activeStep === 2" class="result-display-wrapper">
            <div class="result-header-bar">
              <el-button icon="el-icon-back" size="mini" @click="resetProcess">重新诊断</el-button>
              <span class="patient-info">患者：{{ search }} | 诊断时间：{{ diagnosisTime }}</span>
            </div>

            <el-tabs v-model="activeEyeTab" type="border-card" class="eye-tabs">
              <el-tab-pane v-for="eye in diagnosisList" :key="eye.site" :name="eye.site">
                <span slot="label"><i class="el-icon-view"></i> {{ eye.site }}</span>

                <el-row :gutter="20" class="diagnosis-top-row">
                  <el-col :span="8">
                    <el-card class="status-card" shadow="never">
                      <div class="label">诊断结论</div>
                      <div class="value" :class="{'danger-text': !isHealthy(eye.result)}">{{ eye.result }}</div>
                    </el-card>
                  </el-col>
                  <el-col :span="16">
                    <el-card class="status-card" shadow="never">
                      <div class="label">分析说明</div>
                      <div class="info-text">{{ eye.resultInfo || '无详细分析描述' }}</div>
                    </el-card>
                  </el-col>
                </el-row>

                <div class="image-section">
                  <h4 class="section-title">影像分析结果</h4>
                  <el-row :gutter="20">
                    <el-col :span="12" v-for="(img, idx) in eye.parsedUrls" :key="idx">
                      <el-card shadow="hover" class="img-detail-card">
                        <div slot="header">{{ img.name }}</div>
                        <el-image
                            :src="img.url"
                            :preview-src-list="eye.parsedUrls.map(i => i.url)"
                            fit="contain"
                            class="fundus-img"
                        >
                          <div slot="error" class="image-slot"><i class="el-icon-picture-outline"></i></div>
                        </el-image>
                      </el-card>
                    </el-col>
                  </el-row>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-main>
      <el-footer class="page-footer">爱尔眼科慢病管理系统 - AI诊断终端</el-footer>
    </el-container>
  </div>
</template>

<script>
import Header from "../components/Header";
import api from "@/api/apiManage";

export default {
  name: "NewAIdiagnosis",
  components: { Header },
  data() {
    return {
      activeStep: 0,
      search: "",
      selectedModel: "",
      modelOptions: [],
      diagnosisList: [], // 存储处理后的结构化数据
      activeEyeTab: "",  // 当前选中的 site (如 "左眼")
      diagnosisTime: "",
      loadingStep2: false
    };
  },
  created() {
    this.fetchModelOptions();
  },
  methods: {
    // 获取模型列表 (参考 AIdiagnosis)
    fetchModelOptions() {
      api.getAiDisease().then((res) => {
        if (res.data.code === 200) {
          this.modelOptions = res.data.data.map(item => ({
            label: item.name,
            value: item.id
          }));
        }
      });
    },

    goToStepTwo() {
      if (!this.search) {
        this.$message.warning("请输入就诊号");
        return;
      }
      this.activeStep = 1;
    },

    // 核心逻辑：执行诊断并处理复杂的回参 (参考 NurseDashboard)
    async handleAiImg() {
      if (!this.selectedModel) {
        this.$message.warning("请选择疑似病症");
        return;
      }
      this.loadingStep2 = true;

      const params = {
        visitNumber: this.search,
        diseaseId: this.selectedModel,
        userId: sessionStorage.getItem("userId")
      };

      try {
        const res = await api.getNewAIDiagnose(params);
        if (res.data.code === 200) {
          const rawData = res.data.data;
          this.diagnosisTime = new Date().toLocaleString();

          if (Array.isArray(rawData) && rawData.length > 0) {
            // 关键：将后端 Map 结构转换为前端易读的数组格式
            this.diagnosisList = rawData.map(item => {
              const parsedUrls = [];
              if (item.urls && typeof item.urls === 'object') {
                for (const [key, value] of Object.entries(item.urls)) {
                  parsedUrls.push({
                    name: key,
                    url: this.resolveImageUrl(value)
                  });
                }
              }
              return {
                site: item.site,
                result: item.result,
                resultInfo: item.resultInfo,
                parsedUrls: parsedUrls
              };
            });

            this.activeEyeTab = this.diagnosisList[0].site;
            this.activeStep = 2;
            this.$message.success("AI诊断分析完成");
          } else {
            this.$message.warning("未找到匹配的眼底影像数据");
          }
        }
      } catch (error) {
        this.$message.error("诊断请求失败，请检查网络");
      } finally {
        this.loadingStep2 = false;
      }
    },

    // 路径处理 (参考 NurseDashboard)
    resolveImageUrl(path) {
      if (!path) return '';
      let cleanPath = path.replace(/\\/g, '/');
      if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
      return process.env.VUE_APP_API_BASE_URL + "/images" + cleanPath;
    },

    isHealthy(result) {
      return result && (result.includes('正常') || result.includes('健康'));
    },

    resetProcess() {
      this.activeStep = 0;
      this.selectedModel = "";
      this.diagnosisList = [];
    }
  }
};
</script>

<style scoped lang="scss">
.main-wrapper {
  background-color: #f0f2f5;
  padding: 24px;
}

.steps-nav {
  max-width: 800px;
  margin: 0 auto 40px;
}

.step-card-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.fancy-card {
  width: 100%;
  max-width: 600px;
  border-radius: 12px;

  .card-inner-content {
    padding: 30px;
    text-align: center;
  }
}

.icon-circle {
  width: 64px;
  height: 64px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  margin: 0 auto 20px;
}

.input-group-box {
  margin-top: 30px;
  .styled-input {
    margin-bottom: 20px;
    ::v-deep .el-input__inner {
      height: 45px;
      border-radius: 8px;
    }
  }
}

.result-display-wrapper {
  max-width: 1100px;
  margin: 0 auto;

  .result-header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    background: #fff;
    padding: 10px 20px;
    border-radius: 8px;
    .patient-info {
      font-weight: bold;
      color: #606266;
    }
  }
}

.diagnosis-top-row {
  margin-bottom: 20px;
  .status-card {
    height: 100px;
    background: #fafafa;
    border: 1px solid #ebeef5;
    .label { font-size: 13px; color: #909399; margin-bottom: 8px; }
    .value { font-size: 20px; font-weight: bold; color: #67C23A; }
    .danger-text { color: #F56C6C; }
    .info-text { font-size: 14px; color: #606266; line-height: 1.5; }
  }
}

.section-title {
  border-left: 4px solid #1890ff;
  padding-left: 12px;
  margin: 20px 0;
}

.img-detail-card {
  margin-bottom: 20px;
  ::v-deep .el-card__header { padding: 10px 15px; font-size: 14px; font-weight: bold; }
  .fundus-img {
    width: 100%;
    height: 300px;
    background: #000;
    border-radius: 4px;
  }
}

.page-footer {
  text-align: center;
  color: #909399;
  font-size: 12px;
  border-top: 1px solid #dcdfe6;
  line-height: 60px;
}
</style>