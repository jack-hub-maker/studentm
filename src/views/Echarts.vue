<template>
  <div id="main" style="width: 95%; height: 600px; top:50px"></div>
</template>

<script>
// 1. 导入 echarts
import echarts from "echarts";
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      option: {
        color: ["#80FFA5", "#00DDFF", "#37A2FF", "#FF0087", "#FFBF00"],
        title: {
          text: "不及格分数统计图",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        legend: {
          data: ["Line 1"],
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["周一i", "周二", "周三", "周四", "周五", "周六", "周日"],
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Line 1",
            type: "line",
            stack: "总量",
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(128, 255, 165)",
                },
                {
                  offset: 1,
                  color: "rgba(1, 191, 236)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: [100, 232, 101, 264, 90, 340, 150],
          },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    var myChart = echarts.init(document.getElementById("main"));
    this.$http.get("/echarts").then((res) => {
      console.log(res.data);
      // this.option.xAxis.data=res.data[0];
      // this.option.series[0].data=res.data[1];

      this.$set(this.option.xAxis[0], "data", res.data[0]);
      this.$set(this.option.series[0], "data", res.data[1]);
      // this.option.xAxis[0].data.splice(0,7,res.data[0]);
      // this.option.series[0].data.splice(0,7,res.data[1]);
      myChart.setOption(this.option, true);
      console.log(this.option.xAxis[0].data);
      console.log(this.option.series[0].data);
    });
    this.myway();
  },
  methods: {
    myway() {
      var myChart = echarts.init(document.getElementById("main"));
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(this.option);
    },
  },
};
</script>

<style scoped lang="less"></style>