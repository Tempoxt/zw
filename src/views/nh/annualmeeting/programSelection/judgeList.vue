  <template>
	<ui-table ref="table" 
		:table_column="table_field" 
		:table_query.sync="table_form.query"
		@query="querySubmit"
		>
		<el-dialog
            :title="dialogStatus==='insert'?'添加评委':'修改'"
            :visible.sync="dialogFormVisible"
            class="public-dialog"
            v-el-drag-dialog
		    width="800px"
            >
           	<div>
                <OrgSelect :result="result" ref="OrgSelect" v-if="dialogFormVisible"/>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
            </div>
        </el-dialog>

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
const api_resource = api_common.resource("annualmeeting/jurymember");
import OrgSelect from '@/components/Org/OrgSelect'
let baseUrl = process.env.VUE_APP_STATIC
import dayjs from 'dayjs'
export default {
	mixins: [table_mixin],
	components:{
		OrgSelect
	},
	data() {
		return {
			loading: true,
			api_resource,
			queryDialogFormVisible:true,
			form:{},
			result:[],
            table_topHeight:280,
			dialogFormVisible:false
		};
	},
	methods: {
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
        add(){
			this.result = []
            this.dialogFormVisible = true
		},
		async delete(){
			let rows = this.table_selectedRows.map(row=>row.id)
			var mes = await this.$request.post('annualmeeting/jurymember/delete',{ids:rows.join(',')})
			this.$message.success(mes)
			this.fetchTableData()
		},
        async handleFormSubmit(){
			let staffIds = this.$refs.OrgSelect.getIdsResult()
			this.form.staffIds = staffIds;
			let mess = await api_resource.create(this.form)
			this.$message.success(mess);
			this.fetch()
			this.dialogFormVisible = false
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
		const { field, action,table } = await api_common.menuInit("annualmeeting/jurymember");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.table_form.dateLap = dayjs().add(1,'year').format('YYYY')
		this.fetchTableData();
	}
};
</script>


