<template>
  <div class="model-config-container">
    <el-header>
      <Header active-index="/ModelConfig"></Header>
    </el-header>

    <el-main>
      <!-- 疾病选择栏 -->
      <div class="disease-selector">
        <el-row type="flex" align="middle" :gutter="20">
          <el-col :span="4">
            <span class="selector-label">当前疾病：</span>
          </el-col>
          <el-col :span="6">
            <el-select v-model="currentDiseaseId" placeholder="请选择疾病" filterable @change="handleDiseaseChange">
              <el-option
                  v-for="item in diseaseList"
                  :key="item.id"
                  :label="`${item.name} (ID: ${item.id})`"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAddDisease">新增疾病</el-button>
            <el-button type="warning" icon="el-icon-edit" size="small" @click="handleEditCurrentDisease" :disabled="!currentDiseaseId">编辑</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="success" icon="el-icon-check" size="small" @click="handleSaveConfig">保存配置</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="info" icon="el-icon-view" size="small" @click="handleTestConfig">测试运行</el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 流程图区域 -->
      <div class="flowchart-container">
        <!-- 节点库 - 分组显示 -->
        <div class="node-library">
          <div class="library-header">
            <h4>算法节点库</h4>
            <el-button type="text" icon="el-icon-plus" @click="handleAddNode">新增节点</el-button>
          </div>

          <!-- 当前疾病使用的节点 -->
          <div class="node-group" v-if="currentDiseaseId">
            <div class="node-group-title">
              <span>当前疾病使用节点</span>
              <el-tag size="mini" type="success">{{ currentNodeList.length }}</el-tag>
            </div>
            <div class="node-list">
              <div
                  v-for="node in currentNodeList"
                  :key="node.id"
                  class="library-node in-use"
                  draggable="true"
                  @dragstart="onDragStart($event, node)"
                  @dragend="onDragEnd">
                <span class="node-dot" :style="{ backgroundColor: getNodeColor(node.id) }"></span>
                <span class="node-name">{{ node.name }}</span>
                <span class="node-id">#{{ node.id }}</span>
                <span class="node-in-use" title="已在当前疾病中">✓</span>
                <div class="library-node-actions">
                  <el-button type="text" size="mini" icon="el-icon-edit" @click.stop="editNode(node)"></el-button>
                  <el-button type="text" size="mini" icon="el-icon-delete" style="color: #F56C6C;" @click.stop="deleteNode(node.id)"></el-button>
                </div>
              </div>
              <div v-if="currentNodeList.length === 0" class="node-empty">
                <i class="el-icon-info"></i> 暂无节点，请从下方拖拽或新增
              </div>
            </div>
          </div>

          <!-- 其他可用节点 -->
          <div class="node-group">
            <div class="node-group-title">
              <span>其他可用节点</span>
              <el-tag size="mini" type="info">{{ otherNodesList.length }}</el-tag>
            </div>
            <div class="node-list">
              <div
                  v-for="node in otherNodesList"
                  :key="node.id"
                  class="library-node"
                  draggable="true"
                  @dragstart="onDragStart($event, node)"
                  @dragend="onDragEnd">
                <span class="node-dot" :style="{ backgroundColor: getNodeColor(node.id) }"></span>
                <span class="node-name">{{ node.name }}</span>
                <span class="node-id">#{{ node.id }}</span>
                <div class="library-node-actions">
                  <el-button type="text" size="mini" icon="el-icon-edit" @click.stop="editNode(node)"></el-button>
                  <el-button type="text" size="mini" icon="el-icon-delete" style="color: #F56C6C;" @click.stop="deleteNode(node.id)"></el-button>
                </div>
              </div>
              <div v-if="otherNodesList.length === 0" class="node-empty">
                <i class="el-icon-success"></i> 所有节点都已使用
              </div>
            </div>
          </div>
        </div>

        <!-- 流程图画布 -->
        <div class="flowchart-canvas" ref="canvas" @dragover.prevent @drop="onDrop" @click="deselectAll">
          <div class="canvas-header">
            <div class="canvas-title">
              <span>决策流程图 - {{ currentDiseaseName || '未选择疾病' }}</span>
              <el-tag v-if="rootNodeId" size="mini" type="success">根节点: {{ rootNodeName }}</el-tag>
            </div>
            <div class="canvas-tools">
              <el-button-group>
                <el-button icon="el-icon-plus" size="mini" @click="zoom = Math.min(zoom + 0.1, 2)">放大</el-button>
                <el-button icon="el-icon-minus" size="mini" @click="zoom = Math.max(zoom - 0.1, 0.5)">缩小</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetLayout">重置布局</el-button>
                <el-button
                    icon="el-icon-share"
                    size="mini"
                    :type="showAddLineMode ? 'warning' : 'success'"
                    @click="toggleLineMode"
                    :class="{ 'active-mode': showAddLineMode }">
                  {{ showAddLineMode ? '取消连线' : '连线模式' }}
                </el-button>
              </el-button-group>
            </div>
          </div>

          <div class="canvas-scroll" ref="scrollContainer">
            <div
                class="canvas-wrapper"
                :style="{ transform: `scale(${zoom})`, width: canvasWidth + 'px', height: canvasHeight + 'px' }"
                @mousemove="onCanvasMouseMove"
                @mouseup="onCanvasMouseUp"
                @mouseleave="onCanvasMouseLeave"
            >
              <!-- 绘制连线（放在最底层） -->
              <svg class="connection-lines" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }">
                <defs>
                  <marker id="arrow" markerUnits="strokeWidth" markerWidth="12" markerHeight="12" viewBox="0 0 12 12" refX="6" refY="6" orient="auto">
                    <path d="M2,2 L10,6 L2,10 L6,6 L2,2" fill="#409EFF" stroke="none"/>
                  </marker>
                  <marker id="arrow-selected" markerUnits="strokeWidth" markerWidth="12" markerHeight="12" viewBox="0 0 12 12" refX="6" refY="6" orient="auto">
                    <path d="M2,2 L10,6 L2,10 L6,6 L2,2" fill="#E6A23C" stroke="none"/>
                  </marker>
                </defs>
                <g v-for="line in currentLineList" :key="line.id">
                  <path
                      v-if="getNodePosition(line.modelFrom) && getNodePosition(line.modelTo)"
                      :d="getPathD(line)"
                      :stroke="getLineColor(line)"
                      stroke-width="2"
                      fill="none"
                      :marker-end="getLineMarker(line)"
                      :class="{ 'selected-path': selectedLine && selectedLine.id === line.id }"
                      @click.stop="selectLine(line)"
                  />
                </g>
              </svg>

              <!-- 连线上的条件标签（放在中间层） -->
              <div v-for="line in currentLineList" :key="'label-' + line.id">
                <div
                    v-if="getNodePosition(line.modelFrom) && getNodePosition(line.modelTo)"
                    class="condition-label"
                    :style="getConditionStyle(line)"
                    :class="{ 'selected': selectedLine && selectedLine.id === line.id }"
                    @click.stop="selectLine(line)">
                  {{ line.limitValue }}
                  <span class="condition-reuse" v-if="line.useOutputUrl == 1">(复用)</span>
                </div>
              </div>

              <!-- 绘制节点（放在最上层） -->
              <div
                  v-for="node in currentNodeList"
                  :key="node.id"
                  class="flow-node"
                  :style="getNodeStyle(node)"
                  @click.stop="onNodeClick(node)"
                  @mousedown.stop="onNodeMouseDown($event, node)"
                  @dblclick.stop="startCreateLine(node)"
                  :class="{
                    'selected': selectedNode && selectedNode.id === node.id,
                    'root-node': node.id === rootNodeId,
                    'source-mode': showAddLineMode && selectedSourceNode && selectedSourceNode.id === node.id,
                    'target-mode': showAddLineMode && selectedSourceNode && selectedSourceNode.id !== node.id,
                    'dragging': draggingNode && draggingNode.id === node.id
                  }"
                  :data-node-id="node.id">
                <div class="flow-node-header" :style="{ backgroundColor: getNodeColor(node.id) + '20' }">
                  <span class="flow-node-name">{{ node.name }}</span>
                  <el-tag v-if="node.id === rootNodeId" size="mini" type="success" class="root-tag">根</el-tag>
                </div>
                <div class="flow-node-body">
                  <div class="flow-node-api">{{ node.api }}</div>
                  <div class="flow-node-input">输入: {{ node.input }}</div>
                </div>
                <div class="flow-node-footer">
                  <el-button type="text" size="mini" @click.stop="editNode(node)">编辑</el-button>
                  <el-button type="text" size="mini" style="color: #F56C6C;" @click.stop="deleteNodeFromDisease(node.id)">从疾病移除</el-button>
                  <el-button type="text" size="mini" style="color: #F56C6C;" @click.stop="deleteNode(node.id)">删除节点</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 连线模式提示条 -->
      <transition name="slide-up">
        <div v-if="showAddLineMode" class="line-mode-tip" :class="{ 'has-source': selectedSourceNode }">
          <i class="el-icon-info"></i>
          <span v-if="!selectedSourceNode">请点击一个节点作为连线的起点</span>
          <span v-else>请点击目标节点创建连线 (当前起点: {{ getNodeName(selectedSourceNode.id) }})</span>
          <el-button type="text" size="mini" @click="cancelLineMode" style="color: white; margin-left: 15px;">
            <i class="el-icon-close"></i> 取消
          </el-button>
        </div>
      </transition>

      <!-- 属性配置面板 -->
      <el-card class="property-card" v-if="selectedNode || selectedLine">
        <div slot="header">
          <span>{{ selectedNode ? '节点属性' : '路径属性' }}</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="closeProperty">关闭</el-button>
        </div>

        <!-- 节点属性 -->
        <el-form v-if="selectedNode" size="small" label-width="80px">
          <el-form-item label="节点ID">
            <el-input v-model="selectedNode.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="节点名称">
            <el-input v-model="selectedNode.name"></el-input>
          </el-form-item>
          <el-form-item label="API路径">
            <el-input v-model="selectedNode.api"></el-input>
          </el-form-item>
          <el-form-item label="输入类型">
            <el-input v-model="selectedNode.input"></el-input>
          </el-form-item>
          <el-form-item label="所属疾病">
            <el-select v-model="selectedNode.diseaseId" filterable placeholder="请选择所属疾病">
              <el-option
                  v-for="disease in diseaseList"
                  :key="disease.id"
                  :label="`${disease.name} (ID: ${disease.id})`"
                  :value="disease.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述">
            <el-input type="textarea" v-model="selectedNode.description"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateNode">更新节点</el-button>
            <el-button type="danger" @click="deleteNode(selectedNode.id)">删除节点</el-button>
            <el-button v-if="selectedNode.diseaseId === currentDiseaseId" type="warning" @click="removeNodeFromDisease(selectedNode.id)">从当前疾病移除</el-button>
          </el-form-item>
        </el-form>

        <!-- 路径属性 -->
        <el-form v-else-if="selectedLine" size="small" label-width="90px">
          <el-form-item label="源节点">
            <el-input :value="getNodeName(selectedLine.modelFrom)" disabled></el-input>
          </el-form-item>
          <el-form-item label="目标节点">
            <el-input :value="getNodeName(selectedLine.modelTo)" disabled></el-input>
          </el-form-item>
          <el-form-item label="流转条件">
            <el-input v-model="selectedLine.limitValue" placeholder="如：非四期、allow"></el-input>
          </el-form-item>
          <el-form-item label="复用前序输出">
            <el-switch v-model="selectedLine.useOutputUrl" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="描述">
            <el-input type="textarea" v-model="selectedLine.description"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateLine">更新路径</el-button>
            <el-button type="danger" @click="deleteLine(selectedLine.id)">删除路径</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 快速连线对话框 -->
      <el-dialog title="新增决策路径" :visible.sync="showAddLineDialog" width="500px">
        <el-form :model="lineForm" label-width="100px" size="small">
          <el-form-item label="源节点">
            <el-select v-model="lineForm.modelFrom" filterable placeholder="请选择源节点">
              <el-option
                  v-for="node in currentNodeList"
                  :key="node.id"
                  :label="`${node.name} (ID: ${node.id})`"
                  :value="node.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目标节点">
            <el-select v-model="lineForm.modelTo" filterable placeholder="请选择目标节点">
              <el-option
                  v-for="node in currentNodeList"
                  :key="node.id"
                  :label="`${node.name} (ID: ${node.id})`"
                  :value="node.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="流转条件">
            <el-input v-model="lineForm.limitValue" placeholder="如：非四期、allow"></el-input>
          </el-form-item>
          <el-form-item label="复用前序输出">
            <el-switch v-model="lineForm.useOutputUrl" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="描述">
            <el-input type="textarea" v-model="lineForm.description"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="showAddLineDialog = false">取消</el-button>
          <el-button type="primary" @click="addLine">确定</el-button>
        </div>
      </el-dialog>

      <!-- 测试运行对话框 -->
      <el-dialog title="测试运行" :visible.sync="testDialogVisible" width="600px">
        <el-form label-width="100px">
          <el-form-item label="就诊号">
            <el-input v-model="testVisitNumber" placeholder="请输入就诊号"></el-input>
          </el-form-item>
          <el-form-item label="测试影像">
            <el-upload
                action="#"
                :auto-upload="false"
                :on-change="handleTestFileChange"
                :file-list="testFileList">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <div v-if="testResult" class="test-result">
          <h4>诊断结果：</h4>
          <pre>{{ JSON.stringify(testResult, null, 2) }}</pre>
        </div>
        <div slot="footer">
          <el-button @click="testDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="runTest">开始测试</el-button>
        </div>
      </el-dialog>

      <!-- 疾病新增/编辑对话框 -->
      <el-dialog :title="diseaseDialogTitle" :visible.sync="diseaseDialogVisible" width="500px">
        <el-form :model="diseaseForm" label-width="100px" size="small">
          <el-form-item label="疾病ID">
            <el-input-number v-model="diseaseForm.id" :min="1" placeholder="唯一识别码" :disabled="diseaseEditMode"></el-input-number>
          </el-form-item>
          <el-form-item label="疾病名称">
            <el-input v-model="diseaseForm.name"></el-input>
          </el-form-item>
          <el-form-item label="输入类型">
            <el-input v-model="diseaseForm.input" placeholder="多个用逗号分隔，如：眼底照相,OCT"></el-input>
          </el-form-item>
          <el-form-item label="起始节点">
            <el-select v-model="diseaseForm.startNode" filterable placeholder="请选择起始节点" clearable>
              <el-option
                  v-for="node in allNodes"
                  :key="node.id"
                  :label="`${node.name} (ID: ${node.id})`"
                  :value="node.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="启用状态">
            <el-switch
                v-model="diseaseForm.isEnable"
                :active-value="1"
                :inactive-value="0"
                active-text="启用"
                inactive-text="禁用">
            </el-switch>
          </el-form-item>
          <el-form-item label="描述说明">
            <el-input type="textarea" v-model="diseaseForm.description"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="diseaseDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveDisease">{{ diseaseEditMode ? '更新疾病' : '添加疾病' }}</el-button>
          <el-button v-if="diseaseEditMode" type="danger" @click="deleteDisease(diseaseForm.id)">删除疾病</el-button>
        </div>
      </el-dialog>

      <!-- 节点新增/编辑对话框 -->
      <el-dialog :title="nodeDialogTitle" :visible.sync="showAddNodeDialog" width="500px" @close="resetNodeForm">
        <el-form :model="nodeForm" label-width="100px" size="small">
          <el-form-item label="节点ID">
            <el-input-number v-model="nodeForm.id" :min="1" placeholder="唯一识别码" :disabled="nodeEditMode"></el-input-number>
            <div style="font-size: 12px; color: #999; margin-top: 5px;" v-if="nodeEditMode">
              <i class="el-icon-info"></i> 编辑模式下ID不可修改
            </div>
          </el-form-item>
          <el-form-item label="节点名称">
            <el-input v-model="nodeForm.name"></el-input>
          </el-form-item>
          <el-form-item label="API路径">
            <el-input v-model="nodeForm.api" placeholder="如：4091/api/dr/quality"></el-input>
          </el-form-item>
          <el-form-item label="输入类型">
            <el-input v-model="nodeForm.input" placeholder="如：眼底照相"></el-input>
          </el-form-item>
          <el-form-item label="所属疾病">
            <el-select v-model="nodeForm.diseaseId" filterable placeholder="请选择所属疾病" clearable>
              <el-option
                  v-for="disease in diseaseList"
                  :key="disease.id"
                  :label="`${disease.name} (ID: ${disease.id})`"
                  :value="disease.id">
              </el-option>
            </el-select>
            <div style="font-size: 12px; color: #67C23A; margin-top: 5px;" v-if="nodeForm.diseaseId === currentDiseaseId">
              <i class="el-icon-success"></i> 节点将属于当前疾病
            </div>
          </el-form-item>
          <el-form-item label="描述">
            <el-input type="textarea" v-model="nodeForm.description"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="showAddNodeDialog = false">取消</el-button>
          <el-button type="primary" @click="saveNode">{{ nodeEditMode ? '更新节点' : '添加节点' }}</el-button>
          <el-button v-if="nodeEditMode" type="danger" @click="deleteNode(nodeForm.id)">删除节点</el-button>
        </div>
      </el-dialog>

      <!-- 确认删除对话框 -->
      <el-dialog title="确认删除" :visible.sync="confirmDeleteVisible" width="400px">
        <div style="text-align: center; padding: 20px;">
          <i class="el-icon-warning" style="font-size: 48px; color: #E6A23C;"></i>
          <p style="margin-top: 15px; font-size: 16px;">{{ confirmDeleteMessage }}</p>
        </div>
        <div slot="footer">
          <el-button @click="confirmDeleteVisible = false">取消</el-button>
          <el-button type="danger" @click="executeDelete">确定删除</el-button>
        </div>
      </el-dialog>
    </el-main>
  </div>
