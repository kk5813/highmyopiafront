<template>
  <div>
    <el-container>
      <el-header>
        <!--        页面头部---Header组件        -->
        <Header active-index="/Main"></Header>
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
          <el-table
            border
            :data="tableData"
            style="width: 100%; border-radius: 20px"
            v-loading="loading"
          >
            <el-table-column
              width="90"
              label="用户ID"
              prop="userId"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="登录账号"
              prop="userLoginName"
              align="center"
            >
            </el-table-column>
            <el-table-column label="用户名" prop="userName" align="center">
            </el-table-column>
            <el-table-column label="用户状态" prop="userStatus" align="center">
            </el-table-column>
            <el-table-column label="创建人" prop="creator" align="center">
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" align="center">
            </el-table-column>
            <el-table-column label="修改人" prop="modifier" align="center">
            </el-table-column>
            <el-table-column label="修改时间" prop="updateTime" align="center">
            </el-table-column>
            <el-table-column width="400 px" align="right">
              <template slot="header" slot-scope="scope">
                <el-button
                  size="medium"
                  @click="handleAdd()"
                  type="primary"
                  plain
                  style="margin-right: 10px"
                  >添加用户</el-button
                >
                <!-- v-on:input="dataSizeChange()" -->
                <el-input
                  @keyup.enter.native="searchByLoginName()"
                  v-model="search"
                  size="medium"
                  style="width: 250px"
                  placeholder="输入用户登录账号并按下回车搜索"
                />
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                  >失效</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <!--                                表格分页-->
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

        <!--                添加用户的弹出对话框-->
        <el-dialog
          title="添加用户"
          :visible.sync="dialogFormVisible"
          width="30%"
        >
          <el-form :model="addForm" ref="addForm">
            <el-form-item label="登录账号" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.userLoginName"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="用户密码" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.userPassword"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="用户名" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.userName"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitAddUser()">确 定</el-button>
          </div>
        </el-dialog>
        <!--编辑用户的弹出对话框-->
        <el-dialog
          title="编辑用户"
          :visible.sync="dialogEditFormVisible"
          width="30%"
        >
          <el-form :model="editForm">
            <el-form-item label="用户ID" :label-width="formLabelWidth">
              <el-input
                v-model="editForm.userId"
                autocomplete="off"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="用户登录名" :label-width="formLabelWidth">
              <el-input
                v-model="editForm.userLoginName"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="用户密码" :label-width="formLabelWidth">
              <el-input
                v-model="editForm.userPassword"
                autocomplete="off"
                placeholder="未输入则默认为原密码"
              ></el-input>
            </el-form-item>
            <el-form-item label="用户姓名" :label-width="formLabelWidth">
              <el-input
                v-model="editForm.userName"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="用户角色">
              <el-radio-group v-model="editForm.userStatus">
                <el-radio label="0">系统管理员</el-radio>
                <el-radio label="1">普通用户</el-radio>
                <el-radio label="-1">无效用户</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitEditUser()"
              >确 定</el-button
            >
          </div>
        </el-dialog>
      </el-main>
      <el-footer
        >爱尔慢病管理系统( 推荐使用IE9+,Firefox、Chrome 浏览器访问 )</el-footer
      >
    </el-container>
  </div>
</template>

<script>
/***
 *          表格展示的是用户数据表
 *          tableData是所有的数据
 *          dataSelect是当前页的数据
 *          同时search对应的input输入框的监听事件dataSizeChange（）会改变dataSelect,变为检索后数据
 *
 */
