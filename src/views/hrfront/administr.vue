<template>
	<div class="dashboard" >
<!-- <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll"</el-scrollbar>-->
		<el-tabs v-model="activeName">
			<el-tab-pane label="工作台" name="workbench">
				<div class="outside">
					<el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
						<el-row style="padding-bottom:30px;">
							<el-col :span="12">
								<dormitory></dormitory>
							</el-col>
						</el-row>
					</el-scrollbar>
				</div>
			</el-tab-pane>
			<el-tab-pane label="数据分析" name="dataAnalysis">
				<div class="outside">
						<el-row>
							<el-form ref="form" :model="form" label-width="90px">
								<el-col :span="12">
									<div>
										<dateLap v-model="dateLap" @change="fetch"/>
									</div>
								</el-col>
							</el-form>
							<el-col :span="12" class="operating-btn">
									<el-button plain icon="el-icon-video-play" @click="speechMode(speechIndex)">演讲模式</el-button>
									<!-- <el-button plain icon="el-icon-download" >全部下载</el-button>-->
							</el-col>
						</el-row>
						
					<el-scrollbar wrap-class="scrollbar-wrapper" class="scroll" style="padding-bottom:30px">
						<el-row>
							<el-col :span="12" v-show="bookmeal.length!=0">
								<pieChart  
								:show="checkFullshow"
								ref="echart1"
								title="员工报餐统计" 
								id="bookmeal"
								screenIndex='1'
								@fullScreen="fullScreen"
								:datas="bookmeal"
								:class="{'speech-mode':screenIndex=='1'}"
								></pieChart>
							</el-col>
							<el-col :span="12" class="padding-left-10" v-show="dinnermeal.length!=0">
								<pieChart
								:show="checkFullshow"
								ref="echart2"
								title="员工就餐统计" 
								id="dinnermeal"
								screenIndex='2'
								@fullScreen="fullScreen"
								:datas="dinnermeal"
								:class="{'speech-mode':screenIndex=='2'}"
								></pieChart>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12" v-show="userpay.length!=0">
								<inService
								id="userpay"
								title="员工餐费统计"  
								:show="checkFullshow" 
								:datas = userpay
								ref="echart3" 
								screenIndex='3'
								@fullScreen="fullScreen"
								:class="{'speech-mode':screenIndex=='3'}"
								></inService>
							</el-col>
						</el-row>
					</el-scrollbar>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import dormitory from "./workbench/dormitory"
import * as api_common from "@/api/common";
import * as api_org from "@/api/org";
import table_mixin from "@c/Table/table_mixin";
import pieChart from "./dataAnalysis/pieChart"
import barChart from "./dataAnalysis/barChart"
import inService from "./dataAnalysis/inService"
import screenfull from "screenfull";
import dateLap from '@/components/Table/DateLap'
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
		analysis:{},
		bookmeal:[],
		dinnermeal:[],
		userpay:[],
		eachageData:{},
		orgid:'',
		input5:'',
		filterText:'',
		visible:false,
		data2:[],
		form:{},
      };
    },
	components:{
		dormitory,
		pieChart,
		barChart,
		inService,
		dateLap
	},
	watch:{
		orgid(){
			this.fetchData()
			this.visible = false
			this.findDataName()
		},
		filterText(val) {
			this.$refs.tree2.filter(val);
		}
	},
    methods: {
		fetch(){
			this.fetchData()
		},
		findDataName() {
			if (this.orgid === undefined) {
				return;
			}
			let orgid = this.orgid;
			let info = {};
			let that = this;
			(function f(data) {
				data.some(row => {
					if (row['orgid'] == orgid) {
						info = row;
						return true;
					}
					if (row.subs && row.subs.length) {
						f(row.subs);
					}
				});
			})(this.data2);
			this.input5 = info.name;
		},
		handleChangeNode(val){
            this.orgid = val.orgid
        },
        changeOrg(orgid){
            this.orgid = orgid
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name && data.name.indexOf(value) !== -1;
        },
		speechMode(id){
			screenfull.toggle();
			this.speechSwitch(id);
		},
		speechSwitch(id){
			this.screenIndex=id;
		    this.$refs["echart"+id].checkFull();
			this.checkFullshow=false;
			this.fulltype=true;
		},
		fullScreen(res){
			console.log(res)
			this.speechMode(res);
			this.fulltype=false;
		},
		keyEsc(){
			this.screenIndex=""
		},
		/** * 是否全屏并按键ESC键的方法 */
		checkFull() {
		  var isFull = window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
		  if (isFull === undefined) {
			  isFull = false;
		  }
		  return isFull;
		},
		async fetchData(){
			// if(this.orgid!=''&&this.orgid!=undefined){
				const analysis = await this.$request.get('/restaurant/quitstaffstat?dateLap='+this.dateLap);
				this.bookmeal = analysis.rows.bookmeal
				this.dinnermeal = analysis.rows.dinnermeal;
				this.userpay = analysis.rows.userpay
			// }
		}
    },
	async mounted() {
		let _this = this;
		window.addEventListener('resize', function (e) {
			//此处填写你的业务逻辑即可
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
					if (_this.speechIndex<3) {
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
		this.fetchData()
	},
	async created(){
    	this.dateLap = dayjs().format('YYYY-MM')
		// this.fetchData()
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
	height: 360px;
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
    height: calc(100% - 30px);
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