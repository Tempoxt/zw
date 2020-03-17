  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  >

    <table-header
		:table_actions="table_actions"
		:table_selectedRows="table_selectedRows"
		@action="handleAction"
		:table_form.sync="table_form"
		:table_column="table_field"
		>
		<div style="padding-left:10px;display:flex;align-items:center">
			收款日期：<dateLap v-model="table_form.dateLap" @change="fetch"/>
		</div>
    </table-header>
    <el-table
        ref="elTable"
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
			<each-table-column :table_field="table_field" :template="template"/>
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
import dayjs from 'dayjs'
export default {
	mixins: [table_mixin],
	props:['url','m'],
	data() {
		return {
			loading: true,
			api_resource: api_common.resource(this.url),
			queryDialogFormVisible: true,
			table_topHeight: 293,
			template: {
				unpaidAmount(row,column){ //未收款金额
					if(column.unpaidAmount != 0 ){
						return <span style="color:#F2353C" title={column.unpaidAmount}>{column.unpaidAmount}</span>
					}else{
						return <span title={column.unpaidAmount}>{column.unpaidAmount}</span>
					}
				},
				paidAmount(row,column){ //已收款金额
					if(column.unpaidAmount != 0 ){
						return <span style="color:#F2353C" title={column.paidAmount}>{column.paidAmount}</span>
					}else{
						return <span style="color:#18CC72" title={column.paidAmount}>{column.paidAmount}</span>
					}
				},
				// paidAmount(row,column){ //分配金额  人民币无税出货金额 - 分配金额 !=0
				// 	if(column.unpaidAmount - column.paidAmount != 0 ){
				// 		return <span style="color:#F2353C" title={column.paidAmount}>{column.paidAmount}</span>
				// 	}else{
				// 		return <span style="color:#18CC72" title={column.paidAmount}>{column.paidAmount}</span>
				// 	}
				// }
			}
		};
	},
	watch:{
		url(){
			this.api_resource = api_common.resource(this.url),
			delete this.table_form.keyword
			this.table_form.currentpage = 1
			this.table_form.query.query= []
			this.fetchMenu()
		}
	},
	methods: {
        fetch(){
            this.table_form.currentpage = 1
            this.fetchTableData()
		},
		async fetchTableData() {
			this.table_loading = true;
			const {rows , total } = await this.api_resource.get(this.table_form)
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
    	},
		async fetchMenu(){
			const { field, action,table } = await api_common.menuInit(this.url);
			this.table_field = field;
			this.table_actions = action;
			this.table_config = table
			this.fetchTableData();
		}
	},
	async created() {
		this.table_form.dateLap = dayjs().subtract(1,'month').format('YYYY-MM') 
		await this.fetchMenu()
	}
};
</script>


