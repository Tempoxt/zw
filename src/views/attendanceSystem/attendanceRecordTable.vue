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

		<el-form ref="form" :model="form" label-width="100px">
			<el-radio-group v-model="form.class_id">
				<el-row style="margin-top:15px;">
					<el-col :span="19" :offset="2" v-for="item in classData" :key="item.id">
						<el-radio :label="item.id" style="margin-bottom: 18px;">
							<span style="margin-right:30px">{{item.className}}</span>
							<span v-if="item.onDutyTime1!=null&&item.offDutyTime1!=null">{{item.onDutyTime1}} - {{item.offDutyTime1}}</span>
							<span v-if="item.onDutyTime2!=null&&item.offDutyTime2!=null">,  &nbsp;&nbsp;{{item.onDutyTime2}} - {{item.offDutyTime2}}</span>
							<span v-if="item.onDutyTime3!=null&&item.offDutyTime3!=null">,  &nbsp;&nbsp;{{item.onDutyTime3}} - {{item.offDutyTime3}}</span>
							<span v-if="item.onDutyTime4!=null&&item.offDutyTime4!=null">,  &nbsp;&nbsp;{{item.onDutyTime4}} - {{item.offDutyTime4}}</span>
						</el-radio>
					</el-col>
				</el-row>
			</el-radio-group>
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
    	>
		<el-table-column 
			type="selection" 
			width="60" 
			class-name="table-column-disabled"
			:selectable="table_disable_selected"
			>
		</el-table-column>
		 <el-table-column type="index" :index="indexMethod" fixed/>
            <el-table-column prop="staff__employeeCode" sortable label="工号" fixed/>
            <el-table-column prop="staff__chineseName" label="姓名" fixed>
                <template slot-scope="scope">
                    <div v-html="scope.row.staff__chineseName"></div>
                </template>
            </el-table-column>
            <el-table-column prop="staff__department_name" sortable label="部门" fixed/>
            <el-table-column prop="staff__team_name" sortable label="小组" fixed/>
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
				class_id:''
			},
			classData:[],//班次列表
			optionDatas:[],
		};
	},
	computed:{
		disabled(){
			if(this.form.class_id!=null&&this.form.class_id!=''){
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
		fetch(){
			this.table_form.currentpage = 1
			this.fetchMenu()
		},
		async audit(){
			let rows = this.table_selectedRows.map(row=>row.id)
			await this.$request.put('attendance/dailyreportaudit',{ids:rows.join(',')})
			this.fetchTableData()
		},
		async edit(){
			this.form = {}
            this.classData = await this.$request.get('/attendance/intelligentteam/classeslist')
			this.dialogFormVisible = true;
		},
		async handleFormSubmit(){
			console.log(this.form,'ffff')
			// await this.$request.put('attendance/classmanager/already',form)
			// this.dialogFormVisible = false
			// this.fetchTableData()
		},
		async fetchTableData() {
			if(!this.id){
				return
			}
			this.table_loading = true;
			this.table_form.org_id = this.id
			if(this.m==1){
				var options = await api_common.resource('attendance/dailystatefields').get()
				this.optionDatas = options.map(o=>{return {label:o.name,value:o.code}});
				this.table_form.dailystate = options[0].code
			}
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
			this.table_field = field;
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