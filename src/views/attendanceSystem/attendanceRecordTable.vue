  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  class="attendanceRecord-table"
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
				<el-col :span="22">
					<el-form-item label="打卡记录">
						<div style="margin-left:7px;">
							<span v-show="form&&form.attendance_record" style="margin-right:15px;font-size:12px" v-for="item in form.attendance_record" :key="item.id">
								{{item.split(' ')[1]}}
							</span>
						</div>
					</el-form-item>
				</el-col>
				<el-col :span="17">
					<el-row :gutter="30">
						<el-col :span="12">
							<form-render :type="`select`" :field="{name:'上班1',options:form.attendance_record_drop_list}" clearable
							 v-model="onoffdutytimes.OnDutyTime1" style="width:130%" :disabled="onoffdutytimes.OnDutyTime1=='  '"/>
						</el-col>
						<el-col :span="12">
							<form-render :type="`select`" :field="{name:'下班1',options:form.attendance_record_drop_list}" clearable
							 v-model="onoffdutytimes.OffDutyTime1" style="width:130%" :disabled="onoffdutytimes.OffDutyTime1=='  '"/>
						</el-col>
					</el-row>
				</el-col>
				<el-col :span="17">
					<el-row :gutter="30">
						<el-col :span="12">
							<form-render :type="`select`" :field="{name:'上班2',options:form.attendance_record_drop_list}" clearable
								v-model="onoffdutytimes.OnDutyTime2" style="width:130%" :disabled="onoffdutytimes.OnDutyTime2=='  '"/>
						</el-col>
						<el-col :span="12">
							<form-render :type="`select`" :field="{name:'下班2',options:form.attendance_record_drop_list}" clearable
							 v-model="onoffdutytimes.OffDutyTime2" style="width:130%" :disabled="onoffdutytimes.OffDutyTime2=='  '"/>
						</el-col>
					</el-row>
				</el-col>
				<el-col :span="17">
					<el-row :gutter="30">
						<el-col :span="12">
							<form-render :type="`select`" :field="{name:'上班3',options:form.attendance_record_drop_list}" clearable
								v-model="onoffdutytimes.OnDutyTime3" style="width:130%" :disabled="onoffdutytimes.OnDutyTime3=='  '"/>
						</el-col>
						<el-col :span="12">
							<form-render :type="`select`" :field="{name:'下班3',options:form.attendance_record_drop_list}" clearable
							 v-model="onoffdutytimes.OffDutyTime3" style="width:130%" :disabled="onoffdutytimes.OffDutyTime3=='  '"/>
						</el-col>
					</el-row>
				</el-col>
				<el-col :span="17">
					<el-row :gutter="30">
						<el-col :span="12">
							<form-render :type="`select`" :field="{name:'上班4',options:form.attendance_record_drop_list}" clearable
							v-model="onoffdutytimes.OnDutyTime4" style="width:130%" :disabled="onoffdutytimes.OnDutyTime4=='  '"/>
						</el-col>
						<el-col :span="12">
							<form-render :type="`select`" :field="{name:'下班4',options:form.attendance_record_drop_list}" clearable
							 v-model="onoffdutytimes.OffDutyTime4" style="width:130%" :disabled="onoffdutytimes.OffDutyTime4=='  '"/>
						</el-col>
					</el-row>
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

	<vxe-table
		class="public-vxe-table "
		ref="elTable"
		resizable
		show-overflow
		highlight-hover-row
		@select-all="handleChangeSelection"
		@select-change="handleChangeSelection"
		:data="table_data"
		border
		style="width: 100%"
		v-loading="table_loading"
		:header-cell-style="vxeHeaderStyle"
		:height="table_height"
		@sort-change="table_sort_change"
		@cell-click="cellClickEvent"
      	:cell-class-name="cellClassName"
		:seq-config="{seqMethod: VxeIndexMethod}"
		@resizable-change="table_dragend" 
        :row-class-name="rowClassName"
		>
		<!--@resizable-change="table_dragend" -->
		<vxe-table-column 
			type="selection" 
			width="45" 
			class-name="table-column-disabled"
			:selectable="table_disable_selected"
		></vxe-table-column>
        <vxe-table-column type="index" width="40" align="center"></vxe-table-column>
		<!-- <vxe-table-column field="staff__employeeCode" title="工号" fixed="left" width="50">
			<template slot-scope="scope">
				<div v-html="scope.row.staff__employeeCode"  :title="scope.row.staff__employeeCode"></div>
			</template>
		</vxe-table-column>
		<vxe-table-column field="staff__chineseName" title="姓名" fixed="left" width="60">
			<template slot-scope="scope">
				<div v-html="scope.row.staff__chineseName" :title="scope.row.staff__chineseName"></div>
			</template>
		</vxe-table-column>
		<vxe-table-column field="staff__department_name" title="部门" fixed="left" width="80">
			<template slot-scope="scope">
				<div v-html="scope.row.staff__department_name" :title="scope.row.staff__department_name"></div>
			</template>
		</vxe-table-column>
		<vxe-table-column field="staff__team_name" title="小组" fixed="left" width="60">
			<template slot-scope="scope">
				<div v-html="scope.row.staff__team_name" :title="scope.row.staff__team_name"></div>
			</template>.filter(o=>!['staff__employeeCode','staff__chineseName','staff__department_name','staff__team_name'].includes(o.name))
		</vxe-table-column> -->
		<vxe-table-column v-for="field in table_field.
			filter(column=>!column.fed_isvisiable).filter(column=>!column.isvisiable)"
			:key="field.name" :field="field.name" :title="field.showname" :width="field.width=='auto'?'': parseInt(field.width)" :sortable="field.issort" />
	</vxe-table>
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
// const api_pagemanager = api_common.resource('pagemanager/field')
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
import dayjs from 'dayjs'
export default {
	mixins: [table_mixin],
	props:['id','url','m'],
	data() {
		return {
			loading: true,
			// api_pagemanager,
			vxeHeaderStyle:{background:'#F5FAFB',color:'#37474F'},
			width:'40%',
			api_resource :api_common.resource(this.url),
			table_topHeight: 303,
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
			dailyReportID:'',
			timer:'',
			statusk:1,
			val:'',
			onoffdutytimes: {}
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
		cellClassName ({ row, rowIndex, column, columnIndex }) {
			if(row.fieldStyle){
				var obj = JSON.parse(row.fieldStyle)
				for(var key in obj){
					if(key == column.property){
						if(column.title!="星期"){
							return 'col-red'
						}else{
							if(row.restType==2){
								return 'col-bag-pink'
							}else if(row.restType==3){
								return 'col-bag-green'
							}else if(row.restType==4){
								return 'col-bag-yellow'
							}else if(row.restType==5){
								return 'col-bag-purple'
							}else{
								return ''
							}
						}
					}
				}
			}
			if(column.title=='班次'){
				return 'cursor'
			}
		},
		rowClassName ({ row, rowIndex }) {
			if (row.isNorm==false) {
				return 'col-red'
			}
			if(row.checkStatus==1){
				return 'col-bag-gray'
			}
		},
		async check(){
			let rows = this.table_selectedRows.map(row=>row.id)
			await this.$request.put('/attendance/dailyreportcheck',{ids: rows.join(',')})
			this.fetchTableData()
		},
        handleChangeSelection({selection:val}){ // 单选
			this.table_selectedRowsInfo = val
			this.table_selectedRows = val
			this.$emit("update:table_selectedRows",val)
        },
        table_dragend({$rowIndex, column, columnIndex, $columnIndex, fixed, isHidden}){
            let row = this.table_field.find(field=>field.showname===column.title)
            var isEnd = false
            this.table_field.forEach((item,i)=>{
                if(item==row&&i==this.table_field.length-2){
                isEnd = true
                }
            })
            var newWidth = column.resizeWidth
            row.width = newWidth
            row.menuid = row.menuid_id
            api_pagemanager.update(row.id,{
                width:newWidth,
                menuid:row.menuid_id
            },{alert:false})
        },
		async reset(){
			this.statusk = 1
			let mes = await this.$request.post(this.url+'/rest',this.table_form)
			this.$message.success(mes);
			this.timer = setInterval(()=>{
				this.getResult()
			},10000)
		},
		async getResult(){//获取异步结果
			if(this.statusk!=0){
				this.val = await this.$request.get(this.url+'/restresult',{alert:false})
				if(this.val==0){
					this.$message.success({ message: '当前无重置任务'})
					clearInterval(this.timer)
					return 
				}
				if(this.val==2){
					this.statusk = 0
					this.$message.success({ message: '重置成功'})
					this.fetchTableData()
				}
			}else{
				clearInterval(this.timer)
			}
		},
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
		async cellClickEvent({row, rowIndex, column, columnIndex},event){//日考勤记录修改班次
			if(this.m==1&&column.title=='班次'){
				this.form = {}
				this.$nextTick(()=>{
					this.$refs['form'].clearValidate()
				})
				let checkDate = row.YearMonth.split('-')[0]+'-'+row.checkDate
				this.dialogFormVisible = true
				this.dailyReportID = row.id
				this.classData = await this.$request.get('/attendance/intelligentteam/classeslist')
				this.form = await this.$request.get('attendance/dailyreportclassmodify',{
					params:{
						dailyReportID: row.id,
					}
				})
				for(var key in this.form.onoffdutytimes){
					if(this.form.onoffdutytimes[key] == 'disable'){
						this.form.onoffdutytimes[key] = '  '
					}
				}
				this.onoffdutytimes = this.form.onoffdutytimes
				this.$nextTick(()=>{
					this.$refs['form'].clearValidate()
				})
			}
			// if(this.m==1&&column.title=='班次'&&row.fieldStyle){
			// 	var obj = JSON.parse(row.fieldStyle)
			// 	if(obj.attendanceClass__id==10){
			// }
		},
		async handleFormSubmit(){
			this.form.dailyReportID = this.dailyReportID
			let form = Object.assign({},this.form)
			let obj = form.onoffdutytimes
			const result = {}
			
			let arr = []
			for(var k in form.onoffdutytimes){
				if(form.onoffdutytimes[k]!='  ' && form.onoffdutytimes[k]!=''){
					arr.push(form.onoffdutytimes[k])
				}
			}
			var nary = arr.sort();
			for(var i = 0; i < nary.length - 1; i++) {
				if(nary[i] == nary[i + 1]) {
					this.$message.error(`有重复的打卡记录${nary[i]}`)
					return 
				}
			}
			let mes = await this.$request.post('attendance/dailyreportclassmodify',form)
			this.$message.success({message:mes});
			this.dialogFormVisible = false
			this.fetchTableData()
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
    activated(){
        this.$nextTick(()=>{
            this.$refs['elTable'].recalculate()
       })
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
<style lang="scss">
	.attendanceRecord-table {
		.col-red{
			color: red!important;
			.vxe-cell{
				color: red!important;
			}
		}
		.col-bag-gray{
			background-color: #e5e5e5;
		}
		.col-bag-blue{
			background-color:#7ae8ff
		}
		.col-bag-pink{
			background-color:#ffccff
		}
		.col-bag-green{
			background-color:#CAFBE6
		}
		.col-bag-yellow{
			background-color:#FBEEC7
		}
		.col-bag-purple{
			background-color:#DCD5FF
		}
		.vxe-table .vxe-body--column:not(.col--ellipsis), .vxe-table .vxe-footer--column:not(.col--ellipsis), .vxe-table .vxe-header--column:not(.col--ellipsis) {
			padding: 4px 0;
    		line-height: 16px;
		}
		.public-vxe-table.vxe-table .vxe-body--column.col--ellipsis, .public-vxe-table .vxe-table.vxe-editable .vxe-body--column, .public-vxe-table .vxe-table .vxe-footer--column.col--ellipsis, .public-vxe-table .vxe-table .vxe-header--column.col--ellipsis {
			height: 22px;
			color: #000;
		}
		.vxe-table .vxe-cell {
			padding: 0px 4px;
			text-align: center;
			cursor: default;
		}
		.cursor{
			cursor: pointer;
		}
	}
</style>