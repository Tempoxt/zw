  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  
  >

  	<el-dialog
		title="导入"
		:visible.sync="importDialog"
		class="public-dialog"
		v-el-drag-dialog
		>
      		<el-form ref="importForm" :model="importForm"  label-width="100px"  :rules="rules3">
				<el-row >
					
					<el-col :span="12">
						<form-render :type="`select`" prop="type" :field="{name:'分类',options:dedulist}" v-model="importForm.type"/>
					</el-col>
				
					<el-col :span="12">
						<form-render :type="`select`" prop="program" :field="{name:'补扣项目',options:programList2}" v-model="importForm.program" />
					</el-col>
				
					<el-col :span="12">
						<el-form-item label="补扣月份" prop="recordate">
							<el-date-picker
								v-model="importForm.recordate"
								type="month"
								style="width:100%"
								format="yyyy-MM"
								value-format="yyyy-MM"
								placeholder="选择月份">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<form-render :type="`input`" prop="reason" :field="{name:'补扣原因'}" v-model="importForm.reason"/>
					</el-col>
					<el-col :span="12">
						<el-form-item label="补扣附件" >
							<el-upload
								class="upload-demo"
								ref="upload"
								action="www"
								:file-list="fileList1"
								:on-change="changeFormImportFiles"
								:auto-upload="false">
						    <el-button slot="trigger" size="small" type="primary">补扣附件</el-button></el-upload>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="导入人员明细">
							<el-upload
								class="upload-demo"
								ref="upload"
								action="www"
								:file-list="fileList2"
								:on-change="changeFormImportFiles2"
								:auto-upload="false">
						    <el-button slot="trigger" size="small" type="primary">导入人员明细</el-button></el-upload>
						</el-form-item>
						
						
					</el-col>
				</el-row>

			</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="downLoad">下载模板</el-button>
			<el-button @click="importDialog = false">取 消</el-button>
			<el-button type="primary" @click="handleImportFormSubmit">确 定</el-button>
		</div>
    </el-dialog>

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
						<form-render :type="`select`" prop="program" :field="{name:'补扣项目',options:programList1}" v-model="form.program" />
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
						<form-render :type="`input`" prop="reason" :field="{name:'补扣原因'}" v-model="form.reason"/>
					</el-col>
					<el-col :span="12">
						<el-form-item label="补扣附件" >
							<el-upload
								class="upload-demo"
								ref="upload"
								action="www"
								:file-list="fileList"
								:on-change="changeFormUploadFiles"
								:auto-upload="false">
						    <el-button slot="trigger" size="small" type="primary">选取文件</el-button></el-upload>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>

			<OrgSelect :result="result" v-model="form.ids" ref="OrgSelect" v-if="dialogFormVisible&&isInsert"/>

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

		<el-form ref="form2" :model="form2" label-width="100px" >
			<el-row>
				<el-col :span="24" style="padding-top:20px;">
					<el-form-item label="结算月份" prop="dateLap" :rules="rules2">
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
				<el-col :span="24">
					<form-render
						:type="`radio`"
						:field="{name:'结算状态',options:[{
							value: 1,
							label: '通过'
						},{
							value: 0,
							label: '不通过'
						}]}"
						v-model="form2.flag"
						prop="status"
					/>
				</el-col>
				<el-col :span="24" v-if="this.form2.flag==0">
					<form-render
						:type="`textarea`"
  						:autosize="{ minRows: 2, maxRows: 4}"
						prop="remark"
						filterable
						:field="{name:'不通过原因'}"
						v-model="form2.remark"
					/>
				</el-col>
			</el-row>
		</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm2Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm2Submit" :disabled="disabled2">确 定</el-button>
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
import OrgSelect from '@/components/Org/OrgSelect'
import dayjs from 'dayjs'
import { MessageBox } from 'element-ui';
const api_resource = api_common.resource("deduction");
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
			form2:{
				dateLap: '',
				flag: 1,
				remark: ''
			},
			result:[],
			api_resource,
			orgCategory:[],
			queryDialogFormVisible:true,
			dialogForm2Visible:false,
			table_topHeight:293,
			fileList:[],
			fileList1:[],
			fileList2:[],
			programList:[],
			rules:{
				type:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
				],
				itemName:[
					{ required: true, message: '请输入', trigger:  ['blur', 'change'] },
				],
				amount:[
					{ required: true, message: '请输入', trigger:  ['blur', 'change']},
					{ validator: checkAmount, trigger:  ['blur', 'change'] }
				],
				recordate:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change']},
				],
				reason:[
					{ required: true, message: '请输入', trigger:  ['blur', 'change'] },
				],
			},
			rules3:{
				type:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
				],
				program:[
					{ required: true, message: '请输入', trigger:  ['blur', 'change'] },
				],
				recordate:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change']},
				],
				reason:[
					{ required: true, message: '请输入', trigger:  ['blur', 'change'] },
				],
			},
			rules2:{
				dateLap:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
				],
				flag:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
				],
			},
			dedulist:[],
			template:{
				paymentname(column,row){
					if(row.payStatus===2||row.payStatus===1){
						return <el-tag type="success">{row.paymentname}</el-tag>
					}else if(row.payStatus===0){
						return <el-tag type="info">{row.paymentname}</el-tag>
					}else if(row.payStatus===3){
						return <el-tag type="danger">{row.paymentname}</el-tag>
					}
				},
			},
			importUploadUrl:"/deduction/upload",
			downloadUrl:'/deduction/titleExport',
			timer:'',
			statusk:1,
			val:'',
			s:1,
			importDialog:false,
			importForm:{}
		};
	},
	computed:{
		programList2(){
			return this.importForm.type 
			? 
			this.importForm.type  == 98?this.programList['补助'].map(o=>{
				return {
					label:o.selectname,
					value:o.id
				}
			}):this.programList['扣款'].map(o=>{
				return {
					label:o.selectname,
					value:o.id
				}
			})
			:
			[]
		},
		programList1(){
			return this.form.type 
			? 
			this.form.type  == 98?this.programList['补助'].map(o=>{
				return {
					label:o.selectname,
					value:o.id
				}
			}):this.programList['扣款'].map(o=>{
				return {
					label:o.selectname,
					value:o.id
				}
			})
			:
			[]
		},
		disabled2(){
			if(this.form2.dateLap!==''&&this.form2.flag!==''){
				if(this.form2.flag==1){
					return false
				}else if(this.form2.flag==0){
					if(this.form2.remark!==''){
						return false
					}else{
						return true
					}
				}
			}
			return true
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
		},
		'form2.status'(){
			this.form2.remark = ''
		},
		'form.type'(){
			this.form.program = ''
		},
		'importForm.type'(){
			this.importForm.program = ''
		}
	},
	methods: {
		downLoad(){
			this.handleDownloadChange()
			this.importDialog = false
		},
		changeFormUploadFiles(file, fileList){
			this.form.annex = file.raw
			console.log(file)
		},
		changeFormImportFiles(file){
			this.importForm.annex = file.raw
		},
		changeFormImportFiles2(file){
			this.importForm.the_file = file.raw
		},
		async handleImportFormSubmit(){
			await this.form_validate('importForm')
			var formData = new FormData();
			Object.keys(this.importForm).forEach(k=>{
				formData.append(k,this.importForm[k])
			})
			let mes = await this.$request.post('/deduction/upload',formData)
			this.importDialog = false
			this.$message({
				message: mes,
				type: 'success'
			});
			this.timer = setInterval(()=>{
				this.getResult()
				this.s++;
			},5000)
		},
		handlePreview(){
			
		},
		async import(){
			this.statusk = 1
			this.importForm = {}
			this.$nextTick(()=>{
				this.$refs['importForm'].clearValidate()
			})
			try {
				this.fileList1 = []
				this.fileList2 = []
			} catch (error) {
				
			}
			this.importDialog = true
			this.dedulist = await api_common.getTag('deduction')
			this.programList =await this.$request.get('/deduction/program')
			//  ().map(o=>{
			// 	return {
			// 		label:o.selectname,
			// 		value:o.id
			// 	}
			// })
			// let {
			// 	handleImportChange,
			// } = this
			// MessageBox.alert(
			// 	<el-button-group class="table-import-upload" ref="import">
			// 		<el-button type="primary" onClick={()=>{}}>选择文件</el-button>
			// 		<input type="file" ref="input" class="input" on-change={handleImportChange} ref="importInput"></input>
			// 		<el-button type="" v-show={this.downloadUrl!=''&&this.downloadUrl!=undefined} style="margin-left:20px" onClick={()=>{this.handleDownloadChange()}}>下载模板</el-button>
			// 	</el-button-group>
			// 	, '选择文件导入', {
			// 	showConfirmButton:false,
			// 	center:true
			// });
		},
		async handleImportChange(ev){
			const files = ev.target.files;
			if (!files) return;
			var form = new FormData();
			form.append('the_file',files[0])
			this.importLoading = true
			MessageBox.close()
			MessageBox.alert(
				<div v-loading={true}><br /></div>, '导入中', {
				showConfirmButton:false,
				center:true
			});
			try {
				const mes = await this.$request.post(this.importUploadUrl,form,{alert:false})
				this.statusk = 1
				this.$message({
					message: mes,
					type: 'success'
				});
				this.timer = setInterval(()=>{
					this.getResult()
					this.s++;
				},5000)
			} catch (error) {
				this.$message.error({dangerouslyUseHTMLString: true,message:error.response.data,duration:4000})
			}finally{
				this.importLoading = false
				MessageBox.close()
				this.$nextTick(()=>{
					ev.target.value = null
				})
			}
    	},
		async getResult(){
			if(this.statusk!=0&&this.s<=12){
				if(this.s==12){
					this.$message.error({ message: '导入失败,请重试'})
				}
				try{
					this.val = await this.$request.get('/deduction/upload',{alert:false})
					this.statusk = 0
					this.$message.success({ message: this.val,duration:3000})
					this.fetchTableData()
					clearInterval(this.timer)
					this.s=0
				}catch(err){

				}
			}else{
				clearInterval(this.timer)
				this.s=0
			}
		},
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
			this.result = []
			this.dialogFormVisible = true
			try {
				this.fileList = []
			} catch (error) {
				
			}
			this.$nextTick(()=>{
				this.$refs['form'].clearValidate()
			})
			this.dedulist = await api_common.getTag('deduction')
		
			this.programList = (await this.$request.get('/deduction/program'))
			// .map(o=>{
			// 	return {
			// 		label:o.selectname,
			// 		value:o.id
			// 	}
			// })
		},
		async handleFormSubmit(){
			console.log(this.form,'form')
            await this.form_validate()
			if(this.isInsert){
				let workcodeid = this.$refs.OrgSelect.getIdsResult()
				this.form.ids = workcodeid
				if(this.form.ids!=''){
					let form = Object.assign({},this.form)
					console.log(form,'form')
					var formData = new FormData();
					Object.keys(form).forEach(k=>{
						formData.append(k,form[k])
					})
					await api_resource.create(formData)
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
			}
		},
		financialaudit(){
			this.form2 = {
				flag: 1,
				remark: ''
			}
    		this.$set(this.form2,'dateLap', dayjs().subtract(1,'month').format('YYYY-MM'))
			this.dialogForm2Visible = true
		},
		async handleForm2Submit(){
			this.form2.ids = this.table_selectedRows.map(o=>o.id)
			await this.$request.post('/deduction/audit',{ids:this.form2.ids},{params:{
				dateLap:this.form2.dateLap,
				remark:this.form2.remark,
				flag:this.form2.flag
			}})
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
	}
};
</script>


