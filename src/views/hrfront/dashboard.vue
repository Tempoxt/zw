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
								<!-- <el-col :span="8">
									<stickyNote></stickyNote>
								</el-col>
								<el-col :span="8">
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

	import dateLap from '@/components/Table/DateLap'
	import accident from "./workbench/accident"
	import personnel from "./workbench/personnel"
	import payAdjust from "./workbench/payAdjust"

	import inService from "./dataAnalysis/inService"
	import pieChart from "./dataAnalysis/pieChart"
	import barChart from "./dataAnalysis/barChart"
	import histogram from "./dataAnalysis/histogram"
	import singlehisto from "./dataAnalysis/singlehisto"
	import single from "./dataAnalysis/single"
	import posnegBar from "./dataAnalysis/posnegBar"
	import progre from "./dataAnalysis/progre"
	// import sunbrust from "./dataAnalysis/sunbrust"
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
				staffData:[],//在职人数统计
				sexData:[],//男女比例统计
				eduLevelData:[],//学历分布统计
				eachageData:{},//各年龄段男女占比统计
				memberData:[],//直接/间接人员人数及比列
				leaveData:[],//请假情况统计表
				staffplanData:{},//人员规划及实际人数
				recruitData:{},//各部门招聘完成率统计
				leaveAcountData:[],//离职人数统计表
				leaveEduData:{},//离职学历分析表
				leaveReaData:{},//离职原因分析表
				turnRate:[],//员工流失率
				manageData:{},//人力资源报表
				rewarPunish:{},//人员奖惩情况统计
				overtimeRate:{},//加班比例统计分析
				departTimeData:[],//部门工时统计
				orgid:'',
				input5:'',
				filterText:'',
				visible:false,
				data2:[],
				form:{},
				totalP:'',
				totalP1:'',
				totalP2:'',
				totalP3:'',
				totalP7:'',
				personnel:[],
				one:[],
				dateLap1:'',
				dateLap2:'',
				dateLap3:'',
				dateLap4:'',
				dateLap5:'',
				dateLap6:'',
				dateLap7:'',
				percentage:30,
				payAdjust:[],
				leaveReason:[
					{
						value: '无',
						label: '全部'
					},{
						value: '1',
						label: '直接人员'
					},{
						value: '0',
						label: '间接人员'
					},
				],
				leaveRea:'无'
			};
		},
		components:{
			dateLap,
			dashboardReport,
			quickEntry,
			backlog,
			attendanceManagement,
			systemMessages,
			stickyNote,
			weater,
			workSchedule,
			leaveList,
			supplement,
			accident,
			personnel,
			// inService,
			// pieChart,
			// barChart,
			// histogram,
			// singlehisto,
			// single,
			// posnegBar,
			// progre,
			payAdjust,
			// sunbrust,
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
			orgid(){
				// this.fetchData()
				this.visible = false
				this.findDataName()
			},
			filterText(val) {
				this.$refs.tree2.filter(val);
			}
		},
		methods: {
			fetch(){
				
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
				this.speechMode(res);
				this.fulltype=false;
			},
			keyEsc(){
				this.screenIndex=""
			},
			/** * 是否全屏并按键ESC键的方法 */
			checkFull() {
				var isFull = window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
				// to fix : false || undefined == undefined
				if (isFull === undefined) {
					isFull = false;
				}
				// console.log(document.fullscreenEnabled , window.fullScreen , document.webkitIsFullScreen , document.msFullscreenEnabled);
				// console.log(isFull);
				return isFull;
			},
			async getstaffData(){
				this.staffData = await this.$request.get('/dataanalysis/ondutynumberstat?org_id='+this.orgid);
				let per = this.staffData.map(o=>o.value)
				if(this.pre!==[]){
					this.totalP = per.reduce((tem,item,index)=>tem+item)
				}
			},
			async getsexData(){
				this.sexData = await this.$request.get('/dataanalysis/genderratiostat?org_id='+this.orgid);
			},
			async geteduLevelData(){
				this.eduLevelData = await this.$request.get('/dataanalysis/educationstat?org_id='+this.orgid);
			},
			async geteachageData(){
				this.eachageData = await this.$request.get('/dataanalysis/agestagegenderratiostat?org_id='+this.orgid);
			},
			async getmemberData(){
				this.memberData = await this.$request.get('/dataanalysis/directandindirectratiostat');
				let direct = this.memberData.filter(o=>o.name=="直接人员")
				let indirect = this.memberData.filter(o=>o.name=="间接人员")
				if(direct!=''&&indirect!=''){
					this.totalP1 = '1 : '+ (Number(indirect[0].value)/Number(direct[0].value)).toFixed(2)
				}
			},
			async getleaveData(){
				this.leaveData = await this.$request.get('/dataanalysis/vacatecasestat?dateLap='+this.dateLap1);
				let per2 = this.leaveData.map(o=>o.value)
				if(this.pre2!==[]){
					this.totalP2 = per2.reduce((tem,item,index)=>tem+item)
				}
			},
			async getleaveAcountData(){
				if(this.dateLap2!=''&&this.orgid!=''){
					this.leaveAcountData = await this.$request.get('/dataanalysis/outdutynumberstat?dateLap='+this.dateLap2+'&org_id='+this.orgid);
					if(this.leaveAcountData.length!=0){
						let per3 = this.leaveAcountData.map(o=>o.value)
						if(this.pre3!==[]){
							this.totalP3 = per3.reduce((tem,item,index)=>tem+item)
						}
					}
				}
			},
			async getleaveEduData(){
				this.leaveEduData = await this.$request.get('/dataanalysis/outdutyedutionstat?dateLap='+this.dateLap3+'&org_id='+this.orgid);
			},
			async getleaveReaData(){
				this.leaveReaData = await this.$request.get('/dataanalysis/outdutyreasonstat?dateLap='+this.dateLap4+'&org_id='+this.orgid+'&main_filter='+this.leaveRea);
			},
			async getturnRate(){
				this.turnRate = await this.$request.get('/dataanalysis/numberloseratiostat?org_id='+this.orgid);
			},
			async getmanageData(){
				this.manageData = await this.$request.get('/dataanalysis/hrreportstat?dateLap='+this.dateLap5+'&org_id='+this.orgid);
			},
			async getovertimeRate(){
				this.overtimeRate = await this.$request.get('/dataanalysis/overtimeratiostat?dateLap='+this.dateLap6);
			},
			async getdeparttime(){
				this.departTimeData = await this.$request.get('/dataanalysis/departlabourtimestat?dateLap='+this.dateLap7+'&org_id='+this.orgid);
				if(this.departTimeData.length!=0){
					let per7 = this.departTimeData.map(o=>o.value)
					if(this.pre7!==[]){
						this.totalP7 = per7.reduce((tem,item,index)=>tem+item)
					}
				}
			},
			// fetchData(){
			// 	if(this.orgid!=''&&this.orgid!=undefined){
			// 		this.getstaffData()
			// 		this.getsexData()
			// 		this.geteduLevelData()
			// 		this.geteachageData()
			// 		this.getleaveAcountData()
			// 		this.getleaveEduData()
			// 		this.getleaveReaData()
			// 		this.getturnRate()
			// 		this.getmanageData()
			// 		this.getdeparttime()
			// 	}
			// }
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
			this.dateLap1 = this.dateLap2 = this.dateLap3 =this.dateLap4 =this.dateLap5 = this.dateLap6=this.dateLap7 =dayjs().format('YYYY-MM')
			// this.fetchData()
			this.getleaveData()
			this.getmemberData()
			this.getovertimeRate()
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
	// .el-card__body {
	// 	height: 360px;
	// }
	.speech-mode .el-card__body{
		height: 100%;
		.box-card-c{
			height: 100%;
		}
	}
	// .el-row .el-col:nth-child(2n){
	// 	padding-left: 10px;
	// }
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