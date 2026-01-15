<template>
  <div class="optic-disc-analysis-page">
    <el-header>
      <Header active-index="/nurseDashboard"></Header>
    </el-header>

    <!-- 顶部搜索和状态栏 -->
    <div class="top-section">
      <div class="search-container">
        <!-- 合并后的搜索区域 -->
        <div class="compact-search-box">
          <!-- 第一行：标题 -->
          <div class="compact-search-header">
            <i class="el-icon-search compact-search-icon"></i>
            <span class="compact-search-title">就诊号查询</span>
          </div>

          <!-- 第二行：输入框和按钮 -->
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

        <!-- 状态信息区域 -->
        <div class="compact-status-box" v-if="hasSearched">
          <div class="compact-status-header">
            <i class="el-icon-s-order status-icon"></i>
            <span class="status-title">诊断状态</span>
          </div>
          <div class="compact-status-content">
            <div class="status-row">
              <span class="status-label">就诊号：</span>
              <el-tag type="info" size="small">
                {{ resultData.patientId }}
              </el-tag>
            </div>
            <div class="status-row" v-if="diagnosisTime">
              <span class="status-label">时间：</span>
              <span class="status-value">{{ diagnosisTime }}</span>
            </div>
            <div class="status-row" v-if="resultData.result">
              <span class="status-label">状态：</span>
              <el-tag type="success" size="small">
                <i class="el-icon-success"></i> 已完成
              </el-tag>
            </div>
            <div class="status-row" v-else-if="hasSearched && !isDiagnosing">
              <span class="status-label">状态：</span>
              <el-tag type="warning" size="small">
                <i class="el-icon-warning"></i> 无结果
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 诊断前欢迎区域 -->
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

    <!-- 诊断结果区域 -->
    <div class="post-diagnosis-content" v-else>
      <!-- 第一行：诊断结论和分析依据 -->
      <el-row :gutter="24" class="main-content" v-if="resultData.result">
        <!-- 诊断结论 -->
        <el-col :span="12" class="left-column">
          <el-card shadow="always" class="diagnosis-card">
            <div class="diagnosis-header">
              <i class="el-icon-document-checked result-icon"></i>
              <span class="diagnosis-title">诊断结论</span>
              <div class="diagnosis-badge">
                <el-tag type="success" size="small">
                  AI诊断结果
                </el-tag>
              </div>
            </div>
            <div class="diagnosis-content">
              <h2 class="final-diagnosis">{{ resultData.result }}</h2>
              <div class="diagnosis-time" v-if="diagnosisTime">
                <i class="el-icon-time"></i> {{ diagnosisTime }}
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 分析依据 -->
        <el-col :span="12" class="right-column">
          <el-card shadow="always" class="analysis-card" v-if="resultData.result_info && resultData.result_info.length > 0">
            <div class="card-header">
              <i class="el-icon-chat-line-round"></i>
              <span>分析依据</span>
            </div>
            <div class="analysis-content">
              <div
                  v-for="(info, idx) in resultData.result_info"
                  :key="idx"
                  class="info-item"
              >
                {{ info }}
              </div>
            </div>
          </el-card>
          <el-alert
              v-else-if="!isDiagnosing"
              title="无分析依据"
              type="info"
              show-icon
              :closable="false"
          >
            本次诊断未生成详细的分析依据
          </el-alert>
        </el-col>
      </el-row>

      <!-- 如果没有诊断结果 -->
      <el-alert
          v-if="!resultData.result && !isDiagnosing"
          title="诊断结果为空"
          type="warning"
          show-icon
          :closable="false"
          class="no-result-alert"
      >
        未获取到诊断结果，请检查就诊号是否正确或联系管理员
      </el-alert>

      <!-- 第二行：原始图像和视盘分割结果 -->
      <el-row :gutter="24" class="image-content" v-loading="isDiagnosing" v-if="resultData.urls && resultData.urls.length > 0">
        <!-- 原始眼底图像 -->
        <el-col :span="12" class="left-column">
          <el-card shadow="always" class="image-card">
            <div slot="header" class="card-header">
              <i class="el-icon-picture-outline"></i>
              <span>原始眼底图像</span>
            </div>
            <div class="image-container">
              <el-image
                  :src="imageUrl(0)"
                  :preview-src-list="allUrls"
                  fit="contain"
                  class="fundus-image"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture"></i>
                  <div>无法加载图像</div>
                </div>
              </el-image>
            </div>
          </el-card>
        </el-col>

        <!-- 视盘分割结果 -->
        <el-col :span="12" class="right-column">
          <el-card shadow="always" class="image-card">
            <div slot="header" class="card-header">
              <i class="el-icon-crop"></i>
              <span>视盘分割结果</span>
            </div>
            <div class="image-container">
              <el-image
                  :src="imageUrl(1)"
                  :preview-src-list="allUrls"
                  fit="contain"
                  class="fundus-image"
                  v-if="imageUrl(1)"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture"></i>
                  <div>无法加载图像</div>
                </div>
              </el-image>
              <div class="no-image-placeholder" v-else>
                <i class="el-icon-picture-outline"></i>
                <p>暂无分割结果图像</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 第三行：病灶检测图像 -->
      <div class="lesion-content" v-if="resultData.urls && resultData.urls.length > 2">
        <el-card shadow="always" class="detection-card">
          <div slot="header" class="card-header">
            <i class="el-icon-s-grid"></i>
            <span>病灶检测图像</span>
            <el-tag v-if="lesionImages.length > 0" size="small" type="success">
              共 {{ lesionImages.length }} 张检测图像
            </el-tag>
            <el-tag v-else size="small" type="info">
              无检测图像
            </el-tag>
          </div>
          <div class="detection-content">
            <div v-if="lesionImages.length > 0" class="image-grid">
              <div
                  v-for="(url, index) in lesionImages"
                  :key="index"
                  class="detection-image-item"
              >
                <div class="image-title">检测区域 {{ index + 1 }}</div>
                <el-image
                    :src="url"
                    :preview-src-list="allUrls"
                    fit="cover"
                    class="detection-image"
                />
              </div>
            </div>
            <div v-else class="no-detection-content">
              <i class="el-icon-s-check"></i>
              <h4>无病灶检测图像</h4>
              <p>当前诊断未生成四象限病灶检测图像</p>
              <p class="hint-text">可能原因：</p>
              <ul>
                <li>当前病例不属于需要病灶检测的类型</li>
                <li>病灶检测结果包含在其他分析中</li>
                <li>该诊断流程未包含病灶检测环节</li>
              </ul>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 如果没有图像数据 -->
      <el-alert
          v-if="hasSearched && !isDiagnosing && (!resultData.urls || resultData.urls.length === 0)"
          title="无图像数据"
          type="info"
          show-icon
          :closable="false"
          class="no-image-alert"
      >
        诊断结果未包含图像数据，可能原因：
        <ul>
          <li>该诊断类型不包含图像分析</li>
          <li>图像处理过程中出现错误</li>
          <li>图像文件路径配置不正确</li>
        </ul>
      </el-alert>
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
      // 页面展示用的响应式数据
      resultData: {
        patientId: '',
        result: '',
        result_info: [],
        urls: []
      }
    };
  },
  computed: {
    allUrls() {
      return this.resultData.urls || [];
    },
    // 获取 urls 数组中第 3 到第 6 张（索引 2-5）作为病灶图
    lesionImages() {
      return this.allUrls.slice(2, 6);
    }
  },
  methods: {
    imageUrl(index) {
      return this.allUrls[index] || '';
    },

    // 处理Windows路径，将反斜杠转为正斜杠
    normalizePath(path) {
      return path.replace(/\\/g, '/');
    },

    processUrlString(urlString) {
      if (!urlString) return [];
      console.log("原始URL字符串:", urlString);

      // 规范化路径
      const normalizedUrlString = this.normalizePath(urlString);
      console.log("规范化后的URL字符串:", normalizedUrlString);

      if (typeof normalizedUrlString === 'string') {
        // 按逗号分割，处理可能的空格
        const urls = normalizedUrlString.split(',').map(item => {
          let url = item.trim();
          // 移除可能的引号
          url = url.replace(/^["']+|["']+$/g, '');
          return url;
        }).filter(url => url.length > 0);

        console.log("分割后的URL数组:", urls);

        // 构建完整URL
        const processed = urls.map(item => {
          // 确保路径以正斜杠开头
          const path = item.startsWith('/') ? item : '/' + item;
          const fullUrl = process.env.VUE_APP_API_BASE_URL + "/images" + path;
          console.log("构建完整URL:", fullUrl);
          return fullUrl;
        });

        console.log("最终URL数组:", processed);
        return processed;
      }

      return [];
    },

    async handleDiagnose() {
      if (!this.inputPatientId) {
        this.$message.warning("请输入就诊号");
        return;
      }

      console.log("开始AI诊断，就诊号:", this.inputPatientId);
      this.isDiagnosing = true;
      this.hasSearched = true;

      // 重置数据
      this.resultData = {
        patientId: this.inputPatientId,
        result: '',
        result_info: [],
        urls: []
      };

      let allObj = {
        diseaseId: 24,
        userId: sessionStorage.getItem("userId"),
        visitNumber: this.inputPatientId,
      };

      console.log("请求参数:", allObj);

      try {
        const res = await api.getAiDiagnose(allObj);
        console.log("完整API响应:", res);

        if (res.data.code === 200) {
          const data = res.data.data;
          console.log("后端返回数据:", data);
          console.log("数据类型:", typeof data);
          console.log("是否为数组:", Array.isArray(data));

          // 设置诊断时间
          this.diagnosisTime = new Date().toLocaleString('zh-CN');

          // 处理数组数据
          let actualData = null;

          if (Array.isArray(data) && data.length > 0) {
            // 第一层数组
            const firstLevel = data[0];
            console.log("第一层数组:", firstLevel);

            if (Array.isArray(firstLevel) && firstLevel.length > 0) {
              // 第二层数组（实际数据）
              actualData = firstLevel[0];
              console.log("实际数据对象:", actualData);
            } else if (typeof firstLevel === 'object' && firstLevel !== null) {
              // 直接是对象
              actualData = firstLevel;
              console.log("直接是对象:", actualData);
            }
          } else if (typeof data === 'object' && data !== null) {
            // 直接是对象
            actualData = data;
            console.log("直接是对象:", actualData);
          }

          if (actualData) {
            // 获取 result 字段
            const result = actualData.result || '';
            console.log("获取到的result:", result);

            // 获取 resultInfo 字段
            const resultInfoData = actualData.resultInfo || actualData.result_info;
            console.log("获取到的resultInfo:", resultInfoData);

            let resultInfo = [];
            if (resultInfoData) {
              if (typeof resultInfoData === 'string') {
                // 保持字符串原样
                resultInfo = [resultInfoData];
              } else if (Array.isArray(resultInfoData)) {
                resultInfo = resultInfoData;
              }
            }

            // 处理 URL 字段
            let processedUrls = [];
            const urlData = actualData.url || actualData.urls;
            console.log("获取到的url:", urlData);

            if (urlData) {
              processedUrls = this.processUrlString(urlData);
            }

            // 更新页面数据
            this.resultData = {
              patientId: this.inputPatientId,
              result: result,
              result_info: resultInfo,
              urls: processedUrls
            };

            console.log("最终resultData:", this.resultData);
            this.$message.success("诊断分析完成");
          } else {
            console.warn("无法解析数据格式");
            this.$message.warning("无法解析返回的数据格式");
          }
        } else {
          console.log("响应码错误:", res.data.code, "消息:", res.data.msg);
          this.$message.error(res.data.msg || "诊断失败");
        }
      } catch (error) {
        console.error("请求错误:", error);
        console.error("错误响应:", error.response);
        this.$message.error("请求失败，请检查网络或服务连接");
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

/* 顶部搜索区域 - 紧凑两行布局 */
.top-section {
  margin-bottom: 20px;

  .search-container {
    display: flex;
    gap: 16px;
    align-items: stretch;

    /* 合并的搜索区域 - 紧凑版 */
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

              ::v-deep .el-input__inner {
                height: 34px;
                border-radius: 5px;
                border: 1px solid #dcdfe6;
                padding-left: 34px;
                transition: all 0.3s;
                font-size: 14px;

                &:focus {
                  border-color: #1890ff;
                  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
                }
              }

              ::v-deep .el-input__prefix {
                display: flex;
                align-items: center;
                padding-left: 8px;

                .el-icon-user {
                  color: #909399;
                  font-size: 14px;
                }
              }
            }
          }

          .compact-diagnose-btn {
            height: 34px;
            min-width: 100px;
            border-radius: 5px;
            background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
            border: none;
            font-size: 13px;
            font-weight: 500;
            padding: 0 12px;
            transition: all 0.3s;

            &:hover {
              transform: translateY(-1px);
              box-shadow: 0 3px 10px rgba(24, 144, 255, 0.3);
            }

            &:active {
              transform: translateY(0);
            }

            i {
              margin-right: 5px;
              font-size: 13px;
            }
          }
        }
      }
    }

    /* 状态信息区域 - 紧凑版 */
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
          font-size: 15px;
          color: #67C23A;
          margin-right: 6px;
        }

        .status-title {
          font-size: 15px;
          font-weight: 600;
          color: #303133;
        }
      }

      .compact-status-content {
        .status-row {
          display: flex;
          align-items: center;
          margin-bottom: 4px;

          &:last-child {
            margin-bottom: 0;
          }

          .status-label {
            font-size: 12px;
            color: #606266;
            width: 45px;
            flex-shrink: 0;
          }

          .status-value {
            font-size: 12px;
            color: #303133;
            flex: 1;
          }

          ::v-deep .el-tag {
            font-size: 11px;
            padding: 2px 6px;
            height: auto;

            i {
              margin-right: 3px;
              font-size: 11px;
            }
          }
        }
      }
    }
  }
}

