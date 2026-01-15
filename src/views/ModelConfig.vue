<template>
  <div class="model-config-container">
    <el-header>
      <Header active-index="/ModelConfig"></Header>
    </el-header>

    <el-main>
      <div class="tableContainer" style="padding: 20px; border-radius: 20px; background: white; box-shadow: 8px 20px 30px 8px rgba(21, 60, 204, 0.09);">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane label="1. 疾病定义" name="disease">
            <div class="action-bar">
              <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd('disease')">新增疾病</el-button>
            </div>
            <el-table :data="diseaseList" border size="small" v-loading="loading">
              <el-table-column prop="id" label="疾病ID" width="80" align="center">
                <template slot-scope="scope"><b>{{ scope.row.id }}</b></template>
              </el-table-column>
              <el-table-column prop="name" label="疾病名称" align="center"></el-table-column>
              <el-table-column prop="input" label="输入类型" align="center"></el-table-column>
              <el-table-column label="起始节点" align="center">
                <template slot-scope="scope">
                  <el-tag size="mini" type="success" v-if="scope.row.startNode">
                    ID: {{ scope.row.startNode }} {{ getNodeName(scope.row.startNode) }}
                  </el-tag>
                  <span v-else style="color:#999">未绑定</span>
                </template>
              </el-table-column>
              <el-table-column prop="description" label="描述" show-overflow-tooltip align="center"></el-table-column>
              <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                  <el-button type="text" @click="handleEdit('disease', scope.row)">编辑</el-button>
                  <el-button type="text" style="color:red" @click="handleDelete('disease', scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="2. 模型节点配置" name="node">
            <div class="action-bar">
              <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd('node')">新增节点</el-button>
            </div>
            <el-table :data="allNodes" border size="small" v-loading="loading">
              <el-table-column prop="id" label="节点ID" width="80" align="center">
                <template slot-scope="scope"><b style="color: #409EFF">{{ scope.row.id }}</b></template>
              </el-table-column>
              <el-table-column label="所属疾病" align="center">
                <template slot-scope="scope">
                  ID: {{ scope.row.diseaseId }} <span style="font-size:12px;color:#999">{{ getDiseaseName(scope.row.diseaseId) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="节点名称" align="center"></el-table-column>
              <el-table-column prop="api" label="API路径" show-overflow-tooltip></el-table-column>
              <el-table-column prop="description" label="节点描述" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                  <el-button type="text" @click="handleEdit('node', scope.row)">编辑</el-button>
                  <el-button type="text" style="color:red" @click="handleDelete('node', scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="3. 节点流转逻辑" name="line">
            <div class="action-bar">
              <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd('line')">新增连线</el-button>
            </div>
            <el-table :data="lineList" border size="small" v-loading="loading">
              <el-table-column prop="id" label="逻辑ID" width="80" align="center"></el-table-column>
              <el-table-column label="起始节点" align="center">
                <template slot-scope="scope">ID: {{ scope.row.modelFrom }} {{ getNodeName(scope.row.modelFrom) }}</template>
              </el-table-column>
              <el-table-column label="目标节点" align="center">
                <template slot-scope="scope">ID: {{ scope.row.modelTo }} {{ getNodeName(scope.row.modelTo) }}</template>
              </el-table-column>
              <el-table-column prop="limitValue" label="流转条件" align="center"></el-table-column>
              <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                  <el-button type="text" @click="handleEdit('line', scope.row)">编辑</el-button>
                  <el-button type="text" style="color:red" @click="handleDelete('line', scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-main>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="550px">
      <el-form :model="form" label-width="120px" size="small">
        <el-form-item label="主键 ID">
          <el-input-number v-model="form.id" :min="1" placeholder="唯一识别码"></el-input-number>
        </el-form-item>

        <template v-if="activeTab === 'disease'">
          <el-form-item label="疾病名称"><el-input v-model="form.name"></el-input></el-form-item>
          <el-form-item label="输入类型"><el-input v-model="form.input"></el-input></el-form-item>
          <el-form-item label="起始节点ID">
            <el-input-number v-model="form.startNode" :min="1"></el-input-number>
            <span class="id-name-tag">{{ getNodeName(form.startNode) }}</span>
          </el-form-item>
          <el-form-item label="描述说明"><el-input type="textarea" v-model="form.description"></el-input></el-form-item>
        </template>

        <template v-if="activeTab === 'node'">
          <el-form-item label="所属疾病ID">
            <el-input-number v-model="form.diseaseId" :min="1"></el-input-number>
            <span class="id-name-tag">{{ getDiseaseName(form.diseaseId) }}</span>
          </el-form-item>
          <el-form-item label="节点名称"><el-input v-model="form.name"></el-input></el-form-item>
          <el-form-item label="API路径"><el-input v-model="form.api"></el-input></el-form-item>
          <el-form-item label="描述说明"><el-input type="textarea" v-model="form.description"></el-input></el-form-item>
        </template>

        <template v-if="activeTab === 'line'">
          <el-form-item label="所属疾病ID">
            <el-input-number v-model="form.diseaseId" :min="1"></el-input-number>
            <span class="id-name-tag">{{ getDiseaseName(form.diseaseId) }}</span>
          </el-form-item>
          <el-form-item label="起始节点ID">
            <el-input-number v-model="form.modelFrom" :min="1"></el-input-number>
            <span class="id-name-tag">{{ getNodeName(form.modelFrom) }}</span>
          </el-form-item>
          <el-form-item label="目标节点ID">
            <el-input-number v-model="form.modelTo" :min="1"></el-input-number>
            <span class="id-name-tag">{{ getNodeName(form.modelTo) }}</span>
          </el-form-item>
          <el-form-item label="流转条件"><el-input v-model="form.limitValue"></el-input></el-form-item>
          <el-form-item label="描述说明"><el-input type="textarea" v-model="form.description"></el-input></el-form-item>
        </template>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitSave">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Header from "@/components/Header";
import api from "@/api/apiManage";

export default {
  components: { Header },
  data() {
    return {
      activeTab: 'disease',
      loading: false,
      dialogVisible: false,
      isEdit: false,
      diseaseList: [],
      allNodes: [],
      lineList: [],
      form: {}
    };
  },
  computed: {
    dialogTitle() {
      const titles = { disease: '疾病定义', node: '模型节点', line: '流转逻辑' };
      return (this.isEdit ? '编辑' : '新增') + titles[this.activeTab];
    }
  },
  methods: {
    loadAllData() {
      this.loading = true;
      Promise.all([
        api.getAiDisease(),
        api.getAiNode(),
        api.getAiLine()
      ]).then(([resD, resN, resL]) => {
        this.diseaseList = resD.data.data || [];
        this.allNodes = resN.data.data || [];
        this.lineList = resL.data.data || [];
      }).finally(() => { this.loading = false; });
    },

    // 【复用逻辑】：根据 ID 获取名称，用于列表展示和表单实时预览
    getNodeName(id) {
      if (!id) return '';
      const item = this.allNodes.find(n => n.id === id);
      return item ? ` ( ${item.name} )` : ' ( 未找到该节点 )';
    },
    getDiseaseName(id) {
      if (!id) return '';
      const item = this.diseaseList.find(d => d.id === id);
      return item ? ` ( ${item.name} )` : ' ( 未找到该疾病 )';
    },

    handleTabClick() { this.loadAllData(); },

    handleAdd(type) {
      this.isEdit = false;
      this.activeTab = type;
      const baseForm = { id: null, description: "" };
      if (type === 'disease') {
        this.form = { ...baseForm, name: "", input: "", startNode: null };
      } else if (type === 'node') {
        this.form = { ...baseForm, diseaseId: null, name: "", api: "" };
      } else if (type === 'line') {
        this.form = { ...baseForm, diseaseId: null, modelFrom: null, modelTo: null, limitValue: "" };
      }
      this.dialogVisible = true;
    },

    handleEdit(type, row) {
      this.isEdit = true;
      this.activeTab = type;
      this.form = { ...row };
      this.dialogVisible = true;
    },

    async submitSave() {
      if (!this.form.id) {
        this.$message.warning("请输入主键 ID");
        return;
      }
      try {
        let response;
        const apiMap = {
          add: { disease: api.addAiDisease, node: api.addAiNode, line: api.addAiLine },
          mod: { disease: api.modAiDisease, node: api.modAiNode, line: api.modAiLine }
        };
        const method = this.isEdit ? apiMap.mod[this.activeTab] : apiMap.add[this.activeTab];
        response = await method(this.form);

        if (response.data.code === 200) {
          this.$message.success("保存成功");
          this.dialogVisible = false;
          this.loadAllData();
        } else {
          this.$message.error(response.data.msg || "保存失败");
        }
      } catch (error) {
        this.$message.error("保存失败，请求异常");
      }
    },

    handleDelete(type, id) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', { type: 'warning' }).then(async () => {
        try {
          let res;
          if (type === 'disease') res = await api.delAiDisease(id);
          else if (type === 'node') res = await api.delAiNode(id);
          else if (type === 'line') res = await api.delAiLine(id);

          if (res && res.data.code === 200) {
            this.$message.success("删除成功");
            this.loadAllData();
          } else {
            this.$message.error(res.data.msg || "删除失败");
          }
        } catch (error) {
          this.$message.error("网络异常，删除失败");
        }
      }).catch(() => {});
    }
  },
  mounted() { this.loadAllData(); }
};
</script>

<style scoped>
.el-header { width: 100%; position: fixed; z-index: 1000; left: 0; top: 0; padding: 0; line-height: 65px; }
.el-main { margin-top: 65px; background-color: #E9EEF3; min-height: calc(100vh - 65px); padding: 10px; }
.action-bar { margin-bottom: 15px; }
.tableContainer { margin: 10px; }
b { color: #409EFF; }
/* 新增的样式：让 ID 后的名称显示为灰色且有间距 */
.id-name-tag {
  margin-left: 10px;
  color: #909399;
  font-size: 13px;
  font-weight: bold;
}
</style>