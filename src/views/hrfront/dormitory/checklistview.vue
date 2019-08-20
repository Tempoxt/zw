  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  
  >


	<el-dialog
		title="请选择起始日期"
		:visible.sync="dialogForm1Visible"
		class="public-dialog"
		v-el-drag-dialog
		width="520px"
		>

		<el-form ref="form1" :model="form1" label-width="100px" :inline="true" >
			<el-row>
				<el-col :span="24" style="padding:20px;">
					<form-render :type="`day`" prop="dateLap" :field="{name:''}" v-model="form1.dateLap"/>
				</el-col>
			</el-row>
		</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm1Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm1Submit" :disabled="disabled">确 定</el-button>
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
            <el-select v-model="status" placeholder="请选择" @change="changeStatus">
              <el-option
                v-for="item in statusData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
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
     <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
            <el-button @click="audit({row:scope.row})" type="text" size="small" >撤销</el-button>
        </template>
    </el-table-column>

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
const api_resource = api_common.resource("dormitory/checklistview");
import dateLap from '@/components/Table/DateLap'
import OrgSelect from '@/components/Org/OrgSelect'
import dayjs from 'dayjs'
const download = require('downloadjs')
const defaultForm = () => {
    return {
        estate:1,
        sort:1
    }
}
export default {
	mixins: [table_mixin],
	components:{
		dateLap,
		OrgSelect
	},
	data() {
		return {
			loading: true,
			form:{},
			form1:{
				dateLap:''
			},
			api_resource,
			orgCategory:[],
			queryDialogFormVisible:true,
			dialogForm1Visible:false,
			adminList:[],
			defaultForm,
			roomAdminList:[],
			dormList:[],
			statusData:[
				{id:0,name:'全部'},
				{id:1,name:'待分配'},
				{id:2,name:'待入住'},
				{id:3,name:'待审核搬离'},
				{id:4,name:'待搬离'}
			],
			status:0,
		};
	},
	watch:{
	
	},
	computed:{
		disabled(){
			if(this.form1.dateLap!==''){
				return false
			}
			return true
		},
	},
	methods: {
		changeStatus(val){
			this.table_form.currentpage = 1
			this.status = val
			this.fetchTableData()
		},
		async audit({row}){
			await this.$request.put('dormitory/cancelcheckstate',{
				selectState:row.selectState,
				employeeCode:row.employeeCode
			})
			this.fetchTableData()
		},
		ab2str(u,f) {
			var b = new Blob([u]);
			var r = new FileReader();
			r.readAsText(b, 'utf-8');
			r.onload = function (){if(f)f.call(null,r.result)}
		},
		exportExpireSheet(){
			this.form1.dateLap = ''
			this.dialogForm1Visible = true
		},
		async handleForm1Submit(){
			try{
				const { data,name,contentType} = await this.$request.get('/dormitory/export/expirein?dateLap='+this.form1.dateLap,{ responseType:'arraybuffer'})
				// let today = dayjs().format('YYYY-MM-DD')
				// let day = today.split('-').join('');
				// let namei = '减少被保险人名单';
				download(data,name||this.$route.meta.title,contentType)
			}catch(err){
				var that = this;
				that.ab2str(err.error.response.data,function(str){
					that.$message.error({ message: str });
				});
			}finally{
				this.dialogForm1Visible = false
			}
		},
		async edit(){
			let row = this.table_selectedRows[0]
			this.form = await api_resource.find(row.id)
			this.dialogFormVisible = true;
		},
		async fetchTableData() {
			this.table_loading = true;
			this.table_form.selectState = this.status
			const {rows , total }= await api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
	
		async handleFormSubmit(){
			let form = Object.assign({},this.form)
			form.org_id = this.id
			if(this.isInsert){
				await api_resource.create(form)
			}else{
				await api_resource.update(form.id,form)
			}
			this.dialogFormVisible = false
			this.fetchTableData()
		},
	},
	async created() {
		const { field, action,table } = await api_common.menuInit("dormitory/checklistview");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.fetchTableData();
		// this.table_form.dateLap = dayjs().format('YYYY-MM')
	}
};
</script>


