<template>
  <div>
    <el-container>
      <el-header>
        <Header active-index="/illStatistic"></Header>
      </el-header>
      <el-main v-loading="loading">
        <el-row>
          <el-col :span="24"
            ><div>
              统计时间段：
              <el-date-picker
                style="width: 300px; margin-bottom: 20px"
                v-model="timeRange"
                value-format="yyyy-MM-dd"
                @change="timeChange()"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker></div
          ></el-col>
        </el-row>

        <el-empty v-if="!hasData" description="暂无数据"></el-empty>
        <div v-if="hasData">
          <el-row>
            <el-col :span="24"
              ><div ref="myChart2" style="height: 200px"></div
            ></el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-card
                shadow="hover"
                v-for="(item, index) in currentDetailValueData"
                :key="index"
                style="float: left; margin: 5px 15px 10px 0px; width: 30%"
              >
                <div slot="header" class="header">
                  <span>{{ item.name }}</span>
                </div>
                <div class="content">
                  <el-descriptions :column="1" :content-style="contentStyle">
                    <el-descriptions-item style="" label="数量">{{
                      item.value
                    }}</el-descriptions-item>
                    <el-descriptions-item label="占比">
                      <el-progress
                        type="circle"
                        :percentage="
                          Number(
                            (
                              (item.value / forSum(currentDetailValueData)) *
                              100
                            ).toFixed(2)
                          )
                        "
                      ></el-progress
                    ></el-descriptions-item>
                  </el-descriptions>
                </div>
                <el-divider></el-divider>
              </el-card>
            </el-col>
            <el-col :span="12" style=""
              ><div ref="myChart1" style="height: 600px"
            /></el-col>
          </el-row>
        </div>
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
export default {
  name: "illStatistic",
  components: { Header },
  inject: ["reload"],
  data() {
    return {
      contentStyle: {
        fontWeight: "bold",
        fontSize: "1.2rem",
      },
      hasData: false,
      currentDetailValueData: [],
      timeRange: [],
      detailValueData: [],
      stackData: [],
      loading: false,
      abstractIllData: [],
      detailIllData: [],
    };
  },
  created() {
    // this.setCharts();
  },
  methods: {
    forSum(arr) {
      let sum = 0;
      arr.forEach((item) => (sum += item.value));
      return sum;
    },
    timeChange() {
      this.getCountData();
    },
    getCountData() {
      this.timeRange = this.timeRange ? this.timeRange : ["", ""];
      this.loading = true;
      this.hasData = false;
      let obj = {
        beginTime: this.timeRange[0],
        endTime: this.timeRange[1],
      };
      api
        .getIllCount(obj)
        .then((res) => {
          let abstractData = [];
          let detailData = [];
          if (res.data.data.length && res.data.code == 200) {
            let allData = res.data.data;
            allData.forEach((item, index) => {
              let groupName = item.groupName;
              let categorys = [];
              abstractData.push({
                name: groupName,
                value: item.totalCount,
              });
              if (index == 0) {
                abstractData[index].selected = true;
              }
              detailData.push({
                type: groupName,
              });
              item.categoryCounts.forEach((detalItem) => {
                categorys.push({
                  name: detalItem.categoryName,
                  value: detalItem.count,
                });
              });
              detailData[index].data = categorys;
            });
            this.abstractIllData = abstractData;
            this.detailIllData = detailData;
            this.currentDetailValueData = detailData[0].data;
            this.hasData = true;
          }
        })
        .catch((error) => {})
        .finally(() => {
          this.loading = false;
          if (this.hasData) {
            this.$nextTick(() => {
              this.setCharts();
              this.setCharts2();
            });
          } else {
            // 销毁实例
            let chart1 = this.$echarts.init(this.$refs.myChart1);
            let chart2 = this.$echarts.init(this.$refs.myChart2);
            chart1.dispose();
            chart2.dispose();
          }
        });
    },
    // 生成横向总体分类柱状图
    setCharts2() {
      let myChart = this.$echarts.init(this.$refs.myChart2);
      let ills = this.abstractIllData.map((item) => item.name);
      let illsValue = this.abstractIllData.map((item) => item.value);
      const colors = [
        "#8b2671",
        "#43b244",
        "#EE6666",
        "#126bae",
        "#fed71a",
        "#fc8c23",
        "#f1939c",
        "#5cb3cc"
      ]; // 自定义颜色
      const series = ills.map((item, index) => {
        return {
          name: item,
          type: "bar",
          stack: "total",
          barWidth: "90%",
          label: {
            show: true,
            color: "#fff",
            fontWeight: "bold",
            fontSize: 16,
          },
          itemStyle: {
            color: colors[index % colors.length], // 循环使用颜色
          },
          data: [illsValue[index]],
        };
      });

      let option = {
        tooltip: {
          position: function (point, params, dom, rect, size) {
            // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
            // 提示框位置
            var x = 0; // x坐标位置
            var y = 0; // y坐标位置 // 当前鼠标位置

            var pointX = point[0];
            var pointY = point[1]; // 外层div大小 // var viewWidth = size.viewSize[0]; // var viewHeight = size.viewSize[1]; // 提示框大小

            var boxWidth = size.contentSize[0];
            var boxHeight = size.contentSize[1]; // boxWidth > pointX 说明鼠标左边放不下提示框

            if (boxWidth > pointX) {
              x = pointX + 10;
            } else {
              // 左边放的下
              x = pointX - boxWidth - 10;
            } // boxHeight > pointY 说明鼠标上边放不下提示框

            if (boxHeight > pointY) {
              y = 5;
            } else {
              // 上边放得下
              y = pointY - boxHeight;
            }

            return [x, y];
          },
        },
        legend: {
          selectedMode: false,
          data: ills,
        },
        yAxis: {
          type: "category",
          data: ["数量"],
        },
        xAxis: {
          type: "value",
        },
        animation: true,
        series,
      };

      myChart.setOption(option);

      // 响应式调整
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    setCharts() {
      let abstractIllData = this.abstractIllData;
      let detailIllData = this.detailIllData;
      let newId = 0;
      const _this = this;
      const colors = [
        "#8b2671",
        "#43b244",
        "#EE6666",
        "#126bae",
        "#fed71a",
        "#fc8c23",
        "#f1939c",
        "#5cb3cc"
      ];
      let myChart = this.$echarts.init(this.$refs.myChart1);

      // 为饼状图的中心圆设置颜色
      abstractIllData = abstractIllData.map((item, index) => {
        return {
          ...item,
          itemStyle: {
            color: colors[index % colors.length], // 使用与柱状图相同的颜色
          },
        };
      });

      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        series: [
          {
            name: "疾病组别",
            type: "pie",
            selectedMode: "single",
            radius: [0, "30%"],
            center: ["50%", "40%"],
            label: {
              position: "inner",
              fontSize: 15,
              color: "#fff",
              rotate: true,
            },
            labelLine: {
              show: false,
            },
            data: abstractIllData,
          },
          {
            name: "详细分类",
            type: "pie",
            radius: ["45%", "60%"],
            center: ["50%", "40%"],
            labelLine: {
              length: 30,
            },
            label: {
              formatter: "{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ",
              backgroundColor: "#F6F8FC",
              borderColor: "#8C8D8E",
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                a: {
                  color: "#6E7079",
                  lineHeight: 22,
                  align: "center",
                },
                hr: {
                  borderColor: "#8C8D8E",
                  width: "100%",
                  borderWidth: 1,
                  height: 0,
                },
                b: {
                  color: "#4C5058",
                  fontSize: 14,
                  fontWeight: "bold",
                  lineHeight: 33,
                },
                per: {
                  color: "#fff",
                  backgroundColor: "#4C5058",
                  padding: [3, 4],
                  borderRadius: 4,
                },
              },
            },
            data: this.detailIllData[0].data,
          },
        ],
      };
      myChart.on("click", { seriesName: "疾病组别" }, function (event) {
        detailIllData.forEach((element, index) => {
          if (element.type === event.name) {
            newId = index;
            _this.currentDetailValueData = element.data;
          }
        });
        myChart.setOption({
          series: [
            {
              name: "详细分类",
              data: detailIllData[newId].data,
            },
            {
              name: "疾病组别",
              data: abstractIllData,
            },
          ],
        });
      });
      myChart.setOption(option);
    },
  },
  mounted() {
    this.getCountData();
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
  margin-top: 65px;
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  /* height: 1000px; */
  /* overflow: hidden; */
  overflow: auto;
}

.el-card /deep/ .el-card__header {
  height: 30px;
  background-color: #fcfcfd;
  display: flex;
  align-items: center;
}
</style>