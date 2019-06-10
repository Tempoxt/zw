<template>
  <el-card class="box-card">
    <div :id="id" class="box-card-c"></div>
  </el-card>
</template>

<script>
import echarts from "echarts";

export default {
  props: ["title", "id", "color", "datas"],
  mounted() {
    let option = {
      title: {
        text: this.title
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
        borderRadius: 15,
        data: []
      },
      color: ["#3889FF", "#0BB2D4", "#1FD361", "#FFA023", "#FFD323", "#3889FF"],
      series: [
        {
          name: this.title,
          type: "pie",
          radius: "50%",
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
          data: this.datas
        }
      ]
    };
    for (let i = 0; i < this.datas.length; i++) {
        option.legend.data[i]={}
      option.legend.data[i].name = this.datas[i].name;
      option.legend.data[i].icon = "circle";
    }
    if (this.color) {
      option.color = this.color;
    }
    let myChart = echarts.init(document.getElementById(this.id));
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
  .box-card-c {
    height: 300px;
  }
}
</style>
