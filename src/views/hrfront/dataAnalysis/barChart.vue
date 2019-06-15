<template>
  <el-card class="box-card">
    <div :id="id" v-show="show" class="box-card-c"></div>
		<div :id="id+'2'" v-show="!show" class="box-card-c box-card-c2"></div>
  </el-card>
</template>

<script>
import echarts from "echarts";

export default {
  props: ["title", "id","show"],	
	data() {
		return {
			option: {}
		}
	},
  mounted() {
    this.init();
  },
	methods:{		
		checkFull(){
			
			console.log(this.show)
			$(".box-card-c").width(parseInt($("body").width())-40);
			$("#"+this.id+"2").height(parseInt(window.screen.height)-40);
			console.log(window.screen.height)
			let aaa = echarts.init(document.getElementById(this.id+"2"));
			aaa.setOption(this.option);
		},
		init(){
			this.option = {
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
			this.option.title.text = this.title;
			$(".box-card-c").width(parseInt($(".box-card").parent().width())-40);
			let myChart = echarts.init(document.getElementById(this.id));
			myChart.setOption(this.option);
			//建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
			// window.addEventListener('resize',function() {
			// 	$(".box-card-c").width(parseInt($(".box-card-c").parent().width()));
			// 	$(".box-card-c").height(parseInt($(".box-card-c").parent().height()));
			// 	myChart.resize()
			// });
		}
	}
};
</script>

<style lang="scss" scoped>
.box-card {
  margin-top: 10px;
		.box-card-c.box-card-c2{
		height: 100%;
	}
  .box-card-c {
    height: 300px;
  }
}
</style>
