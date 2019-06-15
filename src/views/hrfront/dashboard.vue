<template>
	<div class="dashboard">
		<el-tabs v-model="activeName">
			<el-tab-pane label="工作台" name="workbench">
				<el-row>
				  <el-col :span="12">
					  <quickEntry></quickEntry>
				  </el-col>
				  <el-col :span="12">
					  <workSchedule></workSchedule>
				  </el-col>
				</el-row>
				<el-row>
				  <el-col :span="12">
					  <leaveList></leaveList>
				  </el-col>
				  <el-col :span="12">
					  <supplement></supplement>
				  </el-col>
				</el-row>
			</el-tab-pane>
			<el-tab-pane label="数据分析" name="dataAnalysis">
				<el-row>
				  <el-col :span="12">
						<el-popover
						  placement="bottom"
						  width="300"
						  trigger="click">
							<Org></Org>
						   <el-input 
						    slot="reference"
							size="small"
							style="width: 240px;"
							placeholder="深圳市兆威机电股份有限公司"
							suffix-icon="el-icon-caret-bottom">
						  </el-input>
						</el-popover>
                        <div class="selectdate">
							<DateLap></DateLap>
						</div>
				  </el-col>
				  <el-col :span="12" class="operating-btn">
                        <el-button plain icon="el-icon-video-play" @click="speechMode(speechIndex)">演讲模式</el-button>
						<!-- <el-button plain icon="el-icon-download" >全部下载</el-button> -->
				  </el-col>
				</el-row>
				<el-row>
				  <el-col :span="12">
                      <inService 
					  :show="checkFullshow" 
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
					   title="男女比列统计" 
					   id="men-and-women"
					   screenIndex='2'
					   @fullScreen="fullScreen"
					   :color="['#FF64C6','#3889FF']"
					   :datas="[{ value: 335, name: '男' },{ value: 634, name: '女' }]"
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
					   :datas="[{ value: 335, name: '博/硕' },{ value: 634, name: '本科' },{ value: 634, name: '大专' },{ value: 634, name: '高中/中专' },{ value: 634, name: '初中及以下' }]"
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
						id="egg-data"
						:class="{'speech-mode':screenIndex=='4'}"
						></barChart>
				  </el-col>
				</el-row>
			</el-tab-pane>
		</el-tabs>
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
	import DateLap from "@/components/Table/DateLap.vue"
	import inService from "./dataAnalysis/inService"
	import pieChart from "./dataAnalysis/pieChart"
	import barChart from "./dataAnalysis/barChart"
	import Org from "@/components/Org/Org.vue"
	
	import screenfull from "screenfull";
  export default {
    data() {
      return {
		activeName: 'workbench',
        value: '',
		screenIndex:"",
		checkFullshow:true,
		speechIndex:1,
		fulltype:false
      };
    },
	components:{
		quickEntry,
		workSchedule,
		leaveList,
		supplement,
		DateLap,
		inService,
		pieChart,
		barChart,
		Org
	},
    methods: {
		speechMode(id){
			screenfull.toggle();
			this.speechSwitch(id);
		},
		speechSwitch(id){
			this.screenIndex=id;
			//console.log(this.$refs.aaaa1.init)
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
		/**
		 * 是否全屏并按键ESC键的方法
		 */
		checkFull() {
		  var isFull = window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
		  // to fix : false || undefined == undefined
		  if (isFull === undefined) {
			  isFull = false;
		  }
		  // console.log(document.fullscreenEnabled , window.fullScreen , document.webkitIsFullScreen , document.msFullscreenEnabled);
		  // console.log(isFull);
		  return isFull;
		}
    },
	mounted() {
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
   //          window.dispatchEvent(myEvent);
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
	}
  };
</script>
<style>
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
	.dashboard{
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