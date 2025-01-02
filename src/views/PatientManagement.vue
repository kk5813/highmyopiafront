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
              label="患者姓名"
              prop="patientName"
              align="center"
            ></el-table-column>
            <el-table-column label="诊断" prop="diagName" align="center">
            </el-table-column>
            <el-table-column label="眼别" prop="siteName" align="center">
            </el-table-column>
            <el-table-column label="诊断医生" prop="doctorName" align="center">
            </el-table-column>
            <el-table-column
              label="科室"
              prop="deptName"
              align="center"
            ></el-table-column>
            <el-table-column label="诊断时间" prop="diagTime" align="center">
            </el-table-column>
            <el-table-column width="400 px" align="right">
              <template slot="header" slot-scope="scope">
                <el-input
                  v-model="search"
                  @keyup.enter.native="
                    () => {
                      (currentPage = 1), (pageSize = 10), searchByInput(1, 10);
                    }
                  "
                  size="medium"
                  placeholder="请输入患者ID或诊断名称,按下回车搜索"
                />
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
    // this.getPatientData()
  },
  methods: {
    searchByInput(page, pageSize) {
      const _this = this;
      this.loading = true;
      let obj = {
        pageNumber: page,
        pageSize: pageSize,
        diagName: this.search,
      };
      let reqArr = [
        request("/visits/page", { method: "get", params: obj }),
        request("/visits/find/" + this.search, { method: "get" }),
      ];
      let handledErrReqs = reqArr.map((item) =>
        item.catch((error) => {
          // 错误处理代码
          console.log("请求出错", error);
        })
      );
      _this.$axios
        .all(handledErrReqs)
        .then(
          this.$axios.spread(function (diagResp, idResp) {
            console.log(diagResp, idResp);
            _this.tableData = diagResp.data.data.total
              ? diagResp.data.data.records
              : idResp.data.data;
            _this.totalSize = diagResp.data.data.total
              ? diagResp.data.data.total
              : idResp.data.data.length;
          })
        )
        .catch((error) => {
          _this.tableData = diagResp.data.data.records
          _this.totalSize = diagResp.data.data.total
        })
        .finally(() => {
          this.loading = false;
        });
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
      if (!this.search) this.getPatientData();
      else this.searchByInput(this.currentPage, size);
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(page) {
      this.currentPage = page;
      if (!this.search) this.getPatientData();
      else this.searchByInput(page, this.pageSize);
    },
    //          页面加载，获取数据
    getPatientData() {
      const _this = this;
      this.loading = true;
      let obj = {
        pageNumber: this.currentPage,
        pageSize: this.pageSize,
        diagName: "",
      };
      api
        .getVisitList(obj)
        .then((res) => {
          if (res.data.code == 200) {
            console.log(res);
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