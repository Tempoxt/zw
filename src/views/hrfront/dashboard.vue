<template>
	<div class="dashboard">
		<el-tabs v-model="activeName" @tab-click="handleClick">
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
			<el-tab-pane label="数据分析" name="dataAnalysis">数据分析</el-tab-pane>
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
	
  export default {
    data() {
      return {
        activeName: 'workbench'
      };
    },
	components:{
		quickEntry,
		workSchedule,
		leaveList,
		supplement
	},
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>
<style lang="scss" scoped>
	.dashboard{
		padding: 20px;
	}
	
</style>