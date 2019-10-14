  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  >
  	<!-- 员工年假明细 -->
	<div>
		<Drawer title="员工年假明细" :closable="false" width="640" v-model="openDrawers" class="drawerInfo">
			<div style="background: #f8f8f8;">
				<el-row :gutter="20">
					<el-col :span="3" class="imgFlex">
						<img src="@/assets/avatar.png" alt="" srcset="" class="imgAvatar">
					</el-col>
					<el-col :span="6" class="userInfo">
						<p>姓名: {{info.chineseName}}</p>
						<p>工号: {{info.employeeCode}}</p>
					</el-col>
					<el-col :span="6" class="userInfo">
						<p>部门: {{info.department_name}}</p>
						<p>职位: {{info.job_name}}</p>
					</el-col>
					<el-col :span="6" class="userInfo">
						<p>&nbsp;</p>
						<p>入职日期: {{info.onDutyTime}}</p>
					</el-col>
				</el-row>
			</div>
			<div v-for="(item,index) in holidayData" :key="index" v-show="item.workAge!=0" class="infoDetail">
				<p class="info"><span style="font-size:14px;font-weight:normal">{{item.desc}}</span>   第{{item.workAge}}年</p>
				<p class="mt1 time">开始时间: {{item.yearStartDate}} ~ {{item.yearEndDate}}</p>
				<el-row :gutter="20" class="fontStyle mt10 ">
					<el-col :span="7">年假天数: {{item.yearDays}}</el-col>
					<el-col :span="7">已休天数: {{item.usedDay}}</el-col>
					<el-col :span="7">未休天数: {{item.remainDay}}</el-col>
				</el-row>
				<el-collapse v-if="item.detail.length!=0" v-model="activeNames" @change="handleChange">
					<el-collapse-item title="休假明细" :name="String(index)">
						<div style="margin-left:70px">
								<el-timeline :reverse="reverse">
								<el-timeline-item
								v-for="(activity, idx) in item.detail"
								:key="idx">
									<span style="color:#808080">{{activity.startDate}}  {{activity.startTime}} ~ {{activity.endDate}}  {{activity.endTime}}
										<span style="margin-left:15px">{{activity.days}}天</span>
									</span>
								</el-timeline-item>
							</el-timeline>
						</div>
					</el-collapse-item>
				</el-collapse>

				<div class="divider"></div>
			</div>
		</Drawer>
	</div>

    <table-header
		:table_actions="table_actions"
		:table_selectedRows="table_selectedRows"
		@action="handleAction"
		:table_form.sync="table_form"
		:table_column="table_field"
		>
		<div style="padding-left:10px">
			<dateLap :disabled="true" type="3" v-model="table_form.dateLap" @change="fetch"/>
		</div>
    </table-header>
    <el-table
		@selection-change="handleChangeSelection"
		:data="table_data"
		border
		style="width: 100%"
		v-loading="table_loading"
		:header-cell-style="headerCellStyle"
		:height="table_height"
		@header-dragend="table_dragend"
		@sort-change="table_sort_change"
		@cell-click="openDrawer"
		:cell-style="cellStyle"
    	>
		<el-table-column 
			type="selection" 
			width="60" 
			class-name="table-column-disabled"
			:selectable="table_disable_selected"
			>
		</el-table-column>
		<el-table-column type="index" :index="indexMethod" width="70"/>
		<each-table-column :table_field="table_field"/>
    </el-table>
    <table-pagination 
        :total="table_form.total" 
        :pagesize.sync="table_form.pagesize"
        :currentpage.sync="table_form.currentpage"
        @change="fetchTableData"
        :table_config="table_config"
    />
  </ui-table>
</template>
<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
const api_resource = api_common.resource("holidaymanager/holidaystat");
import dayjs from 'dayjs'
export default {
	mixins: [table_mixin],
	props:['id'],
	data() {
		return {
			loading: true,
			api_resource,
			queryDialogFormVisible:true,
			visible:false,
			holidayData: [],
			openDrawers: false,
			activeNames: ['0'],
			reverse: true,
			info:{}
		};
	},
	watch:{
		id(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
	},
	methods: {
		handleChange(val) {
			console.log(val);
		},
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		async openDrawer(row,column,cell,event){
			if(row.usedDay==event.target.innerHTML){
				this.openDrawers = true
				this.holidayData = await this.$request.get('holidaymanager/holidaystat/'+row.employeeCode)
				this.info = this.holidayData[0]
			}
		},
		cellStyle({row, column, rowIndex, columnIndex}){
			if(column.label == '已休天数'){
				return 'color:#1FD361;cursor:pointer'
			}else{
				return  ''
			}
		},
		async fetchTableData() {
			if(!this.id){
				return
			}
			this.table_loading = true;
			this.table_form.org_id = this.id
			const {rows , total }= await api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
	},
	async created() {
		const { field, action,table } = await api_common.menuInit("holidaymanager/holidaystat");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.table_form.dateLap = dayjs().format('YYYY')
		this.fetchTableData();
	}
};
</script>
<style lang="scss">
    .drawerInfo .ivu-drawer-body {
        padding:0;
    }
</style>
<style>
    .drawerInfo .ivu-drawer-header{
        background: rgba(245,250,251,1)
    }
    .infoDetail{
        padding: 0 20px ; 
    }
    .imgFlex{
        display: flex;
        align-items: center;
        height: 70px;
        margin-left: 15px;
    }
    .imgAvatar{
        width: 50px;
        height: 50px;
    }
    .userInfo{
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 70px;
        line-height: 26px;
    }
    .info{
        color: #0BB2D4;
        font-size: 16px;
        font-weight: bold;
        margin: 20px 0 10px 2px;
    }
    .el-collapse-item__header{
        position: relative;
    }
    .el-collapse-item__header .el-collapse-item__arrow{
        position: absolute;
        left: 65px;
    }
    .drawerInfo .el-collapse,.drawerInfo .el-collapse-item__wrap,.drawerInfo .el-collapse-item__header{
        border: 0!important;
    }
    .drawerInfo .el-collapse-item__content{
        padding-bottom:0
    }
    .drawerInfo .el-timeline-item__wrapper{
        top: -5px!important;
    }
    .fontStyle{
        color: #37474F;
        font-size: 14px;
    }
    .divider {
        width: 100%;
        border-bottom: 1px dashed #A3AFB7;
        height:1px;
        margin-top: 20px;
    }
    .time{
        color: #A3AFB7;
        font-size: 12px;
    }
    .mt10{margin-top: 10px;}
</style>


