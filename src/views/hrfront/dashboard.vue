<template>
	<div class="dashboard" >
<!-- <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll"> -->
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
							</el-row>
					</el-scrollbar>

				</div>
		
			</el-tab-pane>

			<el-tab-pane label="数据分析" name="dataAnalysis">
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
								<!-- <org v-model="orgid"></org> -->
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
							<!-- <div class="selectdate">
								<DateLap></DateLap>
							</div> -->
						</el-col>
					</el-form>
				  <el-col :span="12" class="operating-btn">
                        <el-button plain icon="el-icon-video-play" @click="speechMode(speechIndex)">演讲模式</el-button>
						<!-- <el-button plain icon="el-icon-download" >全部下载</el-button>-->
				  </el-col>
				</el-row>
				<el-row>
				  <el-col :span="12">
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
				  </el-col>
				  <el-col :span="12" class="padding-left-10">
                       <pieChart  
					   :show="checkFullshow"
					   ref="echart2"
					   title="男女比例统计" 
					   id="men-and-women"
					   screenIndex='2'
					   @fullScreen="fullScreen"
					   :color="['#3889FF','#FF64C6']"
					   :datas="sexData"
					   :class="{'speech-mode':screenIndex=='2'}"
					   ></pieChart>
				  </el-col>
				</el-row>
				<el-row>
				  <el-col :span="12">
					   <pieChart 
					   :show="checkFullshow"
					    ref="echart3"
					    title="学历分布统计" 
					   id="education"
					   screenIndex='3'
					   @fullScreen="fullScreen"
					   :datas="eduLevelData"
					    :class="{'speech-mode':screenIndex=='3'}"
					   ></pieChart>
				  </el-col>
				  <el-col :span="12" class="padding-left-10">
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
				</el-row>
			</el-tab-pane>
			
		</el-tabs>
		<!-- </el-scrollbar> -->
	</div>
<!--    <div style="width:300px">
        <el-progress :text-inside="true" :stroke-width="18" :percentage="0" style="margin-bottom:10px"></el-progress>
        <el-progress :text-inside="true" :stroke-width="18" :percentage="70" style="margin-bottom:10px"></el-progress>
        <el-progress :text-inside="true" :stroke-width="18" :percentage="80" color="rgba(142, 113, 199, 0.7)" style="margin-bottom:10px"></el-progress>
        <el-progress :text-inside="true" :stroke-width="18" :percentage="100" status="success" style="margin-bottom:10px"></el-progress>
        <el-progress :text-inside="true" :stroke-width="18" :percentage="50" status="exception" style="margin-bottom:10px"></el-progress>
    </div> -->
</template>
<script>
	import quickEntry from "./workbench/quickEntry"
	import workSchedule from "./workbench/workSchedule"
	import leaveList from "./workbench/leaveList"
	import supplement from "./workbench/supplement"
	import accident from "./workbench/accident"
	import inService from "./dataAnalysis/inService"
	import pieChart from "./dataAnalysis/pieChart"
	import barChart from "./dataAnalysis/barChart"
	import Org from "@/components/Org/Org.vue"
	import org from '@/views/public/org'
	
	import * as api_common from "@/api/common";
	import * as api_org from "@/api/org";
	import table_mixin from "@c/Table/table_mixin";
	
	import screenfull from "screenfull";
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
		staffData:[],
		sexData:[],
		eduLevelData:[],
		eachageData:{},
		orgid:'',
		input5:'',
		filterText:'',
		visible:false,
		data2:[],
		form:{}
      };
    },
	components:{
		quickEntry,
		workSchedule,
		leaveList,
		supplement,
		accident,
		inService,
		pieChart,
		barChart,
		Org,
		org
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
		  // to fix : false || undefined == undefined
		  if (isFull === undefined) {
			  isFull = false;
		  }
		  // console.log(document.fullscreenEnabled , window.fullScreen , document.webkitIsFullScreen , document.msFullscreenEnabled);
		  // console.log(isFull);
		  return isFull;
		},
		async fetchData(){
			if(this.orgid!=''&&this.orgid!=undefined){
				const analysis = await this.$request.get('/dataanalysis/datastat?org_id='+this.orgid);
				this.staffData = analysis.staff_stat
				this.sexData = analysis.sex_stat;
				this.eduLevelData = analysis.eduLevel_stat;
				this.eachageData = analysis.each_age_sex_stat
			}
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
               console.log(e.keyCode)
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
				   console.log(_this.speechIndex)
			   	if (_this.speechIndex<4) {
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
        this.data2 = await this.$request.get('org');
        let defaultMenuid = this.data2[0].orgid
        this.$refs.tree2.setCurrentKey(defaultMenuid);
        this.orgid = defaultMenuid;
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
	height: 340px;
}
.dashboard .speech-mode .el-card__body{
	height: 100%;
}

.dashboard .speech-mode .el-card__body .box-card-c{
	height: 100%;
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