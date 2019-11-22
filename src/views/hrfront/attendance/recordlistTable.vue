  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
   class="mini-table"
  >

	<el-dialog
		title="请选择月份"
		:visible.sync="dialogForm1Visible"
		class="public-dialog"
		v-el-drag-dialog
		width="520px"
		>
		<el-form ref="form1" :model="form1">
			<el-row>
				<el-col :span="24" style="padding:20px;">
					<el-date-picker
					   	:clearable="false"
						v-model="form1.month"
						type="month"
						size="small"
						format="yyyy年MM月"
						value-format="yyyy-MM"
						placeholder="选择月份">
					</el-date-picker>
				</el-col>
			</el-row>
		</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm1Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm1Submit" :disabled="disabled1">确 定</el-button>
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
	  <el-table-column type="index" :index="indexMethod" width="50" fixed/>
		<el-table-column prop="staff__employeeCode" sortable label="工号" fixed>
			<template slot-scope="scope">
				<span v-html="scope.row.staff__employeeCode" :title="scope.row.staff__employeeCode" class="default-span"></span>
			</template>
		</el-table-column>
		<el-table-column prop="staff__chineseName" label="姓名" fixed>
			<template slot-scope="scope">
				<span v-html="scope.row.staff__chineseName" :title="scope.row.staff__chineseName" class="default-span"></span>
			</template>
		</el-table-column>
		<el-table-column prop="staff__department__name" label="部门" fixed>
			<template slot-scope="scope">
				<span v-html="scope.row.staff__department__name" :title="scope.row.staff__department__name" class="default-span"></span>
			</template>
		</el-table-column>
		<el-table-column prop="staff__principalship__name" label="职位" fixed>
			<template slot-scope="scope">
				<span v-html="scope.row.staff__principalship__name" :title="scope.row.staff__principalship__name" class="default-span"></span>
			</template>
		</el-table-column>
		<el-table-column prop="CheckDateSub" label="日期" fixed>
			<template slot-scope="scope">
				<span v-html="scope.row.CheckDateSub" :title="scope.row.CheckDateSub" class="default-span"></span>
			</template>
		</el-table-column>
		<each-table-column :table_field="table_field.filter(o=>!['staff__employeeCode','staff__chineseName','staff__department__name','staff__principalship__name','CheckDateSub'].includes(o.name))"/>
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
const api_resource = api_common.resource("attendance/recordlist");
import dayjs from 'dayjs'

export default {
    mixins: [table_mixin],
    props:['id'],
    data() {
		return {
			loading: true,
			api_resource,
			queryDialogFormVisible:true,
            table_topHeight:210,
			importUploadUrl:"/attendance/record",
			dialogForm1Visible:false,
			form1:{
				month:''
			}
		};
	},
	computed:{
		disabled1(){
			if(this.form1.month!==''&&this.form1.month!==undefined){
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
    },
    methods: {
		async reset(){
			this.form1.month = ''
			this.dialogForm1Visible = true
		},
		async handleForm1Submit(){
			this.dialogForm1Visible = false
			const mes = await this.$request.post('attendance/recordlist/syndata',{month:this.form1.month})
			this.$message.success({message: mes,duration:4000})
			this.fetchTableData()
		},
      	fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
      	cellStyle({row,column,rowIndex,columnIndex}){
        	if(row.Remark!=''&&row.Remark!=null){
          		return 'color:red'
        	}else if(column.label=="星期"){
          		if(row.weekday=='六'||row.weekday=='日'){
            		return 'background-color:rgb(245, 250, 251);'
          		}
        	}else if(column.label=="假日"){
          		if(row.RestType=='1'){
            		return 'background-color:#f2353c;'
          		}else if(row.RestType=='2'){
					return 'background-color:#1fd361;'
				}else if(row.RestType=='3'){
					return 'background-color:#0bb2d4;'
				}else if(row.RestType=='4'){
					return 'background-color:#ff5698;'
				}else if(row.RestType=='5'){
					return 'background-color:#f4af24;'
				}else if(row.RestType=='6'){
					return 'background-color:#f47a24;'
				}else if(row.RestType=='9'){
					return 'background-color:#68f59c;'
				}else if(row.RestType=='10'){
					return 'background-color:#1cbe57;'
				}
        	}
      	},
		async fetchTableData() {
			if(!this.id){
				return
			}
			this.table_loading = true;
			this.table_form.org_id = this.id
			this.table_form.sheetType = 2
			const {rows , total }= await api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
    },
    async created() {
		const { field, action,table } = await api_common.menuInit("attendance/recordlist");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.table_form.dateLap = dayjs().format('YYYY-MM')
		this.fetchTableData();
    }
};
</script>


