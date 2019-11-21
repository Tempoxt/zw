<template>
  <el-card class="box-card">
    <div :id="id" v-show="show" class="box-card-c"></div>
	<div :id="id+'2'" v-show="!show" class="box-card-c box-card-c2"></div>
  </el-card>
</template>

<script>
import echarts from "echarts";

export default {
  	props: ["title", "id","show","datas","screenIndex"],	
	data() {
		return {
			option: {}
		}
	},
	mounted() {
		if(this.datas!=''&&this.datas.man!=undefined){
			this.$nextTick(function() {
				this.init(this.id,this.datas)
			})
		}
	},
	watch: {
		datas:{
			handler(newVal, oldVal){
				if(this.datas!=''&&this.datas.man!=undefined){
					this.datas = newVal
					this.init(this.id,newVal)
				}
			},
			immediate: true,
			deep: true
		}
	},
	methods:{		
		checkFull(){
			$(".box-card-c").width(parseInt($("body").width())-40);
			$("#"+this.id+"2").height(parseInt(window.screen.height)-40);
			let aaa = echarts.init(document.getElementById(this.id+"2"));
			aaa.setOption(this.option);
		},
		fullScreen(){
			this.$emit("fullScreen",this.screenIndex)
		},
		init(id,data){
			let _this=this;
			this.option = {
			  title: {
			    text: ""
			  },
			  tooltip: {
			    trigger: "axis"
			  },
			  legend: {
				top: "30",
			    data: ['男','女']
			  },
			  toolbox: {
				right:20,
			    show: true,
				itemSize:16,
			    orient: "horizontal",
			    // feature: {
				// 	myTool2: {
				// 		show: true,
				// 		title:"全屏",
				// 		icon: 'path://M428 928H141.2l299.2-299.2c12.5-12.5 12.5-32.8 0-45.2s-32.8-12.5-45.2 0L96 882.7V598c0-17.7-14.3-32-32-32s-32 14.3-32 32v362c0 17.7 14.3 32 32 32h364c17.7 0 32-14.3 32-32s-14.3-32-32-32zM598 96h284.8L583.6 395.2c-12.5 12.5-12.5 32.8 0 45.2s32.8 12.5 45.2 0L928 141.3V424c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32H598c-17.7 0-32 14.3-32 32s14.3 32 32 32z',
				// 		onclick: function (){
				// 			_this.fullScreen()
				// 		}
				// 	},
				// 	saveAsImage: {
				// 		pixelRatio:2,
				// 		icon: 'path://M344.9661875 31.5h336.35a12.0125 12.0125 0 0 1 12.0125 12.0125l-1.20125 472.3315h137.7233125a12.0125 12.0125 0 0 1 8.5889375 20.42125L520.40875 859.2213125a12.0125 12.0125 0 0 1-16.937625 0.1801875L172.2865 536.4454375a12.0125 12.0125 0 0 1 8.40875-20.6014375h152.2584375V43.5125c0-6.606875 5.405625-12.0125 12.0125-12.0125zM61.53125 932.4375h900.9375a30.03125 30.03125 0 1 1 0 60.0625H61.53125a30.03125 30.03125 0 1 1 0-60.0625z',
				// 		show: true,
				// 	}
			    // }
			  },
			  color: ["#7AA2FC", "#FF4EBE"],
			  calculable: true,
			  xAxis: [
			    {
			      type: "category",
			      data: data.man.name
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
			      data: data.man.value
			    },
			    {
			      name: "女",
			      type: "bar",
			      data: data.woman.value
			    }
			  ]
			};
			this.option.title.text = this.title;
			if(data!=undefined&&data.man.name!=undefined){
				$(".box-card-c").width(parseInt($(".box-card").parent().width())-40);
				let myChart = echarts.init(document.getElementById(this.id));
				myChart.setOption(this.option);
				window.addEventListener('resize',function() {
					$(".box-card-c").width(parseInt($(".box-card-c").parent().width()));
					$(".box-card-c").height(parseInt($(".box-card-c").parent().height()));
					myChart.resize()
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.box-card {
  margin-top: 10px;
  padding-top: 15px;
	.box-card-c.box-card-c2{
		height: 100%;
	}
  .box-card-c {
    height: 350px;
  }
}
</style>
