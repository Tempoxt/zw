<template>
	<div class="dashboard" >
		<el-tabs v-model="activeName">
			<el-tab-pane label="工作台" name="workbench">
				<div class="outside">
					<el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
						<el-row style="padding-bottom:30px;">
							<el-col :span="12" v-if="infoData1.length!=0">
								<reemployee title="无银行卡员工" info="NoBankCard" :infoData="infoData1"></reemployee>
							</el-col>
							<el-col :span="12" v-if="infoData2.length!=0">
								<reemployee title="工薪单未签名员工" info="PayrollUnsign" :infoData="infoData2"></reemployee>
							</el-col>
							<el-col :span="12" v-if="infoData3.length!=0">
								<reemployee title="入职工薪单未提交员工" info="PayrollUnsubmit" :infoData="infoData3"></reemployee>
							</el-col>
							<el-col :span="12" v-if="infoData4.length!=0">
								<reemployee title="工资未签收员工" info="SalaryUnsign" :infoData="infoData4"></reemployee>
							</el-col>
						</el-row>
					</el-scrollbar>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import * as api_common from "@/api/common";
import * as api_org from "@/api/org";
import table_mixin from "@c/Table/table_mixin";
import screenfull from "screenfull";
import reemployee from "./remind/reemployee";
export default {
    data() {
      return {
		activeName: 'workbench',
		infoData1:[],
		infoData2:[],
		infoData3:[],
		infoData4:[],
      };
    },
	components:{
		reemployee,
	},
    methods: {
		
    },
	async created(){
		// if(this.info&&this.info=='NoBankCard'){
			this.infoData1 = await this.$request.get('salary/noBankCard');
		// }else if(this.info&&this.info=='PayrollUnsign'){
			this.infoData2 = await this.$request.get('salary/unsignworksalarylist');
		// }else if(this.info&&this.info=='PayrollUnsubmit'){
			this.infoData3 = await this.$request.get('salary/unsubmitdutyworksalary');
		// }else if(this.info&&this.info=='SalaryUnsign'){
			this.infoData4 = await this.$request.get('salary/salarynosign');
		// }
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
	.el-card__header{
		padding: 15px 20px;
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
	.el-card__body {
		height: 360px;
	}
	.speech-mode .el-card__body{
		height: 100%;
		.box-card-c{
			height: 100%;
		}
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
	.el-row .el-col:nth-child(2n){
		padding-left: 10px;
	}
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
}
</style>