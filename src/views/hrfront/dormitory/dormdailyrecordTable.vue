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
            <dateLap v-model="table_form.dateLap" @change="fetch"/>
        </div>
		<div style="padding-left:10px">
			<el-select v-model="status" placeholder="请选择" @change="changeStatus">
				<el-option
					v-for="item in statusData"
					:key="item.code"
					:label="item.name"
					:value="item.code">
				</el-option>
            </el-select>
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
const api_resource = api_common.resource("dormitory/dormdailyrecordsheet");
import dayjs from 'dayjs'
export default {
	mixins: [table_mixin],
	props:['id','data','type'],
	data() {
		return {
			loading: true,
			api_resource,
			queryDialogFormVisible:true,
			status:'',
			statusData:[],
            table_topHeight:235,
		};
	},
	watch:{
		id(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		}
	},
	methods: {
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		changeStatus(){
			this.table_form.liveState = this.status
			this.fetchTableData()
		},
		async fetchTableData() {
			this.table_loading = true;
			if(this.type == 'room'){
				this.table_form.roomId = this.id
				delete this.table_form.dormId
			}else{
				this.table_form.dormId = this.id
				delete this.table_form.roomId
			}
			this.table_form.liveState = this.status
			const {rows , total }= await api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
	},
	async created() {
		const { field, action,table } = await api_common.menuInit("dormitory/dormdailyrecordsheet");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.table_form.dateLap = dayjs().format('YYYY-MM')
		this.statusData = await this.$request.get('/dormitory/dormdailystatefields')
		this.statusData.unshift({code:'0',name:'全部'})
		this.status = this.statusData[0].code
		this.fetchTableData();
	}
};
</script>


