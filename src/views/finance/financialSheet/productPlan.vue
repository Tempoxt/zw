  <template>
  <ui-table ref="table" 
	:table_column="table_field" 
	:table_query.sync="table_form.query"
	@query="querySubmit"
  >
	<el-dialog
		title="请选择"
		:visible.sync="dialogForm2Visible"
		class="public-dialog"
		v-el-drag-dialog
		width="520px"
		>
		<el-form ref="form2" :model="form2" label-width="100px">
			<el-row>
				<el-col :span="24">
					<el-form-item label="导入月份" prop="dateLap">
						<el-date-picker
							v-model="form2.dateLap"
							:clearable="false"
							type="month"
							size="small"
							format="yyyy年MM月"
							value-format="yyyy-MM"
							placeholder="选择月份">
						</el-date-picker>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>

		<el-button-group style="margin-left:40px;padding:10px 0 30px">
			<el-button type="primary" :disabled="disabled" @click="importFile(e)">选择文件</el-button>
			<!-- <el-button type="primary">选择文件</el-button>
            <input type="file" ref="input" class="input" @change="handleImportChange" ref="importInput"></input> -->
			<el-button type="" style="margin-left:20px">下载模板</el-button>
		</el-button-group>
	</el-dialog>



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
  </ui-table>
</template>
<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
import OrgSelect from '@/components/Org/OrgSelect'
import dayjs from 'dayjs'
import { MessageBox } from 'element-ui';
const api_resource = api_common.resource("prodpropelplan/list");
export default {
	mixins: [table_mixin],
	props:['id','flag'],
	components:{
		OrgSelect
	},
	data() {
		return {
			loading: true,
			form2:{
				dateLap: '',
			},
			api_resource,
			orgCategory:[],
			queryDialogFormVisible:true,
			dialogForm2Visible:false,
			// table_topHeight:206,
			// rules:{
			// 	dateLap:[
			// 		{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
			// 	],
			// },
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
	watch:{
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
		importPlan(){
			this.form2.dateLap = ''
			this.dialogForm2Visible = true
		},
		importFile(e){
			this.importUploadUrl = '/prodpropelplan/list/upload'
			this.downloadUrl = '/prodpropelplan/list/upload'
			this.handleImportChange(e)
		}
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