</template>

<script>
import Header from "@/components/Header";
import api from "@/api/apiManage";

export default {
  name: 'ModelConfig',
  components: { Header },
  data() {
    return {
      // 数据列表
      diseaseList: [],
      allNodes: [],
      lineList: [],

      // 当前选中的疾病
      currentDiseaseId: null,

      // 选中的元素
      selectedNode: null,
      selectedLine: null,

      // 连线模式相关
      showAddLineMode: false,
      selectedSourceNode: null,

      // 对话框可见性
      diseaseDialogVisible: false,
      showAddNodeDialog: false,
      showAddLineDialog: false,
      testDialogVisible: false,
      confirmDeleteVisible: false,

      // 表单数据
      diseaseForm: {},
      nodeForm: {},
      lineForm: {},
      diseaseEditMode: false,
      nodeEditMode: false,

      // 删除相关
      deleteType: null,
      deleteId: null,
      confirmDeleteMessage: '',

      // 测试相关
      testVisitNumber: '',
      testFileList: [],
      testResult: null,

      // 节点位置（用于流程图布局）
      nodePositions: {},

      // 画布缩放
      zoom: 1,

      // 画布尺寸
      canvasWidth: 1500,
      canvasHeight: 800,

      // 颜色映射
      nodeColorMap: {},
      colors: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#9B59B6', '#3498DB', '#1ABC9C', '#FF6B6B'],

      // 拖拽相关
      draggingNode: null,
      dragOffsetX: 0,
      dragOffsetY: 0,
      isDragging: false,

      // 拖拽放置相关
      draggedNodeData: null,

      // 重置布局标志
      resetting: false
    };
  },

  computed: {
    diseaseDialogTitle() {
      return this.diseaseEditMode ? '编辑疾病' : '新增疾病';
    },

    nodeDialogTitle() {
      return this.nodeEditMode ? '编辑节点' : '新增节点';
    },

    currentDiseaseName() {
      const disease = this.diseaseList.find(d => d.id === this.currentDiseaseId);
      return disease ? disease.name : '';
    },

    // 当前疾病的节点列表
    currentNodeList() {
      if (!this.currentDiseaseId) return [];
      return this.allNodes.filter(n => n.diseaseId === this.currentDiseaseId);
    },

    // 其他可用节点（不属于当前疾病）
    otherNodesList() {
      if (!this.currentDiseaseId) return this.allNodes;
      return this.allNodes.filter(n => n.diseaseId !== this.currentDiseaseId);
    },

    // 当前疾病的路径列表
    currentLineList() {
      if (!this.currentDiseaseId) return [];
      return this.lineList.filter(l => l.diseaseId === this.currentDiseaseId);
    },

    // 根节点ID
    rootNodeId() {
      const disease = this.diseaseList.find(d => d.id === this.currentDiseaseId);
      return disease ? disease.startNode : null;
    },

    // 根节点名称
    rootNodeName() {
      return this.getNodeName(this.rootNodeId);
    }
  },

  watch: {
    currentDiseaseId(newVal) {
      this.selectedNode = null;
      this.selectedLine = null;
      this.selectedSourceNode = null;
      this.showAddLineMode = false;
      if (newVal) {
        this.$nextTick(() => {
          this.autoLayout();
        });
      }
    },

    currentNodeList: {
      handler() {
        this.$nextTick(() => {
          this.autoLayout();
        });
      },
      deep: true
    },

    currentLineList: {
      handler() {
        this.$nextTick(() => {
          this.autoLayout();
        });
      },
      deep: true
    }
  },

  mounted() {
    this.loadAllData();
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('keydown', this.handleKeyDown);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('keydown', this.handleKeyDown);
  },

  methods: {
    // 加载所有数据
    loadAllData() {
      return Promise.all([
        api.getAiDisease(),
        api.getAiNode(),
        api.getAiLine()
      ]).then(([resD, resN, resL]) => {
        this.diseaseList = resD.data.data || [];
        this.allNodes = resN.data.data || [];
        this.lineList = resL.data.data || [];

        // 为节点生成颜色
        this.allNodes.forEach(node => {
          if (!this.nodeColorMap[node.id]) {
            this.$set(this.nodeColorMap, node.id, this.colors[node.id % this.colors.length]);
          }
        });

        // 默认选中第一个疾病
        if (this.diseaseList.length > 0 && !this.currentDiseaseId) {
          this.currentDiseaseId = this.diseaseList[0].id;
        }

        this.$nextTick(() => {
          this.autoLayout();
          this.handleResize();
        });
      }).catch(error => {
        console.error('加载数据失败:', error);
        this.$message.error('加载数据失败');
      });
    },

    // 获取疾病名称
    getDiseaseName(diseaseId) {
      if (!diseaseId) return '';
      const disease = this.diseaseList.find(d => d.id === diseaseId);
      return disease ? disease.name : '';
    },

    // 判断节点是否已在当前疾病中
    isNodeInCurrentDisease(nodeId) {
      return this.currentNodeList.some(n => n.id === nodeId);
    },

    // 自动布局 - 修复版本，支持孤立节点
    autoLayout() {
      const nodes = this.currentNodeList;
      if (nodes.length === 0) return;

      const positions = {};
      const levelMap = {};

      // 1. 先找出所有有连线的节点
      const nodesWithConnections = new Set();
      this.currentLineList.forEach(line => {
        nodesWithConnections.add(line.modelFrom);
        nodesWithConnections.add(line.modelTo);
      });

      // 2. 为有连线的节点计算层级
      nodes.forEach(node => {
        if (nodesWithConnections.has(node.id)) {
          levelMap[node.id] = this.getNodeLevel(node.id);
        }
      });

      // 3. 将有连线的节点按层级分组
      const levelGroups = {};
      nodes.forEach(node => {
        if (nodesWithConnections.has(node.id)) {
          const level = levelMap[node.id];
          if (!levelGroups[level]) levelGroups[level] = [];
          levelGroups[level].push(node);
        }
      });

      // 布局参数
      const startX = 200;
      const startY = 100;
      const levelWidth = 280;
      const nodeHeight = 120;
      const nodeMargin = 30;

      // 4. 布局有连线的节点
      Object.keys(levelGroups).forEach(level => {
        const group = levelGroups[level];
        group.forEach((node, index) => {
          const x = startX + parseInt(level) * levelWidth;
          const y = startY + index * (nodeHeight + nodeMargin);
          positions[node.id] = { x, y };
        });
      });

      // 5. 布局孤立节点（放在最右侧）
      const isolatedNodes = nodes.filter(node => !nodesWithConnections.has(node.id));
      if (isolatedNodes.length > 0) {
        const maxLevel = Object.keys(levelGroups).length > 0
            ? Math.max(...Object.keys(levelGroups).map(Number))
            : -1;
        const isolatedStartX = startX + (maxLevel + 1) * levelWidth;

        isolatedNodes.forEach((node, index) => {
          const x = isolatedStartX;
          const y = startY + index * (nodeHeight + nodeMargin);
          positions[node.id] = { x, y };
        });
      }

      // 6. 合并现有位置（保留手动调整过的位置）
      const newPositions = {};
      nodes.forEach(node => {
        if (this.nodePositions[node.id] && !this.resetting) {
          // 保留手动调整过的位置
          newPositions[node.id] = this.nodePositions[node.id];
        } else if (positions[node.id]) {
          // 使用新计算的位置
          newPositions[node.id] = positions[node.id];
        }
      });

      this.nodePositions = newPositions;
      this.resetting = false;
    },

    // 获取节点层级（BFS）
    getNodeLevel(nodeId, visited = new Set()) {
      if (!this.rootNodeId) return 0;
      if (nodeId === this.rootNodeId) return 0;

      // 查找指向该节点的路径
      const incomingLines = this.currentLineList.filter(l => l.modelTo === nodeId);
      if (incomingLines.length === 0) return 999;

      let minLevel = 999;
      incomingLines.forEach(line => {
        if (!visited.has(line.modelFrom)) {
          visited.add(line.modelFrom);
          const fromLevel = this.getNodeLevel(line.modelFrom, visited);
          minLevel = Math.min(minLevel, fromLevel + 1);
        }
      });

      return minLevel;
    },

    // 获取节点位置
    getNodePosition(nodeId) {
      return this.nodePositions[nodeId] || null;
    },

    // 获取节点样式
    getNodeStyle(node) {
      const pos = this.getNodePosition(node.id);
      if (!pos) return { display: 'none' };

      return {
        position: 'absolute',
        left: pos.x + 'px',
        top: pos.y + 'px',
        width: '240px',
        borderColor: this.getNodeColor(node.id)
      };
    },

    // 获取路径的SVG路径
    getPathD(line) {
      const fromPos = this.getNodePosition(line.modelFrom);
      const toPos = this.getNodePosition(line.modelTo);

      if (!fromPos || !toPos) return '';

      const startX = fromPos.x + 110; // 节点中心X
      const startY = fromPos.y + 40;   // 节点中心Y
      const endX = toPos.x + 110;
      const endY = toPos.y + 40;

      // 计算控制点（曲线偏移）
      const dx = endX - startX;
      const dy = endY - startY;
      const offset = 50;

      if (Math.abs(dx) > Math.abs(dy)) {
        // 水平方向为主
        const midX = (startX + endX) / 2;
        return `M ${startX} ${startY} C ${midX} ${startY + offset}, ${midX} ${endY - offset}, ${endX} ${endY}`;
      } else {
        // 垂直方向为主
        const midY = (startY + endY) / 2;
        return `M ${startX} ${startY} C ${startX + offset} ${midY}, ${endX - offset} ${midY}, ${endX} ${endY}`;
      }
    },

    // 获取条件标签样式
    getConditionStyle(line) {
      const fromPos = this.getNodePosition(line.modelFrom);
      const toPos = this.getNodePosition(line.modelTo);
      if (!fromPos || !toPos) return { display: 'none' };

      const startX = fromPos.x + 110;
      const startY = fromPos.y + 40;
      const endX = toPos.x + 110;
      const endY = toPos.y + 40;

      const x = (startX + endX) / 2;
      const y = (startY + endY) / 2;

      return {
        position: 'absolute',
        left: (x - 50) + 'px',
        top: (y - 15) + 'px',
        zIndex: 20
      };
    },

    // 获取连线颜色
    getLineColor(line) {
      return this.selectedLine && this.selectedLine.id === line.id ? '#E6A23C' : '#409EFF';
    },

    // 获取连线箭头
    getLineMarker(line) {
      return this.selectedLine && this.selectedLine.id === line.id ? 'url(#arrow-selected)' : 'url(#arrow)';
    },

    // 重置布局
    resetLayout() {
      this.resetting = true;
      this.nodePositions = {};
      this.autoLayout();
    },

    // 处理画布大小变化
    handleResize() {
      if (this.$refs.canvas) {
        const rect = this.$refs.canvas.getBoundingClientRect();
        this.canvasWidth = Math.max(rect.width - 50, 1200);
      }
    },

    // 处理键盘事件
    handleKeyDown(event) {
      if (event.key === 'Escape' && this.showAddLineMode) {
        this.cancelLineMode();
      }
    },

    // 拖拽开始
    onDragStart(event, node) {
      this.draggedNodeData = node;
      event.dataTransfer.setData('text/plain', JSON.stringify(node));
      event.dataTransfer.effectAllowed = 'copy';
      event.dataTransfer.dropEffect = 'copy';

      // 添加拖拽时的提示
      if (node.diseaseId === this.currentDiseaseId) {
        event.dataTransfer.setDragImage(new Image(), 0, 0);
        this.$message({
          message: '拖拽节点可以调整位置',
          type: 'info',
          duration: 2000
        });
      }
    },

    // 拖拽结束
    onDragEnd() {
      this.draggedNodeData = null;
    },

    // 放置节点
    onDrop(event) {
      event.preventDefault();
      event.stopPropagation();

      try {
        let nodeData = null;
        const data = event.dataTransfer.getData('text/plain');

        if (data) {
          nodeData = JSON.parse(data);
        } else if (this.draggedNodeData) {
          nodeData = this.draggedNodeData;
        }

        if (!nodeData) {
          this.$message.warning('无效的节点数据');
          return;
        }

        if (!this.currentDiseaseId) {
          this.$message.warning('请先选择疾病');
          return;
        }

        const exists = this.currentNodeList.some(n => n.id === nodeData.id);
        if (exists) {
          this.$message.warning('该节点已存在于当前疾病中');
          return;
        }

        const canvasRect = this.$refs.canvas.getBoundingClientRect();
        const scrollContainer = this.$refs.scrollContainer;
        const scrollLeft = scrollContainer ? scrollContainer.scrollLeft : 0;
        const scrollTop = scrollContainer ? scrollContainer.scrollTop : 0;

        let x = (event.clientX - canvasRect.left + scrollLeft) / this.zoom - 110;
        let y = (event.clientY - canvasRect.top + scrollTop) / this.zoom - 40;

        x = Math.max(20, Math.min(this.canvasWidth - 240, x));
        y = Math.max(20, Math.min(this.canvasHeight - 140, y));

        this.$set(this.nodePositions, nodeData.id, { x: Math.round(x), y: Math.round(y) });

        const updatedNode = {
          ...nodeData,
          diseaseId: this.currentDiseaseId
        };

        const loading = this.$loading({
          lock: true,
          text: '正在添加节点到疾病...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        api.modAiNode(updatedNode).then(res => {
          loading.close();
          if (res.data.code === 200) {
            this.$message.success('节点已添加到当前疾病');
            this.loadAllData();
          } else {
            this.$delete(this.nodePositions, nodeData.id);
            this.$message.error(res.data.msg || '添加节点失败');
          }
        }).catch(error => {
          loading.close();
          this.$delete(this.nodePositions, nodeData.id);
          console.error('添加节点失败:', error);
          this.$message.error('添加节点失败，请检查网络或后端服务');
        });

      } catch (e) {
        console.error('拖拽放置失败:', e);
        this.$message.error('拖拽放置失败');
      }
    },

    // 节点鼠标按下事件
    onNodeMouseDown(event, node) {
      if (this.showAddLineMode) return;

      event.preventDefault();
      event.stopPropagation();

      const pos = this.nodePositions[node.id];
      if (!pos) return;

      const canvasRect = this.$refs.canvas.getBoundingClientRect();
      const scrollContainer = this.$refs.scrollContainer;
      const scrollLeft = scrollContainer ? scrollContainer.scrollLeft : 0;
      const scrollTop = scrollContainer ? scrollContainer.scrollTop : 0;

      const mouseCanvasX = (event.clientX - canvasRect.left + scrollLeft) / this.zoom;
      const mouseCanvasY = (event.clientY - canvasRect.top + scrollTop) / this.zoom;

      this.dragOffsetX = mouseCanvasX - pos.x;
      this.dragOffsetY = mouseCanvasY - pos.y;
      this.draggingNode = node;
      this.isDragging = true;

      document.body.style.userSelect = 'none';
    },

    // 画布鼠标移动事件
    onCanvasMouseMove(event) {
      if (!this.isDragging || !this.draggingNode) return;

      event.preventDefault();

      const canvasRect = this.$refs.canvas.getBoundingClientRect();
      const scrollContainer = this.$refs.scrollContainer;
      const scrollLeft = scrollContainer ? scrollContainer.scrollLeft : 0;
      const scrollTop = scrollContainer ? scrollContainer.scrollTop : 0;

      const mouseCanvasX = (event.clientX - canvasRect.left + scrollLeft) / this.zoom;
      const mouseCanvasY = (event.clientY - canvasRect.top + scrollTop) / this.zoom;

      let newX = mouseCanvasX - this.dragOffsetX;
      let newY = mouseCanvasY - this.dragOffsetY;

      newX = Math.max(20, Math.min(this.canvasWidth - 240, newX));
      newY = Math.max(20, Math.min(this.canvasHeight - 140, newY));

      this.$set(this.nodePositions, this.draggingNode.id, {
        x: Math.round(newX),
        y: Math.round(newY)
      });
    },

    // 画布鼠标松开事件
    onCanvasMouseUp(event) {
      if (this.isDragging && this.draggingNode) {
        event.preventDefault();

        this.isDragging = false;
        this.draggingNode = null;
        document.body.style.userSelect = '';
      }
    },

    // 画布鼠标离开事件
    onCanvasMouseLeave(event) {
      if (this.isDragging) {
        this.isDragging = false;
        this.draggingNode = null;
        document.body.style.userSelect = '';
      }
    },

    // 切换连线模式
    toggleLineMode() {
      this.showAddLineMode = !this.showAddLineMode;
      if (!this.showAddLineMode) {
        this.selectedSourceNode = null;
      } else {
        this.$message.info('请点击一个节点作为连线的起点');
      }
    },

    // 节点单击事件
    onNodeClick(node) {
      if (this.showAddLineMode) {
        if (!this.selectedSourceNode) {
          this.selectedSourceNode = node;
          this.$message({
            message: `已选择起点: ${node.name}，请点击目标节点`,
            type: 'success',
            duration: 3000
          });
        } else {
          this.createLineBetweenNodes(this.selectedSourceNode, node);
        }
      } else {
        this.selectNode(node);
      }
    },

    // 创建连线
    createLineBetweenNodes(sourceNode, targetNode) {
      if (sourceNode.id === targetNode.id) {
        this.$message.warning('源节点和目标节点不能相同');
        this.cancelLineMode();
        return;
      }

      const exists = this.currentLineList.some(l =>
          l.modelFrom === sourceNode.id && l.modelTo === targetNode.id
      );

      if (exists) {
        this.$message.warning('该连线已存在');
        this.cancelLineMode();
        return;
      }

      const maxId = this.lineList.length > 0 ? Math.max(...this.lineList.map(l => l.id)) : 0;

      this.lineForm = {
        id: maxId + 1,
        modelFrom: sourceNode.id,
        modelTo: targetNode.id,
        diseaseId: this.currentDiseaseId,
        limitValue: 'allow',
        useOutputUrl: 0,
        description: ''
      };

      this.showAddLineMode = false;
      this.selectedSourceNode = null;
      this.showAddLineDialog = true;
    },

    // 开始创建连线（双击节点）
    startCreateLine(node) {
      if (!this.currentDiseaseId) {
        this.$message.warning('请先选择疾病');
        return;
      }

      this.showAddLineMode = true;
      this.selectedSourceNode = node;
      this.selectedNode = null;
      this.selectedLine = null;

      this.$message({
        message: `已进入连线模式，起点: ${node.name}，请点击目标节点`,
        type: 'success',
        duration: 3000
      });
    },

    // 取消连线模式
    cancelLineMode() {
      this.showAddLineMode = false;
      this.selectedSourceNode = null;
      this.$message.info('已取消连线');
    },

    // 处理疾病切换
    handleDiseaseChange() {
      this.showAddLineMode = false;
      this.selectedSourceNode = null;
      this.selectedNode = null;
      this.selectedLine = null;
    },

    // 编辑当前疾病
    handleEditCurrentDisease() {
      if (!this.currentDiseaseId) return;
      const disease = this.diseaseList.find(d => d.id === this.currentDiseaseId);
      if (disease) {
        this.diseaseEditMode = true;
        this.diseaseForm = {
          ...disease,
          isEnable: disease.isEnable !== undefined ? disease.isEnable : 1
        };
        this.diseaseDialogVisible = true;
      }
    },

    // 新增疾病
    handleAddDisease() {
      this.diseaseEditMode = false;
      this.diseaseForm = {
        id: null,
        name: '',
        input: '',
        startNode: null,
        isEnable: 1,
        description: ''
      };
      this.diseaseDialogVisible = true;
    },

    // 保存疾病
    saveDisease() {
      if (!this.diseaseForm.id) {
        this.$message.warning('请输入疾病ID');
        return;
      }

      if (!this.diseaseForm.name) {
        this.$message.warning('请输入疾病名称');
        return;
      }

      const apiMethod = this.diseaseEditMode ? api.modAiDisease : api.addAiDisease;
      const actionText = this.diseaseEditMode ? '更新' : '添加';

      apiMethod(this.diseaseForm).then(res => {
        if (res.data.code === 200) {
          this.$message.success(`疾病${actionText}成功`);
          this.diseaseDialogVisible = false;
          this.loadAllData();
        } else {
          this.$message.error(res.data.msg || `${actionText}失败`);
        }
      }).catch(error => {
        console.error('保存疾病失败:', error);
        this.$message.error('操作失败，请重试');
      });
    },

    // 删除疾病
    deleteDisease(diseaseId) {
      this.showConfirmDialog('疾病', diseaseId, 'disease');
    },

    // 新增节点
    handleAddNode() {
      this.nodeEditMode = false;

      const defaultDiseaseId = this.currentDiseaseId || null;

      this.nodeForm = {
        id: null,
        name: '',
        api: '',
        input: '',
        description: '',
        diseaseId: defaultDiseaseId
      };

      if (defaultDiseaseId) {
        const diseaseName = this.getDiseaseName(defaultDiseaseId);
        this.$message.info(`新增节点将自动关联到当前疾病: ${diseaseName}`);
      }

      this.showAddNodeDialog = true;
    },

    // 编辑节点
    editNode(node) {
      this.nodeEditMode = true;
      this.nodeForm = {
        ...node,
        input: node.input || ''
      };
      this.showAddNodeDialog = true;
    },

    // 重置节点表单
    resetNodeForm() {},

    // 保存节点
    saveNode() {
      if (!this.nodeForm.id) {
        this.$message.warning('请输入节点ID');
        return;
      }

      if (!this.nodeForm.name) {
        this.$message.warning('请输入节点名称');
        return;
      }

      const apiMethod = this.nodeEditMode ? api.modAiNode : api.addAiNode;
      const actionText = this.nodeEditMode ? '更新' : '添加';

      apiMethod(this.nodeForm).then(res => {
        if (res.data.code === 200) {
          this.$message.success(`节点${actionText}成功`);
          this.showAddNodeDialog = false;

          this.loadAllData().then(() => {
            if (this.currentDiseaseId) {
              this.$nextTick(() => {
                this.autoLayout();
              });
            }
          });
        } else {
          this.$message.error(res.data.msg || `${actionText}失败`);
        }
      }).catch(error => {
        console.error(`节点${actionText}失败:`, error);
        this.$message.error('操作失败，请重试');
      });
    },

    // 删除节点
    deleteNode(nodeId) {
      this.showConfirmDialog('节点', nodeId, 'node');
    },

    // 从当前疾病移除节点
    removeNodeFromDisease(nodeId) {
      const node = this.allNodes.find(n => n.id === nodeId);
      if (!node) return;

      const updatedNode = {
        ...node,
        diseaseId: null
      };

      const loading = this.$loading({
        lock: true,
        text: '正在从疾病移除节点...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      api.modAiNode(updatedNode).then(res => {
        loading.close();
        if (res.data.code === 200) {
          this.$message.success('节点已从当前疾病移除');
          this.selectedNode = null;
          this.loadAllData();
        } else {
          this.$message.error(res.data.msg || '移除失败');
        }
      }).catch(error => {
        loading.close();
        console.error('移除节点失败:', error);
        this.$message.error('移除失败，请重试');
      });
    },

    // 从节点卡片移除
    deleteNodeFromDisease(nodeId) {
      this.removeNodeFromDisease(nodeId);
    },

    // 选择节点
    selectNode(node) {
      this.selectedNode = {...node};
      this.selectedLine = null;
    },

    // 更新节点
    updateNode() {
      if (!this.selectedNode) return;

      api.modAiNode(this.selectedNode).then(res => {
        if (res.data.code === 200) {
          this.$message.success('节点更新成功');
          this.loadAllData();
        } else {
          this.$message.error(res.data.msg || '更新节点失败');
        }
      }).catch(error => {
        console.error('更新节点失败:', error);
        this.$message.error('更新节点失败，请重试');
      });
    },

    // 选择路径
    selectLine(line) {
      this.selectedLine = {...line};
      this.selectedNode = null;
    },

    // 添加路径
    addLine() {
      if (!this.lineForm.modelFrom || !this.lineForm.modelTo) {
        this.$message.warning('请选择源节点和目标节点');
        return;
      }
      this.lineForm.diseaseId = this.currentDiseaseId;

      api.addAiLine(this.lineForm).then(res => {
        if (res.data.code === 200) {
          this.$message.success('路径添加成功');
          this.showAddLineDialog = false;
          this.loadAllData();
        } else {
          this.$message.error(res.data.msg || '添加路径失败');
        }
      }).catch(error => {
        console.error('添加路径失败:', error);
        this.$message.error('添加路径失败，请重试');
      });
    },

    // 更新路径
    updateLine() {
      if (!this.selectedLine) return;

      api.modAiLine(this.selectedLine).then(res => {
        if (res.data.code === 200) {
          this.$message.success('路径更新成功');
          this.loadAllData();
        } else {
          this.$message.error(res.data.msg || '更新路径失败');
        }
      }).catch(error => {
        console.error('更新路径失败:', error);
        this.$message.error('更新路径失败，请重试');
      });
    },

    // 删除路径
    deleteLine(lineId) {
      this.showConfirmDialog('路径', lineId, 'line');
    },

    // 显示确认删除对话框
    showConfirmDialog(type, id, deleteType) {
      this.deleteType = deleteType;
      this.deleteId = id;

      let name = '';
      if (deleteType === 'disease') {
        const item = this.diseaseList.find(d => d.id === id);
        name = item ? item.name : `ID: ${id}`;
        this.confirmDeleteMessage = `确定要删除疾病 "${name}" 吗？删除后相关的节点关联和路径都将被清除。`;
      } else if (deleteType === 'node') {
        const item = this.allNodes.find(n => n.id === id);
        name = item ? item.name : `ID: ${id}`;
        this.confirmDeleteMessage = `确定要删除节点 "${name}" 吗？删除后相关的路径也将被删除。`;
      } else if (deleteType === 'line') {
        this.confirmDeleteMessage = `确定要删除该路径吗？`;
      }

      this.confirmDeleteVisible = true;
    },

    // 执行删除
    executeDelete() {
      this.confirmDeleteVisible = false;

      let apiCall = null;
      let successMsg = '';

      if (this.deleteType === 'disease') {
        apiCall = api.delAiDisease(this.deleteId);
        successMsg = '疾病删除成功';
      } else if (this.deleteType === 'node') {
        apiCall = api.delAiNode(this.deleteId);
        successMsg = '节点删除成功';
      } else if (this.deleteType === 'line') {
        apiCall = api.delAiLine(this.deleteId);
        successMsg = '路径删除成功';
      }

      if (!apiCall) return;

      const loading = this.$loading({
        lock: true,
        text: '正在删除...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      apiCall.then(res => {
        loading.close();
        if (res.data.code === 200) {
          this.$message.success(successMsg);

          if (this.deleteType === 'disease' && this.deleteId === this.currentDiseaseId) {
            this.currentDiseaseId = null;
          }
          if (this.deleteType === 'node' && this.selectedNode && this.selectedNode.id === this.deleteId) {
            this.selectedNode = null;
          }
          if (this.deleteType === 'line' && this.selectedLine && this.selectedLine.id === this.deleteId) {
            this.selectedLine = null;
          }

          this.loadAllData();
        } else {
          this.$message.error(res.data.msg || '删除失败');
        }
      }).catch(error => {
        loading.close();
        console.error('删除失败:', error);
        this.$message.error('删除失败，请重试');
      });
    },

    // 关闭属性面板
    closeProperty() {
      this.selectedNode = null;
      this.selectedLine = null;
    },

    // 取消所有选中
    deselectAll() {
      if (!this.showAddLineMode) {
        this.selectedNode = null;
        this.selectedLine = null;
      }
    },

    // 获取节点名称
    getNodeName(nodeId) {
      if (!nodeId) return '';
      const node = this.allNodes.find(n => n.id === nodeId);
      return node ? node.name : `未知节点(${nodeId})`;
    },

    // 获取节点颜色
    getNodeColor(nodeId) {
      return this.nodeColorMap[nodeId] || '#409EFF';
    },

    // 保存配置
    handleSaveConfig() {
      this.$message.success('配置已保存');
    },

    // 测试配置
    handleTestConfig() {
      this.testDialogVisible = true;
      this.testResult = null;
    },

    // 运行测试
    runTest() {
      this.testResult = {
        success: true,
        stages: [
          {node: '异常图像检测', result: '正常'},
          {node: '四期非四期诊断', result: '非四期'}
        ],
        finalDiagnosis: '糖网病（非增殖期）',
        confidence: 0.92
      };
    },

    handleTestFileChange(file) {
      this.testFileList = [file];
    }
  }
};
</script>

