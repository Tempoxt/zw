  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  >

	<el-dialog
		:title="dialogStatus==='insert'?'添加排班':'修改排班'"
		:visible.sync="dialogFormVisible"
		class="public-dialog"
		v-el-drag-dialog
		width="800px"
		>

		<el-form ref="form" :model="form" label-width="100px" :rules="rule">
			<el-row>
				<el-col :span="19">
					<el-form-item label="已选员工">
						<div>
							<el-tag
								style="margin-right:10px"
								v-for="tag in selectedRow"
								:key="tag.staff_id"
								closable
								@close="handleClose(tag)"
								type="info">
								{{tag.chineseName}}
							</el-tag>
						</div>
					</el-form-item>
				</el-col>
				<el-col :span="19">
					<el-form-item label="使用班次" prop="class_id">
						<el-select v-model="form.class_id" placeholder="请选择" filterable style="width:100%">
							<el-option
								v-for="item in classData"
								:key="item.id"
								:label="item.ret_str"
								:value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="19" v-if="dialogStatus==='insert'">
					<el-form-item label="开始日期" prop="start_date">
						<el-date-picker
							:picker-options="pickerOptions1"
							v-model="form.start_date"
							type="date"
							format="yyyy-MM-dd"
							value-format="yyyy-MM-dd"
							style="width:100%"
							placeholder="开始日期">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="19" v-else>
					<form-render :type="`day`" prop="start_date" :field="{name:'开始日期'}" v-model="form.start_date"/>
				</el-col>
				<el-col :span="19" v-if="dialogStatus==='insert'">
					<el-form-item label="结束日期">
						<el-date-picker
							:picker-options="pickerOptions1"
							v-model="form.end_date"
							type="date"
							format="yyyy-MM-dd"
							value-format="yyyy-MM-dd"
							style="width:100%"
							placeholder="结束日期">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="19" v-else>
					<el-form-item label="结束日期">
						<el-date-picker
							:picker-options="pickerOptions2"
							v-model="form.end_date"
							type="date"
							format="yyyy-MM-dd"
							value-format="yyyy-MM-dd"
							style="width:100%"
							placeholder="结束日期">
						</el-date-picker>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible = false">取 消</el-button>
			<el-button type="primary" @click="handleFormSubmit">确 定</el-button>
		</div>
    </el-dialog>

	<el-dialog
		title="修改班次"
		:visible.sync="dialogForm3Visible"
		class="public-dialog"
		v-el-drag-dialog
		width="800px"
		>

		<el-form ref="form3" :model="form3" label-width="110px" :rules="rule3">
			<el-row>
				<el-col :span="17">
					<el-form-item label="打卡记录">
						<div style="margin-left:7px;">
							<span v-show="form3&&form3.attendance_record" style="margin-right:15px;font-size:12px" v-for="item in form3.attendance_record" :key="item.id">{{item}}</span>
						</div>
					</el-form-item>
				</el-col>
				<el-col :span="17">
					<el-form-item label="当前班次" prop="classes_id">
						<el-select v-model="form3.classes_id" placeholder="请选择" filterable style="width:100%">
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
			<el-button @click="dialogForm3Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm3Submit" :disabled="disabled3">确 定</el-button>
		</div>
    </el-dialog>

    <table-header
		:table_actions="table_actions"
		:table_selectedRows="table_selectedRows"
		@action="handleAction"
		:table_form.sync="table_form"
		:table_column="table_field"
		>
		<div style="padding-left:10px" v-if="this.m==2">
			<dateLap v-model="table_form.dateLap" @change="fetch" :disabled="true"/>
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
		<el-table-column prop="employeeCode" label="工号" fixed>
			<template slot-scope="scope">
				<div v-html="scope.row.employeeCode" :title="scope.row.employeeCode"></div>
			</template>
		</el-table-column>
		<el-table-column prop="chineseName" label="姓名" fixed>
			<template slot-scope="scope">
				<div v-html="scope.row.chineseName" :title="scope.row.chineseName"></div>
			</template>
		</el-table-column>
		<el-table-column prop="department_name" label="部门" fixed>
			<template slot-scope="scope">
				<div v-html="scope.row.department_name" :title="scope.row.department_name"></div>
			</template>
		</el-table-column>
		<el-table-column prop="team_name" label="小组" fixed>
			<template slot-scope="scope">
				<div v-html="scope.row.team_name" :title="scope.row.team_name"></div>
			</template>
		</el-table-column>
		<each-table-column :table_field="table_field.filter(o=>!['employeeCode','chineseName','department_name','team_name'].includes(o.name))"/>
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
			table_topHeight:293,
			queryDialogFormVisible:true,
			dialogFormVisible:false,
			dialogForm3Visible:false,
			dialogForm4Visible:false,
			dialogForm5Visible:false,
			form:{},
			form1:{
				class_id: null,
				start_date: null
			},
			form3:{},
			form4:{},
			result:[],
			rule:{
				class_id:[
					{ required: true, message: '请选择', trigger: ['blur','change'] },
				],
				start_date:[
					{ required: true, message: '请选择日期时间', trigger: ['blur','change'] },
				],
			},
			rule3:{
				classes_id:[
					{ required: true, message: '请选择', trigger: ['blur','change'] },
				],
			},
			days:'',//每月天数
			selectedRow:[],//选中要修改排班的人员
			classData:[],//班次列表
			pickerOptions1:{
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7;
				}
			},
			pickerOptions2:{
				disabledDate:time=> {
                    if (this.form.start_date) {
                        return time.getTime() < new Date(this.form.start_date).getTime();
					}
					else{
						return time.getTime() < new Date().getTime() + 3600*1*1000
					}
				}
				// disabledDate(time) {
				// 	return time.getTime() < new Date(this.form.end_date).getTime();
				// }
			},
			dialogStatus:'insert',
		};
	},
	computed:{
		disabled(){
			if(this.form1.exceptionType!=null&&this.form1.exceptionTime!=null){
				return false
			}
			return true
		},
		disabled3(){
			if(this.form3.classes_id!=''){
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
			if(this.m==1){
				delete this.table_form.dateLap
			}else{
				this.table_form.dateLap = dayjs().format('YYYY-MM')
			}
			this.table_form.currentpage = 1
			this.table_form.query.query= []
			this.fetchMenu()
		}
	},
	methods: {
		fetch(){
			this.table_form.currentpage = 1
			this.fetchMenu()
		},
		async schedule(){
			this.dialogStatus = 'insert'
			this.form={}
			this.$nextTick(()=>{
				this.$refs['form'].clearValidate()
			})
			this.selectedRow = this.table_selectedRows.map(row=>row)
            this.classData = await this.$request.get('/attendance/intelligentteam/classeslist')
			this.dialogFormVisible = true
		},
		handleClose(tag){
			this.selectedRow.splice(this.selectedRow.indexOf(tag), 1);
		},
		async editClass(){
			this.dialogStatus = 'edit'
			this.form = {}
			this.$nextTick(()=>{
				this.$refs['form'].clearValidate()
			})
			this.selectedRow = this.table_selectedRows.map(row=>row)
            this.classData = await this.$request.get('/attendance/intelligentteam/classeslist')
			this.dialogFormVisible = true;
		},
		async handleFormSubmit(){
			await this.form_validate()
			if(this.selectedRow.length!=0){
				let staff_id = this.selectedRow.map(row=>row.staff_id)
				this.form.ids = staff_id.join(',')
				let form = Object.assign({},this.form)
				if(this.dialogStatus == 'insert'){
					try{
						let mes = await this.api_resource.create(form)
						this.$message.success({message:mes});
						this.dialogFormVisible = false
						this.fetchTableData()
					}catch(err){

					}
				}else{
					await this.$request.put('attendance/classmanager/already',form)
					this.dialogFormVisible = false
					this.fetchTableData()
				}
			}else{
				this.$message.error('请选择要添加的人员');
			}
		},
		async editSchedule(row,column,cell,event){//已排班修改单条记录
			if(this.m==2&&column.type!='index'&&column.type!="selection"&&column.label!='工号'&&column.label!='姓名'&&column.label!='部门'&&column.label!='小组'){
				let day = column.property.split('day')[1]
				let date = this.table_form.dateLap+'-'+day
				if(new Date(date)<new Date()){
					if(event.target.innerHTML.indexOf('red')!=-1||event.target.style.color=='red'||event.target.innerText=='	'||event.target.innerText==''){
						this.form3 = {}
						this.dialogForm3Visible = true
						this.classData = await this.$request.get('/attendance/intelligentteam/classeslist')
						this.form3 = (await this.$request.get('attendance/classmanager/already/single',{
							params:{
								staff_id: row.employeeCode,
								class_date: date
							}
						}))[0]
						this.$nextTick(()=>{
							this.$refs['form3'].clearValidate()
						})
					}
				}
			}
		},
		async handleForm3Submit(){
			try{
				let form3 = Object.assign({},this.form3)
				await this.$request.put('attendance/classmanager/already/single',form3)
				this.dialogForm3Visible = false
				this.fetchTableData()
			}catch(err){
				
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
		getMonthDays(year,month){
			var stratDate = new Date(year,month-1,1),
			endData = new Date(year,month,1);
			this.days = (endData -stratDate)/(1000*60*60*24);
			return this.days;
		},
		async fetchMenu(){
			const { field, action,table } = await api_common.menuInit(this.url);
			if(this.m==1){
				this.table_field = field;
			}else{
				this.getMonthDays(this.table_form.dateLap.split('-')[0],this.table_form.dateLap.split('-')[1])
				for(var i=1;i<this.days+1;i++){
					this.table_field = field;
					let fields = {
						catolog: "",
						fieldtype: "text",
						icon: "",
						id: 2144+i,
						isblank: true,
						iseditable: false,
						isquicksearch: false,
						issearch: false,
						issort: false,
						isvisiable: false,
						menuid_id: 335,
						name: "day"+i,
						remark: "",
						showname: i+"日",
						sort: '',
						sourcefrom: "",
						validation: "",
						width: "auto",
					}
					if(i<10){
						fields.name =  "day0"+i
					}
					this.table_field.push(fields)
				}
			}
			this.table_actions = action;
			this.table_config = table
			this.fetchTableData()
		}
	},
	async created() {
		this.table_form.dateLap = dayjs().format('YYYY-MM')
		await this.fetchMenu()
	}
};
</script>