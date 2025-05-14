<template>
  <div>
    <el-header>
      <Header active-index="/Followupvisit"></Header>
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
                <el-button type="primary" @click="handleDoctorChange()"
                  >确定</el-button
                >
              </template>
            </el-input>
          </div>

          <el-button
            style="margin-left: 30px"
            icon="el-icon-success"
            type="primary"
            :disabled="setFollowupedIds.length <= 0"
            @click="editPatientsFollow()"
            >标记已随访</el-button
          >

          <el-button
            style="margin-left: 30px"
            icon="el-icon-star-on"
            type="primary"
            @click="addTemplateVisible = true"
            >添加随访模板</el-button
          >

          <el-button
            style="margin-left: 30px"
            icon="el-icon-s-order"
            type="primary"
            :disabled="allTemplates.length <= 0"
            @click="manageTemplateVisible = true"
            >随访模板管理</el-button
          >
        </div>

        <el-table
          :data="tableData"
          ref="multipleTable"
          border
          style="width: 100%; border-radius: 20px"
          v-loading="loading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="患者ID" prop="patientId" align="center">
          </el-table-column>
          <el-table-column
            width="100px;"
            label="患者姓名"
            prop="patientName"
            align="center"
          >
          </el-table-column>
          <el-table-column
            width="50px"
            label="性别"
            prop="gender"
            align="center"
          >
          </el-table-column>
          <el-table-column
            width="150px;"
            label="出生日期"
            prop="idNumber"
            align="center"
          >
            <template slot-scope="scope" v-if="scope.row.idNumber">
              {{
                scope.row.idNumber.substring(6, 10) +
                "-" +
                scope.row.idNumber.substring(10, 12) +
                "-" +
                scope.row.idNumber.substring(12, 14)
              }}
            </template>
          </el-table-column>
          <!-- <el-table-column label="身份证号" prop="idNumber" align="center">
          </el-table-column> -->
          <el-table-column
            width="150px"
            label="手机号"
            prop="telephone"
            align="center"
          >
          </el-table-column>
          <el-table-column label="随访计划" prop="visitPlan" align="center">
          </el-table-column>
          <el-table-column
            label="计划随访时间"
            prop="planVisitDate"
            align="center"
          >
            <template slot="header" slot-scope="scope">
              <el-dropdown @command="handleCommand">
                <span>
                  计划随访时间({{ currentClass }})<i
                    class="el-icon-arrow-down el-icon--right"
                  ></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-date" command="全部"
                    >全部</el-dropdown-item
                  >
                  <el-dropdown-item icon="el-icon-plus" command="后续待随访"
                    >后续待随访</el-dropdown-item
                  >
                  <el-dropdown-item icon="el-icon-check" command="今日未随访"
                    >今日未随访</el-dropdown-item
                  >
                  <el-dropdown-item icon="el-icon-close" command="超期未随访"
                    >超期未随访</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column
            prop="visitResult"
            label="随访情况"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.visitResult === 0 ? 'danger' : 'success'"
                disable-transitions
                >{{ scope.row.visitResult === 0 ? "未随访" : "已随访" }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header" slot-scope="scope">
              <!-- <el-tooltip content="添加随访" placement="top">
                <el-button
                  icon="el-icon-plus"
                  circle
                  type="success"
                  size="mini"
                  style="margin-right: 10px"
                  @click="addFollowup(scope.$index, scope.row)"
                ></el-button>
              </el-tooltip> -->
              <el-input
                v-model="search"
                size="medium"
                placeholder="请输入患者ID"
                clearable
                style="width: 200px"
              >
                <template slot="append">
                  <el-button
                    icon="el-icon-search"
                    type="primary"
                    @click="searchByIdInput()"
                    circle
                  ></el-button>
                </template>
              </el-input>
            </template>
            <template slot-scope="scope" class="table-operate">
              <el-button
                size="mini"
                @click="editFollowupInfo(scope.row)"
                type="primary"
                plain
              >
                随访信息</el-button
              >
              <el-button size="mini" @click="handlePatientInfo(scope.row)">
                病人资料</el-button
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
      <!-- 随访信息 -->
      <el-dialog
        title="随访信息"
        :visible.sync="dialogEditFormVisible"
        width="30%"
      >
        <el-form :model="followupForm">
          <el-form-item label="患者ID" :label-width="formLabelWidth">
            <el-input
              v-model="followupForm.patientId"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="患者姓名" :label-width="formLabelWidth">
            <el-input
              v-model="followupForm.patientName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="计划随访日期" :label-width="formLabelWidth">
            <el-date-picker
              style="float: left"
              :picker-options="pickerOptions"
              v-model="followupForm.planVisitDate"
              align="left"
              type="date"
              placeholder=""
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="随访计划" :label-width="formLabelWidth">
            <el-input
              v-model="followupForm.visitPlan"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="实际随访日期" :label-width="formLabelWidth">
            <el-date-picker
              style="float: left"
              v-model="followupForm.visitDate"
              align="left"
              type="date"
              placeholder=""
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="随访结果记录" :label-width="formLabelWidth">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 10 }"
              placeholder="请输入内容"
              v-model="followupForm.visitContent"
            >
            </el-input>
            <el-button style="float: right" type="text" @click="loadTemplate()"
              >加载模板</el-button
            >
          </el-form-item>
          <el-form-item label="随访情况补充" :label-width="formLabelWidth">
            <el-input
              v-model="followupForm.visitRemark"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否完成随访" :label-width="formLabelWidth">
            <el-radio-group
              style="margin-left: 10px"
              v-model="followupForm.visitResult"
            >
              <el-radio :label="0">未随访</el-radio>
              <el-radio :label="1">已随访</el-radio>
              <el-radio :label="-1">不再随访</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEditFollowup()"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <!-- 病人信息 -->
      <el-dialog
        title="病人基本信息"
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
              style="margin-left: -200px"
              v-model="infoForm.sexName"
              disabled
            >
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="出生日期" :label-width="formLabelWidth">
            <el-input
              v-model="infoForm.birthday"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="患者电话" :label-width="formLabelWidth">
            <el-input v-model="infoForm.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" :label-width="formLabelWidth">
            <el-input
              v-model="infoForm.idNumber"
              autocomplete="off"
              disabled
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
      <!--                            新增随访          -->
      <el-dialog
        title="添加随访"
        :visible.sync="dialogAddFormVisible"
        width="30%"
      >
        <el-form :model="addFollowForm">
          <el-form-item label="患者ID" :label-width="formLabelWidth">
            <el-input
              v-model="addFollowForm.patientId"
              autocomplete="off"
            ></el-input>
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

      <!--                            添加随访模板          -->
      <el-dialog
        title="添加随访模板"
        :visible.sync="addTemplateVisible"
        width="30%"
      >
        <el-form :model="templateForm">
          <el-form-item label="科室" :label-width="formLabelWidth">
            <el-select
              v-model="templateForm.deptId"
              placeholder="请选择"
              style="float: left"
            >
              <el-option
                v-for="item in depts"
                :key="item.value"
                :label="item.deptName"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模板名称" :label-width="formLabelWidth">
            <el-input
              v-model="templateForm.templateName"
              placeholder="请输入模板名称（请勿与已有模板重复）"
            ></el-input>
          </el-form-item>
          <el-form-item label="几天后随访" :label-width="formLabelWidth">
            <el-input-number
              style="float: left"
              v-model="templateForm.intervalValue"
              :step="1"
              :min="1"
              :max="999"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="随访计划" :label-width="formLabelWidth">
            <el-input
              type="textarea"
              maxlength="85"
              show-word-limit
              :autosize="{ minRows: 4, maxRows: 10 }"
              v-model="templateForm.visitPlan"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addTemplate()">确 定</el-button>
          <el-button @click="addTemplateVisible = false">取 消</el-button>
        </div>
      </el-dialog>

      <!--                            管理随访模板          -->
      <el-dialog
        title="随访模板管理"
        :visible.sync="manageTemplateVisible"
        width="30%"
      >
        <el-form :model="editTemplateForm">
          <el-form-item label="模板名称" :label-width="formLabelWidth">
            <el-select
              v-model="chosenTemplate"
              placeholder="请选择"
              style="float: left"
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
              v-model="editTemplateForm.intervalValue"
              :step="1"
              :min="1"
              :max="999"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="随访计划" :label-width="formLabelWidth">
            <el-input
              type="textarea"
              maxlength="85"
              show-word-limit
              :autosize="{ minRows: 4, maxRows: 10 }"
              v-model="editTemplateForm.visitPlan"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editTemplate()">修 改</el-button>
          <el-button type="danger" @click="deleteTemplate(editTemplateForm.id)"
            >删 除</el-button
          >
        </div>
      </el-dialog>
    </el-main>
    <el-footer
      >爱尔眼科慢病管理系统( 推荐使用Edge,Firefox、Chrome 浏览器访问
      )</el-footer
    >
  </div>
