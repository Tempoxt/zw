<template>
  <el-card class="box-card">
    <div :id="id" v-show="show" class="box-card-c"></div>
		<div :id="id+'2'" v-show="!show" class="box-card-c box-card-c2"></div>
  </el-card>
</template>
<script>
import echarts from "echarts";

export default {
  props: ["title", "id","color","show","datas","screenIndex"],	
	data() {
		return {
			option: {}
		}
	},
	mounted() {
		if(this.datas!=''&&this.datas.name!==undefined){
			this.$nextTick(function() {
				this.init(this.id,this.datas)
			})
		}
	},
	watch: {
		datas:{
			handler(newVal, oldVal){
				if(this.datas!=''&&this.datas.name!==undefined){
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
					trigger: "axis",
					axisPointer: {
						type: 'shadow'
					},
					formatter: '{c}%'
				},
				legend: {
					top: "30",
					data: []
				},
				toolbox: {
					right:20,
					show: true,
					itemSize:14,
					orient: "horizontal",
				},
				color: ["#40CDE9"],
				calculable: true,
					grid: {
						left: '5%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
				xAxis: [
					{
						type: "value",
						boundaryGap: [0, 0.01],
						show: false
					}
				],
				yAxis: [
					{
						type: "category",
						data: data.name,
						axisLabel: {
							formatter: '{value} %'
						}
					}
				],
				series: [
					{
						name: "",
						type: "bar",
						label: {
							normal: {
								position: 'right',
								show: true,
								label: {
									show: true,
									positiong: 'top',
									formatter: '{c}%'
								}
							}
						},
						barWidth: 14,
						barCategoryGap:'80%',
						data: data.value,
						itemStyle: {
							normal: {
								label: {
									show: true,
									positiong: 'top',
									formatter: '{c}%'
								}
							}
						}
					},
				]
			};
			this.option.title.text = this.title;
			if(data!=undefined){
				if (this.color) {
					this.option.color = this.color;
				}
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
    height: 350px;
  }
}
</style>
