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
		if(this.datas!='' && this.datas.mon_act_num!=undefined){
			this.$nextTick(function() {
				this.init(this.id,this.datas)
			})
		}
	},
	watch: {
		datas:{
			handler(newVal, oldVal){
				if(this.datas!='' && this.datas.mon_act_num!=undefined){
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
					bottom: "10",
					data: ['月实际数','月预算数']
				},
				toolbox: {
					right:20,
					show: true,
					itemSize:16,
					orient: "horizontal",
				},
				color: ['#FFD500','#44E594'],
				calculable: true,
				xAxis: [
					{
						type: "category",
						data: data.mon_bud_num.name
					}
				],
				yAxis: [
					{
						type: "value"
					}
				],
				series: [
					{
						name: "月预算数",
						type: "bar",
						data: data.mon_bud_num.value
					},
					{
						name: "月实际数",
						type: "bar",
						data: data.mon_act_num.value
					}
				]
			};
			this.option.title.text = this.title;
			if(data!=undefined&&data.mon_act_num.value!=undefined){
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