</template>

<script>
import Header from "../components/Header";
import api from "@/api/apiManage";
export default {
  name: "Followupvisit",
  components: { Header },
  inject: ["reload"],
  data() {
    return {
      // 添加v-if处理分页组件修改当前页无响应的bug
      pageshow: true,
      loading: false,
      currentPage: 1,
      pageSize: 10,
      search: "",
      totalSize: 0,
      checkList: ["全部未随访"],
      currentPatientName: "",
      dialogFormVisible: false,
      dialogEditFormVisible: false,
      infoForm: {},
      followupForm: {
        gender: "",
        id: 0,
        nextVisitDate: "",
        patientId: "",
        patientName: "",
        planVisitDate: "",
        telephone: "",
        visitContent: "",
        visitDate: "",
        visitPlan: "",
        visitRemark: "",
        visitResult: 0,
      },
      formLabelWidth: "120px",
      dialogFormVisible: false,
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
      tableData: [],
      visitresult: true,
      pickerOptions: {
        //          日期限制，只能选择今日以后的时间
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      currentClass: "全部",
      diaDoctor: "",
      templateForm: {
        deptId: "",
        id: "",
        intervalValue: 0,
        templateName: "",
        visitContent: "",
        visitPlan: "",
        visitRemark: "",
        visitResult: 0,
      },
      editTemplateForm: {
        id: "",
        templateName: "",
        deptName: "",
        intervalValue: 0,
        visitPlan: "",
        visitResult: 0,
        visitContent: "",
        visitRemark: "",
        modifier: "",
      },
      manageTemplateVisible: false,
      addTemplateVisible: false,
      depts: [{ deptName: "眼底病科" }, { deptName: "青白科" }],
      setFollowupedIds: [],
      allTemplates: [],
      chosenTemplate: "",
    };
  },
  created() {
    this.getAllTemplates();
    this.getDepts();
    this.getData();
  },
  methods: {
    // 根据搜索条件筛选table数据
    searchByIdInput() {
      let idObj = {
        patientId: this.search,
      };
      this.loading = true;
      api
        .searchFollowup(idObj)
        .then((res) => {
          if (res.data.code == 200) {
            this.tableData = res.data.data.records;
            this.totalSize = this.tableData.length;
          }
        })
        .catch((error) => {})
        .finally(() => {
          this.loading = false;
        });
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
              return { value: item.id, deptName: item.deptName };
            });
          }
        })
        .catch((error) => {})
        .finally(() => {});
    },

    // 获取table数据
    getData() {
      let yesterday = this.getYesterday(0);
      let today = this.getNowTime(0);
      let tomorrow = this.getTomorrow(0);
      let yesterdayObj = {
        patientId: "",
        dateStart: "",
        doctorName: this.diaDoctor,
        dateEnd: yesterday,
        visitResult: 0,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
      };
      let todayObj = {
        patientId: "",
        dateStart: today,
        dateEnd: today,
        doctorName: this.diaDoctor,
        visitResult: 0,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
      };
      let tomorrowObj = {
        patientId: "",
        dateStart: tomorrow,
        dateEnd: "",
        doctorName: this.diaDoctor,
        visitResult: 0,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
      };
      let allObj = {
        patientId: "",
        dateStart: "",
        dateEnd: "",
        doctorName: this.diaDoctor,
        visitResult: "",
        pageNo: this.currentPage,
        pageSize: this.pageSize,
      };
      this.loading = true;
      if (this.currentClass === "全部") {
        api
          .searchFollowup(allObj)
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
      } else if (this.currentClass === "今日未随访") {
        api
          .searchFollowup(todayObj)
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
      } else if (this.currentClass === "超期未随访") {
        api
          .searchFollowup(yesterdayObj)
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
      } else if (this.currentClass === "后续待随访") {
        api
          .searchFollowup(tomorrowObj)
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
      }
    },

    // 处理各类筛选条件变化
    handleCommand(command) {
      this.currentClass = command;
      this.currentPage = 1;
      this.pageSize = 10;
      this.getData();
    },
    handleSizeChange(size) {
      this.pageshow = false; //让分页隐藏
      this.pageSize = size;
      this.getData();
      this.$nextTick(() => {
        //重新渲染分页
        this.pageshow = true;
      });
    },
    handleCurrentChange(page) {
      this.pageshow = false; //让分页隐藏
      this.currentPage = page;
      this.getData();

      this.$nextTick(() => {
        //重新渲染分页
        this.pageshow = true;
      });
    },
    handleDoctorChange() {
      this.currentPage = 1;
      this.pageSize = 10;
      this.getData();
    },

    handleSelectionChange(val) {
      this.setFollowupedIds = val.map(function (item) {
        return item.followupId;
      });
    },

    // 添加随访内容时可用文字模板(来源于前端存储)
    loadTemplate() {
      this.followupForm.visitContent = this.$constants.followTemplate;
    },

    // 添加单个随访病人
    addFollowup(index, row) {
      const _this = this;
      _this.dialogAddFormVisible = true;
      Object.assign(
        this.$data.addFollowForm,
        this.$options.data().addFollowForm
      );
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
        .finally(() => {
          this.getData();
        });
    },

    // 修改随访内容以及患者基本信息
    editFollowupInfo(row) {
      let obj = {
        patientId: row.patientId,
      };
      api.searchFollowup(obj).then((res) => {
        if (res.data.code == 200) {
          this.followupForm = res.data.data.records[0];
          this.followupForm.id = this.followupForm.followupId;
        }
      });
      this.dialogEditFormVisible = true;
    },
    submitEditFollowup() {
      this.dialogEditFormVisible = false;
      const _this = this;
      _this.followupForm.visitDate = _this.followupForm.visitDate.substring(0, 10)
      _this.followupForm.planVisitDate = _this.followupForm.visitDate.substring(0, 10)
      api
        .editFollowup(_this.followupForm)
        .then((res) => {
          if (res.data.code === 200) {
            this.$message({
              message: "编辑成功",
              type: "success",
            });
          }
        })
        .catch((error) => {
          this.$message.error("编辑失败");
        })
        .finally(() => {
          this.getData();
        });
    },
    handlePatientInfo(row) {
      api.getPatientById(row.patientId).then((res) => {
        if (res.data.code == 200) {
          this.infoForm = res.data.data;
        }
      });
      this.dialogFormVisible = true;
    },
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
          this.getData();
        });
    },

    // 批量进行患者已随访信息修改,即批量已随访
    editPatientsFollow() {
      let obj = {
        followupIds: this.setFollowupedIds,
        visitDate: this.getNowTime(0),
      };
      api
        .setFollowupBatch(obj)
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
          this.getData();
        });
    },

    // 添加随访模板
    addTemplate() {
      api
        .addFollowupTemplate(this.templateForm)
        .then((res) => {
          if (res.data.code === 200) {
            this.$message({
              message: "添加成功",
              type: "success",
            });
          } else if (res.data.code === 40006) {
            this.$message.error("缺失随访计划!");
          } else if (res.data.code === 40014) {
            this.$message.error("存在同名模板!");
          }
        })
        .catch((error) => {
          this.$message.error("添加失败");
        })
        .finally(() => {
          this.$nextTick(() => {
            this.addTemplateVisible = false; // 保障关闭操作
          });
          this.getAllTemplates();
        });
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
              this.chosenTemplate = this.allTemplates[0].id;
              this.handleTemplateChange(this.chosenTemplate);
            }
          }
        })
        .catch((error) => {})
        .finally(() => {});
    },

    // 处理模板选择变化
    handleTemplateChange(selectedId) {
      const selectedTemplate = this.allTemplates.find(
        (item) => item.id === selectedId
      );
      if (selectedTemplate) {
        this.editTemplateForm = {
          id: selectedTemplate.id,
          intervalValue: selectedTemplate.intervalValue,
          visitPlan: selectedTemplate.visitPlan,
        };
      }
    },

    // 编辑模板
    editTemplate() {
      api
        .editFollowupTemplate(this.editTemplateForm)
        .then((res) => {
          if (res.data.code === 200) {
            this.$message({
              message: "修改成功",
              type: "success",
            });
          }
        })
        .catch((error) => {
          this.$message.error("修改失败");
        })
        .finally(() => {
          this.$nextTick(() => {
            this.manageTemplateVisible = false; // 保障关闭操作
          });
          this.getAllTemplates();
        });
    },

    // 删除模板
    deleteTemplate(templateId) {
      api
        .deleteTemplate(templateId)
        .then((res) => {
          if (res.data.code === 200) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
          }
        })
        .catch((error) => {
          this.$message.error("删除失败");
        })
        .finally(() => {
          this.$nextTick(() => {
            this.manageTemplateVisible = false; // 保障关闭操作
          });
          this.getAllTemplates();
        });
    },

    // 时间选择器相关函数
    getNowTime(isAll) {
      let now = new Date();
      let year = now.getFullYear(); //获取完整的年份(4位,1970-????)
      let month = now.getMonth() + 1; //获取当前月份(0-11,0代表1月)
      let today = now.getDate(); //获取当前日(1-31)
      let hour = now.getHours(); //获取当前小时数(0-23)
      let minute = now.getMinutes(); //获取当前分钟数(0-59)
      let second = now.getSeconds(); //获取当前秒数(0-59)
      let nowTime = "";
      //返回年月日时分秒
      if (isAll) {
        nowTime =
          year +
          "-" +
          this.fillZero(month) +
          "-" +
          this.fillZero(today) +
          " " +
          this.fillZero(hour) +
          ":" +
          this.fillZero(minute) +
          ":" +
          this.fillZero(second);
      } else {
        //返回年月日
        nowTime =
          year + "-" + this.fillZero(month) + "-" + this.fillZero(today);
      }
      return nowTime;
    },
    getYesterday(isAll) {
      let nowDate = new Date();
      let nowDay = nowDate.getDate();
      // 实际获取昨天日期
      let now = new Date(nowDate.setDate(nowDay - 1));
      let year = now.getFullYear(); //获取完整的年份(4位,1970-????)
      let month = now.getMonth() + 1; //获取当前月份(0-11,0代表1月)
      let today = now.getDate(); //获取当前日(1-31)
      let hour = now.getHours(); //获取当前小时数(0-23)
      let minute = now.getMinutes(); //获取当前分钟数(0-59)
      let second = now.getSeconds(); //获取当前秒数(0-59)
      let nowTime = "";
      //返回年月日时分秒
      if (isAll) {
        nowTime =
          year +
          "-" +
          this.fillZero(month) +
          "-" +
          this.fillZero(today) +
          " " +
          this.fillZero(hour) +
          ":" +
          this.fillZero(minute) +
          ":" +
          this.fillZero(second);
      } else {
        //返回年月日
        nowTime =
          year + "-" + this.fillZero(month) + "-" + this.fillZero(today);
      }
      return nowTime;
    },
    getTomorrow(isAll) {
      let nowDate = new Date();
      let nowDay = nowDate.getDate();
      // 实际获取昨天日期
      let now = new Date(nowDate.setDate(nowDay + 1));
      let year = now.getFullYear(); //获取完整的年份(4位,1970-????)
      let month = now.getMonth() + 1; //获取当前月份(0-11,0代表1月)
      let today = now.getDate(); //获取当前日(1-31)
      let hour = now.getHours(); //获取当前小时数(0-23)
      let minute = now.getMinutes(); //获取当前分钟数(0-59)
      let second = now.getSeconds(); //获取当前秒数(0-59)
      let nowTime = "";
      //返回年月日时分秒
      if (isAll) {
        nowTime =
          year +
          "-" +
          this.fillZero(month) +
          "-" +
          this.fillZero(today) +
          " " +
          this.fillZero(hour) +
          ":" +
          this.fillZero(minute) +
          ":" +
          this.fillZero(second);
      } else {
        //返回年月日
        nowTime =
          year + "-" + this.fillZero(month) + "-" + this.fillZero(today);
      }
      return nowTime;
    },
    fillZero(str) {
      var realNum;
      if (str < 10) {
        realNum = "0" + str;
      } else {
        realNum = str;
      }
      return realNum;
    },
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
.el-tabs /deep/ .el-tabs__item {
  font-size: 18px;
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

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand /deep/ label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand /deep/ .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>