<template>
  	<div class="outside">
		<div class="dashboard">
			<el-popover popper-class="maxheight"
				placement="bottom" width="300"
				style="height:500px" trigger="click" v-model="visible" >
				<el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
					<div style="padding:20px">
						<div class="side-header">
							<el-input placeholder="快速查找" v-model="filterText" class="input" >
								<i slot="suffix" class="el-input__icon el-icon-search" ></i>
							</el-input>
						</div>
						<el-tree
							class="tree" :data="data2"
							:props="{ children: 'subs', label: 'name' }"
							default-expand-all node-key="orgid"
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
					suffix-icon="el-icon-caret-bottom"
				>
				</el-input>
            </el-popover>

			<el-select v-model="course" placeholder="请选择" filterable style="margin-left:20px">
				<el-option
					v-for="item in courseData"
					:key="item.course"
					:label="item.subject"
					:value="item.course">
				</el-option>
			</el-select>
			<el-scrollbar
				wrap-class="scrollbar-wrapper"
				class="scroll"
				style="padding-bottom:30px"
			>
				<el-row class="elCol">
					<!-- <el-col :span="12" class="relative">
						<singlehisto title="2020实际预算月对比"
							ref="echart1"
							:show="checkFullshow"
							screenIndex="1"
							id="actual"
							:datas="actualBudget"
							:color="['#44E594']"
						></singlehisto>
					</el-col> -->
					<el-col :span="12" class="relative">
						<!-- <div style="display:flex;justify-content: center;">
							<canvas id="chartId" width="600" height="350"></canvas>
						</div> -->
						<barChartX title="月预算费用与实际费用对比"
							ref="echart1"
							:show="checkFullshow"
							screenIndex="1"
							id="monthBudget"
							:datas="monthDetail"
							:color="['#F9C855','#44E594']"
						></barChartX>
						<div style="position: absolute;top:90px;left:0;right:0;margin:0 auto;font-size:12px;display:flex;justify-content:center" v-if="this.monthDetail && this.monthDetail.last_month">
							<span>{{this.lastMonth}}月预算数：</span><span style="color:#FF8000">{{this.monthDetail.last_month.bud_num}}</span>
							<span style="margin-left:20px"> <img :src="this.monthDetail.last_month.bud_tag==='up'?require('@/assets/up.png'):require('@/assets/down.png')" alt="" width="6" height="12"></span>
							<span style="margin-left:7px">{{this.monthDetail.last_month.bud_ratio}}</span>
							<span style="margin-left:40px">{{this.lastMonth}}月实际数：</span><span style="color:#18CC72">{{this.monthDetail.last_month.act_num}}</span>
							<span style="margin-left:20px"> <img :src="this.monthDetail.last_month.act_tag==='up'?require('@/assets/up.png'):require('@/assets/down.png')" alt="" width="6" height="12"></span>
							<span style="margin-left:7px">{{this.monthDetail.last_month.act_ratio}}</span>
						</div>
						<el-date-picker
							v-model="dateLap1" class="dateLap"
							type="month" width="140px"
							placeholder="选择月" value-format="yyyy-MM" 
							@change="getMonthBudget()">
						</el-date-picker>
					</el-col>
					<el-col :span="12" class="relative">
						<barChartX title="预算费用与实际费用累计对比"
							ref="echart2"
							:show="checkFullshow"
							screenIndex="2"
							id="budge2"
							:datas="actualCompare"
							:color="['#F9C855','#44E594']"
						></barChartX>
						<div style="position: absolute;top:90px;left:0;right:0;margin:0 auto;font-size:12px;display:flex;justify-content:center" v-if="this.actualCompare && this.actualCompare.last_month">
							<span style="margin-right:20px">{{this.lastYear}}</span>月预算数：<span style="color:#FF8000">{{this.actualCompare.last_month.bud_num}}</span>
							<span style="margin-left:20px"> <img :src="this.actualCompare.last_month.bud_tag==='up'?require('@/assets/up.png'):require('@/assets/down.png')" alt="" width="6" height="12"></span>
							<span style="margin-left:7px">{{this.actualCompare.last_month.bud_ratio}}</span>
							<span style="margin-left:40px">月实际数：</span><span style="color:#18CC72">{{this.actualCompare.last_month.act_num}}</span>
							<span style="margin-left:20px"> <img :src="this.actualCompare.last_month.act_tag==='up'?require('@/assets/up.png'):require('@/assets/down.png')" alt="" width="6" height="12"></span>
							<span style="margin-left:7px">{{this.actualCompare.last_month.act_ratio}}</span>
						</div>
						<el-date-picker class="dateLap"
							v-model="dateLap2"
							type="monthrange"
							range-separator="至"
							start-placeholder="开始月份"
							end-placeholder="结束月份"
							@change="getActualCompare()"
							value-format="yyyy-MM">
						</el-date-picker>
					</el-col>
					<el-col :span="12" class="relative">
						<barChart title="预算费用与实际费用对比"
							ref="echart3"
							:show="checkFullshow"
							screenIndex="3"
							id="budge"
							:datas="budgetCompare"
							:color="['#F9C855','#44E594']"
						></barChart>
						<el-date-picker
							v-model="dateLap3" class="dateLap"
							type="year" width="140px"
							placeholder="选择年"
							@change="getBudgetCompare()">
						</el-date-picker>
					</el-col>
					<!-- <el-col :span="12" class="relative">
						<singlehisto title="各部门实际费用"
							ref="echart4"
							:show="checkFullshow"
							screenIndex="4"
							id="detail"
							:datas="departDetail"
							:color="['#44E594']"
						></singlehisto>
						<dateLap
							class="dateLap"
							width="140px"
							itemsD="1"
							v-model="dateLap4"
							@change="getDetail()"
						/>
					</el-col> -->
				</el-row>
			</el-scrollbar>
		</div>
	</div>
