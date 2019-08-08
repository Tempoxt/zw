  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  
  >

  	<el-dialog
		title="编辑"
		:visible.sync="dialogFormVisible"
		class="public-dialog"
		v-el-drag-dialog
		>
    	<el-form ref="form" :model="form"  label-width="120px" :rules="rules">
				<el-row >
					<el-col :span="14" :offset="4">
						<el-form-item label="月份" prop="month">
							<el-date-picker
								disabled
								v-model="form.month"
								type="month"
								style="width:100%"
								format="yyyy-MM"
								value-format="yyyy-MM"
								placeholder="选择月份">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" disabled prop="staff__chineseName" :field="{name:'姓名'}" v-model="form.staff__chineseName" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="productOverInterest" placeholder="请输入贷款延期利息" :field="{name:'贷款延期利息'}" v-model="form.productOverInterest" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="modelOverInterest" placeholder="请输入模具款延期利息" :field="{name:'模具款延期利息'}" v-model="form.modelOverInterest" />
					</el-col>
				</el-row>
			</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible = false">取 消</el-button>
			<el-button type="primary" @click="handleFormSubmit">确 定</el-button>
		</div>
    </el-dialog>

	<el-dialog
		title="编辑"
		:visible.sync="dialogForm1Visible"
		class="public-dialog"
		v-el-drag-dialog
		>
    	<el-form ref="form1" :model="form1"  label-width="110px" :rules="rules1">
				<el-row >
					<el-col :span="14" :offset="4">
						<el-form-item label="月份" prop="month">
							<el-date-picker
								disabled
								v-model="form1.month"
								type="month"
								style="width:100%"
								format="yyyy-MM"
								value-format="yyyy-MM"
								placeholder="选择月份">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" disabled prop="cusCode" :field="{name:'客户编码'}" v-model="form1.cusCode" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" disabled prop="cusName" :field="{name:'客户简称'}" v-model="form1.cusName" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="balance" placeholder="请输入" :field="{name:'应收货款余额'}" v-model="form1.balance" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="debtAmount" placeholder="请输入" :field="{name:'欠款金额'}" v-model="form1.debtAmount" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="debtInterest" placeholder="请输入" :field="{name:'欠款利息'}" v-model="form1.debtInterest" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="badDebtAmount" placeholder="请输入" :field="{name:'呆坏账金额'}" v-model="form1.badDebtAmount" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="badDebtInterest" placeholder="请输入" :field="{name:'呆坏账利息'}" v-model="form1.badDebtInterest" />
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
		
		<div style="padding-left:10px">
			<dateLap type="2" :disabled="true" v-model="table_form.dateLap" @change="fetchTableData"/>
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
    <each-table-column :table_field="table_field"  :template="template"/>
	<el-table-column
		v-if="this.url=='commission/presoncommcollect'"
		fixed="right"
		label="操作"
		width="100">
		<template slot-scope="scope">
			<el-button @click="handleClick(scope.row)" type="text" size="small">明细</el-button>
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
import dateLap from '@/components/Table/DateLap'
import dayjs from 'dayjs'
import { setTimeout } from 'timers';
const api_resource = api_common.resource("commission/commissionSet/person");
export default {
	mixins: [table_mixin],
	props:['id','url'],
	components:{
		dateLap
	},
	data() {
		return {
			loading: true,
			api_resource,
			orgCategory:[],
			queryDialogFormVisible:true,
			serialnumber:[],
			form:{},
			form1:{},
			form2:{},
			table_topHeight:286,
			dialogForm1Visible:false,
			dialogFormVisible:false,
			importUploadUrl:'commission/commissionSet/person/upload',
			downloadUrl:'commission/commissionSet/person/downtemplate',
			rules:{
				staff__chineseName: [
					{ required: true, message: '请输入', trigger: 'change' },
				],
				month: [
					{ required: true, message: '请选择', trigger: 'change' },
				],
				productOverInterest: [
					{ required: true, message: '请输入', trigger: 'blur' },
				],
				modelOverInterest: [
					{ required: true, message: '请输入', trigger: 'blur' },
				]
			},
			rules1:{
				cusCode: [
					{ required: true, message: '请选择', trigger: 'change' },
				],
				cusName: [
					{ required: true, message: '请选择', trigger: 'change' },
				],
				month: [
					{ required: true, message: '请选择', trigger: 'change' },
				],
				balance: [
					{ required: true, message: '请输入', trigger: 'blur' },
				],
				// debtAmount: [
				// 	{ required: true, message: '请输入', trigger: 'blur' },
				// ],
				// debtInterest: [
				// 	{ required: true, message: '请输入', trigger: 'blur' },
				// ],
				// badDebtAmount: [
				// 	{ required: true, message: '请输入', trigger: 'blur' },
				// ],
				// badDebtInterest: [
				// 	{ required: true, message: '请输入', trigger: 'blur' },
				// ]
			},
			template:{
				ClearState(column,row){
					if(row.ClearState===0){
						return <el-tag type="success">已结付</el-tag>
					}else{
						return <el-tag type="info">未结付</el-tag>
					}
				},
			}
		};
	},
	watch:{
		id(){
			this.fetchTableData()
			// if(this.url!=='commission/receiptCommDetail'){
			// 	this.fetchTableData()
			// }else{
			// 	if(Number(this.id)){
			// 		this.fetchTableData()
			// 	}else{
			// 		return 
			// 	}
			// }
		},
		url(){
			this.table_data = []
            this.fetchMenu()
			this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM'))
			this.table_form.currentpage = 1
			if(this.url=='commission/presoncommcollect'){
				this.importUploadUrl = 'commission/commissionSet/person/upload'
				this.downloadUrl= 'commission/commissionSet/person/downtemplate'
			}else{
				this.importUploadUrl = 'commission/commissionSet/customer/import'
				this.downloadUrl= 'commission/commissionSet/customer/import'
			}
		}
	},
	methods: {
		async reset(){
			if(this.table_form.dateLap!==null){
				if(this.url=='commission/presoncommcollect'){
					const mes = await this.$request.post('/commission/personal/reset',{dateLap:this.table_form.dateLap})
					this.$message.success({message: mes})
				}else if(this.url=='commison/cuscommdetail'){
					const mes = await this.$request.post('/commission/customer/reset',{dateLap:this.table_form.dateLap})
					this.$message.success({message: mes})
				}else{
					const mes = await this.$request.post('commission/reset',{dateLap:this.table_form.dateLap})
					this.$message.success({message: mes})
				}
			}else{
				this.$message.error({message:'请选择月份'})
			}
		},
		async fetchTableData() {
			if(!this.id){
				return
			}
			this.table_loading = true;
			this.table_form.org_id = this.id
			if(this.url=="commission/presoncommcollect"){
				const {rows , total }= await api_resource.get(this.table_form);
				this.table_data  = rows
				this.table_form.total = total
			}else if(this.url=="commison/cuscommdetail"){
				const {rows , total }= await api_common.resource('commission/commissionSet/customer').get(this.table_form)
				this.table_data  = rows
				this.table_form.total = total
			}else{
				const {rows , total }= await api_common.resource('commission/commissionSet/receiptDetail').get(this.table_form)
				this.table_data  = rows
				this.table_form.total = total
			}
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
		handleClick(row){
			this.$emit('change','收款提成明细',row.staff__id)
		},
		async edit(){
			if(this.url=='commission/presoncommcollect'){
				let row = this.table_selectedRowsInfo[0];
				this.dialogFormVisible = true
				this.form = await this.api_resource.find(row.id)
			}else{
				let row = this.table_selectedRowsInfo[0];
				this.dialogForm1Visible = true
				this.form1 = await this.$request.get('/commission/commissionSet/customer/update/'+row.id)
			}
			
		},
		async handleFormSubmit(){
            await this.form_validate()
            let form = Object.assign({},this.form)
            await this.api_resource.update(form.id,form)
			this.dialogFormVisible = false
			this.fetchTableData()
		},
		form1_validate(form = 'form1'){
		return new Promise((resolve,reject)=>{
			this.$refs[form].validate((valid) => {
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
            let form = Object.assign({},this.form1)
            await this.$request.put('/commission/commissionSet/customer/update/'+form.id,form)
			this.dialogForm1Visible = false
			this.fetchTableData()
		},
		async fetchMenu(){
			const { field, action,table } = await api_common.menuInit(this.url);
			this.table_field = field;
			this.table_actions = action;
			this.table_config = table
			setTimeout(()=>{
				this.fetchTableData();
			},500)
		}
	},
	async created() {
		await this.fetchMenu()
		this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM'))
	}
};
</script>


