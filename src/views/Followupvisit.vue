<template>
  <div>
    <el-header>
      <Header active-index="/Followupvisit"></Header>
    </el-header>
    <el-main>
      <!--                三个表格 今日待随访/超期未随访/全部未随访        -->
      <el-tabs v-model="activeName" @tab-click="handleClick" stretch>
        <el-tab-pane label="今日待随访" name="first">
          <el-table
            :data="
              todayUndoSelect.slice(
                (todayUndoCurrentPage - 1) * todayUndoPageSize,
                todayUndoCurrentPage * todayUndoPageSize
              )
            "
            style="width: 100%"
          >
            <el-table-column label="病历号" prop="caseId"> </el-table-column>
            <el-table-column label="患者卡号" prop="patientId">
            </el-table-column>
            <el-table-column label="患者姓名" prop="patientName">
            </el-table-column>
            <el-table-column label="手机号" prop="telephone"> </el-table-column>
            <el-table-column label="计划随访时间" prop="planVisitDate">
            </el-table-column>
            <el-table-column width="400 px" align="right">
              <template slot="header" slot-scope="scope">
                <el-input
                  v-on:input="todayUndoDataSizeChange"
                  v-model="search"
                  size="medium"
                  placeholder="输入关键字搜索"
                />
              </template>
              <template slot-scope="scope" class="table-operate">
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
                  @click="patientPastCase(scope.$index, scope.row)"
                >
                  患者病历</el-button
                >
                <el-button
                  size="mini"
                  type="success"
                  @click="addFollowup(scope.$index, scope.row)"
                  >新增随访</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <!--                                            表格分页-->
          <el-pagination
            align="center"
            @size-change="handleTodayUndoSizeChange"
            @current-change="handleTodayUndoCurrentChange"
            :current-page="todayUndoCurrentPage"
            :page-sizes="[1, 5, 10, 20]"
            :page-size="todayUndoPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="todayUndoSelect.length"
          >
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="超期未随访" name="second">
          <el-table
            :data="
              overdueSelect.slice(
                (overdueCurrentPage - 1) * overduePageSize,
                overdueCurrentPage * overduePageSize
              )
            "
            style="width: 100%"
          >
            <el-table-column label="病历号" prop="caseId"> </el-table-column>
            <el-table-column label="患者卡号" prop="patientId">
            </el-table-column>
            <el-table-column label="患者姓名" prop="patientName">
            </el-table-column>
            <el-table-column label="手机号" prop="telephone"> </el-table-column>
            <el-table-column label="计划随访时间" prop="planVisitDate">
            </el-table-column>
            <el-table-column width="400 px" align="right">
              <template slot="header" slot-scope="scope">
                <el-input
                  v-on:input="overdueDataSizeChange"
                  v-model="search"
                  size="medium"
                  placeholder="输入关键字搜索"
                />
              </template>
              <template slot-scope="scope" class="table-operate">
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
                  @click="patientPastCase(scope.$index, scope.row)"
                >
                  过往病历</el-button
                >
                <el-button
                  size="mini"
                  type="success"
                  @click="addFollowup(scope.$index, scope.row)"
                  >新增随访</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <!--                                            表格分页-->
          <el-pagination
            align="center"
            @size-change="handleOverdueSizeChange"
            @current-change="handleOverdueCurrentChange"
            :current-page="overdueCurrentPage"
            :page-sizes="[1, 5, 10, 20]"
            :page-size="overduePageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="overdueSelect.length"
          >
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="全部未随访" name="third">
          <el-table
            :data="
              undoSelect.slice(
                (undoCurrentPage - 1) * undoPageSize,
                undoCurrentPage * undoPageSize
              )
            "
            style="width: 100%"
          >
            <el-table-column label="病历号" prop="caseId"> </el-table-column>
            <el-table-column label="患者卡号" prop="patientId">
            </el-table-column>
            <el-table-column label="患者姓名" prop="patientName">
            </el-table-column>
            <el-table-column label="手机号" prop="telephone"> </el-table-column>
            <el-table-column label="计划随访时间" prop="planVisitDate">
            </el-table-column>
            <el-table-column width="400 px" align="right">
              <template slot="header" slot-scope="scope">
                <el-input
                  v-on:input="undoDataSizeChange"
                  v-model="search"
                  size="medium"
                  placeholder="输入关键字搜索"
                />
              </template>
              <template slot-scope="scope" class="table-operate">
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
                  @click="patientPastCase(scope.$index, scope.row)"
                >
                  过往病历</el-button
                >
                <el-button
                  size="mini"
                  type="success"
                  @click="addFollowup(scope.$index, scope.row)"
                  >新增随访</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <!--                                            表格分页-->
          <el-pagination
            align="center"
            @size-change="handleUndoSizeChange"
            @current-change="handleUndoCurrentChange"
            :current-page="undoCurrentPage"
            :page-sizes="[1, 5, 10, 20]"
            :page-size="undoPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="undoSelect.length"
          >
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
      <!--                                            患者信息编辑-->
      <el-dialog
        :title="currentPatientName + '基本信息'"
        :visible.sync="dialogFormVisible"
        width="30%"
      >
        <el-form :model="infoForm">
          <el-form-item label="患者卡号" :label-width="formLabelWidth">
            <el-input
              v-model="infoForm.patientId"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="患者姓名" :label-width="formLabelWidth">
            <el-input
              v-model="infoForm.patientName"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="患者性别" :label-width="formLabelWidth">
            <el-radio-group v-model="infoForm.gender" disabled>
              <el-radio-button label="男性"></el-radio-button>
              <el-radio-button label="女性"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="患者地址" :label-width="formLabelWidth">
            <el-input
              v-model="infoForm.address"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="出生日期" :label-width="formLabelWidth">
            <el-input
              v-model="infoForm.birthday"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="患者电话" :label-width="formLabelWidth">
            <el-input
              v-model="infoForm.telephone"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="患者单位" :label-width="formLabelWidth">
            <el-input
              v-model="infoForm.unit"
              autocomplete="off"
              placeholder="请输入患者单位"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="身份证号" :label-width="formLabelWidth">
            <el-input
              v-model="infoForm.idcard"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!--                            新增随访          -->
      <el-dialog
        :title="currentPatientName + '添加随访'"
        :visible.sync="dialogFormVisibleFollowup"
        width="30%"
      >
        <el-form :model="addFollow">
          <el-form-item label="预防计划" :label-width="formLabelWidth">
            <el-select
              v-model="addFollow.visitPlan"
              placeholder="请选择随访类型"
            >
              <el-option label="计划随访" value="planned"></el-option>
              <el-option label="非计划随访" value="Unplanned"></el-option>
              <el-option label="定期随访" value="regular"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否随访成功" :label-width="formLabelWidth">
            <el-radio
              v-model="addFollow.visitResult"
              label="true"
              @change="followupResultChange(addFollow)"
              >是</el-radio
            >
            <el-radio
              v-model="addFollow.visitResult"
              label="false"
              @change="followupResultChange(addFollow)"
              >否</el-radio
            >
          </el-form-item>
          <el-form-item
            label="随访内容"
            :label-width="formLabelWidth"
            v-if="visitresult"
          >
            <el-input
              v-model="addFollow.visitContent"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <div v-else>
            <el-form-item label="随访未成功原因" :label-width="formLabelWidth">
              <el-input
                v-model="addFollow.visitRemark"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="下次随访时间" :label-width="formLabelWidth">
              <el-date-picker
                v-model="addFollow.nextVisitDate"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleFollowup = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="submitEditShortInfo('addFollow')"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </el-main>
    <el-footer
      >爱尔眼科慢病管理系统( 推荐使用IE9+,Firefox、Chrome 浏览器访问
      )</el-footer
    >
  </div>
