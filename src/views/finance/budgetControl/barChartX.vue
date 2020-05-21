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
		if(this.datas!='' && this.datas.this_month!=undefined){
			this.$nextTick(function() {
				this.init(this.id,this.datas.this_month)
			})
		}
	},
	watch: {
		datas:{
			handler(newVal, oldVal){
				if(this.datas!='' && this.datas.this_month!=undefined){
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
			var min =  data.this_month[0][0]
			var max =  data.this_month[1][0]
			var color =  ['#FFD500','#44E594']
			if(max==0){
				min = 35659548.63
				max = 117704576.61
			}
			if(min>max){
				min =  data.this_month[1][0]
				max =  data.this_month[0][0]
				var color =  ['#44E594','#FFD500']
			}
			this.option = {
				title: {
					text: ""
				},
				dataset: {
					source: data.this_month,
				},
				legend: {
					data: ['实际数','预算数']
				},
				toolbox: {
					right:20,
					show: true,
					itemSize:16,
					orient: "horizontal",
				},
				grid: {containLabel: true,height:'60%',top: 120},
				xAxis: {name: 'amount',show: false},
				yAxis: {
					type: 'category',
					axisTick: {
						alignWithLabel: true 
					}
				},
				visualMap: {
					min: min,
					max: max,
					dimension: 0,
					inRange: {
						color: color
					},
					show: false
				},
				series: [
					{
						type: 'bar',
						barWidth: 30,
						barCategoryGap: 30,
						encode: {
							x: 'amount',
							y: 'product'
						},
						label:{
							show: true,
							color: '#4C5D66',
							position: 'right'
						}
					}
				],
			};
			this.option.title.text = this.title;
			this.option.legend.data = ['实际数','预算数']
			if(data!=undefined&&data.this_month!=undefined){
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
