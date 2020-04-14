<template>
	<div class="dashboard" >
		<el-tabs v-model="activeName">
			<el-tab-pane label="工作台" name="workbench">
				<div class="outside">
					<el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
							<el-row :gutter="10">
								<!-- <el-col :span="16">
									<backlog></backlog>
								</el-col>
								<el-col :span="8">
									<weater></weater>
								</el-col> -->
								<!-- <el-col :span="16">
									<workSchedule></workSchedule>
								</el-col>
								<el-col :span="8">
									<quickEntry></quickEntry>
								</el-col> -->
								<el-col :span="8">
									<stickyNote></stickyNote>
								</el-col>
								<!-- <el-col :span="8">
									<attendanceManagement></attendanceManagement>
								</el-col>
								<el-col :span="8">
									<systemMessages></systemMessages>
								</el-col> -->
								<!-- <el-col :span="12">
									<leaveList></leaveList>
								</el-col>
								<el-col :span="12">
									<supplement></supplement>
								</el-col> -->
							</el-row>
							<!-- <el-row style="padding-bottom:30px;">
								<el-col :span="12">
									<accident></accident>
								</el-col>
								<el-col :span="12" v-if="personnel.length>0">
									<personnel :datas="personnel" title="待转正员工"></personnel>
								</el-col>
								<el-col :span="12" v-if="payAdjust.length>0">
									<payAdjust :datas="payAdjust" title="调薪员工"></payAdjust>
								</el-col>
							</el-row> -->
					</el-scrollbar>
				</div>
			</el-tab-pane>
			<el-tab-pane label="数据分析" lazy name="dataAnalysis">
				<dashboardReport/>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
	import backlog from "./workbench/backlog"
	import attendanceManagement from "./workbench/attendanceManagement"
	import stickyNote from "./workbench/stickyNote"
	import systemMessages from "./workbench/systemMessages"
	import weater from "./workbench/weater"
	import quickEntry from "./workbench/quickEntry"
	import workSchedule from "./workbench/workSchedule"
	import leaveList from "./workbench/leaveList"
	import supplement from "./workbench/supplement"

	import dashboardReport from "./dashboard-report"
	import * as api_common from "@/api/common";
	import * as api_org from "@/api/org";
	import table_mixin from "@c/Table/table_mixin";
	import screenfull from "screenfull";
	import dayjs from 'dayjs'
	export default {
		data() {
			return {
				activeName: 'workbench',
				value: '',
				screenIndex:"",
				checkFullshow:true,
				speechIndex:1,
				fulltype:false,
				form:{},
			};
		},
		components:{
			dashboardReport,
			stickyNote,
		},
		watch:{
			activeName(val) {
				if(val=="dataAnalysis"){
					setTimeout(()=>{
						var myEvent = new Event('resize')
						window.dispatchEvent(myEvent)
					},1000)
				}
			},
		},
		methods: {
			checkFull() {
				var isFull = window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
				if (isFull === undefined) {
					isFull = false;
				}
				return isFull;
			},
		},
		async mounted() {
			let _this = this;
			window.addEventListener('resize', function (e) {
				if (!_this.checkFull()) {
					//$(".box-card-c").height(300);
					_this.keyEsc();
					_this.checkFullshow=true
					_this.speechIndex=1 
					_this.fulltype=false;
					// var myEvent = new Event('resize');
					//  window.dispatchEvent(myEvent);
				}		  
			})
			window.addEventListener('keyup', function (e) {
				if (_this.fulltype) {
					// console.log(e.keyCode,'eeeeee')
					if (e.keyCode==38) {
						if (_this.speechIndex>1) {
							_this.speechIndex=parseInt(_this.speechIndex)-1;
							_this.speechSwitch(_this.speechIndex)
						} else{
							_this.$message({
							message: '已经是第一个',
							type: 'warning'
							});
						}
					}
					if (e.keyCode==40) {
						if (_this.speechIndex<13) {
							_this.speechIndex=parseInt(_this.speechIndex)+1;
							_this.speechSwitch(_this.speechIndex)
						} else{
							_this.$message({
							message: '已经是最后一个',
							type: 'warning'
							});
						}
					}
				}
			})
		},
		created(){

		}
  };
</script>
<style lang="scss">
.outside{
	height: 790px;
	background: #F5FAFB;
}
.maxheight{
	height: 500px;
}
.dashboard{
	.iconfont{
		margin-right: 10px;
		margin-top: -2px;
	}
	.box-card{
		margin-bottom: 15px;
		.box-card-header{
			padding: 10px 0;
			border-bottom: 1px solid #CCD5DB;
		}
	}
	.cardName{
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		color: #37474F;
		font-size: 16px;
		font-weight: bold
	}
	.el-card__header{
		border: none;
		padding: 0 20px;
	}
	.el-card__body{
		padding: 0 20px 20px!important;
	}
	.selectdate{
		.el-date-editor{
			width: 120px;
		}
	}
	.el-calendar-table{
		.el-calendar-day {
			height: 25px;
		}
		thead th {
			padding: 6px 0;
		}
	}
	.el-calendar__body {
		padding: 8px 20px 35px;
	}
	.el-calendar__header {
		padding: 6px 20px;
	}
	.speech-mode .el-card__body{
		height: 100%;
		.box-card-c{
			height: 100%;
		}
	}
	.el-row .el-col:nth-child(n) .dateLap{
		right: 20px!important;
	}
}
</style>

<style lang="scss" scoped>
.box-card {
	width: 100%;
	padding-top: 15px;
	margin-top: 10px;
	.box-card-c.box-card-c2{
		height: 100%;
	}
	.box-card-c {
		height: 350px;
	}
}
.el-tabs__content{
	background: #F5FAFB!important;
}
 .el-popper{
	height: 500px!important;
}
.scroll {
    height: calc(100% - 30px);
	/deep/ .scrollbar-wrapper {
		overflow-x: hidden;
	}
	/deep/ .el-scrollbar__view{
		width: calc(100% - 5px);
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
	.dateLap{
		position: absolute;
		top: 23px;
	}
	.absoSelect{
		position: absolute;
		top: 23px;
		right: 240px;
		width: 20%;
		.el-input__inner{
			border-radius: 0;
		}
	}
	.relative{
		position: relative;
	}
	.totalR{
		font-size: 16px;
		font-weight: bold;
		position: absolute;
		bottom: 40px;
		left: 0;
		right: 0;
		height: 0;
		display: flex;
		justify-content: center;
	}
}
	
</style>