</template>
<script>
import * as api_common from "@/api/common";
import dateLap from "@/components/Table/DateLap";
import dayjs from 'dayjs'
import singlehisto from './singlehisto'
import barChart from './barChart'
import barChartX from './barChartX'
export default {
    components:{
        // singlehisto,
		// dateLap,
		barChart,
		barChartX,
    },
	data() {
		return {
			// api_resource,
            checkFullshow: true,
			departDetail: [],
			dateLap1: '',
			dateLap2: [],
			dateLap3: '',
			dateLap4: '',
			// orgid1: 's1',
			actualBudget: [],
			orgid: "",
			input5: "",
			filterText: "",
			visible: false,
			data2: [],
			budgetCompare: [],
			monthDetail: [],
			actualCompare: [],
			lastMonth: '',
			course: '',
			courseData: [],
			lastYear: ''
		};
	},
	watch: {
		async orgid() {
			// this.getActualBudget();
			this.visible = false;
			this.findDataName();
			await this.getMonthBudget()
			await this.getActualCompare()
			await this.getBudgetCompare()
		},
		filterText(val) {
			this.$refs.tree2.filter(val);
		},
		async course(){
			await this.getMonthBudget()
			await this.getActualCompare()
			await this.getBudgetCompare()
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
					if (row["orgid"] == orgid) {
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
		handleChangeNode(val) {
			this.orgid = val.orgid;
		},
		changeOrg(orgid) {
			this.orgid = orgid;
		},
		filterNode(value, data) {
			if (!value) return true;
			return data.name && data.name.indexOf(value) !== -1;
		},
		async getMonthBudget(){//月预算费用与实际费用对比
			this.monthDetail = await this.$request.get('/budgetcontrol/currentmonthactualandbudget',{params:{
				dateLap: this.dateLap1,
				orgid: this.orgid,
				course: this.course
			}})
			this.lastMonth = +this.dateLap1.split('-')[1]-1
		},
		async getActualCompare(){//预算费用与实际费用累计对比
			let data = {
				dateLap: this.dateLap2,
				orgid: this.orgid,
				course: this.course
			}
			this.actualCompare = await this.$request.get('/budgetcontrol/actualandbudgetcumulativecomparison',{params:data})
			let year1 = +this.dateLap2[0].split('-')[0]-1
			let month1 = +this.dateLap2[0].split('-')[1]
			if(month1<10){
				month1 = '0'+month1
			}
			let year2 = +this.dateLap2[1].split('-')[0]-1
			let month2 = +this.dateLap2[1].split('-')[1]
			if(month2<10){
				month2 = '0'+month2
			}
			this.lastYear = year1+'-'+month1 + '至'+year2+'-'+month2
		},
		// async getActualBudget(){ //2020年实际预算月对比
		// 	this.actualBudget = await this.$request.get('/budgetcontrol/actualbudgetmonthcomparison',{params:{
		// 		orgid: this.orgid
		// 	}})
		// },
		async getBudgetCompare(){ //预算费用与实际费用年对比
			this.dateLap3 = dayjs(this.dateLap3).format('YYYY')
			this.budgetCompare = await this.$request.get('/budgetcontrol/actualandbudgetmonthsoftheyear',{params:{
				orgid: this.orgid,
				dateLap: this.dateLap3,
				course: this.course
			}})
		},
		async getDetail(){//各部门实际费用
			this.departDetail = await this.$request.get('/budgetcontrol/actualcostofeachdepartment',{params:{
				dateLap: this.dateLap4
			}})
		},
	},
	async created() {
		this.courseData = await this.$request.get('/budgetcontrol/showsubjects')
		this.course = this.courseData[0].course
		// const { field, action,table } = await api_common.menuInit(this.url);
		// this.table_field = field;
		// this.table_actions = action;
		// this.table_config = table
		this.data2 = await this.$request.get("org/tree");
		let defaultMenuid = this.data2[0].orgid;
		this.$refs.tree2.setCurrentKey(defaultMenuid);
		this.orgid = defaultMenuid;
		this.dateLap1 = this.dateLap4 = dayjs().subtract(1,'month').format('YYYY-MM')
		this.dateLap3 = dayjs().subtract(1,'month').format('YYYY')
		this.dateLap2 = [dayjs().month(0).format('YYYY-MM'),dayjs().format('YYYY-MM')]
		// await this.getActualBudget();
		// await this.getMonthBudget()
		// await this.getActualCompare()
		// await this.getBudgetCompare()
		// await this.getDetail();
	}
};
</script>
<style lang="scss">
.outside {
    // height: 830px;
	height: 100%;
    background: #f5fafb;
    
    .elCol{
        .el-card__body{
            padding: 0 0 0 20px;
        }
    }
}
.maxheight {
  height: 500px;
}

</style>
<style lang="scss" scoped>
.outside{
	.el-row .el-col:nth-child(2n){
		padding-left: 10px;
	}

    .box-card {
        width: 100%;
        margin-top: 10px;
        padding-top: 15px;
        .box-card-c.box-card-c2 {
            height: 100%;
        }
        .box-card-c {
            height: 350px;
        }
    }
    .scroll {
        height: calc(100% - 30px);
        width: 100%;
        /deep/ .scrollbar-wrapper {
            overflow-x: hidden;
        }
    }
    .dashboard {
        background: #f5fafb;
        height: 100%;
        padding: 20px;
        .selectdate {
            display: inline-block;
            margin-left: 60px;
        }
        .padding-left-10 {
            padding-left: 10px;
        }
        .speech-mode {
            position: fixed;
            top: 0;
            left: 0;
            margin-top: 0;
            z-index: 99;
            width: 100%;
            height: 100%;
        }
        .dateLap {
            position: absolute;
            top: 23px;
            right: 17px;
			.el-input__inner{
				width: 140px;
			}
        }
        .relative {
            position: relative;
        }
    }
}
</style>
