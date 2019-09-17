<template>
  <ui-table ref="table" 
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
					<form-render :type="`day`" :field="{name:'生效日期'}" prop="transferDate" v-model="form.transferDate"/>
				</el-col>
				<el-col :span="12">
					<form-render :type="`select`" :field="{name:'调动区域',options:areaDa}" v-model="form.workGroup" clearable filterable/>
				</el-col>
			</el-row>
		</el-form>

		<OrgSelect v-model="form.ids" ref="OrgSelect" v-if="dialogFormVisible"/>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible = false">取 消</el-button>
			<el-button type="primary"  @click="handleFormSubmit">确 定</el-button>
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
			form:{},
			api_resource,
			orgCategory:[],
			queryDialogFormVisible:true,
			adminList:[],
			defaultForm,
			roomAdminList:[],
			dormList:[],
			dialogFormVisible:false,
			form:{
				transferDate:'',
				team:'',
				workGroup:'',
				ids:''
			},
			optionsDa:[],
			areaDa:[],
			rules:{
				transferDate:[
					{ required: true, message: '请选择日期', trigger: 'blur' },
				],
				department:[
					{ required: true, message: '请选择', trigger: 'blur' },
				],
			},
		};
	},

	methods: {
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		async handleFormSubmit(){
			this.form.ids = this.$refs.OrgSelect.getIdsResult()
			let form = Object.assign({},this.form)
			// if(this.form.team!==''||this.form.workGroup!==''){
				if(this.form.ids!==''){
					let repeat = await this.$request.post('/transfer/record',form,{alert:false})
					if(repeat.length!==0){
						var rep = repeat.map(o=>o)
						this.$message.error({message:'创建失败,'+rep+'已在该小组',duration:12000})
					}else{
						this.$message.success({message:'创建成功'})
					}
					this.dialogForm3Visible = false
					this.fetchTableData()
				}else{
					this.$message.error('请选择需要调动的人员');
				}
			// }else{
			// 	this.$message.error('请选择需要调动的区域或小组');
			// }
		},
		add(){
			this.form = {
				team:'',
				workGroup:'',
				ids:''
			}
			this.$set(this.form,'transferDate',dayjs().format('YYYY-MM-DD'))
			this.dialogFormVisible = true
			this.getOptions();
			this.getAreas()
		},
		async fetchTableData() {
			this.table_loading = true;
			this.table_form.org_id = this.id
			const {rows , total }= await api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
		async getOptions(){//获取调至小组的下拉选项
			this.optionsDa = (await this.$request.get('/org/teamselect')).map(o=>{return {label:o.name,value:o.id}})
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


