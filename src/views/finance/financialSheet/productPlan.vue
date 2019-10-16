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
			<dateLap v-model="table_form.dateLap" :disabled="true" @change="fetch"/>
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
		<each-table-column :table_field="table_field"/>
    </el-table>
    <table-pagination 
        :total="table_form.total" 
        :pagesize.sync="table_form.pagesize"
        :currentpage.sync="table_form.currentpage"
        @change="fetchTableData"
        :table_config="table_config"
    />
	<!-- <importForm :showModal.sync="dialogFormVisible"/> -->
  </ui-table>
</template>
<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
import dayjs from 'dayjs'
import importForm from './importForm'
import { MessageBox } from 'element-ui';
const api_resource = api_common.resource("prodpropelplan/list");
export default {
	mixins: [table_mixin],
	components:{
		importForm
	},
	data() {
		return {
			dialogFormVisible:false,
			showModal:false,
			loading: true,
			api_resource,
			orgCategory:[],
			queryDialogFormVisible:true,
			dialogForm2Visible:false,
			importForm:{
				month: dayjs().format('YYYY-MM'),
			},
		};
	},
	computed:{
		disabled(){
			if(this.form2.dateLap!==''){
				return false
			}
			return true
		}
	},
	methods: {
        fetch(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
		async fetchTableData() {
			this.table_loading = true;
			const {rows , total }= await api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
		import(){
			// this.dialogFormVisible = true
			let {
				handleImportChange,
			} = this
			MessageBox.alert(
				<importForm importUploadUrl="/prodpropelplan/list/upload" downloadUrl="/rodpropelplan/list/downtemplate"/>
			, '选择文件导入', {
			showConfirmButton:false,
			center:true
			});
		},
	},
	async created() {
		const { field, action,table } = await api_common.menuInit("prodpropelplan/list");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM'))
		this.fetchTableData();
	}
};
</script>


