<template>
  <el-card class="box-card">
    <div id="ring-diagram"></div>
  </el-card>
</template>

<script>
import echarts from "echarts";

export default {
  mounted() {
    let myChart = echarts.init(document.getElementById("ring-diagram"));
    let option = {
      title: {
        text: "在职人数统计"
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      toolbox: {
        show: true,
        orient: "horizontal",
        feature: {
          restore: {
            //重置
            show: true
          },
          dataZoom: {
            //数据缩放视图
            show: true
          },
          saveAsImage: {
            //保存图片
            show: true
          }
        }
      },
      legend: {
        orient: "horizontal",
        top: "30",
        data: [
          "齿轮箱业务部",
          "总裁办",
          "管理部",
          "经管部",
          "营业部",
          "注塑业务部"
        ]
      },
      color: ["#FF004E", "#FFA023", "#FFD323", "#1FD361", "#0BB2D4", "#3889FF"],
      series: [
        {
          name: "在职人数统计",
          type: "pie",
          radius: ["50%", "70%"],
          center: ["50%", "60%"],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: "outside",
              formatter: "{b}:{c}/{d}%"
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: "18",
                fontWeight: "bold"
              }
            }
          },
          labelLine: {
            normal: {
              show: true
            }
          },
          data: [
            { value: 335, name: "齿轮箱业务部" },
            { value: 310, name: "总裁办" },
            { value: 234, name: "管理部" },
            { value: 135, name: "经管部" },
            { value: 1548, name: "营业部" },
            { value: 1548, name: "注塑业务部" }
          ]
        }
      ]
    };
    myChart.setOption(option);
    //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
    window.addEventListener("resize", function() {
      myChart.resize();
    });
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  margin-top: 10px;
  #ring-diagram {
    height: 300px;
  }
}
</style>
