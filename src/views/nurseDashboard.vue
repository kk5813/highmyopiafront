<template>
  <div class="optic-disc-analysis-page">
    <el-header>
      <Header active-index="/nurseDashboard"></Header>
    </el-header>

    <div class="top-section">
      <div class="search-container">
        <div class="compact-search-box">
          <div class="compact-search-header">
            <i class="el-icon-search compact-search-icon"></i>
            <span class="compact-search-title">就诊号查询</span>
          </div>
          <div class="compact-search-body">
            <div class="compact-input-group">
              <div class="input-with-label">
                <span class="input-label">就诊号：</span>
                <el-input
                    v-model="inputPatientId"
                    placeholder="请输入患者就诊号"
                    class="compact-patient-input"
                    clearable
                    size="medium"
                >
                  <i slot="prefix" class="el-input__icon el-icon-user"></i>
                </el-input>
              </div>
              <el-button
                  type="primary"
                  icon="el-icon-cpu"
                  :loading="isDiagnosing"
                  @click="handleDiagnose"
                  class="compact-diagnose-btn"
              >
                {{ isDiagnosing ? '诊断中...' : '开始AI诊断' }}
              </el-button>
            </div>
          </div>
        </div>

        <div class="compact-status-box" v-if="hasSearched">
          <div class="compact-status-header">
            <i class="el-icon-s-order status-icon"></i>
            <span class="status-title">诊断状态</span>
          </div>
          <div class="compact-status-content">
            <div class="status-row">
              <span class="status-label">就诊号：</span>
              <el-tag type="info" size="small">{{ inputPatientId }}</el-tag>
            </div>
            <div class="status-row" v-if="diagnosisTime">
              <span class="status-label">时间：</span>
              <span class="status-value">{{ diagnosisTime }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">眼别：</span>
              <div v-if="diagnosisList.length > 0" style="display:inline-block">
                <el-tag
                    v-for="item in diagnosisList"
                    :key="item.site"
                    type="primary"
                    size="mini"
                    style="margin-right: 4px;"
                >
                  {{ item.site }}
                </el-tag>
              </div>
              <el-tag v-else-if="!isDiagnosing" type="warning" size="small">无结果</el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="pre-diagnosis-content" v-if="!hasSearched">
      <el-row :gutter="24">
        <el-col :span="16" :offset="4">
          <el-card shadow="always" class="welcome-card">
            <div class="welcome-content">
              <div class="welcome-icon">
                <i class="el-icon-s-promotion"></i>
              </div>
              <h2 class="welcome-title">眼底AI诊断分析系统</h2>
              <p class="welcome-description">
                请输入患者就诊号，系统将自动进行眼底图像分析，包括视盘分割、病灶检测和疾病诊断。
              </p>
              <div class="diagnosis-steps">
                <div class="step-item">
                  <div class="step-number">1</div>
                  <div class="step-content">
                    <h4>输入就诊号</h4>
                    <p>在上方输入框输入患者的就诊号码</p>
                  </div>
                </div>
                <div class="step-item">
                  <div class="step-number">2</div>
                  <div class="step-content">
                    <h4>开始AI诊断</h4>
                    <p>点击"开始AI诊断"按钮启动分析</p>
                  </div>
                </div>
                <div class="step-item">
                  <div class="step-number">3</div>
                  <div class="step-content">
                    <h4>查看结果</h4>
                    <p>获取完整的诊断报告和分析结果</p>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="post-diagnosis-content" v-else-if="diagnosisList.length > 0">

      <div class="eye-tabs-wrapper">
        <el-tabs v-model="activeSite" type="border-card" class="eye-tabs">
          <el-tab-pane
              v-for="item in diagnosisList"
              :key="item.site"
              :name="item.site"
          >
            <span slot="label">
              <i class="el-icon-view"></i> {{ item.site }}
            </span>
          </el-tab-pane>
        </el-tabs>
      </div>

      <transition name="el-fade-in-linear" mode="out-in">
        <div class="eye-detail-container" v-if="currentEyeData" :key="activeSite">

          <el-row :gutter="24" class="main-content">
            <el-col :span="10" class="left-column">
              <el-card shadow="always" class="diagnosis-card">
                <div class="diagnosis-header">
                  <i class="el-icon-document-checked result-icon"></i>
                  <span class="diagnosis-title">诊断结论 ({{ currentEyeData.site }})</span>
                  <div class="diagnosis-badge">
                    <el-tag :type="getResultTagType(currentEyeData.result)" effect="dark">
                      {{ currentEyeData.result }}
                    </el-tag>
                  </div>
                </div>
                <div class="diagnosis-content">
                  <h2 class="final-diagnosis" :class="{'text-danger': !isHealthy(currentEyeData.result)}">
                    {{ currentEyeData.result }}
                  </h2>
                  <div class="diagnosis-time">
                    <i class="el-icon-time"></i> {{ diagnosisTime }}
                  </div>
                </div>
              </el-card>
            </el-col>

            <el-col :span="14" class="right-column">
              <el-card shadow="always" class="analysis-card">
                <div class="card-header">
                  <i class="el-icon-chat-line-round"></i>
                  <span>详细分析说明</span>
                </div>
                <div class="analysis-content">
                  <div class="info-text-box">
                    {{ currentEyeData.resultInfo || '暂无详细说明' }}
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <div class="section-divider">
            <span class="divider-title"><i class="el-icon-picture"></i> 影像分析结果</span>
          </div>

          <el-row :gutter="20" class="image-content">
            <el-col
                v-for="(img, idx) in currentEyeData.parsedUrls"
                :key="idx"
                :span="12"
                class="image-col"
            >
              <el-card shadow="hover" class="image-card">
                <div slot="header" class="card-header">
                  <span>{{ img.name }}</span> </div>
                <div class="image-container">
                  <el-image
                      :src="img.url"
                      :preview-src-list="allCurrentImages"
                      fit="contain"
                      class="fundus-image"
                  >
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                      <div class="error-msg">加载失败</div>
                    </div>
                    <div slot="placeholder" class="image-slot">
                      <i class="el-icon-loading"></i>
                      <div>加载中...</div>
                    </div>
                  </el-image>
                </div>
              </el-card>
            </el-col>
          </el-row>

        </div>
      </transition>
    </div>

    <div v-else-if="hasSearched && !isDiagnosing" class="no-data-container">
      <el-alert title="未查询到诊断数据" type="warning" show-icon :closable="false" center></el-alert>
    </div>

  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import api from "@/api/apiManage";

export default {
  name: 'OpticDiscAnalysisPage',
  components: { Header },
  data() {
    return {
      inputPatientId: '',
      isDiagnosing: false,
      hasSearched: false,
      diagnosisTime: '',

      // 新的数据结构
      diagnosisList: [], // 存储后端返回的数组
      activeSite: ''     // 当前选中的 Tab (如 "左眼")
    };
  },
  computed: {
    // 获取当前 Tab 对应的数据对象
    currentEyeData() {
      if (!this.activeSite || this.diagnosisList.length === 0) return null;
      return this.diagnosisList.find(item => item.site === this.activeSite);
    },
    // 获取当前眼别下所有图片的 URL 用于大图预览
    allCurrentImages() {
      if (!this.currentEyeData || !this.currentEyeData.parsedUrls) return [];
      return this.currentEyeData.parsedUrls.map(img => img.url);
    }
  },
  methods: {
    isHealthy(result) {
      return result && (result.includes('正常') || result.includes('健康'));
    },

    getResultTagType(result) {
      if (!result) return 'info';
      if (this.isHealthy(result)) return 'success';
      return 'danger'; // 异常显示红色
    },

    // 路径处理：将后端文件路径转为前端可访问的 URL
    resolveImageUrl(path) {
      if (!path) return '';
      // 1. 统一反斜杠
      let cleanPath = path.replace(/\\/g, '/');
      // 2. 确保以 / 开头
      if (!cleanPath.startsWith('/')) {
        cleanPath = '/' + cleanPath;
      }
      // 3. 拼接 Base URL + 静态资源前缀 (假设后端映射了 /images 到文件系统)
      return process.env.VUE_APP_API_BASE_URL + "/images" + cleanPath;
    },

    async handleDiagnose() {
      if (!this.inputPatientId) {
        this.$message.warning("请输入就诊号");
        return;
      }

      this.isDiagnosing = true;
      this.hasSearched = true;
      this.diagnosisList = [];
      this.activeSite = '';

      const params = {
        diseaseId: 24,
        userId: sessionStorage.getItem("userId"),
        visitNumber: this.inputPatientId,
      };

      try {
        const res = await api.getNewAIDiagnose(params);

        if (res.data.code === 200) {
          const rawData = res.data.data;
          this.diagnosisTime = new Date().toLocaleString('zh-CN');

          if (Array.isArray(rawData) && rawData.length > 0) {

            // 数据转换：将 Map 转为 Array 方便前端渲染
            this.diagnosisList = rawData.map(item => {

              const parsedUrls = [];
              if (item.urls && typeof item.urls === 'object') {
                // 遍历 Map (key: 图片名, value: 路径)
                for (const [key, value] of Object.entries(item.urls)) {
                  parsedUrls.push({
                    name: key,
                    url: this.resolveImageUrl(value)
                  });
                }
              }

              return {
                site: item.site,          // "左眼" / "右眼"
                result: item.result,      // "高度近视"
                resultInfo: item.resultInfo, // 说明字符串
                parsedUrls: parsedUrls    // 处理后的图片数组
              };
            });

            // 默认选中第一个 Tab
            if (this.diagnosisList.length > 0) {
              this.activeSite = this.diagnosisList[0].site;
            }

            this.$message.success(res.data.msg || "诊断分析完成");
          } else {
            this.$message.warning("未查询到相关眼底数据");
          }
        } else {
          this.$message.error(res.data.msg || "诊断请求失败");
        }
      } catch (error) {
        console.error(error);
        this.$message.error("网络请求异常");
      } finally {
        this.isDiagnosing = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.optic-disc-analysis-page {
  padding: 16px;
  background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
  min-height: 100vh;
}

/* --- 顶部搜索区域 (保持原有样式) --- */
.top-section {
  margin-bottom: 20px;

  .search-container {
    display: flex;
    gap: 16px;
    align-items: stretch;

    .compact-search-box {
      flex: 3;
      background: white;
      border-radius: 8px;
      padding: 10px 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      border: 1px solid #e4e7ed;
      display: flex;
      flex-direction: column;
      min-height: 80px;

      .compact-search-header {
        display: flex;
        align-items: center;
        margin-bottom: 4px;

        .compact-search-icon {
          font-size: 16px;
          color: #1890ff;
          margin-right: 6px;
        }

        .compact-search-title {
          font-size: 15px;
          font-weight: 600;
          color: #303133;
        }
      }

      .compact-search-body {
        flex: 1;
        display: flex;
        align-items: center;

        .compact-input-group {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;

          .input-with-label {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 6px;

            .input-label {
              font-size: 14px;
              color: #606266;
              font-weight: 500;
              white-space: nowrap;
            }

            .compact-patient-input {
              flex: 1;
            }
          }

          .compact-diagnose-btn {
            height: 34px;
            min-width: 100px;
            background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
            border: none;
          }
        }
      }
    }

    .compact-status-box {
      flex: 1;
      background: white;
      border-radius: 8px;
      padding: 10px 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      border: 1px solid #e4e7ed;
      min-height: 80px;

      .compact-status-header {
        display: flex;
        align-items: center;
        margin-bottom: 6px;
        padding-bottom: 4px;
        border-bottom: 1px solid #f0f2f5;

        .status-icon {
          color: #67C23A;
          margin-right: 6px;
        }

        .status-title {
          font-weight: 600;
        }
      }

      .compact-status-content .status-row {
        display: flex;
        align-items: center;
        margin-bottom: 4px;
        font-size: 12px;

        .status-label {
          color: #606266;
          width: 45px;
        }

        .status-value {
          color: #303133;
        }
      }
    }
  }
}

/* --- 欢迎区域 (保持原有样式) --- */
.pre-diagnosis-content {
  margin-top: 16px;

  .welcome-card {
    border: none;
    background: linear-gradient(135deg, #f6faff 0%, #e6f7ff 100%);

    .welcome-content {
      text-align: center;
      padding: 32px 16px;

      .welcome-icon {
        font-size: 50px;
        color: #1890ff;
        margin-bottom: 16px;
      }

      .welcome-title {
        color: #303133;
        margin-bottom: 12px;
        font-size: 24px;
      }

      .welcome-description {
        color: #606266;
        font-size: 14px;
        line-height: 1.6;
        max-width: 550px;
        margin: 0 auto 32px;
      }

      .diagnosis-steps {
        display: flex;
        justify-content: space-around;
        max-width: 750px;
        margin: 0 auto;

        .step-item {
          text-align: center;
          padding: 0 16px;

          .step-number {
            width: 45px;
            height: 45px;
            line-height: 45px;
            background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
            color: white;
            border-radius: 50%;
            font-size: 20px;
            font-weight: bold;
            margin: 0 auto 12px;
          }

          .step-content {
            h4 {
              color: #303133;
              margin-bottom: 6px;
              font-size: 16px;
            }

            p {
              color: #909399;
              font-size: 13px;
            }
          }
        }
      }
    }
  }
}

/* --- 诊断结果区域 (新样式) --- */
.eye-tabs-wrapper {
  background: white;
  border-radius: 8px 8px 0 0;
  /* 覆盖Element UI tabs 默认边框，使其融合 */
  ::v-deep .el-tabs--border-card {
    border: none;
    box-shadow: none;
  }

  ::v-deep .el-tabs__header {
    background-color: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
    margin-bottom: 0;
  }

  ::v-deep .el-tabs__item {
    font-size: 15px;
    font-weight: 500;
    height: 48px;
    line-height: 48px;

    &.is-active {
      color: #1890ff;
      font-weight: bold;
    }
  }
}

.eye-detail-container {
  background: #fff;
  padding: 24px;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  min-height: 500px;
}

.main-content {
  margin-bottom: 24px;
}

/* 诊断结论卡片 */
.diagnosis-card {
  height: 100%;
  border-radius: 8px;
  border: 1px solid #ebeef5;

  .diagnosis-header {
    display: flex;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f2f5;
    margin-bottom: 12px;

    .result-icon {
      font-size: 20px;
      color: #1890ff;
      margin-right: 8px;
    }

    .diagnosis-title {
      font-size: 16px;
      font-weight: bold;
      color: #303133;
    }

    .diagnosis-badge {
      margin-left: auto;
    }
  }

  .diagnosis-content {
    .final-diagnosis {
      font-size: 24px;
      color: #67C23A;
      margin: 10px 0;
      font-weight: 600;
    }

    .final-diagnosis.text-danger {
      color: #F56C6C;
    }

    .diagnosis-time {
      font-size: 13px;
      color: #909399;
    }
  }
}

/* 分析依据卡片 */
.analysis-card {
  height: 100%;
  border-radius: 8px;
  border: 1px solid #ebeef5;

  .card-header {
    font-weight: bold;
    display: flex;
    align-items: center;

    i {
      color: #1890ff;
      margin-right: 6px;
    }
  }

  .info-text-box {
    padding: 12px;
    background: #f8f9fa;
    border-radius: 4px;
    color: #606266;
    line-height: 1.6;
    font-size: 14px;
    border: 1px solid #f0f0f0;
  }
}

/* 影像区域 */
.section-divider {
  margin: 20px 0 16px;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;

  .divider-title {
    font-size: 16px;
    font-weight: bold;
    color: #303133;
    border-left: 4px solid #1890ff;
    padding-left: 10px;
  }
}

.image-col {
  margin-bottom: 20px;
}

.image-card {
  border-radius: 8px;

  .card-header span {
    font-weight: bold;
    font-size: 14px;
  }

  .image-container {
    height: 350px; /* 大图高度 */
    background: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    overflow: hidden;

    .fundus-image {
      width: 100%;
      height: 100%;
    }
  }
}

.image-slot {
  color: #909399;
  display: flex;
  flex-direction: column;
  align-items: center;

  i {
    font-size: 24px;
    margin-bottom: 5px;
  }

  .error-msg {
    font-size: 12px;
  }
}

.no-data-container {
  margin-top: 20px;
}

/* 响应式 */
@media (max-width: 768px) {
  .search-container {
    flex-direction: column;
  }
  .compact-input-group {
    flex-direction: column;
  }
  .main-content {
    flex-direction: column;
  }
  .left-column, .right-column {
    width: 100%;
    margin-bottom: 16px;
  }
  .image-col {
    width: 100%;
  }
  .image-container {
    height: 220px;
  }
}
</style>