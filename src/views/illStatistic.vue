<template>
  <div>
    <el-container>
      <el-header>
        <Header active-index="/illStatistic"></Header>
      </el-header>
      <el-main>
        <div ref="myChart1" v-loading="loading" style="height: 1000px;" />
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
  name: "illStatistic",
  components: { Header },
  inject: ["reload"],
  data() {
    return {
      loading: false,
      abstractIllData: [
      ],
      detailIllData: [
        
      ],
    };
  },
  created() {
    // this.setCharts();
  },
  methods: {
    getCountData() {
      this.loading = true;
      let obj = {};
      api
        .getIllCount(obj)
        .then((res) => {
          let abstractData = [];
          let detailData = [];
          if (res.data.code == 200) {
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
            this.setCharts();
          }
        })
        .catch((error) => {})
        .finally(() => {
          this.loading = false;
        });
    },
    setCharts() {
      let abstractIllData = this.abstractIllData;
      let detailIllData = this.detailIllData;
      let newId = 0;
      let myChart = this.$echarts.init(this.$refs.myChart1);
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        // legend: {
        //   data: [
        //     "糖尿病性视网膜病变",
        //     "视网膜静脉阻塞",
        //     "高度近视",
        //     "青光眼",
        //     "角膜溃疡",
        //     // "黄斑变性",
        //     "白内障",
        //     "干眼",
        //   ],
        // },
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
            data: this.abstractIllData,
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
          if (element.type === event.name) newId = index;
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
  margin-top: 50px;
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  /* height: 1000px; */
  /* overflow: hidden; */
  overflow: auto;
}
</style>