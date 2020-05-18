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
		<div style="padding-left:10px">
			<dateLap type="2" v-model="table_form.dateLap" @change="fetch"/>
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
      	:show-summary="table_config.isShowFooter"
      	:summary-method="getSummaries"
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
const api_resource = api_common.resource("attendance/extraovertime");
// import importForm from '../finance/financialSheet/importForm'
// import { MessageBox } from 'element-ui';
import dayjs from 'dayjs'
export default {
	mixins: [table_mixin],
	props:['id','flag'],
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
			info:{},
			table_topHeight:293,
		};
	},
	watch:{
		id(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		flag(){
			delete this.table_form.keyword
			delete this.table_form.sortname
			this.table_form.currentpage = 1
			this.table_form.query.query= []
			this.table_form.flag = this.flag
			this.fetchMenu()
		}
	},
	methods: {
		batchsettlement(){
      		let rows = this.table_selectedRows.map(row=>row.id)
			this.$confirm('确定申请结算?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(async () => {
				console.log(rows)
				const mes = await this.$request.post('/attendance/extraovertime',{
					dateLap: this.table_form.dateLap,
					ids: rows
				})
				this.$message.success(mes)
				// return this.api_resource.remove(rows.join(','))
			})
			.then(() => {
				this.fetchTableData()
			})
		},
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		async fetchTableData() {
			if(!this.id){
				return
			}
			this.table_loading = true;
			this.table_form.orgid = this.id
			this.table_form.flag = this.flag
			const {rows , total }= await api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
		async fetchMenu(){
			const { field, action,table } = await api_common.menuInit("atten_extraovertime"+this.flag);
			this.table_field = field;
			this.table_actions = action;
			this.table_config = table
			setTimeout(()=>{
				this.fetchTableData()
			},500)
		}
	},
	async created() {
		this.table_form.dateLap = dayjs().format('YYYY-MM')
		await this.fetchMenu()
	}
};
</script>


