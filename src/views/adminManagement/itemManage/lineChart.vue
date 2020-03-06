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
		if(this.datas&&this.datas.article_title!=undefined){
			this.$nextTick(function() {
				this.init(this.id,this.datas)
			})
		}
	},
	watch: {
		datas:{
			handler(newVal, oldVal){
				if(newVal){
					this.$nextTick(function() {
						this.init(this.id,newVal)
					})
				}
			},
			immediate: true,
			deep: true
		}
	},
	methods:{
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
					data: ['请购数量','发放数量','库存数量']
				}, 
				grid: {
					left: '3%',
					right: '6%',
					bottom: '3%',
					containLabel: true
				},
				toolbox: {
					right:20,
					show: true,
					itemSize:14,
					orient: "horizontal",
				},
				color: ["#0BB2D4", "#F2353C", "#1FD361"],
				calculable: true,
				xAxis: {
					type: 'category',
					boundaryGap: false,
					data: data.month_range
				},
				yAxis: {
					type: "value"
				},
				series: [
					{
						name: "请购数量",
						type: "line",
						data:data.purchase_number
					},
					{
						name: "发放数量",
						type: "line", 
						data:data.grant_number
					},
					{
						name: "库存数量",
						type: "line",
						data:data.stock_number
					}
				]
			};
			if(data!=undefined){
				this.option.title.text = data.article_title+'-'+data.article_size;
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
	.box-card-c.box-card-c2{
		height: 100%;
	}
	.box-card-c {
		height: 350px;
	}
}
</style>
