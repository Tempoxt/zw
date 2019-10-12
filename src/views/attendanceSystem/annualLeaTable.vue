  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  >
  	<!-- 员工年假明细 -->
	<div>
		<Drawer :closable="false" width="640" v-model="openDrawers">
			<p class="detail fontStyle"><span style="color:#37474F"></span>员工年假明细</p>
			<div class="demo-drawer-profile mt60">
				<div v-for="(item,index) in holidayData" :key="index" style="padding-bottom:1px;border-bottom:1px dashed #A3AFB7">
					<p class="info">{{item.desc}}   第{{item.workAge}}年</p>
					<p class="mt1 time">开始时间: {{item.yearStartDate}} ~ {{item.yearEndDate}}</p>
					<div class="fontStyle mt10 mb20">
						<span>年假天数: {{item.yearDays}}</span>
						<span class="ml80">已休天数: {{item.usedDay}}</span>
						<span class="ml80">未休天数: {{item.remainDay}}</span>
					</div>
					<el-collapse v-if="item.detail.length!=0" v-model="activeNames" @change="handleChange">
						<el-collapse-item title="休假明细" :name="String(index)">
							<div style="margin-left:70px">
								 <el-timeline :reverse="reverse">
									<el-timeline-item
									v-for="(activity, idx) in item.detail"
									:key="idx">
									{{activity.startDate}}  {{activity.startTime}} ~ {{activity.endDate}}  {{activity.endTime}}<span style="margin-left:15px">{{activity.days}}天</span>
									</el-timeline-item>
								</el-timeline>
							</div>
						</el-collapse-item>
					</el-collapse>

				</div>
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


