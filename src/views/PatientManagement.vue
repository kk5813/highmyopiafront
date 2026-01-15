<template>
  <div>
    <el-container>
      <el-header>
        <Header active-index="/patientmanagement"></Header>
      </el-header>
      <el-main>
        <div
          class="tableContainer"
          style="
            padding-bottom: 10px;
            border-radius: 20px;
            background: white;
            margin-top: 10px;
            box-shadow: 8px 20px 30px 8px rgba(21, 60, 204, 0.09);
          "
        >
          <div
            style="
              padding: 10px;
              border-radius: 20px;
              background: white;
              float: left;
            "
          >
            <div style="display: inline-block">
              <el-input v-model="diaDoctor">
                <template slot="prepend">诊断医生</template>
                <template slot="append">
                  <el-button type="primary" @click="handleDoctorChange()" circle
                    >确定</el-button
                  >
                </template>
              </el-input>
            </div>

            <el-button
              style="margin-left: 30px"
              icon="el-icon-top-right"
              type="primary"
              :disabled="setFollowupedInfos.length <= 0"
              @click="dialogAddFormVisible = true"
              >批量添加随访</el-button
            >
          </div>

          <!--                            患者档案表格-->
          <el-table
            :data="tableData"
            border
            style="width: 100%; border-radius: 20px"
            v-loading="loading"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="患者号" prop="patientId" align="center">
            </el-table-column>
            <el-table-column
              width="100px"
              label="患者姓名"
              prop="patientName"
              align="center"
            ></el-table-column>
            <el-table-column
              width="50px"
              label="性别"
              prop="sexName"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="出生日期"
              width="200px"
              prop="birthday"
              align="center"
            >
              <template slot-scope="scope" v-if="scope.row.birthday">
                {{ scope.row.birthday.substring(0, 10) }}
              </template>
            </el-table-column>
            <el-table-column label="诊断" prop="diagName" align="center">
            </el-table-column>
            <el-table-column
              width="100px"
              label="眼别"
              prop="siteName"
              align="center"
            >
            </el-table-column>
            <el-table-column
              width="100px"
              label="诊断医生"
              prop="doctorName"
              align="center"
            >
            </el-table-column>
            <el-table-column label="科室" prop="deptName" align="center">
              <template slot="header" slot-scope="scope">
                <el-dropdown @command="handleDept">
                  <span>
                    科室({{ currentCommand }})<i
                      class="el-icon-arrow-down el-icon--right"
                    ></i>
                  </span>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      style="font-size: 12px"
                      v-for="(item, index) in depts"
                      :key="item.value"
                      :command="item.deptName"
                      :divided="true"
                    >
                      {{ item.deptName }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column
              label="诊断时间"
              width="400px;"
              prop="diagTime"
              align="center"
            >
              <template slot="header" slot-scope="scope">
                <span> 诊断时间 </span>
                <el-date-picker
                  style="width: 300px"
                  v-model="timeRange"
                  value-format="yyyy-MM-dd"
                  @change="timeChange()"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column width="200px" align="center">
              <template slot="header" slot-scope="scope">
                <el-button
                  @click="downInfo()"
                  type="primary"
                  size="mini"
                  v-if="withPermission"
                  >信息导出</el-button
                >
                <el-button
                  @click="dialogSearchVisible = true"
                  type="primary"
                  size="mini"
                  >搜索</el-button
                >
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="patientInfo(scope.$index, scope.row)"
                  type="primary"
                  plain
                >
                  基本信息</el-button
                >
                <el-button
                  size="mini"
                  type="success"
                  @click="toCaseDetail(scope.row)"
                  >详细病历</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <!--                                            表格分页-->
          <el-pagination
            style="margin-top: 10px"
            align="center"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[1, 5, 10, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalSize"
          >
          </el-pagination>
        </div>
        <!-- 搜索 -->
        <el-dialog title="搜索" :visible.sync="dialogSearchVisible" width="30%">
          <div>
            <el-input v-model="searchForm.patientId">
              <template slot="prepend">患者ID</template>
            </el-input>
          </div>
          <div style="margin-top: 15px">
            <el-input v-model="searchForm.diagName">
              <template slot="prepend">诊断名</template>
            </el-input>
          </div>
          <div style="margin-top: 15px">
            <el-date-picker
              style="width: 300px"
              v-model="searchForm.timeRange"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
            <template slot="prepend">时间段</template>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogSearchVisible = false">取 消</el-button>
            <el-button type="primary" @click="searchByInput()">确 定</el-button>
          </div>
        </el-dialog>
        <!--                                            患者信息编辑-->
        <el-dialog
          :title="currentPatientName + '基本信息'"
          :visible.sync="dialogFormVisible"
          width="30%"
        >
          <el-form :model="infoForm">
            <el-form-item label="患者ID" :label-width="formLabelWidth">
              <el-input
                v-model="infoForm.id"
                autocomplete="off"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="患者姓名" :label-width="formLabelWidth">
              <el-input v-model="infoForm.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="患者性别" :label-width="formLabelWidth">
              <el-radio-group
                disabled
                style="margin-left: -200px"
                v-model="infoForm.sexName"
              >
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="出生日期" :label-width="formLabelWidth">
              <el-input
                disabled
                v-model="infoForm.birthday"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="患者电话" :label-width="formLabelWidth">
              <el-input v-model="infoForm.phone" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" :label-width="formLabelWidth">
              <el-input
                disabled
                v-model="infoForm.idNumber"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitEditPatient('form')"
              >确 定</el-button
            >
          </div>
        </el-dialog>
        <!--                            批量新增随访          -->
        <el-dialog
          title="添加随访"
          :visible.sync="dialogAddFormVisible"
          width="30%"
        >
          <el-form :model="addFollowForm">
            <el-form-item label="使用模板" :label-width="formLabelWidth">
              <el-switch
                @change="useTemplateChange()"
                v-model="useTemplate"
                active-color="#13ce66"
                inactive-color="#ff4949"
                style="float: left; margin-top: 10px"
                :disabled="allTemplates.length <= 0"
              >
              </el-switch>
            </el-form-item>
            <el-form-item label="模板名称" :label-width="formLabelWidth">
              <el-select
                v-model="chosenTemplate"
                placeholder="请选择"
                style="float: left"
                :disabled="allTemplates.length <= 0 || !useTemplate"
                @change="handleTemplateChange"
              >
                <el-option
                  v-for="item in allTemplates"
                  :key="item.id"
                  :label="item.templateName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="几天后随访" :label-width="formLabelWidth">
              <el-input-number
                style="float: left"
                v-model="addFollowForm.intervalValue"
                :step="1"
                :min="1"
                :max="999"
                :disabled="useTemplate"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="随访计划" :label-width="formLabelWidth">
              <el-input
                :disabled="useTemplate"
                type="textarea"
                maxlength="85"
                show-word-limit
                :autosize="{ minRows: 4, maxRows: 10 }"
                v-model="addFollowForm.visitPlan"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addPatientsFollow()"
              >确 定</el-button
            >
            <el-button @click="dialogAddFormVisible = false">取 消</el-button>
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
import Header from "../components/Header";
import api from "@/api/apiManage";
import request from "@/axios";
import { mapMutations, mapGetters } from "vuex";
export default {
  name: "PatientManagement",
  components: { Header },
  inject: ["reload"],
  data() {
    return {
      currentDiag: "",
      currentCommand: "",
      searchForm: {
        patientId: "",
        diagName: "",
        timeRange: [],
      },
      depts: [{ deptName: "眼底病科" }, { deptName: "青白科" }],
      dialogSearchVisible: false,
      timeRange: ["", ""],
      withPermission: false,
      currentClass: "",
      formLabelWidth: "100px",
      //用户数据
      tableData: [{}],
      //搜索词
      search: "",
      currentPage: 1,
      pageSize: 10,
      totalSize: 0,
      loading: false,
      dataSelect: [{}],
      isSearched: false,
      //   患者基本信息
      infoForm: {
        id: "123",
        name: "123",
        sexName: "123",
        birthday: "123",
        phone: "123",
        idNumber: "123",
      },
      //      患者过往病历
      caseData: [{}],
      dialogFormVisible: false,
      currentPatientName: "",
      diaDoctor: "",
      dialogAddFormVisible: false,
      addFollowForm: {
        id: "",
        patientId: "",
        intervalValue: "",
        visitPlan: "",
        visitRemark: "",
        visitResult: "",
        visitDate: "",
        visitContent: "",
        deptId: "",
        doctorId: "",
        visitNumber: "",
      },
      pickerOptions: {
        //          日期限制，只能选择今日以后的时间
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      chosenTemplate: -1,
      allTemplates: [],
      setFollowupedInfos: [],
      useTemplate: false,
    };
  },
  computed: {
    ...mapGetters("patientState", ["getFilters"]),
  },
  created() {
    // 这里设置currentPage是为了解决仅在mounted函数中设置currentPage分页组件仍显示页码为1的bug
    const savedFilters = this.getFilters;
    if (savedFilters.currentPage != -1) {
      this.currentPage = savedFilters.currentPage;
    }

    this.getAllTemplates();
    this.getDepts();
    api
      .findUserById(sessionStorage.getItem("userId"))
      .then((res) => {
        if (res.data.data && res.data.data.userStatus === 0)
          this.withPermission = true;
      })
      .catch((error) => {})
      .finally(() => {});
  },
  methods: {
    // 加载vuex相关方法
    ...mapMutations("patientState", ["SET_FILTERS"]),

    // 处理各类筛选条件变化
    handleDept(command) {
      this.currentClass = command;
      this.currentPage = 1;
      this.pageSize = 10;
      this.currentCommand = command ? command : "";
      this.getData();
    },
    // 处理时间区间变化
    timeChange() {
      this.currentPage = 1;
      this.pageSize = 10;
      this.getData();
    },
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange(size) {
      this.pageSize = size;
      this.getData();
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getData();
    },
    // 处理诊断医生变化
    handleDoctorChange() {
      this.currentPage = 1;
      this.pageSize = 10;
      this.getData();
    },
    // 处理模板选择变化
    handleTemplateChange(selectedId) {
      const selectedTemplate = this.allTemplates.find(
        (item) => item.id === selectedId
      );
      if (selectedTemplate) {
        this.addFollowForm = {
          id: selectedTemplate.id,
          intervalValue: selectedTemplate.intervalValue,
          visitPlan: selectedTemplate.visitPlan,
        };
      }
    },
    // 处理表格勾选项
    handleSelectionChange(val) {
      this.setFollowupedInfos = val.map(function (item) {
        return {
          deptId: item.deptId,
          doctorId: item.doctorId,
          patientId: item.patientId,
          visitNumber: item.visitNumber,
        };
      });
    },

    useTemplateChange() {
      const selectedTemplate = this.allTemplates.find(
        (item) => item.id === this.chosenTemplate
      );
      if (selectedTemplate) {
        this.addFollowForm = {
          id: selectedTemplate.id,
          intervalValue: selectedTemplate.intervalValue,
          visitPlan: selectedTemplate.visitPlan,
        };
      }
    },

    // 下载全部诊断信息
    downInfo() {
      api
        .downloadPatientInfo()
        .then((res) => {
          //res为接口所返回的文件流
          let blob = new Blob([res.data.data], {
            type: "text/csv; charset=GBK;",
          });
          //新窗口打开
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.target = "_blank";
          link.click();
        })
        .catch((error) => {
          this.$message({
            message: "下载失败",
            type: "danger",
          });
        })
        .finally(() => {});
    },

    // 根据搜索条件筛选table数据
    searchByInput() {
      this.timeRange = this.searchForm.timeRange;
      this.currentDiag = this.searchForm.diagName;
      this.currentPage = 1;
      this.pageSize = 10;
      this.getData(this.searchForm.patientId);
      // Object.assign(this.$data.searchForm, this.$options.data().searchForm);
      this.dialogSearchVisible = false;
    },

    // 获取全部模板
    getAllTemplates() {
      let obj = {
        templateName: "",
        visitPlan: "",
        deptName: "",
        modifyName: "",
        intervalValue: "",
        dateStart: "",
        dateEnd: "",
        pageNo: "",
        pageSize: "",
      };
      api
        .seachTemplate(obj)
        .then((res) => {
          if (res.data.code === 200) {
            this.allTemplates = res.data.data.records;
            if (this.allTemplates.length > 0) {
              this.useTemplate = true;
              this.chosenTemplate = this.allTemplates[0].id;
              this.handleTemplateChange(this.chosenTemplate);
            }
          }
        })
        .catch((error) => {})
        .finally(() => {});
    },

    // 获取全部科室
    getDepts() {
      let obj = {
        pageNumber: 1,
        pageSize: 20,
      };
      api
        .getDeptsName(obj)
        .then((res) => {
          if (res.data.code == 200) {
            let items = res.data.data.records;
            this.depts = items.map(function (item) {
              return { deptName: item.deptName };
            });
          }
        })
        .catch((error) => {})
        .finally(() => {});
    },

    // 获取table数据
    getData(patientId) {
      // 避免时间选择器清空后为null
      this.timeRange = this.timeRange ? this.timeRange : ["", ""];
      let queryObj = {
        pageNumber: this.currentPage,
        pageSize: this.pageSize,
        diagName: this.currentDiag,
        deptName: this.currentClass,
        doctorName: this.diaDoctor,
        startTime: this.timeRange[0],
        endTime: this.timeRange[1],
        patientID: patientId,
      };
      this.loading = true;
      api
        .getVisitList(queryObj)
        .then((res) => {
          if (res.data.code == 200) {
            this.tableData = res.data.data.records;
            this.totalSize = res.data.data.total;
          }
        })
        .catch((error) => {})
        .finally(() => {
          this.loading = false;
        });
    },

    // 功能上等同getData函数青春版，用于无任何筛选条件下加载全科室诊断数据
    getPatientData() {
      const _this = this;
      let obj = {
        pageNumber: this.currentPage,
        pageSize: this.pageSize,
        deptName: this.currentCommand,
      };
      this.loading = true;
      api
        .getVisitList(obj)
        .then((res) => {
          if (res.data.code == 200) {
            this.tableData = res.data.data.records;
            this.totalSize = res.data.data.total;
          }
        })
        .catch((error) => {})
        .finally(() => {
          this.loading = false;
        });
    },

    // 跳转至详细病历
    toCaseDetail(row) {
      // 保存当前table的筛选状态到 Vuex
      this.SET_FILTERS({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        currentCommand: this.currentCommand,
        diaDoctor: this.diaDoctor,
        timeRange: this.timeRange,
        searchForm: this.searchForm,
      });

      this.$router.push({
        path: "/postcasedetail",
        query: { id: row.patientId, name: row.patientName },
      });
    },

    // 加载患者基本信息
    patientInfo(index, row) {
      api
        .getPatientById(row.patientId)
        .then((res) => {
          if (res.data.code == 200) {
            this.infoForm = res.data.data;
            this.dialogFormVisible = true;
          }
        })
        .catch((error) => {
          this.$message({
            message: "该用户基本信息不存在！",
            type: "warning",
          });
        })
        .finally(() => {});
    },

    // 编辑患者基本信息
    submitEditPatient() {
      this.dialogFormVisible = false;
      const _this = this;
      api
        .editPatient(_this.infoForm)
        .then((res) => {
          if (res.data.code === 200) {
            this.$message({
              message: "编辑成功",
              type: "success",
            });
          } else {
            this.$message.error("编辑失败");
          }
        })
        .catch((error) => {
          this.$message.error("编辑失败");
        })
        .finally(() => {
          this.getPatientData();
        });
    },

    // 添加勾选患者至随访管理
    addPatientsFollow() {
      let templateObj = {
        infos: this.setFollowupedInfos,
        templateId: this.chosenTemplate,
      };
      let infoObj = [];
      let currentDate = new Date();
      let year = currentDate.getFullYear();
      let month = currentDate.getMonth() + 1; 
      let day = currentDate.getDate();
      infoObj = this.setFollowupedInfos.map((item) => {
        return {
          deptId: item.deptId,
          doctorId: item.doctorId,
          patientId: item.patientId,
          visitNumber: item.visitNumber,
          planVisitDate: this.getTargetDate(`${year}-${month}-${day}`, this.addFollowForm.intervalValue),
          visitPlan: this.addFollowForm.visitPlan,
        };
      });
      if (this.useTemplate) {
        api
          .addFollowUpBatchByTemplate(templateObj)
          .then((res) => {
            if (res.data.code === 200) {
              this.$message({
                message: "批量设置成功",
                type: "success",
              });
            } else {
              this.$message.error("批量设置失败");
            }
          })
          .catch((error) => {
            this.$message.error("批量设置失败");
          })
          .finally(() => {
            this.$nextTick(() => {
              this.dialogAddFormVisible = false; // 保障关闭操作
            });
            this.getPatientData();
          });
      } else {
        api
          .addFollowUpBatchByPatientsInfo(infoObj)
          .then((res) => {
            if (res.data.code === 200) {
              this.$message({
                message: "批量设置成功",
                type: "success",
              });
            } else {
              this.$message.error("批量设置失败");
            }
          })
          .catch((error) => {
            this.$message.error("批量设置失败");
          })
          .finally(() => {
            this.$nextTick(() => {
              this.dialogAddFormVisible = false; // 保障关闭操作
            });
            this.getPatientData();
          });
      }
    },

    // 返回当前时间 + 天数的对应日期
    getTargetDate(startDate, days) {
      var startTime = new Date(startDate).getTime();
      var diff = days * 86400 * 1000;
      var endTime = startTime + diff;
      var d = new Date(endTime);
      var CurrentDate = "";
      CurrentDate += d.getFullYear();
      //var year=(d.getFullYear())+"-"+(d.getMonth()+1)+"-"+(d.getDate());
      if (d.getMonth() + 1 > 9) {
        CurrentDate += "-" + (d.getMonth() + 1);
      } else {
        CurrentDate += "-0" + (d.getMonth() + 1);
      }
      if (d.getDate() > 9) {
        CurrentDate += "-" + d.getDate();
      } else {
        CurrentDate += "-0" + d.getDate();
      }
      return CurrentDate;
    },
  },

  mounted() {
    const savedFilters = this.getFilters;
    if (savedFilters.currentPage == -1) {
      this.getPatientData();
    } else {
      // 利用vuex解决在PatientManagement页面点击病人详细病历并返回PatientManagement页面时原筛选条件丢失的问题
      this.currentPage = savedFilters.currentPage;
      this.pageSize = savedFilters.pageSize;
      // 修改科室名称显示
      this.currentCommand = savedFilters.currentCommand;
      // 修改实际筛选科室
      this.currentClass = savedFilters.currentCommand;
      this.timeRange = savedFilters.timeRange;
      this.diaDoctor = savedFilters.diaDoctor;
      this.currentDiag = savedFilters.searchForm.diagName;
      this.searchForm = savedFilters.searchForm;

      // 强制分页组件更新
      this.$nextTick(() => {
        this.getData();
      });

      // 重置Vuex状态，避免任意条件时都应用该筛选条件
      this.SET_FILTERS({
        currentPage: -1,
        pageSize: 10,
        currentCommand: "",
        timeRange: [],
        diaDoctor: "",
        searchForm: {},
      });
    }
  },
};
</script>

<style scoped>
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

.div-popover {
  display: inline-block;
}
.el-checkbox__statusFirst {
  display: block;
  margin-bottom: 8px;
}
.el-checkbox__statusOthers {
  display: block;
  margin-top: 8px;
  margin-bottom: 8px;
}
.el-popover.popoverStyle {
  min-width: 100px;
}
.el-popover.popoverStyle {
  min-width: 100px;
}
</style>