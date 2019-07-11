<template>
	<ui-table ref="table" 
		:table_column="table_field" 
		:table_query.sync="table_form.query"
		@query="querySubmit"
		>

		<el-dialog
			:title="dialogStatus==='insert'?'手动添加':'编辑'"
			:visible.sync="dialogFormVisible"
			class="public-dialog"
			v-el-drag-dialog
			>
			<div style="width:500px;margin:0 auto">
				<el-form ref="form" :model="form" label-width="100px" :rules="rules">
					<el-row :gutter="20">
						<el-col :span="24">
							<form-render :type="`select`" prop="invoiceType" :field="{name:'发票类型',options:optionData}" v-model="form.invoiceType"/>
						</el-col>
						<el-col :span="24">
							<form-render :type="`input`" prop="invoiceCode" :field="{name:'发票代码'}" v-model="form.invoiceCode"/>
						</el-col>
						<el-col :span="24">
							<form-render :type="`input`" prop="invoiceNumber" :field="{name:'发票号码'}" v-model="form.invoiceNumber" />
						</el-col>
						<el-col :span="24">
							<form-render :type="`day`" :field="{name:'开票日期'}" v-model="form.invoiceDate" />
						</el-col>
						<el-col :span="24">
							<form-render :type="`input`" prop="amount" :field="{name:'金额'}" v-model="form.amount" />
						</el-col>
						<el-col :span="24">
							<form-render :type="`textarea`" :field="{name:'备注'}" v-model="form.remark" />
						</el-col>
					</el-row>
				</el-form>
			</div>

			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleFormSubmit">确 定</el-button>
			</div>
		</el-dialog>

		<el-dialog
			title="扫码添加"
			:visible.sync="dialogForm2Visible"
			class="public-dialog"
			v-el-drag-dialog
			>
			<div style="width:500px;margin:0 auto">
				<el-form ref="form2" :model="form2" label-width="100px" :rules="rules2">
					<el-row :gutter="20">
						<el-col :span="24">
							<form-render :type="`select`" prop="invoiceType" placeholder="请选择发票类型" :field="{name:'发票类型',options:optionData}" v-model="form2.invoiceType"/>
						</el-col>
						<el-col :span="24">
							<el-form-item label="发票代码">
								<el-input v-model="form2.invoiceCode" prop="invoiceCode"  placeholder="请扫描发票二维码"  ref="input" @keyup.enter.native="submitInvoice"></el-input>
							</el-form-item>
							<!-- <form-render :type="`input`" prop="invoiceCode" :field="{name:''}" ref="input" v-model="form2.invoiceCode"/> -->
							<!-- handleForm2Submit -->
						</el-col>
					</el-row>
				</el-form>
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
						v-for="item in optionDatas"
						:key="item.type"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			</div>
			<div style="padding-left:10px">
				<dateLap v-model="table_form.dateLap" @change="fetchTableData"/>
			</div>	
		</table-header>
		<el-table
			@selection-change="handleChangeSelection"
			:data="table_data"

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
import dateLap from '@/components/Table/DateLap'
import dayjs from 'dayjs'
const api_resource = api_common.resource("productrecheck/invoicerecheck");
let baseUrl = process.env.VUE_APP_STATIC

export default {
    mixins: [table_mixin],
	components:{
		dateLap
	},
    data() {
        return {
          baseUrl,
          loading: true,
          form:{},
          form2:{},
          api_resource,
          orgCategory:[],
          queryDialogFormVisible:true,
          table_height:window.innerHeight-256,
          optionData:[],
		  dialogForm2Visible:false,
		  dialogFormVisible:false,
		  status:'全部',
		  optionDatas:[],
          rules:{
            invoiceType:[
                { required: true, message: '请选择', trigger: 'change' },
            ],
            invoiceCode:[
                { required: true, message: '请输入',trigger: 'blur' }
            ],
            amount:[
                { required: true, message: '请输入', trigger: 'blur' },
            ],
            invoiceNumber:[
                { min: 8, max: 8, message: '长度为8位', trigger: 'blur' }
            ]
		  },
		  rules2:{
            invoiceType:[
                { required: true, message: '请选择', trigger: 'change' },
            ],
            invoiceCode:[
                { required: true, message: '请输入',trigger: 'blur' }
            ],
          }
        };
    },
    watch:{
		'form2.invoiceType'(){
			if(this.form2.invoiceType!=''){
				this.inputFocus()
			}
		}
    },
    methods: {
		invioce_validate(){
            return new Promise((resolve,reject)=>{
                this.$refs.form2.validate((valid) => {
                if(valid){
                    resolve()
                }else{
                    reject()
                    return false
                }
                })
            })
        },
		changeStatus(val){
			this.status = val
			this.table_form.invoiceType = val
			this.fetchTableData()
		},
		inputFocus(){
			this.$nextTick(()=>{
				this.$refs.input.focus()
			})
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
        async add(){
			this.addItem = '手动添加'
            this.form = {}
            this.optionData = (await api_common.resource('productrecheck/getallinvoicetype').get()).map(o=>{return {label:o.title,value:o.type}});
            this.dialogFormVisible = true
		},
		async scan(){
			this.addItem = '扫码添加'
			this.form2 = {}
            this.optionData = (await api_common.resource('productrecheck/getallinvoicetype').get()).map(o=>{return {label:o.title,value:o.type}});
            this.dialogForm2Visible = true
		},
        async edit(){
			this.$nextTick(()=>{
                this.$refs['form'].clearValidate()
            })
            this.dialogFormVisible = true
            this.optionData = (await api_common.resource('productrecheck/getallinvoicetype').get()).map(o=>{return {label:o.title,value:o.type}});
            let row = this.table_selectedRows[0]
            this.form = await api_resource.find(row.id);
        },
        async handleFormSubmit(){
            await this.form_validate()
			let form = Object.assign({},this.form)
            if(this.isInsert){
				await api_resource.create(form)
            }else{
                await api_resource.update(form.id,this.form)
            }
            this.dialogFormVisible = false
            this.fetchTableData()
		},
		async submitInvoice(){
			await this.invioce_validate()
			
            let form2 = Object.assign({},this.form2)
			if(form2.invoiceType&&form2.invoiceCode!=''){
				try {
					await this.$request.post('/productrecheck/invoicerecheck/scan',form2)
					this.dialogForm2Visible = false
					setTimeout(() => {
						this.fetchTableData()
					}, 500);
				} catch (error) {
					console.log(error,'err')
				}
			}
		}
    },
    async created() {
        const { field, action,table } = await api_common.menuInit("productrecheck/invoicerecheck");
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table
		this.table_form.dateLap = dayjs().format('YYYY-MM')
		this.optionDatas = (await api_common.resource('productrecheck/getallinvoicetype').get()).map(o=>{return {label:o.title,value:o.type}});
		this.optionDatas.push({value:0,label:'全部'})
		this.table_form.invoiceType = 0
        this.fetchTableData();
    }
};
</script>



