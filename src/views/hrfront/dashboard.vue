<template>
	<div class="dashboard" >
		<el-tabs v-model="activeName">
			<el-tab-pane label="工作台" name="workbench">
				<div class="outside">
					<el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
							<!-- <el-row>
								<el-col :span="12">
									<quickEntry></quickEntry>
								</el-col>
								<el-col :span="12">
									<workSchedule></workSchedule>
								</el-col>
								<el-col :span="12">
									<leaveList></leaveList>
								</el-col>
								<el-col :span="12">
									<supplement></supplement>
								</el-col>
							</el-row> -->
							<el-row style="padding-bottom:30px;">
								<el-col :span="12">
									<accident></accident>
								</el-col>
								<el-col class="padding-left-10" :span="12" v-show="personnel.length>0">
									<personnel :datas="personnel" title="待转正员工"></personnel>
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
								<el-popover
									popper-class="maxheight"
									placement="bottom"
									width="300"
									style="height:500px"
									trigger="click"
									v-model="visible"
									>
									<el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
										<div style="padding:20px">
											<div class="side-header">
												<el-input placeholder="快速查找" v-model="filterText" class="input">
													<i slot="suffix" class="el-input__icon el-icon-search"></i>
												</el-input>
											</div>
											<el-tree
												class="tree"
												:data="data2"
												:props="{children: 'subs', label: 'name' }"
												default-expand-all
												node-key="orgid"
												:filter-node-method="filterNode"
												ref="tree2"
												:highlight-current="true"
												:check-on-click-node="false"
												@node-click="handleChangeNode"
												:expand-on-click-node="false"
											>
												<span slot-scope="{ node, data }">
													<span v-if="data.org_type === 1" class="icon iconfont icon-zonggongsi"></span>
													<span v-if="data.org_type === 2" class="icon iconfont icon-fengongsi"></span>
													<span v-if="data.org_type === 3" class="icon iconfont icon-fenbumen"></span>
													&nbsp;
													<span>{{ node.label }}</span>
												</span>
											</el-tree>
										</div>
									</el-scrollbar>
									<el-input 
										slot="reference"
										size="small"
										style="width: 240px;"
										placeholder="深圳市兆威机电股份有限公司"
										:value="input5"
										suffix-icon="el-icon-caret-bottom">
									</el-input>
								</el-popover>
							</el-col>
						</el-form>
						<el-col :span="12" class="operating-btn">
							<el-button plain icon="el-icon-video-play" @click="speechMode(speechIndex)">演讲模式</el-button>
						</el-col>
					</el-row>
						
					<el-scrollbar wrap-class="scrollbar-wrapper" class="scroll" style="padding-bottom:30px">
						<el-row>
							<el-col :span="12" class="relative" v-show="staffData.length!=0">
								<inService
								id="ring-diagram"
								title="在职人数统计"  
								:show="checkFullshow" 
								:datas = staffData
								ref="echart1" 
								screenIndex='1'
								@fullScreen="fullScreen"
								:class="{'speech-mode':screenIndex=='1'}"
								></inService>
								<div class="totalR" v-if="totalP!=''">总人数:{{totalP}}</div>
							</el-col>
							<el-col :span="12" class="padding-left-10" v-show="sexData.length!=0">
								<pieChart  
								:show="checkFullshow"
								ref="echart2"
								title="男女比例统计" 
								id="men-and-women"
								screenIndex='2'
								@fullScreen="fullScreen"
								:color="['#5A8BFC','#FF23AE']"
								:datas="sexData"
								:class="{'speech-mode':screenIndex=='2'}"
								></pieChart>
							</el-col>
							<el-col :span="12" v-show="eduLevelData.length!=0">
								<pieChart
								:show="checkFullshow"
								ref="echart3"
								title="学历分布统计" 
								id="education"
								:color="['#6556FF','#5A8BFC','#5CACFC','#40CDE9','#58D8BE','#4BDB80','#7DD453','#84EBFF','#B392FF','#FFAA7E','#FF8D8D','#E4D945','#F3D044','#FFAF47','#FF8D53','#FE68D1']"
								screenIndex='3'
								@fullScreen="fullScreen"
								:datas="eduLevelData"
								:class="{'speech-mode':screenIndex=='3'}"
								></pieChart>
							</el-col>
							<el-col :span="12" class="padding-left-10"  v-show="eachageData.length!=0">
								<barChart 
								:show="checkFullshow" 
								ref="echart4" 
								title="各年龄段男女占比统计" 
								screenIndex='4'
								@fullScreen="fullScreen"
								id="ege-data"
								:datas="eachageData"
								:class="{'speech-mode':screenIndex=='4'}"
								></barChart>
							</el-col>
							<el-col :span="12" class="relative" v-show="memberData.length!=0">
								<inService
								id="ring-member"
								title="直接/间接人员人数及比列"  
								:show="checkFullshow" 
								:datas = memberData
								:color="['#40CDE9','#FF8D53']"
								ref="echart5" 
								screenIndex='5'
								@fullScreen="fullScreen"
								:class="{'speech-mode':screenIndex=='5'}"
								></inService>
								<div class="totalR" v-if="totalP1!=''">总人数:{{totalP1}}</div>
							</el-col>
							<el-col :span="12" class="padding-left-10 relative" v-show="leaveData.length!=0">
								<inService
								id="ring-leave"
								title="请假情况统计表"  
								:show="checkFullshow" 
								:datas = leaveData
								ref="echart6" 
								screenIndex='6'
								@fullScreen="fullScreen"
								:class="{'speech-mode':screenIndex=='6'}"
								></inService>
								<dateLap class="dateLap" width="140px" itemsD="1" v-model="dateLap1" @change="getleaveData()"/>
								<div class="totalR" v-if="totalP2!=''">总次数:{{totalP2}}</div>
							</el-col>
							<!-- <el-col :span="12"  v-show="staffplanData.length!=0">
								<histogram 
								:show="checkFullshow" 
								ref="echart7" 
								title="人员规划及实际人数" 
								screenIndex='7'
								:color="['#5A8BFC','#40CDE9']"
								@fullScreen="fullScreen"
								id="staff-plan"
								:datas="staffplanData"
								:class="{'speech-mode':screenIndex=='7'}"
								></histogram>
							</el-col>
							<el-col :span="12" class="padding-left-10" v-show="recruitData.length!=0">
								<singlehisto 
								:show="checkFullshow" 
								ref="echart8" 
								title="各部门招聘完成率统计" 
								screenIndex='8'
								:color="['#40CDE9']"
								@fullScreen="fullScreen"
								id="recruit-data"
								:datas="recruitData"
								:class="{'speech-mode':screenIndex=='8'}"
								></singlehisto>
							</el-col> -->
							<el-col :span="12" class="relative" v-show="sexData.length!=0">
								<pieChart  
								:show="checkFullshow"
								ref="echart9"
								title="离职人数统计" 
								id="leave-account"
								screenIndex='9'
								@fullScreen="fullScreen"
								:color="['#3889FF','#FF64C6']"
								:datas="leaveAcountData"
								:class="{'speech-mode':screenIndex=='9'}"
								></pieChart>
								<dateLap class="dateLap right20" width="140px" itemsD="1" v-model="dateLap2" @change="getleaveData()"/>
								<div class="totalR" v-if="totalP3!=''">离职人数:{{totalP3}}</div>
							</el-col>
							<el-col :span="12" class="padding-left-10 relative" v-show="leaveEduData.length!=0">
								<singlehisto 
								:show="checkFullshow" 
								ref="echart10" 
								title="离职学历分析表" 
								screenIndex='10'
								:color="['#996EFF']"
								@fullScreen="fullScreen"
								id="leave-edu"
								:datas="leaveEduData"
								:class="{'speech-mode':screenIndex=='10'}"
								></singlehisto>
								<dateLap class="dateLap" width="140px" itemsD="1" v-model="dateLap3" @change="getleaveEduData()"/>
							</el-col>
							<el-col :span="12" class="relative" v-show="leaveReaData.length!=0">
								<singlehisto 
								:show="checkFullshow" 
								ref="echart11" 
								title="离职原因分析表" 
								screenIndex='11'
								:color="['#5A8BFC']"
								@fullScreen="fullScreen"
								id="leave-reason"
								:datas="leaveReaData"
								:class="{'speech-mode':screenIndex=='11'}"
								></singlehisto>
								<dateLap class="dateLap right20" width="140px" itemsD="1" v-model="dateLap4" @change="getleaveReaData()"/>
							</el-col>
							<el-col :span="12" class="padding-left-10" v-show="leaveEduData.length!=0">
								<inService
								id="turn-rate"
								title="员工流失率"  
								:show="checkFullshow" 
								:datas = turnRate
								ref="echart12" 
								screenIndex='12'
								@fullScreen="fullScreen"
								:class="{'speech-mode':screenIndex=='12'}"
								></inService>
							</el-col>
							<el-col :span="12" class="relative"  v-show="manageData.length!=0">
								<posnegBar 
								:show="checkFullshow" 
								ref="echart13" 
								title="人力资源报表" 
								screenIndex='13'
								:color="['#FF7676','#84EBFF','#40CDE9']"
								@fullScreen="fullScreen"
								id="manage-data"
								:datas="manageData"
								:class="{'speech-mode':screenIndex=='13'}"
								></posnegBar>
								<dateLap class="dateLap right20" width="140px" itemsD="1" v-model="dateLap5" @change="getmanageData()"/>
							</el-col>
							<el-col :span="12" class="padding-left-10 relative">
								<!-- <el-card class="box-card">
									<div>
										<div class="title">加班比率统计分析</div>
									</div>
									<div class="box-card-c flexProg">
										<div class="mr60" v-for="o in 4" :key="o">
											<el-progress type="circle" :percentage="percentage" stroke-width="15"></el-progress>
											<div class="depart">齿轮箱业务部</div>
										</div>
									</div>
								</el-card>
								<span class="iconAbso">
									<svg t="1566301956703" style="margin-right:10px;" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6739" width="16" height="16"><path d="M428 928H141.2l299.2-299.2c12.5-12.5 12.5-32.8 0-45.2s-32.8-12.5-45.2 0L96 882.7V598c0-17.7-14.3-32-32-32s-32 14.3-32 32v362c0 17.7 14.3 32 32 32h364c17.7 0 32-14.3 32-32s-14.3-32-32-32zM598 96h284.8L583.6 395.2c-12.5 12.5-12.5 32.8 0 45.2s32.8 12.5 45.2 0L928 141.3V424c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32H598c-17.7 0-32 14.3-32 32s14.3 32 32 32z" p-id="6740"></path></svg>
									<svg t="1566300364709" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5452" width="16" height="16"><path d="M344.9661875 31.5h336.35a12.0125 12.0125 0 0 1 12.0125 12.0125l-1.20125 472.3315h137.7233125a12.0125 12.0125 0 0 1 8.5889375 20.42125L520.40875 859.2213125a12.0125 12.0125 0 0 1-16.937625 0.1801875L172.2865 536.4454375a12.0125 12.0125 0 0 1 8.40875-20.6014375h152.2584375V43.5125c0-6.606875 5.405625-12.0125 12.0125-12.0125zM61.53125 932.4375h900.9375a30.03125 30.03125 0 1 1 0 60.0625H61.53125a30.03125 30.03125 0 1 1 0-60.0625z" p-id="5453"></path></svg>
								</span> -->
								<progre
								:show="checkFullshow" 
								ref="echart14" 
								title="加班比率统计分析" 
								screenIndex='14'
								@fullScreen="fullScreen"
								id="overtime-rate"
								:datas="overtimeRate"
								:color="['#58D8BE']"
								:class="{'speech-mode':screenIndex=='14'}"
								></progre>
								<dateLap class="dateLap" width="140px" itemsD="1" v-model="dateLap6" @change="getovertimeRate()"/>
							</el-col>
							<!-- <el-col :span="12" class="padding-left-10" v-show="rewarPunish.length!=0">
								<histogram 
								:show="checkFullshow" 
								ref="echart14" 
								title="人员奖惩情况统计" 
								screenIndex='14'
								:color="['#7DD453','#FF8D53']"
								@fullScreen="fullScreen"
								id="reward-punish"
								:datas="rewarPunish"
								:class="{'speech-mode':screenIndex=='14'}"
								></histogram>
							</el-col> -->
						</el-row>
					</el-scrollbar>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
	// import quickEntry from "./workbench/quickEntry"
	// import workSchedule from "./workbench/workSchedule"
	// import leaveList from "./workbench/leaveList"
	// import supplement from "./workbench/supplement"
	import dateLap from '@/components/Table/DateLap'
	import accident from "./workbench/accident"
	import personnel from "./workbench/personnel"
	import inService from "./dataAnalysis/inService"
	import pieChart from "./dataAnalysis/pieChart"
	import barChart from "./dataAnalysis/barChart"
	import histogram from "./dataAnalysis/histogram"
	import singlehisto from "./dataAnalysis/singlehisto"
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
				personnel:[],
				one:[],
				dateLap1:'',
				dateLap2:'',
				dateLap3:'',
				dateLap4:'',
				dateLap5:'',
				dateLap6:'',
				percentage:30
			};
		},
		components:{
			dateLap,
			// quickEntry,
			// workSchedule,
			// leaveList,
			// supplement,
			accident,
			personnel,
			inService,
			pieChart,
			barChart,
			histogram,
			singlehisto,
			posnegBar,
			progre,
			// sunbrust,
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
				this.memberData = await this.$request.get('/dataanalysis/directandindirectratiostat?org_id='+this.orgid);
				let per1 = this.memberData.map(o=>o.value)
				if(this.pre1!==[]){
					this.totalP1 = per1.reduce((tem,item,index)=>tem+item)
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
				this.leaveAcountData = await this.$request.get('/dataanalysis/outdutynumberstat?dateLap='+this.dateLap2);
				let per3 = this.leaveAcountData.map(o=>o.value)
				if(this.pre3!==[]){
					this.totalP3 = per3.reduce((tem,item,index)=>tem+item)
				}
			},
			async getleaveEduData(){
				this.leaveEduData = await this.$request.get('/dataanalysis/outdutyedutionstat?dateLap='+this.dateLap3);
			},
			async getleaveReaData(){
				this.leaveReaData = await this.$request.get('/dataanalysis/outdutyreasonstat?dateLap='+this.dateLap4);
			},
			async getturnRate(){
				this.turnRate = await this.$request.get('/dataanalysis/numberloseratiostat?org_id='+this.orgid);
			},
			async getmanageData(){
				this.manageData = await this.$request.get('/dataanalysis/hrreportstat?dateLap='+this.dateLap5);
			},
			async getovertimeRate(){
				this.overtimeRate = await this.$request.get('/dataanalysis/overtimeratiostat?dateLap='+this.dateLap6);
			},
			fetchData(){
				if(this.orgid!=''&&this.orgid!=undefined){
					this.getstaffData()
					this.getsexData()
					this.geteduLevelData()
					this.geteachageData()
					this.getleaveAcountData()
					this.getleaveEduData()
					this.getleaveReaData()
					this.getturnRate()
					this.getmanageData()
				}
			}
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
						if (_this.speechIndex<12) {
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
			this.dateLap1 = dayjs().format('YYYY-MM')
			this.dateLap2 = dayjs().format('YYYY-MM')
			this.dateLap3 = dayjs().format('YYYY-MM')
			this.dateLap4 = dayjs().format('YYYY-MM')
			this.dateLap5 = dayjs().format('YYYY-MM')
			this.dateLap6 = dayjs().format('YYYY-MM')
			this.fetchData()
			this.getleaveData()
			this.getmemberData()
			this.getovertimeRate()
		},
		async created(){
			this.data2 = await this.$request.get('org');
			let defaultMenuid = this.data2[0].orgid
			this.$refs.tree2.setCurrentKey(defaultMenuid);
			this.orgid = defaultMenuid;
			this.personnel = await this.$request.get('hrm/staffautoshiftremind');
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
	position: absolute;
	bottom: 40px;
	left: 0;
	right: 0;
	height: 0;
	display: flex;
	justify-content: center;
}
.relative{
	position: relative;
}
.dateLap{
	position: absolute;
	top: 23px;
	right: 90px;
}
.right20{
	right: 100px!important;
}
.depart{
	color: #4C5D66;
	text-align: center;
	margin-top: 5px;
}
.flexProg{
	display: flex;
	flex-wrap: wrap;
}
.title{
	font-family: 'Microsoft YaHei';
	font-size:18px;
	font-weight: bold;
	color: #303133;
	padding-bottom: 30px;
}
.mr60{
	margin-right:60px
}
.iconAbso{
	position: absolute;
	right: 40px;
	top: 30px;
}
</style>

<style lang="scss" scoped>
.box-card {
	width: 100%;
  margin-top: 10px;
  padding-top: 15px;
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