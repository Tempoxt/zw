  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  
  >

	<el-dialog
		title="添加"
		:visible.sync="dialogForm3Visible"
		class="public-dialog"
		v-el-drag-dialog
		width="800px"
		>

		<el-form ref="form" :model="form3" label-width="110px" :rules="rule">
			<el-row>
				<el-col :span="12">
					<form-render prop="stayStart" :type="`day`" :field="{name:'有效起始日期'}" v-model="form3.stayStart"/>
				</el-col>
				<el-col :span="12">
					<form-render :type="`day`" :field="{name:'有效结束日期'}" v-model="form3.stayEnd"/>
				</el-col>
			</el-row>
		</el-form>

      	<OrgSelect searchApi='/hrm/hotpartstaff' filter_mark="hotAllowance" v-model="form3.ids" ref="OrgSelect" v-if="dialogForm3Visible"/>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm3Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm3Submit">确 定</el-button>
		</div>
    </el-dialog>



  	<el-dialog
		title="高温津贴设置"
		:visible.sync="dialogForm2Visible"
		class="public-dialog"
		v-el-drag-dialog
		width="500px"
    	>
		<div style="width:400px;margin:0 auto">
			<el-form ref="form" :model="form2" label-width="100px">
				<el-row :gutter="20">
					<el-col :span="24">
						<form-render :type="`input`" :field="{name:'高温津贴'}" v-model="form2.hotAllowance" />
					</el-col>
					<el-col :span="24">
						<el-form-item label="津贴月份">
							<div style="display:flex">
								<el-select v-model="form2.startMonth" placeholder="请选择" >
									<el-option
									v-for="item in 12"
									:key="item"
									:label="item+'月'"
									:value="item">
									</el-option>
								</el-select>    
								<span style="padding:0 10px;">至</span>   
								<el-select v-model="form2.endMonth" placeholder="请选择">
									<el-option
									v-for="item in 12"
									:key="item"
									:label="item+'月'"
									:value="item">
									</el-option>
								</el-select>      
							</div>  
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm2Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm2Submit">确 定</el-button>
		</div>
    </el-dialog>

  	<el-dialog
		title='编辑'
		:visible.sync="dialogFormVisible"
		class="public-dialog"
		v-el-drag-dialog
		width="800px"
		>
		<div>
			<el-form ref="form" :model="form" label-width="110px" :rules="rule1">
				<el-row :gutter="20">
					<el-col :span="17" :offset="3">
						<form-render :type="`input`" :field="{name:'员工姓名'}" v-model="form.chineseName" disabled/>
					</el-col>
					<el-col :span="17" :offset="3">
						<form-render :type="`day`"  :field="{name:'有效起始日期'}" v-model="form.stayStart"/>
					</el-col>
					<el-col :span="17" :offset="3">
						<form-render prop="stayEnd" :type="`day`" :field="{name:'有效结束日期'}" v-model="form.stayEnd"/>
					</el-col>
				</el-row>
			</el-form>
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
				<dateLap v-model="table_form.dateLap" @change="fetch"/>
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
const api_resource = api_common.resource("hot/record");
import OrgSelect from '@/components/Org/OrgSelect'
import dayjs from 'dayjs'
const defaultForm = () => {
    return {
        estate:1,
        sort:1
    }
}
export default {
	mixins: [table_mixin],
	props:['id'],
	components:{
		OrgSelect
	},
	data() {
		return {
			loading: true,
			form:{},
			api_resource,
			orgCategory:[],
			queryDialogFormVisible:true,
			table_topHeight:276,
			adminList:[],
			defaultForm,
			roomAdminList:[],
			dormList:[],
			dialogForm2Visible:false,
			dialogForm3Visible:false,
			form2:{},
			form3:{},
			rule:{
				stayStart:[
					{ required: true, message: '请选择日期', trigger: ['blur','change'] },
				]
			},
			rule1:{
				stayEnd:[
					{ required: true, message: '请选择日期', trigger: ['blur','change'] },
				]
			}
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
		async set(){
			this.form2 = await this.$request.get('/hot/recordbasic')
			this.dialogForm2Visible = true
		},
		async handleForm2Submit(){
			await this.$request.put('/hot/recordbasic',this.form2)
			this.dialogForm2Visible = false
		},
		async handleForm3Submit(){
            await this.form_validate()
			let ids = this.$refs.OrgSelect.getIdsResult()
			this.form3.ids = ids;
			if(this.form3.ids!==''){
				try{
					let mes = await this.$request.post('/hot/record',this.form3)
					this.$message.success({message:mes})
					this.dialogForm3Visible = false
				}catch(err){
					// this.$message.error({message:err.response.data})
				}
				this.fetchTableData()
			}else{
				this.$message.error('请选择要添加的人员');
			}
		},
		add(){
			this.$nextTick(()=>{
				this.$refs['form'].clearValidate()
			})
			this.form3 = {}
			this.dialogForm3Visible = true
		},
		async edit(){
			let row = this.table_selectedRows[0]
			this.form = await api_resource.find(row.id)
			this.dialogFormVisible = true;
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
		async handleFormSubmit(){
            await this.form_validate()
			let form = Object.assign({},this.form)
			form.org_id = this.id
			try{
				await api_resource.update(form.id,form,{alert:false})
				this.$message.success('修改成功')
			}catch(err){
				this.$message.error(err.response.data);
			}
			
			this.dialogFormVisible = false
			this.fetchTableData()
		},
	},
	async created() {
		const { field, action,table } = await api_common.menuInit("hot/record");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.fetchTableData();
		this.table_form.dateLap = dayjs().format('YYYY-MM')
	}
};
</script>


