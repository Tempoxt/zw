  <template>
  <ui-table ref="table" 
	:table_column="table_field" 
	:table_query.sync="table_form.query"
	@query="querySubmit"
  >
	<el-dialog
		title="请选择重置月份"
		:visible.sync="dialogFormVisible"
		class="public-dialog"
		v-el-drag-dialog
		width="520px"
		>
		<el-form ref="form" :model="form">
			<el-row>
				<el-col :span="24" style="padding:20px;">
					<el-date-picker
						v-model="form.dateLap"
						type="month"
						size="small"
						format="yyyy年MM月"
						value-format="yyyy-MM"
						placeholder="选择月份">
					</el-date-picker>
				</el-col>
			</el-row>
		</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible = false">取 消</el-button>
			<el-button type="primary" @click="handleFormSubmit" :disabled="disabled">确 定</el-button>
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
const api_resource = api_common.resource("prodpropelplan/mobuleprod/list");
export default {
	mixins: [table_mixin],
	props:['id'],
	components:{
		OrgSelect
	},
	data() {
		return {
			loading: true,
			api_resource,
			orgCategory:[],
			queryDialogFormVisible:true,
			form:{
				dateLap:''
			},
			dialogFormVisible:false,
			timer:'',
			statusk:1,
			val:'',
			month:dayjs().format('YYYY-MM')
		};
	},
	computed:{
		disabled(){
			if(this.form.dateLap!==''&&this.form.dateLap!==undefined){
                return false
            }
            return true
		},
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
		async getDa(){
			if(this.statusk!=0){
				this.val = await this.$request.get('prodpropelplan/mobuleprod/resetresult',{alert:false})
				if(this.val=='重置成功'){
					this.statusk = 0
					this.$message.success({ message: this.val})
					this.fetchTableData()
				}
			}else{
				clearInterval(this.timer)
			}
		},
		async handleFormSubmit(){
			this.dialogFormVisible = false
			this.statusk = 1
			const mes = await this.$request.post('prodpropelplan/mobuleprod/list/reset',{dateLap:this.form.dateLap})
			this.$message.success({message: mes})
			this.timer = setInterval(()=>{
				this.getDa()
			},10000)
		},
		async reset(){
			this.form={}
			this.dialogFormVisible = true
		},
		async fetchTableData() {
			if(this.id==''){
				return
			}
			this.table_loading = true;
			this.table_form.orgid = this.id
			const {rows , total }= await api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
	},
	async created() {
		const { field, action,table } = await api_common.menuInit("prodpropelplan/mobuleprod/list");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM'))
		this.fetchTableData();
	}
};
</script>


