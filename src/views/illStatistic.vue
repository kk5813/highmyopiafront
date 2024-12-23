<template>
  <div>
    <el-container>
      <el-header>
        <Header active-index="/illStatistic"></Header>
      </el-header>
      <el-main>
        <div ref="myChart1" id="aaaa" style="height: 1000px" />
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
export default {
  name: "illStatistic",
  components: { Header },
  inject: ["reload"],
  data() {
    return {
      abstractIllData: [
        { value: 1548, name: "糖尿病性视网膜病变", selected: true },
        { value: 775, name: "视网膜静脉阻塞" },
        { value: 2876, name: "高度近视" },
        // { value: 306, name: "青光眼" },
        // { value: 256, name: "角膜溃疡" },
        // { value: 423, name: "黄斑变性" },
        // { value: 215, name: "白内障" },
        // { value: 487, name: "干眼" },
      ],
      detailIllData: [
        {
          type: "糖尿病性视网膜病变",
          data: [
            { value: 1048, name: "1型糖尿病" },
            { value: 100, name: "2型糖尿病" },
            { value: 200, name: "1型糖尿病性视网膜病变" },
            { value: 200, name: "2型糖尿病性视网膜病变" },
          ],
        },
        {
          type: "视网膜静脉阻塞",
          data: [
            { value: 130, name: "视网膜分支静脉阻塞" },
            { value: 335, name: "视网膜中央静脉阻塞" },
            { value: 310, name: "视网膜部分性静脉阻塞" },
          ],
        },
        {
          type: "高度近视",
          data: [
            { value: 1056, name: "高度近视" },
            { value: 1220, name: "病理性近视" },
            { value: 120, name: "黄斑劈裂" },
            { value: 90, name: "黄斑出血" },
            { value: 150, name: "变性近视" },
            { value: 101, name: "黄斑玻璃体牵拉综合症" },
            { value: 139, name: "脉络膜新生血管" },
          ],
        },
      ],
    };
  },
  created() {
    // this.setCharts();
  },
  methods: {
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
        legend: {
          data: [
            "糖尿病性视网膜病变",
            "视网膜静脉阻塞",
            "高度近视",
            // "青光眼",
            // "角膜溃疡",
            // "黄斑变性",
            // "白内障",
            // "干眼",
          ],
        },
        series: [
          {
            name: "概括分类",
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
      myChart.on("click", { seriesName: "概括分类" }, function (event) {
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
              name: "概括分类",
              data: abstractIllData,
            },
          ],
        });
      });
      myChart.setOption(option);
    },
  },
  mounted() {
    this.setCharts();
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