</template>

<script>
import Header from "../components/Header";
export default {
  name: "Followupvisit",
  components: { Header },
  inject: ["reload"],
  data() {
    return {
      activeName: "first",
      todayUndo: [{}],
      todayUndoSelect: [],
      todayUndoCurrentPage: 1,
      todayUndoPageSize: 10,
      overdue: [{}],
      overdueSelect: [],
      overdueCurrentPage: 1,
      overduePageSize: 10,
      undo: [{}],
      undoSelect: [],
      undoCurrentPage: 1,
      undoPageSize: 10,
      search: "",
      currentPatientName: "",
      infoForm: {
        id: "",
        patientName: "",
        patientId: "",
        gender: "",
        birthday: "",
        telephone: "",
        address: "",
        unit: "",
        idcard: "",
      },
      formLabelWidth: "120px",
      dialogFormVisible: false,
      dialogFormVisibleFollowup: false,
      addFollow: {
        id: "",
        caseId: "",
        patientId: "",
        planVisitDate: "",
        visitPlan: "",
        visitRemark: "",
        visitResult: "true",
        visitDate: "",
        visitContent: "",
        nextVisitDate: "",
      },
      visitresult: true,
      pickerOptions: {
        //          日期限制，只能选择今日以后的时间
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
    };
  },
  created() {
    const _this = this;
    //          超期的随访
    _this.$axios
      .get("/followup/Overdue", {
        headers: {
          Authorization: _this.$store.getters.getToken,
        },
      })
      .then((res) => {
        // console.log(res)
        _this.overdue = res.data.data;
        _this.overdueSelect = res.data.data;
      });

    //          今日的随访
    _this.$axios
      .get("/followup/todayUndo", {
        headers: {
          Authorization: _this.$store.getters.getToken,
        },
      })
      .then((res) => {
        // console.log(res)
        _this.todayUndo = res.data.data;
        _this.todayUndoSelect = res.data.data;
      });

    //          全部未完成的随访
    _this.$axios
      .get("/followup/Undo", {
        headers: {
          Authorization: _this.$store.getters.getToken,
        },
      })
      .then((res) => {
        // console.log(res)
        _this.undo = res.data.data;
        _this.undoSelect = res.data.data;
      });
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    todayUndoDataSizeChange() {
      this.todayUndoSelect = this.todayUndo.filter(
        (data) =>
          !this.search ||
          data.patientId.toLowerCase().includes(this.search.toLowerCase()) ||
          data.patientName.toLowerCase().includes(this.search.toLowerCase())
      );
    },
    handleTodayUndoSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.todayUndoCurrentPage = 1;
      this.todayUndoPageSize = val;
    },
    //当前页改变时触发 跳转其他页
    handleTodayUndoCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.todayUndoCurrentPage = val;
    },
    //
    overdueDataSizeChange() {
      this.overdueSelect = this.overdue.filter(
        (data) =>
          !this.search ||
          data.patientId.toLowerCase().includes(this.search.toLowerCase()) ||
          data.patientName.toLowerCase().includes(this.search.toLowerCase())
      );
    },
    handleOverdueSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.overdueCurrentPage = 1;
      this.overduePageSize = val;
    },
    //当前页改变时触发 跳转其他页
    handleOverdueCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.overdueCurrentPage = val;
    },
    //
    undoDataSizeChange() {
      this.undoSelect = this.undo.filter(
        (data) =>
          !this.search ||
          data.patientId.toLowerCase().includes(this.search.toLowerCase()) ||
          data.patientName.toLowerCase().includes(this.search.toLowerCase())
      );
    },
    handleUndoSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.undoCurrentPage = 1;
      this.undoPageSize = val;
    },
    //当前页改变时触发 跳转其他页
    handleUndoCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.undoCurrentPage = val;
    },
    patientInfo(index, row) {
      const _this = this;
      _this.$axios
        .get("/patient/patientIndex/" + row.patientId, {
          headers: {
            Authorization: _this.$store.getters.getToken,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            _this.infoForm.id = res.data.data.id;
            _this.infoForm.patientName = res.data.data.patientName;
            _this.infoForm.patientId = res.data.data.patientId;
            _this.infoForm.gender = res.data.data.gender;
            _this.infoForm.birthday = res.data.data.birthday;
            _this.infoForm.telephone = res.data.data.telephone;
            _this.infoForm.address = res.data.data.address;
            _this.infoForm.unit = res.data.data.unit;
            _this.infoForm.idcard = res.data.data.idcard;
            _this.dialogFormVisible = true;
          }
        });
    },
    patientPastCase(index, row) {
      const _this = this;
      _this.$router.push({
        name: "PostCaseDetail",
        params: { id: row.caseId },
      });
    },
    submitEditShortInfo() {
      console.log(this.addFollow);
      const _this = this;
      _this.$axios
        .post("/followup/editFollowup/", _this.addFollow, {
          headers: {
            Authorization: _this.$store.getters.getToken,
          },
        })
        .then((res) => {
          console.log(res);
          _this.dialogFormVisibleFollowup = false;
          _this.reload();
        });
    },
    addFollowup(index, row) {
      const _this = this;
      _this.addFollow.id = row.id;
      _this.addFollow.caseId = row.caseId;
      _this.dialogFormVisibleFollowup = true;
    },
    followupResultChange(addFollow) {
      const _this = this;
      if (addFollow.visitResult == "true") {
        _this.visitresult = true;
        _this.addFollow.visitRemark = "";
        _this.addFollow.nextVisitDate = "";
      } else {
        _this.visitresult = false;
        _this.addFollow.visitContent = "";
      }
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
  height: calc(100vh - 60px - 65px);
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
</style>