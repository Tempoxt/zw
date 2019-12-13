  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  >

	<el-dialog
		title="班次修改"
		:visible.sync="dialogFormVisible"
		class="public-dialog selectClass"
		v-el-drag-dialog
		width="800px"
		>
		<el-form ref="form" :model="form" label-width="110px" :rules="rule">
			<el-row>
				<el-col :span="17">
					<el-form-item label="打卡记录">
						<div style="margin-left:7px;">
							<span v-show="form&&form.attendance_record" style="margin-right:15px;font-size:12px" v-for="item in form.attendance_record" :key="item.id">{{item}}</span>
						</div>
					</el-form-item>
				</el-col>
				<el-col :span="17">
					<el-form-item label="当前班次" prop="classes_id">
						<el-select v-model="form.classes_id" placeholder="请选择" filterable style="width:100%">
							<el-option
								v-for="item in classData"
								:key="item.id"
								:label="item.ret_str"
								:value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible = false">取 消</el-button>
			<el-button type="primary" @click="handleFormSubmit" :disabled="disabled">确 定</el-button>
		</div>
    </el-dialog>

    <table-header
		:table_actions="table_actions"
		:table_selectedRows="table_selectedRows"
		@action="handleAction"
		:table_form.sync="table_form"
		:table_column="table_field"
		>
		<div style="padding-left:10px" v-if="this.m==1">
			<el-select v-model="table_form.dailystate" placeholder="请选择" @change="fetch" style="width:140px">
				<el-option
					v-for="item in optionDatas"
					:key="item.value"
					:label="item.label"
					:value="item.value">
				</el-option>
			</el-select>
		</div>
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
		@cell-click="editSchedule"
    	>
		<el-table-column 
			type="selection" 
			width="60" 
			class-name="table-column-disabled"
			:selectable="table_disable_selected"
			>
		</el-table-column>
		 <el-table-column type="index" :index="indexMethod" fixed/>
		 <el-table-column prop="staff__employeeCode" label="工号" fixed>
			<template slot-scope="scope">
				<div v-html="scope.row.staff__employeeCode" :title="scope.row.staff__employeeCode"></div>
			</template>
		</el-table-column>
		<el-table-column prop="staff__chineseName" label="姓名" fixed>
			<template slot-scope="scope">
				<div v-html="scope.row.staff__chineseName" :title="scope.row.staff__chineseName"></div>
			</template>
		</el-table-column>
		<el-table-column prop="staff__department_name" label="部门" fixed>
			<template slot-scope="scope">
				<div v-html="scope.row.staff__department_name" :title="scope.row.staff__department_name"></div>
			</template>
		</el-table-column>
		<el-table-column prop="staff__team_name" label="小组" fixed>
			<template slot-scope="scope">
				<div v-html="scope.row.staff__team_name" :title="scope.row.staff__team_name"></div>
			</template>
		</el-table-column>
		<each-table-column :table_field="table_field.filter(o=>!['staff__employeeCode','staff__chineseName','staff__department_name','staff__team_name'].includes(o.name))"/>
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
export default {
	mixins: [table_mixin],
	props:['id','url','m'],
	data() {
		return {
			loading: true,
			api_resource:api_common.resource(this.url),
			table_topHeight:276,
			queryDialogFormVisible:true,
			dialogFormVisible:false,
			form:{
				classes_id:''
			},
			classData:[],//班次列表
			optionDatas:[],
			rule:{
				classes_id:[
					{ required: true, message: '请选择', trigger: ['blur','change'] },
				],
			},
			dailyReportID:''
		};
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
		id(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		url(){
            this.api_resource = api_common.resource(this.url)
			delete this.table_form.keyword
			delete this.table_form.sortname
			this.table_form.currentpage = 1
			this.table_form.query.query= []
			this.fetchMenu()
		}
	},
	methods: {
		table_disable_selected(row){
			if(this.m=='1'&&row.auditStatus==1){
				return false
			}else{
				return true
			}
		},
		fetch(){
			this.table_form.currentpage = 1
			this.fetchMenu()
		},
		async audit(){
			let rows = this.table_selectedRows.map(row=>row.id)
			await this.$request.put('attendance/dailyreportaudit',{ids:rows.join(',')})
			this.fetchTableData()
		},
		async editSchedule(row,column,cell,event){//日考勤记录修改班次
			if(this.m==1&&column.label=='班次'){
				if(event.target.innerHTML.indexOf('red')!=-1||event.target.style.color=='red'||event.target.innerText=='	'||event.target.innerText==''){
					this.form = {}
					this.$nextTick(()=>{
						this.$refs['form'].clearValidate()
					})
					this.dialogFormVisible = true
					this.dailyReportID = row.id
					this.classData = await this.$request.get('/attendance/intelligentteam/classeslist')
					this.form = (await this.$request.get('attendance/classmanager/already/single',{
						params:{
							staff_id: row.staff__employeeCode,
							class_date: row.checkDate
						}
					}))[0]
				}
			}
		},
		async handleFormSubmit(){
			this.form.dailyReportID = this.dailyReportID
			let form = Object.assign({},this.form)
			let mes = await this.$request.post('attendance/dailyreportclassmodify',form)
			this.$message.success({message:mes});
			this.dialogFormVisible = false
			this.fetchTableData()
		},
		cellStyle({row,column,rowIndex,columnIndex}){
			if(column.label=="星期"&&row.fieldStyle){
				var fields = JSON.parse(row.fieldStyle)
				if(fields.weekDay==1){
					return 'background-color:#7ae8ff;'
				}else if(fields.weekDay==2){
					return 'background-color:#ffccff;'
				}else{
					return ''
				}
			}
		},
		async fetchTableData() {
			if(!this.id){
				return
			}
			this.table_loading = true;
			this.table_form.org_id = this.id
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
		this.table_form.dateLap = dayjs().format('YYYY-MM')
		if(this.m==1){
			var options = await api_common.resource('attendance/dailystatefields').get()
			this.optionDatas = options.map(o=>{return {label:o.name,value:o.code}});
			this.table_form.dailystate = options[0].code
		}
		await this.fetchMenu()
	}
};
</script>