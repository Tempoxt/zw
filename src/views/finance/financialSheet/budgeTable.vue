  <template>
  <ui-table
  ref="table"
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
			<dateLap v-model="table_form.dateLap" @change="fetch"/>
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
const api_resource = api_common.resource("u8report/budgetreport");
import dayjs from 'dayjs'
import { MessageBox } from 'element-ui';
import importForm from './importForm'
export default {
	mixins: [table_mixin],
	props:['id'],
	components:{
		importForm
	},
	data() {
		return {
			loading: true,
			api_resource,
			queryDialogFormVisible:true,
			visible:false,
			gridData: [],
			importUploadUrl:'/u8report/uploadbudget',
			timer:'',
			statusk:1,
			val:'',
			s:1,
		};
	},
	watch:{
		id(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
	},
	methods: {
		import(){
			MessageBox.alert(
				<importForm importUploadUrl={this.importUploadUrl} resourJudge='1'
				on={{fetchData:()=>{this.fetch()}}}/>
				, '选择文件导入', {
				showConfirmButton:false,
				center:true
			});
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
		const { field, action,table } = await api_common.menuInit("u8report/budgetreport");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.table_form.dateLap = dayjs().format('YYYY-MM')
		this.fetchTableData();
	}
};
</script>


