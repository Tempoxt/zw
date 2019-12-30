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
                <dateLap type="3" v-model="table_form.dateLap" @change="fetch" :disabled="true"/>
            </div>
		</table-header>
		<el-table
			ref="elTable"
			@selection-change="handleChangeSelection"
			:row-class-name="table_state_className"
			:data="table_data"
			border
			style="width: 100%"
			v-loading="table_loading"
			:header-cell-style="headerCellStyle"
			:height="table_height"
			@header-dragend="table_dragend"
			@sort-change="table_sort_change"
			>
			<el-table-column  type="selection" width="60" class-name="table-column-disabled" :selectable="table_disable_selected"></el-table-column>
			<el-table-column type="index" :index="indexMethod" />
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
const api_resource = api_common.resource("invitation/departdraw");
import dayjs from 'dayjs'
export default {
	mixins: [table_mixin],
	data() {
		return {
			loading: true,
			api_resource,
			queryDialogFormVisible:true,
            importUploadUrl:'/invitation/departdraw/upload',
            downloadUrl:'/invitation/departdraw/upload',
		};
	},
	methods: {
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		async getType(){
 			this.typeData = (await this.$request.get('invitation/sitemanager/siteset/stafftypelist')).map(o=>{return {label:o.staffTypeDesc,value:o.staffType}})
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
	},
	async created() {
		const { field, action,table } = await api_common.menuInit("invitation/departdraw");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.table_form.dateLap = dayjs().add(1,'year').format('YYYY')
		this.fetchTableData();
	}
};
</script>


