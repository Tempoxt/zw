  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  
  >
  
  	<el-dialog
		:title="dialogStatus==='insert'?'添加补扣款':'编辑'"
		:visible.sync="dialogFormVisible"
		class="public-dialog"
		v-el-drag-dialog
		>
      		<el-form ref="form" :model="form"  label-width="100px"  :rules="rules">
				<el-row >
					<el-col :span="12" v-if="!isInsert">
						<form-render :type="`input`" :field="{name:'姓名'}" v-model="form.name" :disabled="!isInsert"/>
					</el-col>
					<el-col :span="12">
						<form-render :type="`select`" prop="type" :field="{name:'分类',options:dedulist}" v-model="form.type"/>
					</el-col>
				
					<el-col :span="12">
						<form-render :type="`input`" prop="itemName" :field="{name:'补扣项目'}" v-model="form.itemName" />
					</el-col>
					<el-col :span="12">
						<form-render :type="`input`" prop="amount" :field="{name:'补扣金额'}" v-model="form.amount"/>
					</el-col>
					<el-col :span="12">
						<el-form-item label="扣款月份" prop="recordate">
							<el-date-picker
								v-model="form.recordate"
								type="month"
								style="width:100%"
								format="yyyy-MM"
								value-format="yyyy-MM"
								placeholder="选择月份">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<form-render :type="`input`" prop="remark" :field="{name:'补扣原因'}" v-model="form.remark"/>
					</el-col>
				</el-row>

			</el-form>

			<OrgSelect v-model="form.ids" ref="OrgSelect" v-if="dialogFormVisible&&isInsert"/>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible = false">取 消</el-button>
			<el-button type="primary" @click="handleFormSubmit">确 定</el-button>
		</div>
    </el-dialog>

	<el-dialog
		title="请选择结算月份"
		:visible.sync="dialogForm2Visible"
		class="public-dialog"
		v-el-drag-dialog
		width="520px"
		>

		<el-form ref="form2" :model="form2" label-width="100px" :inline="true" >
			<el-row>
				<el-col :span="24" style="padding:20px;">
					<el-date-picker
						v-model="form2.dateLap"
						:clearable="false"
						type="month"
						size="medium"
						format="yyyy年MM月"
						value-format="yyyy-MM"
						placeholder="选择月份">
					</el-date-picker>
				</el-col>
			</el-row>
		</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm2Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm2Submit">确 定</el-button>
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
const api_resource = api_common.resource("deduction");
import OrgSelect from '@/components/Org/OrgSelect'
import dayjs from 'dayjs'
export default {
	mixins: [table_mixin],
	props:['id','flag'],
	components:{
		OrgSelect
	},
	data() {
		var checkAmount = (rule, value, callback) => {
			if (!value) {
				return callback(new Error('请输入'));
			}else if (!(/^\d+(\.\d{1,2})?$/.test(value))) {
				callback(new Error('请输入精度为两位小数以内的正数'));
			}else{
				callback();
			}
		
		};
		return {
			loading: true,
			form:{},
			form2:{},
			api_resource,
			orgCategory:[],
			queryDialogFormVisible:true,
			dialogForm2Visible:false,
			table_topHeight:276,
			rules:{
				type:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
				],
				itemName:[
					{ required: true, message: '请输入', trigger:  ['blur', 'change'] },
				],
				amount:[
					{ validator: checkAmount, trigger:  ['blur', 'change'] }
				],
				recordate:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change']},
				],
				remark:[
					{ required: true, message: '请输入', trigger:  ['blur', 'change'] },
				],
			},
			dedulist:[],
			template:{
				paymentname(column,row){
					if(row.paymentname==='已结付'){
						return <el-tag type="success">{row.paymentname}</el-tag>
					}else{
						return <el-tag type="info">{row.paymentname}</el-tag>
					}
				},
			},
			importUploadUrl:"/deduction/upload",
			downloadUrl:'/deduction/titleExport'
		};
	},
	computed:{
		disabled(){

		}
	},
	watch:{
		id(){
            this.table_form.currentpage = 1
			this.fetchTableData()
		},
        flag(){
			if(this.table_form.sortname){
				this.table_form.sortname = 'id'
			}
			this.table_form.query.query = []
			this.table_form.currentpage = 1
            this.fetchMenu()
            this.fetchTableData()
		}
	},
	methods: {
        fetch(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
		async fetchTableData() {
			if(!this.id){
				return
			}
			this.table_loading = true;
			this.table_form.orgid = this.id
			this.table_form.flag = this.flag
			const {rows , total }= await api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
		async add(){
			this.dialogFormVisible = true
			this.$nextTick(()=>{
				this.$refs['form'].clearValidate()
			})
        	this.dedulist = await api_common.getTag('deduction')
		},
		async handleFormSubmit(){
            await this.form_validate()
			if(this.isInsert){
				let workcodeid = this.$refs.OrgSelect.getIdsResult()
				this.form.ids = workcodeid
				if(this.form.ids!=''){
					let form = Object.assign({},this.form)
					await api_resource.create(form)
					this.dialogFormVisible = false
					this.fetchTableData()
				}else{
					this.$message.error({message:'请选择员工'})
				}
			}else{
				let form = Object.assign({},this.form)
				await api_resource.update(form.id,form)
				this.dialogFormVisible = false
				this.fetchTableData()
				// ,{alert:false}
            	// this.$message.success({message:'修改成功'})
			}
		},
		financialaudit(){
			this.dialogForm2Visible = true
		},
		async handleForm2Submit(){
			let ids = this.table_selectedRows.map(o=>o.id).join(',')
			await this.$request.get('/deduction/audit',{params:{ids:ids,dateLap:this.form2.dateLap}})
			this.$message.success({message:'结算成功'})
			this.dialogForm2Visible = false
			this.fetchTableData()
		},
		async edit(){
			this.dialogFormVisible = true;
			this.$nextTick(()=>{
				this.$refs['form'].clearValidate()
			})
        	this.dedulist = await api_common.getTag('deduction')
			let row = this.table_selectedRows[0]
			this.form = await api_resource.find(row.id)
		},
		async fetchMenu(){
            const { field, action,table } = await api_common.menuInit("deduction"+this.flag);
            this.table_field = field;
            this.table_actions = action;
            this.table_config = table
        }
	},
	async created() {
        this.fetchMenu()
		this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM'))
		this.fetchTableData();
    	this.$set(this.form2,'dateLap', dayjs().subtract(1,'month').format('YYYY-MM'))
	}
};
</script>


