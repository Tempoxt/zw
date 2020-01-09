  <template>
  <ui-table ref="table" 
	:table_column="table_field" 
	:table_query.sync="table_form.query"
	@query="querySubmit"
	>
	
		<el-dialog
			:title="dialogStatus==='insert'?'添加部门人员编制规划':'编辑部门人员编制规划'"
			:visible.sync="dialogFormVisible"
			class="public-dialog"
			v-el-drag-dialog
			
			>

			<el-form ref="form" :model="form" label-width="110px" :rules="rules">
				<el-row :gutter="40">
					<el-col :span="12">
						<el-form-item label="年份" prop="year">
							<el-date-picker :disabled="!isInsert"
								:clearable="false"
								v-model="form.year"
								type="year"
								format="yyyy年"
								value-format="yyyy"
      							style="width:100%"
								placeholder="选择年份">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<form-render :type="`input`" prop="lastYearCount" :field="{name:'上年实际人数'}" v-model="form.lastYearCount" placeholder="请输入人数"/>
					</el-col>
				
					<el-col :span="12">
						<form-render :type="`select`" prop="fatherDepart" :field="{name:'事业部',options:departList}" v-model="form.fatherDepart" @change="clearDepart" :disabled="!isInsert"/>
					</el-col>
					<el-col :span="12">
						<form-render :type="`input`" prop="yearCount" :field="{name:'当年规划人数'}" v-model="form.yearCount" placeholder="请输入人数"/>
					</el-col>
					<el-col :span="12">
						<form-render :type="`select`" prop="department" :field="{name:'部门',options:depart}" v-model="form.department" :disabled="!isInsert"/>
					</el-col>
				</el-row>
			</el-form>

			<div slot="footer" class="dialog-footer dialog-multiple-footer">
                <div>
                    <el-switch
                        v-if="isInsert"
                        v-model="form_multiple"
                        active-text="连续添加"
                        inactive-text="">
                    </el-switch>
                </div>
                <div>
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleFormSubmit" :disabled="disabled">确 定</el-button>
                </div>
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
import dayjs from 'dayjs'
const api_resource = api_common.resource("hrmplan/staffplan");
const download = require('downloadjs')
export default {
	mixins: [table_mixin],
	props:['id'],
	data() {
		return {
			loading: true,
			api_resource,
			orgCategory:[],
			queryDialogFormVisible:true,
			dialogFormVisible:false,
			table_topHeight:234,
			form:{
				year:'',
				lastYearCount:'',
				fatherDepart:'',
				yearCount:'',
				department:''
			},
			departList:[],
			depart:[],
			rules:{
				year: [
                    { required: true, message: '请选择', trigger: 'change' },
				],
				lastYearCount: [
                    { required: true, message: '请输入人数', trigger: 'blur' },
				],
				fatherDepart: [
                    { required: true, message: '请选择', trigger: 'change' },
				],
				yearCount: [
                    { required: true, message: '请输入人数', trigger: 'blur' },
				],
				department: [
                    { required: true, message: '请选择', trigger: 'change' },
				],
			}
		};
	},
	computed:{
		disabled(){
			if(this.form.year!==''&&this.form.lastYearCount!==''&&this.form.fatherDepart!==''&&this.form.yearCount!==''&&this.form.department!==''){
				return false
			}
			return true
		}
	},
	watch:{
		id(){ 
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		async 'form.fatherDepart'(){
			if(this.form&&this.form.fatherDepart!==''&&this.form.fatherDepart!==undefined){
				this.depart =  (await api_common.resource('hrmplan/getdeaprtbyfather').get({fatherId:this.form.fatherDepart})).map(o=>{return {label:o.name,value:o.id}})
			}
		}
	},
	methods: {
		fetch(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
		clearDepart(){
			this.form.department = ''
			this.$nextTick(()=>{
				this.$refs['form'].clearValidate()
			})
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
		async fetchDepart(){
			this.departList = (await api_common.resource('hrmplan/getfatherdeaprt').get()).map(o=>{return {label:o.name,value:o.id}})
		},
		add(){
			this.form ={
				lastYearCount:'',
				fatherDepart:'',
				yearCount:'',
				department:''
			}
			this.$set(this.form,'year',dayjs().format('YYYY'))
			this.dialogFormVisible = true
			this.fetchDepart()
		},
		async edit(){
			this.dialogFormVisible = true
			this.form = await this.api_resource.find(this.table_selectedRowsInfo[0].id)
			this.fetchDepart()
		},
		async handleFormSubmit(){
            await this.form_validate()
            let form = Object.assign({},this.form)
            if(this.isInsert){
                await this.api_resource.create(form)
            }else{
                await this.api_resource.update(form.id,form)
			}
			if(this.isInsert&&this.form_multiple){
				this.form ={
					lastYearCount:'',
					fatherDepart:'',
					yearCount:'',
					department:''
				}
            	this.$nextTick(()=>{
					this.$refs['form'].clearValidate()
				})
				this.fetchTableData()
			}else{
				this.dialogFormVisible = false
				this.fetchTableData()
			}
        },
	},
	async created() {
		const { field, action,table } = await api_common.menuInit("hrmplan/staffplan");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM'))
		this.fetchTableData();
	}
};
</script>


