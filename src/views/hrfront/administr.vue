<template>
	<div class="dashboard" >
<!-- <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll"--></el-scrollbar>

		<div class="outside">
			<el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
				<el-row style="padding-bottom:30px;">
					<el-col :span="12">
						<dormitory></dormitory>
					</el-col>
				</el-row>
			</el-scrollbar>
		</div>
	</div>
</template>
<script>
	import dormitory from "./workbench/dormitory"
	import * as api_common from "@/api/common";
	import * as api_org from "@/api/org";
	import table_mixin from "@c/Table/table_mixin";
  export default {
    data() {
      return {
      };
    },
	components:{
		dormitory,
	},
    methods: {
		
    },
	async created(){
    }
  };
</script>
<style>
.outside{
	height: 790px;
	background: #F5FAFB;
}
.maxheight{
	height: 500px;
}
.dashboard .el-card__header{
	padding: 15px 20px;
}
.dashboard .el-card__body{
	padding: 0 20px 20px!important;
}
.dashboard .selectdate .el-date-editor{
    width: 120px;
}
.dashboard .el-calendar-table .el-calendar-day {
    height: 25px;
}
.dashboard .el-calendar-table thead th {
    padding: 6px 0;
}
.dashboard .el-calendar__body {
    padding: 8px 20px 35px;
}
.dashboard .el-calendar__header {
    padding: 6px 20px;
}
.dashboard .el-card__body {
	height: 400px;
}
.dashboard .speech-mode .el-card__body{
	height: 100%;
}

.dashboard .speech-mode .el-card__body .box-card-c{
	height: 100%;
}
.totalR{
	font-size: 16px;
	font-weight: bold;
	position: relative;
	bottom: 40px;
	left: 0;
	right: 0;
	height: 0;
	display: flex;
	justify-content: center
}
</style>

<style lang="scss" scoped>

.el-tabs__content{
	background: #F5FAFB!important;
}
 .el-popper{
	height: 500px!important;
}
.scroll {
	height: 100%;
	width: 100%;
	/deep/ .scrollbar-wrapper {
		overflow-x: hidden;
	}
}
.dashboard{
	background: #F5FAFB;
	height: 100%;
	padding: 20px;
	.selectdate{
		display: inline-block;
		margin-left: 60px;
	}
	.operating-btn{
		text-align: right;
	}
	.padding-left-10{
		padding-left: 10px
	}
	.speech-mode{
		position: fixed;
		top: 0;
		left: 0;
		margin-top: 0;
		z-index: 99;
		width: 100%;
		height: 100%;
	}
}
	
</style>