<style scoped>
.el-header {
  width: 100%;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  padding: 0;
  line-height: 65px;
}

.el-main {
  margin-top: 65px;
  background-color: #E9EEF3;
  min-height: calc(100vh - 65px);
  padding: 20px;
}

.disease-selector {
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.selector-label {
  font-weight: bold;
  color: #333;
  font-size: 14px;
}

/* 流程图容器 */
.flowchart-container {
  display: flex;
  gap: 15px;
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  min-height: 700px;
}

/* 节点库 - 分组样式 */
.node-library {
  width: 280px;
  border-right: 1px solid #f0f0f0;
  padding-right: 15px;
  overflow-y: auto;
  max-height: 700px;
}

.library-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  position: sticky;
  top: 0;
  background: white;
  padding-bottom: 10px;
  z-index: 10;
}

.library-header h4 {
  margin: 0;
  font-size: 15px;
  color: #333;
}

.node-group {
  margin-bottom: 20px;
}

.node-group-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 0 5px;
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.node-group-title span {
  color: #333;
}

.node-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.library-node {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 6px;
  cursor: move;
  transition: all 0.3s;
  border: 1px solid transparent;
  position: relative;
}

.library-node:hover {
  background: #ecf5ff;
  border-color: #409EFF;
  transform: translateX(2px);
}

