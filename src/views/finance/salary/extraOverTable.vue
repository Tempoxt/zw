  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  >

	<el-dialog
		title="申请额外加班"
		:visible.sync="dialogFormVisible"
		class="public-dialog selectClass"
		v-el-drag-dialog
		width="800px"
		>
		<el-form ref="form" :model="form" label-width="110px" :rules="rule">
			<el-row>
				<el-col :span="16" :offset="3">
					<form-render prop="dateLap" :type="`day`" :field="{name:'加班日期'}" v-model="form.dateLap"/>
				</el-col>
				<el-col :span="16" :offset="3">
					<form-render prop="reason" :type="`textarea`" :field="{name:'加班原因'}" v-model="form.reason"/>
				</el-col>
			</el-row>
			<OrgSelect :result="result" v-model="form.workcodes" activeNam="first" ref="OrgSelect" v-if="dialogFormVisible"/>
		</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible = false">取 消</el-button>
			<el-button type="primary" @click="handleFormSubmit">确 定</el-button>
		</div>
    </el-dialog>

	<el-dialog
		title="申请额外加班费"
		:visible.sync="dialogForm1Visible"
		class="public-dialog"
		v-el-drag-dialog
		>
      		<el-form ref="form1" :model="form1"  label-width="100px"  :rules="rule1">
				<el-row >
					<el-col :span="16" :offset="3">
						<el-form-item label="补扣月份" prop="dateLap">
							<el-date-picker
								v-model="form1.dateLap"
								type="month"
								style="width:100%"
								format="yyyy-MM"
								value-format="yyyy-MM"
								placeholder="选择月份">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="16" :offset="3">
						<el-form-item label="附件" prop="annex">
							<el-upload
								class="upload-demo"
								ref="upload"
								action="www"
								:file-list="fileList"
								:on-change="changeFormUploadFiles"
								:auto-upload="false">
						    <el-button slot="trigger" size="small" type="primary">上传附件</el-button></el-upload>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm1Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm1Submit">确 定</el-button>
		</div>
    </el-dialog>

    <table-header
		:table_actions="table_actions"
		:table_selectedRows="table_selectedRows"
		@action="handleAction"
		:table_form.sync="table_form"
		:table_column="table_field"
		>
		<div style="padding-left:10px" v-show="this.m==1">
			<dateLap type="1" v-model="dateLap1" @change="fetch" :disabled="true"/>
		</div>
		<div style="padding-left:10px" v-show="this.m==2">
			<dateLap type="2" v-model="dateLap2" @change="fetch" :disabled="true"/>
		</div>
		<div style="padding-left:10px" v-show="this.m==3">
			<dateLap type="3" v-model="dateLap3" @change="fetch" :disabled="true"/>
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
		 <el-table-column type="index" :index="indexMethod" fixed/>
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
import dayjs from 'dayjs'
import OrgSelect from '@/components/Org/OrgSelect'
export default {
	mixins: [table_mixin],
	props:['url','m'],
	data() {
		return {
			loading: true,
			api_resource:api_common.resource(this.url),
			table_topHeight:276,
			queryDialogFormVisible:true,
			dialogFormVisible:false,
			dialogForm1Visible:false,
			form:{},
			form1:{},
			rule:{
				dateLap:[
					{ required: true, message: '请选择', trigger: ['blur','change'] },
				],
				reason:[
					{ required: true, message: '请输入', trigger: ['blur','change'] },
				],
			},
			rule1:{
				dateLap:[
					{ required: true, message: '请选择', trigger: ['blur','change'] },
				],
			},
			dateLap1:'',
			dateLap2:'',
			dateLap3:'',
			result:[],
			fileList:[],
			template:{
				audit(row,column){
					if(column.audit=='已审核'){
						return <span style="color:#1FD361">{column.audit}</span>
					}else{
						return <span>{column.audit}</span>
					}
				},
				pay(row,column){
					if(column.pay=='未结算'){
						return <span style="color:#F2353C">{column.pay}</span>
					}else{
						return <span>{column.pay}</span>
					}
				}
			}
		};
	},
	components:{
		OrgSelect
	},
	computed:{
		disabled(){
			if(this.form.classes_id!=''){
				return false
			}
			return true
		},
	},
	watch:{
		url(){
            this.api_resource = api_common.resource(this.url)
			delete this.table_form.keyword
			this.table_form.currentpage = 1
			this.table_form.query.query= []
			if(this.m==1){
				this.dateLap1 = dayjs().format('YYYY-MM-DD')
			}else if(this.m==2){
				this.dateLap2 = dayjs().format('YYYY-MM')
			}else{
				this.dateLap3 = dayjs().format('YYYY')
			}
			this.fetchMenu()
		}
	},
	methods: {
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		applyOver(){
			this.form = {}
			this.result = []
			this.$nextTick(()=>{
				this.$refs['form'].clearValidate()
			})
			this.dialogFormVisible = true
		},
		changeFormUploadFiles(file, fileList){
			this.form1.annex = file.raw
		},
		apply(){
			this.fileList = []
			this.form1 = {}
			this.$nextTick(()=>{
				this.$refs['form1'].clearValidate()
			})
			let rows = this.table_selectedRows.map(row=>row.workcode)
			this.form1.workcodes = rows.join(',')
			this.dialogForm1Visible = true 
		},
        form1_validate(){
            return new Promise((resolve,reject)=>{
                this.$refs.form1.validate((valid) => {
                if(valid){
                    resolve()
                }else{
                    reject()
                    return false
                }
                })
            })
        },
		async handleForm1Submit(){
			await this.form1_validate()
			let form1 = Object.assign({},this.form1)
			var formData = new FormData();
			Object.keys(form1).forEach(k=>{
				formData.append(k,form1[k])
			})
			let mes = await this.api_resource.create(formData)
			this.$message.success(mes);
			this.dialogForm1Visible = false
			this.fetchTableData()
		},
		async audit(){
			let rows = this.table_selectedRows.map(row=>row.id)
			await this.$request.put('attendance/dailyreportaudit',{ids:rows.join(',')})
			this.fetchTableData()
		},
		async handleFormSubmit(){
			await this.form_validate()
			let ids = this.$refs.OrgSelect.getIdsResult()
			this.form.workcodes = [ids];
			let form = Object.assign({},this.form)
			let mes = await this.api_resource.create(form)
			this.$message.success(mes);
			this.dialogFormVisible = false
			this.fetchTableData()
		},
		async fetchTableData() {
			this.table_loading = true;
			if(this.m==1){
				this.table_form.dateLap = this.dateLap1
			}else if(this.m==2){
				this.table_form.dateLap = this.dateLap2
			}else{
				this.table_form.dateLap = this.dateLap3
			}
			const {rows , total }= await this.api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
		async fetchMenu(){
			const { field, action,table } = await api_common.menuInit(this.url);
			this.table_field = field;
			this.table_actions = action;
			this.table_config = table
			this.fetchTableData()
		}
	},
	async created() {
		this.dateLap1 = dayjs().format('YYYY-MM-DD')
		await this.fetchMenu()
	}
};
</script>