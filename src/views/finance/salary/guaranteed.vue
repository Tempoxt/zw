  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  >

  	<el-dialog
		title="导入保底名单"
		:visible.sync="importDialog"
		class="public-dialog"
		v-el-drag-dialog
		>
      		<el-form ref="importForm" :model="importForm"  label-width="100px"  :rules="rules">
				<el-row >
					<el-col :span="17" :offset="3">
						<el-form-item label="保底月份" prop="month">
							<el-date-picker
								v-model="importForm.month"
								type="month"
								style="width:100%"
								format="yyyy-MM"
								value-format="yyyy-MM"
								placeholder="选择月份">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="17" :offset="3">
						<form-render :type="`textarea`" :field="{name:'说明'}" v-model="importForm.remark"/>
					</el-col>
					<el-col :span="17" :offset="3">
						<el-form-item label="人员明细" >
							<el-upload
								class="upload-demo"
								ref="upload"
								action="www"
								:limit="1"
								:file-list="fileList1"
								:on-change="changeFormImportFiles"
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


    <table-header
		:table_actions="table_actions"
		:table_selectedRows="table_selectedRows"
		@action="handleAction"
		:table_form.sync="table_form"
		:table_column="table_field"
		>
		<div style="padding-left:10px">
			<dateLap type="2" v-model="table_form.dateLap" @change="fetch" :disabled="true"/>
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
const api_resource = api_common.resource("salary/guaranteed");
export default {
	mixins: [table_mixin],
	data() {
		return {
			loading: true,
			api_resource,
			table_topHeight:230,
			queryDialogFormVisible:true,
			importDialog:false,
			rules:{
				month:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
				],
			},
			fileList1:[],
			downloadUrl:'/salary/guaranteed/title',
			timer:'',
			statusk:1,
			val:'',
			s:1,
			importForm:{},
			template:{
				statusName(column,row){
					if(row.statusName=='未处理'){
						return <el-tag type="danger">{row.statusName}</el-tag>
					}else if(row.statusName=='未审核'){
						return <el-tag type="warning">{row.statusName}</el-tag>
					}else{
						return <el-tag type="success">{row.statusName}</el-tag>
					}
				}
			}
		};
	},
	methods: {
		downLoad(){
			this.handleDownloadChange()
			this.importDialog = false
		},
		changeFormImportFiles(file){
			this.importForm.the_file = file.raw
		},
		async apply(){
			let ids = this.table_selectedRows.map(o=>o.id)
			let mes = await this.$request.post('/salary/guaranteed/workflow',{ids:ids})
			this.$message.success(mes);
			this.fetchTableData()
		},
		async import(){
			this.statusk = 1
			this.importForm = {
				month:this.table_form.dateLap
			}
			this.$nextTick(()=>{
				this.$refs['importForm'].clearValidate()
			})
			this.fileList1 = []
			this.importDialog = true
		},
		async handleImportFormSubmit(){
			await this.form_validate('importForm')
			var formData = new FormData();
			Object.keys(this.importForm).forEach(k=>{
				formData.append(k,this.importForm[k])
			})
			let mes = await this.$request.post('/salary/guaranteed/upload',formData)
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
		
		async getResult(){
			if(this.statusk!=0&&this.s<=12){
				if(this.s==12){
					this.$message.error({ message: '导入失败,请重试'})
				}
				try{
					this.val = await this.$request.get('/salary/guaranteed/upload',{alert:false})
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
			this.table_loading = true;
			const {rows , total }= await this.api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
	},
	async created() {
        const { field, action,table } = await api_common.menuInit('salary/guaranteed');
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table
		this.table_form.dateLap = dayjs().format('YYYY-MM')
        this.fetchTableData()
	}
};
</script>