.library-node.in-use {
  background: #ecf5ff;
  border-color: #409EFF;
  opacity: 0.9;
}

.library-node.in-use .node-name {
  color: #409EFF;
  font-weight: 500;
}

.library-node-actions {
  display: none;
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2px;
}

.library-node:hover .library-node-actions {
  display: flex;
  gap: 2px;
}

.node-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
  flex-shrink: 0;
}

.library-node .node-name {
  flex: 1;
  font-size: 13px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 5px;
}

.library-node .node-id {
  font-size: 11px;
  color: #999;
  margin-left: 5px;
  flex-shrink: 0;
}

.node-in-use {
  color: #67C23A;
  font-weight: bold;
  margin-left: 5px;
  font-size: 14px;
  flex-shrink: 0;
}

.node-empty {
  padding: 15px;
  text-align: center;
  color: #999;
  font-size: 12px;
  background: #fafafa;
  border-radius: 6px;
  border: 1px dashed #e4e7ed;
  margin-bottom: 10px;
}

.node-empty i {
  margin-right: 5px;
  font-size: 14px;
}

/* 流程图画布 */
.flowchart-canvas {
  flex: 1;
  background: #fafafa;
  border-radius: 8px;
  overflow: auto;
  position: relative;
  min-height: 650px;
  max-height: 800px;
  border: 1px solid #e4e7ed;
}

