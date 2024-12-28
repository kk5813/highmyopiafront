<template>
  <div>
    <el-container>
      <el-header>
        <Header active-index="/patientmanagement"></Header>
      </el-header>
      <el-main>
        <!--                            患者档案表格-->
        <el-table :data="tableData" style="width: 100%" v-loading="loading">
          <el-table-column label="就诊号" prop="visitNumber"> </el-table-column>
          <el-table-column
            label="患者姓名"
            prop="patientName"
          ></el-table-column>
          <el-table-column label="诊断" prop="diagName"> </el-table-column>
          <el-table-column label="诊断时间" prop="diagTime"> </el-table-column>
          <el-table-column label="眼别" prop="siteName"> </el-table-column>
          <el-table-column label="科室" prop="deptName"> </el-table-column>
          <el-table-column width="400 px" align="right">
            <template slot="header" slot-scope="scope">
              <el-input
                v-on:input="dataSizeChange()"
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
                type="success"
                @click="toCaseDetail(scope.row)"
                >详细病历</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!--                                            表格分页-->
        <el-pagination
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
        <!--                                            患者信息编辑-->
        <el-dialog
          :title="currentPatientName + '基本信息'"
          :visible.sync="dialogFormVisible"
          width="30%"
        >
          <el-form :model="infoForm">
            <el-form-item label="就诊号" :label-width="formLabelWidth">
              <el-input
                v-model="infoForm.patientId"
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
              >
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="出生日期" :label-width="formLabelWidth">
              <el-input
                v-model="infoForm.birthday"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="患者电话" :label-width="formLabelWidth">
              <el-input v-model="infoForm.phone" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" :label-width="formLabelWidth">
              <el-input
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
export default {
  name: "PatientManagement",
  components: { Header },
  inject: ["reload"],
  data() {
    return {
      formLabelWidth: "100px",
      //用户数据
      tableData: [{}],
      currentPage: 1,
      pageSize: 10,
      //搜索词
      search: "",
      currentPage: 1,
      pageSize: 10,
      totalSize: 0,
      loading: true,
      dataSelect: [{}],
      //   患者基本信息
      infoForm: {
        id: "123",
        name: "123",
        patientId: "123",
        sexName: "123",
        birthday: "123",
        phone: "123",
        idNumber: "123",
      },
      //      患者过往病历
      caseData: [{}],
      dialogFormVisible: false,
      dialogFormVisibleShortInfo: false,
      dialogFormVisiblePastCase: false,
      currentPatientName: "",
    };
  },
  created() {
    // this.getPatientData()
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    toCaseDetail(row) {
      this.$router.push({
        name: "PostCaseDetail",
        params: { id: row.visitNumber },
      });
    },
    //          患者基本信息
    patientInfo(index, row) {
      api.getPatientById("1796786711460069377").then((res) => {
        if (res.data.code == 200) {
          this.infoForm = res.data.data;
          this.infoForm.patientId = row.visitNumber;
        }
      });
      this.dialogFormVisible = true;
    },
    //每页条数改变时触发 选择一页显示多少行
    handleSizeChange(size) {
      this.pageSize = size;
      this.getPatientData();
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getPatientData();
    },
    //          页面加载，获取数据
    getPatientData() {
      const _this = this;
      this.loading = true;
      api
        .getVisitList(this.pageSize, this.currentPage, this.search)
        .then((res) => {
          if (res.data.code == 200) {
            this.tableData = res.data.data.records;

            this.loading = false;
            this.totalSize = res.data.data.total;
            this.loading = false;
          }
        });
    },
    dataSizeChange() {
      this.dataSelect = this.tableData.filter(
        (data) =>
          !this.search ||
          (data.patientId &&
            data.patientId.toLowerCase().includes(this.search.toLowerCase())) ||
          (data.patientName &&
            data.patientName
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (data.telephone &&
            data.telephone.toLowerCase().includes(this.search.toLowerCase()))
      );
    },
    //          编辑患者基本信息
    submitEditPatient() {
      this.dialogFormVisible = false;
      const _this = this;
      console.log(this.infoForm);
      _this.$axios
        .post("/patient/edit", _this.infoForm, {
          headers: {
            Authorization: _this.$store.getters.getToken,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.code === 200) {
            this.$message({
              message: "编辑成功",
              type: "success",
            });
            this.reload();
          } else {
            this.$message.error("编辑失败");
          }
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
</style>