<template>
  <ui-table 
  	class="public-table-container"
	ref="table" 
    :table_column="table_field" 
    :table_query.sync="table_form.query"
    @query="querySubmit"
    >

	<el-dialog
		title="员工调动"
		:visible.sync="dialogFormVisible"
		class="public-dialog"
		v-el-drag-dialog
		width="800px"
		>
		<el-form ref="form" :model="form" label-width="100px" :rules="rules">
			<el-row>
				<el-col :span="12">
					<form-render prop="department" :type="`depart`" :field="{name:'调动部门'}" v-model="form.department"/>
				</el-col>
				<el-col :span="12">
					<form-render :type="`branchteam`" :field="{name:'调至小组',id:form.department}" v-model="form.team" clearable/>
				</el-col>
				<el-col :span="12">
					<form-render :type="`day`" :field="{name:'生效日期'}" prop="transferDate" v-model="form.transferDate" :picker-options="pickerOptions"/>
				</el-col>
				<el-col :span="12">
					<form-render :type="`select`" :field="{name:'调动区域',options:areaDa}" v-model="form.workGroup" clearable filterable/>
				</el-col>
			</el-row>
		</el-form>

		<OrgSelect v-model="form.ids" :result="result" ref="OrgSelect" v-if="dialogFormVisible"/>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible = false">取 消</el-button>
			<el-button type="primary"  @click="handleFormSubmit">确 定</el-button>
		</div>
	</el-dialog>

	<el-dialog
		title="员工调动修改"
		:visible.sync="dialogForm1Visible"
		class="public-dialog"
		v-el-drag-dialog
		width="800px"
		>
			<el-form ref="form1" :model="form1" label-width="110px" :rules="rules1">
		
				<form-render :type="`input`" :field="{name:'姓名'}" v-model="form1.chineseName" disabled/>
			
				<form-render :type="`input`" :field="{name:'调前部门'}" v-model="form1.oDepartName__name" disabled/>

				<form-render :type="`input`" :field="{name:'调前小组'}" v-model="form1.oTeam__name" disabled/>

				<form-render :type="`input`" :field="{name:'调前地点'}" v-model="form1.oWorkGroup__name" disabled/>

				<form-render :type="`input`" :field="{name:'调后部门'}" v-model="form1.nDepartName__name" disabled/>

				<form-render :type="`branchteam`" :field="{name:'调后小组',id:form1.nDepartment}" v-model="form1.nTeam" clearable/>

				<form-render :type="`select`" :field="{name:'调后地点',options:areaDa}" v-model="form1.nWorkGroup" clearable filterable/>

				<form-render :type="`day`" :field="{name:'生效日期'}" prop="transferDate" :clearable="false" v-model="form1.transferDate" :picker-options="pickerOptions1"/>

		</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm1Visible = false">取 消</el-button>
			<el-button type="primary"  @click="handleForm1Submit">确 定</el-button>
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
		:cell-style="cellStyle"
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
const api_resource = api_common.resource("transfer/record");
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
	props:{
		value:{},
	},
	components:{
		OrgSelect
	},
	data() {
		return {
			loading: true,
			api_resource,
			orgCategory:[],
			queryDialogFormVisible:true,
			adminList:[],
			defaultForm,
			roomAdminList:[],
			dormList:[],
			dialogFormVisible:false,
			dialogForm1Visible:false,
			form:{
				transferDate:'',
				team:'',
				ids:''
			},
			form1:{},
			areaDa:[],
			result:[],
      		table_topHeight:233,
			rules:{
				transferDate:[
					{ required: true, message: '请选择日期', trigger: 'blur' },
				],
				department:[
					{ required: true, message: '请选择', trigger: 'blur' },
				],
			},
			rules1:{
				transferDate:[
					{ required: true, message: '请选择日期', trigger: 'blur' },
				],
			},
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7;
				}
			},
			pickerOptions1: {
				disabledDate(time) {
					return time.getTime() < Date.now();
				}
			},
			template:{
				source(column,row){
					if(row.source==1){
						return <span>OA</span>
					}else{
						return <span>手动添加</span>
					}
				},
				isTransfer(column,row){
					if(row.isTransfer==1){
						return <el-tag type="success">已生效</el-tag>
					}else{
						return <el-tag type="danger">未生效</el-tag>
					}
				}
			}
		};
	},

	methods: {
		async delete(){
			let rows = this.table_selectedRows.map(row=>row.id)
			await this.$request.delete('transfer/record/bluk?ids='+rows.join(','))
			this.$message.success({message:'删除成功'})
			this.fetchTableData()
		},
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		cellStyle({row, column, rowIndex, columnIndex}){
			if((row.nDepartment!==row.oDepartment&&column.label == '调后部门')||(row.nPrincipalship!==row.oPrincipalship&&column.label == '调后职位')
			||(row.nWorkGroup!==row.oWorkGroup&&column.label == '调后工作地点')||(row.nTeam!==row.oTeam&&column.label == '调后小组')){
				return 'color:#F2353C;cursor:default'
			}else{
				return ''
			}
		},
		
		add(){
			this.result = []
			this.form = {
				team:'',
				workGroup:'',
				ids:'',
				department:''
			}
			this.dialogFormVisible = true
			this.getAreas()
		},
		async edit(){
			this.dialogForm1Visible = true
            let row = this.table_selectedRows[0];
			this.form1 = await api_resource.find(row.id)
			this.getAreas()
		},
		async handleForm1Submit(){
			let form1 = Object.assign({},this.form1)
			await api_resource.update(form1.id,form1)
			// let mes = await this.$request.put('/transfer/record',form1)
			// this.$message.success({message:mes})
			this.dialogForm1Visible = false
			this.fetchTableData()
		},
		async handleFormSubmit(){
			await this.form_validate()
			this.form.ids = this.$refs.OrgSelect.getIdsResult()
			if(this.form.ids!==''){
				if(this.form.workGroup==''){
					delete this.form.workGroup
				}
				let form = Object.assign({},this.form)
				try{
					let mes = await api_resource.create(form)
					// let mes = await this.$request.post('/transfer/record',form)
					this.$message.success({message:mes})
					this.dialogFormVisible = false
					this.fetchTableData()
				}catch(err){

				}
			}else{
				this.$message.error('请选择需要调动的人员');
			}
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
		async getAreas(){//获取调至区域的下拉选项
			this.areaDa = (await this.$request.get('/officeaddress')).map(o=>{return {label:o.officeaddressname,value:o.id}})
		},
	},
	async created() {
		const { field, action,table } = await api_common.menuInit("transfer/record");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM'))
		this.fetchTableData();
	}
};
</script>


