  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  class="mini-table"
  >

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
    	>
		<el-table-column 
			type="selection" 
			width="60" 
			class-name="table-column-disabled"
			:selectable="table_disable_selected"
			>
		</el-table-column>
		<el-table-column type="index" :index="indexMethod" width="70"/>
		<each-table-column :table_field="table_field.filter(o=>!['used_days','remain_days','remark'].includes(o.name))"/>
		<el-table-column prop="used_days" label="已休天数">
			<template slot-scope="scope">
				<el-popover v-if="scope.row.used_days>0" ref="popover" @show="showPopover(scope.row)" placement="bottom" width="600" trigger="click" transition="el-zoom-in-top">
					<el-table :data="gridData">
						<el-table-column width="100" property="applyDate" label="申请日期"></el-table-column>
						<el-table-column width="110" property="startDate" label="年休假开始日期"></el-table-column>
						<el-table-column width="80" property="startTime" label="年休假开始时间"></el-table-column>
						<el-table-column width="110" property="endDate" label="年休假结束日期"></el-table-column>
						<el-table-column width="80" property="endTime" label="年休假结束时间"></el-table-column>
						<el-table-column width="80" property="days" label="休假天数"></el-table-column>
					</el-table>
					<el-button type="text" slot="reference" style="color:#1FD361;line-height:0px;width:100%;text-align:left">{{scope.row.used_days}}</el-button>
				</el-popover>
				<span v-else>{{scope.row.used_days}}</span>
            </template>
		</el-table-column>
		<el-table-column prop="remain_days" label="剩余天数">
			<template slot-scope="scope">
				<span>{{scope.row.remain_days}}</span>
			</template>
		</el-table-column>
		<el-table-column prop="remark" label="备注">
			<template slot-scope="scope">
				<span>{{scope.row.remark}}</span>
			</template>
		</el-table-column>
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
const api_resource = api_common.resource("hrm/yearholidaymanager");
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
			gridData: [],
		};
	},
	watch:{
		id(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
	},
	methods: {
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		async showPopover(data){
			this.gridData = await this.$request.get('hrm/yearholidaymanager/'+data.employeeCode+'?dateLap='+this.table_form.dateLap)
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
		const { field, action,table } = await api_common.menuInit("hrm/yearholidaymanager");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.table_form.dateLap = dayjs().format('YYYY')
		this.fetchTableData();
	}
};
</script>


