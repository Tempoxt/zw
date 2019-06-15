<template>
  <el-card class="box-card">
    <div id="ring-diagram" v-show="show" class="box-card-c"></div>
		<div id="ring-diagram2" v-show="!show" class="box-card-c"></div>
  </el-card>
</template>

<script>
import echarts from "echarts";

export default {
	props:["show","screenIndex"],
	data() {
		return {
			option: {}
		}
	},
  mounted() {
    this.init()
  },
	methods:{
		checkFull(){
			
			console.log(this.show)
			$(".box-card-c").width(parseInt($("body").width())-40);
			$("#ring-diagram2").height(parseInt(window.screen.height)-40);
			console.log(window.screen.height)
			let aaa = echarts.init(document.getElementById("ring-diagram2"));
			aaa.setOption(this.option);
		},
		fullScreen(){
			this.$emit("fullScreen",this.screenIndex)
		},
		init(){
			console.log("1234564")
			let _this=this;
			this.option = {
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
			      myTool2: {
			          show: true,
								title:"全屏",
			          icon: 'image://http://echarts.baidu.com/images/favicon.png',
			          onclick: function (){
			              _this.fullScreen()
			          }
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
			$(".box-card-c").width(parseInt($(".box-card").parent().width())-40);
			let myChart = echarts.init(document.getElementById("ring-diagram"));
			myChart.setOption(this.option);
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
	#ring-diagram2{
		height: 100%;
	}
  .box-card-c{
    height: 300px;
  }
}
</style>
