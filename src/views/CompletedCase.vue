<template>
    <div>
        <el-header>
            <Header
                active-index="/CompletedCase"></Header>
        </el-header>
        <el-main>
            <!--                            已完善病历表格-->
            <el-table
                    :data="dataSelect.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                    style="width: 100%">
                <el-table-column
                        label="病历号"
                        prop="id">
                </el-table-column>
                <el-table-column
                        label="患者卡号"
                        prop="patientId">
                </el-table-column>
                <el-table-column
                        label="患者姓名"
                        prop="patientName">
                </el-table-column>

                <el-table-column
                        label="诊断结论"
                        prop="diagnosis">
                </el-table-column>
                <el-table-column
                        label="确诊时间"
                        prop="checktime">
                </el-table-column>
                <el-table-column
                        width="400 px"
                        align="right">
                    <template slot="header" slot-scope="scope">
                        <el-button
                                style="margin-right: 20px"
                                @click="showIOLRange()">眼轴范围筛选</el-button>
                        <el-select v-model="la" placeholder="检查结果筛选" @change="selectChange()">
                            <el-option label="重置" value="0"></el-option>
                            <el-option label="IOL Master" value="1"></el-option>
                            <el-option label="OCT" value="2"></el-option>
                            <el-option label="超广角" value="3"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                        width="400 px"
                        align="right">
                    <template slot="header" slot-scope="scope">
                        <el-input
                                v-on:input="dataSizeChange()"
                                v-model="search"
                                size="medium"
                                placeholder="输入关键字搜索"/>
                    </template>
                    <template slot-scope="scope" class="table-operate">
                        <el-button
                                size="mini"
                                type="success"
                                @click="handleEdit(scope.$index, scope.row)">详细病历</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination align='center'
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="currentPage"
                           :page-sizes="[1,5,10,20]"
                           :page-size="pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="dataSelect.length">
            </el-pagination>
            <el-dialog title="眼轴长度筛选" :visible.sync="dialogFormVisibleIOL" width="30%">
                <span>选择眼轴长度范围<br></span>
                <span>{{alValue[0]}}-{{alValue[1]}}</span>
                <div class="block">
                    <el-slider
                            v-model="alValue"
                            range
                            show-stops
                            :min="20"
                            :max="38">
                    </el-slider>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="selectIOLRange()">确 定</el-button>
                </span>
            </el-dialog>
        </el-main>
        <el-footer>爱尔眼科高度近视智能诊断系统(  推荐使用IE9+,Firefox、Chrome 浏览器访问   )</el-footer>
    </div>
</template>

<script>
    import Header from "../components/Header";
    export default {
        name: "CompletedCase",
        components: {Header},
        data() {
            return {
                la:'',
                alValue: [24, 28],
                tableData: [],
                //搜索词
                search: '',
                currentPage: 1,
                pageSize: 10,
                // 当前页用户数据
                dataSelect: [],
                dialogFormVisibleIOL: false,
            }
        },
        created() {
            const _this = this
            _this.$axios.get("/caselist/pastCaseList", {
                headers: {
                    "Authorization": _this.$store.getters.getToken
                }
            }).then(res => {
                // console.log(res)
                _this.tableData = res.data.data;
                // console.log(_this.tableData)
                _this.dataSelect = _this.tableData
            })
        },
        methods: {
            handleEdit(index, row) {
                const _this = this
                _this.$router.push({name: "PostCaseDetail", params: {id: row.id}})
            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.currentPage = 1;
                this.pageSize = val;
            },
            //当前页改变时触发 跳转其他页
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
                this.currentPage = val;
            },
            dataSizeChange() {
                this.dataSelect = this.tableData.filter(data => !this.search
                    || data.id && data.id.toString().includes(this.search.toLowerCase())
                    || data.patientId && data.patientId.toLowerCase().includes(this.search.toLowerCase())
                    || data.patientName && data.patientName.toLowerCase().includes(this.search.toLowerCase())
                    || data.diagnosis && data.diagnosis.toLowerCase().includes(this.search.toLowerCase())
                );
            },
            selectChange() {
                const _this = this
                if(_this.la == 0) {
                    _this.dataSelect = _this.tableData
                } else {
                    _this.$axios.get("/caselist/pastCaseListHave/" + _this.la, {
                        headers: {
                            "Authorization": _this.$store.getters.getToken
                        }
                    }).then(res => {
                        console.log(res)
                        // _this.tableData = res.data.data
                        _this.dataSelect = res.data.data
                    })
                }

            },
            showIOLRange() {
                this.dialogFormVisibleIOL = true;
            },
            selectIOLRange() {
                const _this = this
                _this.$axios.get("/caselist/pastCaseListRange/" + _this.alValue[0] + '/' + _this.alValue[1], {
                    headers: {
                        "Authorization": _this.$store.getters.getToken
                    }
                }).then(res => {
                    console.log(res)
                    _this.dataSelect = res.data.data
                })
                _this.dialogFormVisibleIOL = false
            }
        }
    }
</script>

<style scoped>
    .el-header {
        width: 100%;
        position:absolute;
        left: 0;
        padding: 0;
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 65px;
        top: 0;
    }
    .el-main {
        width: 100%;
        margin-top: 60px;
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        height: 850px;
    }
    .el-footer {
        bottom: 0;
        width: 100%;
        position:fixed;
        left: 0;
        padding: 0;
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 65px;
        font-size: 10px;
    }
</style>