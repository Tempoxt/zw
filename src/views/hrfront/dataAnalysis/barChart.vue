<template>
  <el-card class="box-card">
    <div :id="id" v-show="show" class="box-card-c"></div>
		<div :id="id+'2'" v-show="!show" v-if="datas" class="box-card-c box-card-c2"></div>
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
		this.$nextTick(function() {
			this.init(this.id,this.datas)
		})
	},
	watch: {
		datas:{
			handler(newVal, oldVal){
				if(this.datas!=''){
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
			console.log(window.screen.height)
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
			  color: ["#3889FF", "#FF64C6"],
			  calculable: true,
			  	// grid: {
				// 	top: '90',
				// },
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
			if(data!=undefined){
				this.option.xAxis.data = this.datas.man.name
				$(".box-card-c").width(parseInt($(".box-card").parent().width())-40);
				let myChart = echarts.init(document.getElementById(this.id));
				myChart.setOption(this.option);
				//建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
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
    height: 300px;
  }
}
</style>
