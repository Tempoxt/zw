<template>
  <el-card class="box-card">
    <div :id="id" class="box-card-c"></div>
  </el-card>
</template>

<script>
import echarts from "echarts";

export default {
  props: ["title", "id"],
  mounted() {
    let option = {
      title: {
        text: ""
      },
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: [{name:'男',icon:"circle"}, {name:'女',icon:"circle"}]
      },
      toolbox: {
        show: true,
        orient: "horizontal",
        feature: {
          restore: {
            //重置
            show: true
          },
          saveAsImage: {
            //保存图片
            show: true
          }
        }
      },
      color: ["#73ACFF", "#FF64C6"],
      calculable: true,
      xAxis: [
        {
          type: "category",
          data: ["25岁以下", "25-35岁", "36-45岁", "46-55岁", "56岁以上"]
        }
      ],
      yAxis: [
        {
          type: "value"
        }
      ],
      series: [
        {
          name: "男",
          type: "bar",
          data: [2, 4, 7, 23, 25]
        },
        {
          name: "女",
          type: "bar",
          data: [2, 5, 9, 26, 28]
        }
      ]
    };
    option.title.text = this.title;
    $(".box-card-c").width(parseInt($(".box-card").parent().width())-40);
    let myChart = echarts.init(document.getElementById(this.id));
    myChart.setOption(option,true);
    //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
    // window.addEventListener("resize", function() {
    //   myChart.resize();
    // });
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  margin-top: 10px;
  .box-card-c {
    height: 300px;
  }
}
</style>
