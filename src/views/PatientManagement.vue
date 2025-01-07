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
          <!--                            患者档案表格-->
          <el-table
            :data="tableData"
            border
            style="width: 100%; border-radius: 20px"
            v-loading="loading"
          >
            <el-table-column label="就诊号" prop="visitNumber" align="center">
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
              <template slot="header" slot-scope="scope">
                <el-dropdown @command="handleCommand">
                  <span>
                    诊断<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="">全部</el-dropdown-item>
                    <el-dropdown-item command="糖尿病">糖网</el-dropdown-item>
                    <el-dropdown-item command="静脉阻塞"
                      >视网膜静脉阻塞</el-dropdown-item
                    >
                    <el-dropdown-item command="近视">高度近视</el-dropdown-item>
                    <el-dropdown-item command="青光眼">青光眼</el-dropdown-item>
                    <el-dropdown-item command="角膜溃疡"
                      >角膜溃疡</el-dropdown-item
                    >
                    <el-dropdown-item command="黄斑变性"
                      >黄斑变性</el-dropdown-item
                    >
                    <el-dropdown-item command="白内障">白内障</el-dropdown-item>
                    <el-dropdown-item command="干眼">干眼</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
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
            <el-table-column
              label="科室"
              prop="deptName"
              align="center"
            ></el-table-column>
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
                <!-- <el-input
                  width="50px"
                  v-model="search"
                  @keyup.enter.native="
                    () => {
                      (currentPage = 1), (pageSize = 10), searchByInput(1, 10);
                    }
                  "
                  size="medium"
                  placeholder="请输入患者ID或诊断名称"
                /> -->
                <el-button @click="dialogSearchVisible = true" type="primary" size="mini"
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
          <div style="margin-top: 15px;">
            <el-input v-model="searchForm.diagName">
              <template slot="prepend">诊断名</template>
            </el-input>
          </div>
          <div style="margin-top: 15px;">
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
            <el-button type="primary" @click="searchByInput()"
              >确 定</el-button
            >
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
import request from "@/axios";
export default {
  name: "PatientManagement",
  components: { Header },
  inject: ["reload"],
  data() {
    return {
      searchForm: {
        patientId: '',
        diagName: '',
        timeRange: []
      },
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
    };
  },
  created() {
    api
      .findUserById(sessionStorage.getItem("userId"))
      .then((res) => {
        if (res.data.data && res.data.data.userStatus === 0)
          this.withPermission = true;
      })
      .catch((error) => {})
      .finally(() => {});
    // this.getPatientData()
  },
  methods: {
    timeChange() {
      this.currentPage = 1;
      this.pageSize = 10;
      this.getData();
    },
    downInfo() {
      api
        .downloadPatientInfo()
        .then((res) => {
          //res为接口所返回的文件流
          let blob = new Blob([res.data.data], {
            type: "text/csv;",
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
    handleCommand(command) {
      this.currentClass = command;
      this.currentPage = 1;
      this.pageSize = 10;
      this.getData();
    },
    getData(patientId) {
      // 避免时间选择器清空后为null
      this.timeRange = this.timeRange ? this.timeRange : ["", ""];
      let queryObj = {
        pageNumber: this.currentPage,
        pageSize: this.pageSize,
        diagName: this.currentClass,
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
    searchByInput() {
      // const _this = this;
      // this.loading = true;
      // let obj = {
      //   pageNumber: page,
      //   pageSize: pageSize,
      //   diagName: this.search,
      // };
      // let reqArr = [
      //   request("/visits/page", { method: "get", params: obj }),
      //   request("/visits/find/" + this.search, { method: "get" }),
      // ];
      // let handledErrReqs = reqArr.map((item) =>
      //   item.catch((error) => {
      //     // 错误处理代码
      //     // console.log("请求出错", error);
      //   })
      // );
      // _this.$axios
      //   .all(handledErrReqs)
      //   .then(
      //     this.$axios.spread(function (diagResp, idResp) {
      //       console.log(diagResp, idResp);
      //       _this.tableData = !idResp
      //         ? diagResp.data.data.records
      //         : idResp.data.data;
      //       _this.totalSize = !idResp
      //         ? diagResp.data.data.total
      //         : idResp.data.data.length;
      //     })
      //   )
      //   .catch((error) => {
      //     _this.tableData = diagResp.data.data.records;
      //     _this.totalSize = diagResp.data.data.total;
      //   })
      //   .finally(() => {
      //     this.loading = false;
      //   });
      this.timeRange = this.searchForm.timeRange
      this.currentClass = this.searchForm.diagName
      this.currentPage = 1
      this.pageSize = 10
      this.getData(this.searchForm.patientId)
      Object.assign(
        this.$data.searchForm,
        this.$options.data().searchForm
      );
      this.dialogSearchVisible = false
    },
    toCaseDetail(row) {
      this.$router.push({
        path: "/postcasedetail",
        query: { id: row.patientId, name: row.patientName },
      });
    },
    //          患者基本信息
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
    //每页条数改变时触发 选择一页显示多少行
    handleSizeChange(size) {
      this.pageSize = size;
      this.getData();
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getData();
    },
    //          页面加载，获取数据
    getPatientData() {
      const _this = this;
      let obj = {
        pageNumber: this.currentPage,
        pageSize: this.pageSize,
        diagName: "",
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
    //          编辑患者基本信息
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
  },
  mounted() {
    this.getPatientData();
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