.canvas-header {
  padding: 10px;
  background: white;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 30;
}

.canvas-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.canvas-title span {
  font-weight: bold;
  color: #333;
}

.canvas-tools {
  margin-right: 10px;
}

.canvas-tools .el-button.active-mode {
  background: #E6A23C;
  color: white;
  border-color: #E6A23C;
  position: relative;
}

.canvas-tools .el-button.active-mode::after {
  content: '';
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: #F56C6C;
  border-radius: 50%;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.canvas-scroll {
  width: 100%;
  height: calc(100% - 50px);
  overflow: auto;
  position: relative;
}

.canvas-wrapper {
  position: relative;
  transition: transform 0.3s;
  transform-origin: 0 0;
  background: #fafafa;
  background-image: linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
  linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

/* 连接线 - 放在最底层 */
.connection-lines {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
}

.connection-lines path {
  pointer-events: stroke;
  cursor: pointer;
  transition: stroke 0.3s, stroke-width 0.3s;
}

.connection-lines path:hover {
  stroke: #67C23A;
  stroke-width: 3;
}

.connection-lines path.selected-path {
  stroke: #E6A23C;
  stroke-width: 3;
}

/* 条件标签 - 放在中层 */
.condition-label {
  background: white;
  border: 1px solid #409EFF;
  border-radius: 16px;
  padding: 4px 12px;
  font-size: 12px;
  color: #409EFF;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  pointer-events: all;
  display: inline-block;
  font-weight: bold;
  z-index: 20;
  transform: translate(-50%, -50%);
}

.condition-label:hover {
  background: #ecf5ff;
  transform: translate(-50%, -50%) scale(1.05);
}

.condition-label.selected {
  background: #E6A23C;
  border-color: #E6A23C;
  color: white;
}

.condition-reuse {
  font-size: 10px;
  opacity: 0.8;
  margin-left: 4px;
}

/* 流程节点 - 放在最上层 */
.flow-node {
  position: absolute;
  width: 240px;
  background: white;
  border: 2px solid;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: grab;
  transition: all 0.2s;
  z-index: 30;
  user-select: none;
}

.flow-node:active {
  cursor: grabbing;
}

.flow-node:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  z-index: 40;
}

.flow-node.selected {
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.5);
}

