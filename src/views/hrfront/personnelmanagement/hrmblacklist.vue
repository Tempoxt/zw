<template>
	<ui-table ref="table" 
		:table_column="table_field" 
		:table_query.sync="table_form.query"
		@query="querySubmit"
		>

		<el-dialog
			:title="dialogStatus==='insert'?'添加':'编辑'"
			:visible.sync="dialogFormVisible"
			class="public-dialog"
			v-el-drag-dialog
			width="800px"
			>

			<el-form ref="form" :model="form" label-width="100px" :inline="true" :rules="rules">
				<el-row :gutter="40">
					<el-col :span="12">
						<el-row :gutter="0">
							<el-col :span="24">
								<form-render :type="`input`" :field="{name:'姓名'}" v-model="form.chineseName"/>
							</el-col>
						
							<el-col :span="24">
								<form-render prop="idCard" :type="`input`" :field="{name:'身份证号'}" v-model="form.idCard"/>
							</el-col>
						
							<el-col :span="24">
								<form-render
									:type="`radio`"
									:field="{name:'性别',options:[{
									value: 1,
									label: '男'
									},{
									value: 2,
									label: '女'
									}]}"
									v-model="form.sex"
									prop="sex"
								/>
							</el-col>   
						</el-row>
					</el-col>
					<el-col :span="12">
						<el-row :gutter="0">
							<el-col :span="24">
								<form-render :type="`input`" :field="{name:'籍贯'}" v-model="form.provinse"/>
							</el-col>
							<el-col :span="24">
								<form-render :type="`input`" :field="{name:'状况说明'}" v-model="form.explain"/>
							</el-col>
						</el-row>
					</el-col>
				</el-row>
			</el-form>

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
			<!-- <div style="padding-left:10px">
				<dateLap v-model="table_form.dateLap" @change="fetchTableData"/>
			</div> -->
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
const api_resource = api_common.resource("hrmblacklist/record");
import dateLap from '@/components/Table/DateLap'
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
		dateLap,
		OrgSelect
	},
	data() {
		return {
			loading: true,
			form:{},
			api_resource,
			orgCategory:[],
			queryDialogFormVisible:true,
			table_height:window.innerHeight-236,
			adminList:[],
			defaultForm,
			roomAdminList:[],
			dormList:[],
			dialogFormVisible:false,
			optionsDa:[],
			areaDa:[],
			rules:{
				idCard: [
					{ required: true, message: '请输入', trigger: 'blur' },
				],
			}
		};
	},
	methods: {
		async handleFormSubmit(){
			await this.form_validate()
            let form = Object.assign({},this.form)
			if(this.isInsert){
				await this.$request.post('/hrmblacklist/record',this.form)
			}else{
				await api_resource.update(form.id,form,{alert:false})
				this.$message.success('修改成功')
			}
			this.dialogFormVisible = false
			this.fetchTableData()
		},
		add(){
			this.form = {}
			this.dialogFormVisible = true
		},
		async edit(){
			this.dialogFormVisible = true
            let row = this.table_selectedRows[0];
			this.form = await this.$request.get('/hrmblacklist/record/'+row.id)
		},
		delete(){
			let rows = this.table_selectedRows.map(row=>row.id)
			this.api_resource.remove(rows.join(','))
			this.fetchTableData()
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
	},
	async created() {
		const { field, action,table } = await api_common.menuInit("hrmblacklist/record");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM'))
		this.fetchTableData();
	}
};
</script>