/* 诊断前欢迎区域 */
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
              line-height: 1.5;
            }
          }
        }
      }
    }
  }
}

/* 诊断后内容区域 */
.post-diagnosis-content {
  margin-top: 16px;
}

/* 第一行：诊断结论和分析依据 */
.main-content {
  margin-bottom: 16px;

  .diagnosis-card {
    border: 1px solid #ebeef5;
    border-radius: 10px;
    height: 100%;

    .diagnosis-header {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 2px solid #f0f2f5;

      .result-icon {
        font-size: 20px;
        color: #1890ff;
        margin-right: 10px;
      }

      .diagnosis-title {
        font-size: 16px;
        font-weight: bold;
        color: #1890ff;
        flex: 1;
      }

      .diagnosis-badge {
        margin-left: auto;
      }
    }

    .diagnosis-content {
      .final-diagnosis {
        margin: 0 0 8px 0;
        color: #303133;
        font-size: 20px;
        font-weight: 600;
        line-height: 1.4;
        padding: 6px 0;
      }

      .diagnosis-time {
        color: #909399;
        font-size: 13px;

        i {
          margin-right: 5px;
          font-size: 12px;
        }
      }
    }
  }

  .analysis-card {
    border: 1px solid #ebeef5;
    border-radius: 10px;
    height: 100%;

    .analysis-content {
      padding: 16px;
      max-height: 200px;
      overflow-y: auto;

      .info-item {
        padding: 10px 0;
        color: #606266;
        line-height: 1.5;
        font-size: 13px;
        border-bottom: 1px solid #f0f2f5;

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}

/* 第二行：图像内容 */
.image-content {
  margin-bottom: 16px;

  .image-card {
    border: 1px solid #ebeef5;
    border-radius: 10px;
    height: 100%;

    .image-container {
      height: 300px;
      border-radius: 6px;
      overflow: hidden;
      background: #f8f9fa;
      position: relative;

      .fundus-image {
        width: 100%;
        height: 100%;
      }

      .no-image-placeholder {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        color: #c0c4cc;

        i {
          font-size: 50px;
          margin-bottom: 12px;
        }

        p {
          font-size: 13px;
          margin: 0;
        }
      }
    }
  }
}

/* 第三行：病灶检测内容 */
.lesion-content {
  margin-bottom: 16px;

  .detection-card {
    border: 1px solid #ebeef5;
    border-radius: 10px;

    .detection-content {
      .image-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        padding: 16px;

        .detection-image-item {
          .image-title {
            text-align: center;
            margin-bottom: 8px;
            font-size: 13px;
            color: #606266;
            font-weight: 500;
          }

          .detection-image {
            width: 100%;
            height: 180px;
            border-radius: 6px;
            overflow: hidden;
            border: 1px solid #ebeef5;
          }
        }
      }

      .no-detection-content {
        text-align: center;
        padding: 32px 16px;
        color: #909399;

        i {
          font-size: 50px;
          margin-bottom: 12px;
          color: #67C23A;
        }

        h4 {
          margin: 0 0 8px 0;
          color: #606266;
          font-size: 16px;
        }

        p {
          margin: 0 0 8px 0;
          line-height: 1.5;
          font-size: 13px;
        }

        .hint-text {
          color: #e6a23c;
          margin-top: 16px;
          font-weight: bold;
          font-size: 13px;
        }

        ul {
          text-align: left;
          margin: 8px 0 0 18px;
          color: #606266;

          li {
            margin-bottom: 6px;
            font-size: 12px;
          }
        }
      }
    }
  }
}

/* 无结果提示 */
.no-result-alert,
.no-image-alert {
  margin-bottom: 20px;
  border-radius: 6px;
  padding: 12px 16px;

  ul {
    margin: 8px 0 0 18px;
    li {
      margin-bottom: 4px;
      font-size: 13px;
    }
  }
}

/* 通用卡片头部样式 */
.card-header {
  font-weight: bold;
  display: flex;
  align-items: center;

  i {
    color: #1890ff;
    margin-right: 6px;
    font-size: 15px;
  }
}

.image-slot {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: #f5f7fa;
  color: #909399;

  i {
    font-size: 30px;
    margin-bottom: 8px;
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .search-container {
    flex-direction: column;
  }

  .compact-search-box,
  .compact-status-box {
    width: 100%;
  }

  .detection-content .image-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }

  .diagnosis-steps {
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .optic-disc-analysis-page {
    padding: 12px;
  }

  .top-section {
    .search-container {
      .compact-search-box,
      .compact-status-box {
        padding: 8px 12px;
      }
    }
  }

  .compact-input-group {
    flex-direction: column;
    gap: 10px !important;

    .input-with-label {
      width: 100%;
    }

    .compact-diagnose-btn {
      width: 100%;
      min-width: auto !important;
    }
  }

  .main-content,
  .image-content {
    flex-direction: column;
  }

  .left-column,
  .right-column {
    width: 100%;
    margin-bottom: 16px;
  }

  .image-card .image-container {
    height: 220px;
  }

  .detection-image {
    height: 140px !important;
  }
}
</style>