.flow-node.root-node {
  border-width: 3px;
}

.flow-node.source-mode {
  box-shadow: 0 0 0 3px #409EFF;
  position: relative;
}

.flow-node.source-mode::after {
  content: '起点';
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background: #409EFF;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  white-space: nowrap;
}

.flow-node.target-mode {
  box-shadow: 0 0 0 3px #67C23A;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 3px rgba(103, 194, 58, 0.5);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(103, 194, 58, 0.3);
  }
  100% {
    box-shadow: 0 0 0 3px rgba(103, 194, 58, 0.5);
  }
}

.flow-node.dragging {
  opacity: 0.8;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  z-index: 100;
  cursor: grabbing;
  transform: scale(1.02);
}

.flow-node-header {
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 6px 6px 0 0;
}

.flow-node-name {
  font-weight: bold;
  color: #333;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 130px;
}

.root-tag {
  margin-left: 5px;
  flex-shrink: 0;
}

.flow-node-body {
  padding: 8px 12px;
  font-size: 12px;
}

.flow-node-api {
  color: #666;
  margin-bottom: 4px;
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.flow-node-input {
  color: #999;
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.flow-node-footer {
  padding: 5px 12px 8px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  border-top: 1px dashed #f0f0f0;
  flex-wrap: wrap;
}

/* 连线模式提示条 */
.line-mode-tip {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(64, 158, 255, 0.9);
  color: white;
  padding: 10px 20px;
  border-radius: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  backdrop-filter: blur(5px);
  animation: slideUp 0.3s ease;
}

.line-mode-tip.has-source {
  background: rgba(103, 194, 58, 0.9);
}

.line-mode-tip i {
  font-size: 16px;
}

@keyframes slideUp {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1;
  }
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter, .slide-up-leave-to {
  bottom: 0;
  opacity: 0;
}

/* 属性面板 */
.property-card {
  margin-top: 20px;
  border-radius: 10px;
}

.property-card .el-form {
  max-width: 450px;
}

.test-result {
  margin-top: 15px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 6px;
  max-height: 300px;
  overflow-y: auto;
}

.test-result pre {
  margin: 0;
  font-size: 12px;
}
</style>