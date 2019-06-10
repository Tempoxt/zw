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
						<el-select v-model="value" placeholder="请选择">
							<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
                        <div class="selectdate">
							<DateLap></DateLap>
						</div>
				  </el-col>
				  <el-col :span="12" class="operating-btn">
                        <el-button plain icon="el-icon-video-play" >演讲模式</el-button>
						<el-button plain icon="el-icon-download" >全部下载</el-button>
				  </el-col>
				</el-row>
				<el-row>
				  <el-col :span="12">
                      <inService></inService>
				  </el-col>
				  <el-col :span="12" class="padding-left-10">
                       <pieChart 
					   title="男女比列统计" 
					   id="men-and-women" 
					   :color="['#FF64C6','#3889FF']"
					   :datas="[{ value: 335, name: '男' },{ value: 634, name: '女' }]"
					   ></pieChart>
				  </el-col>
				</el-row>
				<el-row>
				  <el-col :span="12">
					   <pieChart
					    title="学历分布统计" 
					   id="education"
					   :datas="[{ value: 335, name: '博/硕' },{ value: 634, name: '本科' },{ value: 634, name: '大专' },{ value: 634, name: '高中/中专' },{ value: 634, name: '初中及以下' }]"
					   ></pieChart>
				  </el-col>
				  <el-col :span="12" class="padding-left-10">
                        <barChart title="各年龄段男女占比统计" id="egg-data"></barChart>
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
  export default {
    data() {
      return {
				activeName: 'workbench',
				options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: ''
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
		barChart
	},
    methods: {
    }
  };
</script>
<style>
.dashboard .selectdate .el-date-editor{
      width: 120px;
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
	}
	
</style>