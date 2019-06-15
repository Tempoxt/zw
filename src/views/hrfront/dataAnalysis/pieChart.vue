<template>
  <el-card class="box-card">
    <div :id="id" v-show="show" class="box-card-c"></div>
		<div :id="id+'2'" v-show="!show" class="box-card-c box-card-c2"></div>
  </el-card>
</template>

<script>
import echarts from "echarts";

export default {
  props: ["title", "id", "color", "datas","show","screenIndex"],
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
			$("#"+this.id+"2").height(parseInt(window.screen.height)-40);
			console.log(window.screen.height)
			let aaa = echarts.init(document.getElementById(this.id+"2"));
			aaa.setOption(this.option);
		},		
		fullScreen(){
			this.$emit("fullScreen",this.screenIndex)
		},
		init(){
			let _this=this;
			  this.option = {
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
			    this.option.legend.data[i]={}
			    this.option.legend.data[i].name = this.datas[i].name;
			    this.option.legend.data[i].icon = "circle";
			  }
			  if (this.color) {
			    this.option.color = this.color;
			  }
			  $(".box-card-c").width(parseInt($(".box-card").parent().width())-40);
			  let myChart = echarts.init(document.getElementById(this.id));
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
	.box-card-c.box-card-c2{
		height: 100%;
	}
  .box-card-c {
    height: 300px;
  }
}
</style>
