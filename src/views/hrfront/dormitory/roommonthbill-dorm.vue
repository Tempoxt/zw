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
        <el-date-picker
			v-model="month"
			type="month"
			size="medium"
			@change="changeMonth"
			format="yyyy年MM月"
			value-format="yyyy-MM"
			placeholder="选择月份">
        </el-date-picker>
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
		<el-table-column type="index" :index="indexMethod" />
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
const api_resource = api_common.resource("dormitory/roommonthbill");
import dayjs from 'dayjs'
export default {
	mixins: [table_mixin],
	props:['id','data','rows'],
	data() {
		return {
			loading: true,
			month:dayjs().format('YYYY-MM'),
			api_resource,
			queryDialogFormVisible:true,
			template:{
				checkState(column,row){
					return <div>{['待入住','已入住','待搬离','已搬离'][row.checkState]}</div>
				},
			},
			importUploadUrl:"/dormitory/import/meter",
			downloadUrl:"/dormitory/import/meter",
            table_topHeight:235,
		};
	},
	watch:{
		id(val){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
	},
	methods: {
		importMeter(){
			this.import();
		},
		changeMonth(){
			this.table_form.currentpage = 1
			this.table_form.month = this.month
			this.fetchTableData()
		},
		async fetchTableData() {
			this.table_loading = true;
			this.table_form.room__dorm_id = this.id
			const {rows , total }= await api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
	},
	async created() {
		this.$set(this.table_form,'month',dayjs().format('YYYY-MM'))
		const { field, action,table } = await api_common.menuInit("dormitory/dormmonthbill");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.fetchTableData();
	}
};
</script>


<style lang="scss" scoped>
.transfer-footer {
    display: flex;
    height: 100%;
    align-items: center;
    span {
        padding-left: 6px;
    }
}
.public-dialog {
    /deep/ .el-transfer-panel {
        width: 300px;
    }
    /deep/ .el-transfer-panel__body {
        height: 370px;
    }
    /deep/ .el-transfer-panel__list.is-filterable {
        height: 320px !important;
    }
}
</style>