import Header from "../components/Header";
import api from "@/api/apiManage";
export default {
  name: "Main",
  components: { Header },
  data() {
    return {
      // 顶部导航栏默认选中
      activeIndex: "/Main",
      // 编辑和添加用户对话框
      dialogFormVisible: false,
      dialogEditFormVisible: false,
      // 添加用户表格
      addForm: {
        userName: "",
        userPassword: "",
        userLoginName: "",
      },
      // 编辑用户表格
      editForm: {
        userId: "",
        userName: "",
        userLoginName: "",
        userPassword: "",
        userStatus: "",
      },
      formLabelWidth: "100px",
      //用户数据
      tableData: [],
      //搜索词
      search: "",
      currentPage: 1,
      pageSize: 10,
      // 当前页用户数据
      dataSelect: [{}],
      loading: false,
      totalSize: 0,
    };
  },
  created() {
    // this.getUserTableData();
  },
  methods: {
    //编辑功能
    handleEdit(index, row) {
      this.editForm.userId = row.userId;
      this.editForm.userLoginName = row.userLoginName;
      this.editForm.userName = row.userName;
      this.editForm.userPassword = "";
      if (row.userStatus === "系统管理员") this.editForm.userStatus = "0";
      else if (row.userStatus === "普通用户") this.editForm.userStatus = "1";
      else if (row.userStatus === "无效用户") this.editForm.userStatus = "-1";
      this.dialogEditFormVisible = true;
    },

    handleAdd() {
      this.dialogFormVisible = true;
      Object.assign(this.$data.addForm, this.$options.data().addForm);
    },

    //失效某用户
    handleDelete(index, row) {
      const _this = this;
      console.log(row.userId);
      _this
        .$confirm("您是否要失效用户" + row.userLoginName, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          api.deleteUser(row.userId).then((res) => {
            console.log(res);
            if (res.data.code === 200) {
              _this.$message({
                type: "success",
                message: "成功失效用户!",
              });
            } else {
              _this.$message.error("操作失败");
            }
          });
        })
        .catch((error) => {_this.$message.error("操作失败");})
        .finally(() => {
          this.getUserTableData();
          this.loading = false;
        });
    },
    //每页条数改变时触发 选择一页显示多少行
    handleSizeChange(size) {
      this.pageSize = size;
      this.getUserTableData();
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getUserTableData();
    },
    //          搜索功能
    searchByLoginName() {
      if (!this.search) {
        this.$message({
          message: "搜索信息不能为空！",
          type: "danger",
        });
        return;
      }
      let obj = {
        userLoginName: this.search,
      };
      this.loading = true;
      this.currentPage = 1;
      this.pageSize = 10;
      api
        .searchUser(obj)
        .then((res) => {
          if (res.data.code == 200 && res.data.data) {
            let users = res.data.data.users;
            users.forEach((item, index) => {
              if (item.userStatus === 0) {
                users[index].userStatus = "系统管理员";
              } else if (item.userStatus === 1) {
                users[index].userStatus = "普通用户";
              } else {
                users[index].userStatus = "无效用户";
              }
            });
            this.tableData = users;
            this.totalSize = res.data.data.total;
          } else {
            this.$message({
              message: "用户不存在",
              type: "danger",
            });
          }
        })
        .catch((error) => {})
        .finally(() => {
          this.loading = false;
        });
    },

    //      获得数据
    getUserTableData() {
      this.loading = true;
      api
        .getUserList(this.pageSize, this.currentPage)
        .then((res) => {
          if (res.data.code == 200) {
            this.tableData = res.data.data.records;
            this.tableData.forEach(function (element) {
              if (element.userStatus === 0) {
                element.userStatus = "系统管理员";
              } else if (element.userStatus === 1) {
                element.userStatus = "普通用户";
              } else {
                element.userStatus = "无效用户";
              }
            });
            this.totalSize = res.data.data.total;
          }
        })
        .catch((error) => {})
        .finally(() => {
          this.loading = false;
        });
    },
    //      添加用户
    submitAddUser() {
      const _this = this;
      api
        .addUser(this.addForm)
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              message: "成功创建用户",
              type: "success",
            });
          } else if (
            res.data.code == 400 &&
            res.data.msg == "该用户名已注册！"
          ) {
            this.$message.error("该登录账号已存在");
          } else {
            this.$message.error("创建失败");
          }
          _this.dialogFormVisible = false;
        })
        .catch((error) => {
          this.$message.error("创建失败");
        })
        .finally(() => {
          this.getUserTableData();
        });
    },
    //      编辑用户
    submitEditUser() {
      const _this = this;
      _this.dialogEditFormVisible = false;
      console.log(_this.editForm);
      api
        .editUser(_this.editForm)
        .then((res) => {
          console.log(res);
          if (res.data.code === 200) {
            this.$message({
              message: "编辑成功",
              type: "success",
            });
            this.getUserTableData();
          } else {
            this.$message.error("编辑失败");
          }
          _this.dialogFormVisible = false;
        })
        .catch((error) => {
          this.$message.error("编辑失败");
        })
        .finally(() => {
          this.getUserTableData();
        });
    },
  },
  mounted() {
    this.getUserTableData();
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

::v-deep .el-table th,
::v-deep .el-table tr,
::v-deep .el-table td {
}
</style>