  <template>
  <ui-table ref="table" 
	:table_column="table_field" 
	:table_query.sync="table_form.query"
	@query="querySubmit"
	>

	<el-dialog
		title="加班申请"
		:visible.sync="dialogFormVisible"
		class="public-dialog"
		v-el-drag-dialog
		width="800px"
		>
		<el-form ref="form" :model="form" label-width="100px" :rules="rule">
			<el-tabs v-model="form_activeName" >
				<el-tab-pane label="添加加班" name="first">
					<el-row>
						<el-col :span="12">
							<form-render :type="`input`" :disabled="true" :field="{name:'加班类型'}" v-model="form.overtimeType"/>
						</el-col>
						<el-col :span="12">
							<form-render prop="remark" :type="`input`" :field="{name:'加班原因'}" v-model="form.remark"/>
						</el-col>
						<el-col :span="12">
							<form-render prop="startTime" :type="`datetime`" :field="{name:'加班开始时间'}" v-model="form.startTime"/>
						</el-col>
						<el-col :span="12">
							<form-render prop="endTime" :type="`datetime`" :field="{name:'加班结束时间'}" v-model="form.endTime"/>
						</el-col>
						<el-col :span="12">
							<form-render prop="duration" :type="`input`" :field="{name:'加班工时'}" v-model="form.duration"/>
						</el-col>
					</el-row>
      				<OrgSelect :result="result" v-model="form.ids" activeNam="first" ref="OrgSelect" v-if="dialogFormVisible"/>
				</el-tab-pane>
				<el-tab-pane label="加班汇总" name="second">
					<p>加班人员汇总表</p>
					<el-table
						class="dtable"
						:data="overData"
						:header-cell-style="headerStyle"
						height="450"
						style="width: 100%;margin-top:20px"
						>
						<el-table-column prop="chinese_name" label="姓名"></el-table-column>
						<el-table-column prop="employee_code" label="工号"></el-table-column>
						<el-table-column prop="startTime" label="加班开始时间" width="120px"></el-table-column>
						<el-table-column prop="endTime" label="加班结束时间" width="120px"></el-table-column>
						<el-table-column prop="duration" label="加班工时"></el-table-column>
						<el-table-column prop="overtimeType" label="加班类型"></el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible = false">取 消</el-button>
			<el-button type="primary" @click="goOverTime" v-if="this.form_activeName=='first'">下一步</el-button>
			<el-button type="primary" @click="handleFormSubmit" v-if="this.form_activeName=='second'">确 定</el-button>
		</div>
    </el-dialog>

	<el-dialog
		title='修改'
		:visible.sync="dialogForm1Visible"
		class="public-dialog"
		v-el-drag-dialog
		width="800px"
		>
		<div>
			<el-form ref="form1" :model="form1" label-width="110px" :rules="rule1">
				<el-row :gutter="20">
					<el-col :span="17" :offset="3">
						<form-render :type="`input`" :field="{name:'员工'}" v-model="form1.staff__chineseName" disabled/>
					</el-col>
					<el-col :span="17" :offset="3">
						<form-render :type="`input`" :field="{name:'加班类型'}" v-model="form1.overtimeType" disabled/>
					</el-col>
					<el-col :span="17" :offset="3">
						<form-render prop="startTime" :type="`datetime`" :field="{name:'加班开始时间'}" v-model="form1.startTime"/>
					</el-col>
					<el-col :span="17" :offset="3">
						<form-render prop="endTime" :type="`datetime`" :field="{name:'加班结束时间'}" v-model="form1.endTime"/>
					</el-col>
					<el-col :span="17" :offset="3">
						<form-render prop="duration" :type="`input`" :field="{name:'加班工时'}" v-model="form1.duration"/>
					</el-col>
					<el-col :span="17" :offset="3">
						<form-render prop="remark" :type="`input`" :field="{name:'加班原因'}" v-model="form1.remark"/>
					</el-col>
				</el-row>
			</el-form>
		</div>

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
		<div style="padding-left:10px" v-show="this.m!=1&&this.m!=4">
			<dateLap type="1" v-model="dateLap1" @change="fetch"/>
		</div>
		<div style="padding-left:10px" v-show="this.m==1||this.m==4">
			<dateLap type='2' v-model="dateLap" @change="fetch"/>
		</div>
		<div style="padding-left:10px" v-if="this.m==4">
			 <!--  -->
			<el-select v-model="depart" placeholder="请选择" @change="changeStatus" style="width:140px">
				<el-option
					v-for="item in departList"
					:key="item.value"
					:label="item.title"
					:value="item.value">
				</el-option>
			</el-select>
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
      	:show-summary="table_config.isShowFooter"
      	:summary-method="getSummaries"
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
	<div v-if="this.m==4&&main" style="margin-top:10px">
		<span>合计正班工时: <span style="font-weight:bold">{{main.RWT}}</span></span>
		<span style="margin-left:10px">合计平时加班:<span style="font-weight:bold"> {{main.RotN}}</span></span>
		<span style="margin-left:10px">合计周末加班: <span style="font-weight:bold"> {{main.RotW}}</span></span>
		<span style="margin-left:10px">合计节假日加班: <span style="font-weight:bold"> {{main.RotL}}</span></span>
		<span style="margin-left:10px">合计总工时: <span style="font-weight:bold"> {{main.total}}</span></span>
	</div>
    <table-pagination v-if="this.m!=4"
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
import OrgSelect from '@/components/Org/OrgSelect'
import dayjs from 'dayjs'
const download = require('downloadjs')
export default {
	mixins: [table_mixin],
	props:['auditStatus','m','url'],
	components:{
		OrgSelect
	},
	data() {
		var checkHours = (rule, value, callback) => {
			if(this.form.endTime!=''&&this.form.startTime!=''&&this.form.endTime!=undefined&&this.form.startTime!=undefined){
				var dur = new Date(this.form.endTime).getTime()-new Date(this.form.startTime).getTime()
				if (!value) {
					return callback(new Error('请输入'));
				}else if (value<0.5) {
					callback(new Error('加班工时至少为0.5小时'));
				}else if (value>dur/(60*1000*60)) {
					callback(new Error('加班工时必须小于等于加班结束时间-加班开始时间'));
				}else{
					callback();
				}
			}
		};
		var checkHours1 = (rule, value, callback) => {
			if(this.form1.endTime!=''&&this.form1.startTime!=''&&this.form1.endTime!=undefined&&this.form1.startTime!=undefined){
				var dur = new Date(this.form1.endTime).getTime()-new Date(this.form1.startTime).getTime()
				if (!value) {
					return callback(new Error('请输入'));
				}else if (value<0.5) {
					callback(new Error('加班工时至少为0.5小时'));
				}else if (value>dur/(60*1000*60)) {
					callback(new Error('加班工时必须小于等于加班结束时间-加班开始时间'));
				}else{
					callback();
				}
			}
		};
		return {
			loading: true,
			api_resource: api_common.resource(this.url),
			queryDialogFormVisible:true,
			dialogFormVisible:false,
			dialogForm1Visible:false,
			table_topHeight:293,
			form:{},
			form1:{},
			result:[],
			depart: '',
			rule:{
				startTime:[
					{ required: true, message: '请选择日期时间', trigger: ['blur','change'] },
				],
				endTime:[
					{ required: true, message: '请选择日期时间', trigger: ['blur','change'] },
				],
				duration:[
					{ required: true, message: '请输入', trigger: ['blur','change'] },
					{ validator: checkHours, trigger:  ['blur', 'change'] }
				],
				remark:[
					{ required: true, message: '请输入', trigger: ['blur','change'] },
				]
			},
			rule1:{
				startTime:[
					{ required: true, message: '请选择日期时间', trigger: ['blur','change'] },
				],
				endTime:[
					{ required: true, message: '请选择日期时间', trigger: ['blur','change'] },
				],
				duration:[
					{ required: true, message: '请输入', trigger: ['blur','change'] },
					{ validator: checkHours1, trigger:  ['blur', 'change'] }
				],
				remark:[
					{ required: true, message: '请输入', trigger: ['blur','change'] },
				]
			},
			html:'',
			dateLap:'',
			dateLap1:'',
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() < new Date().getTime() + 3600*1*1000;
				}
			},
			pickerOptions1: {
				disabledDate:time=> {
                    if (this.form.endTime) {
                        return time.getTime() > new Date(this.form.endTime).getTime();
                    }
				}
			},
            pickerOptions2: {
				disabledDate:time=> {
                    if (this.form.startTime) {
                        return time.getTime() < new Date(this.form.startTime).getTime();
                    }
				}
            },
			departList: [],
			main: {},
			form_activeName: 'first',
			overData: [],
		};
	},
	watch:{
		// auditStatus(){
		// 	delete this.table_form.keyword
		// 	// delete this.table_form.dateLap
		// 	this.table_form.currentpage = 1
			
		// 	this.fetchMenu()
		// 	this.fetchTableData()
		// },
		m(){
            this.api_resource = api_common.resource(this.url)
			delete this.table_form.keyword
			delete this.table_form.sortname
			delete this.table_form.quicksearch
			this.table_form.currentpage = 1
			this.table_form.query.query= []
			this.fetchMenu()
			this.fetchTableData()
		},
	},
	methods: {
		async goOverTime(){
			await this.form_validate()
			let ids = this.$refs.OrgSelect.getAryResult()
			this.form.ids = ids;
			if(this.form.ids.length!=0){
				ids.map(o=>{
					o.startTime = this.form.startTime
					o.endTime = this.form.endTime
					o.overtimeType = this.form.overtimeType
					o.duration = this.form.duration
					o.remark = this.form.remark
					o.chinese_name = o.chineseName
					o.employee_code = o.employeeCode
					o.staff_id  = o.id
					delete o.id
					this.overData.push(o)
				})
				this.form_activeName = 'second'
				this.form = {
					overtimeType: '正常加班'
				}
				this.result = []
				this.$nextTick(()=>{
					this.$refs['form'].clearValidate()
				})
			}else{
				this.$message.error('请选择要添加的人员');
			}
		},
        headerStyle(row,rowIndex,column,columnIndex){
            return "background:rgba(245,250,251,1);box-shadow:0px 1px 0px rgba(228,234,236,1);"
        },
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		async delete(){
			let rows = this.table_selectedRows.map(row=>row.id)
			const mes = await this.$request.post('attendance/overtimedelete',{ids:rows.join(',')})
			this.$message.success({message:mes})
			this.fetchTableData();
		},
		async audit(){
			let rows = this.table_selectedRows.map(row=>row.id)
			await this.$request.put('attendance/overtimeaudit',{ids:rows.join(',')})
			this.fetchTableData();
		},
		add(){
			this.result = []
			this.form = {
				overtimeType: '正常加班'
			}
			this.$nextTick(()=>{
				this.$refs['form'].clearValidate()
			})
			this.dialogFormVisible = true
		},
		ab2str(u,f) {
			var b = new Blob([u]);
			var r = new FileReader();
			r.readAsText(b, 'utf-8');
			r.onload = function (){if(f)f.call(null,r.result)}
		},
		async handleFormSubmit(){
			try{
				let mes = await this.$request.post('/attendance/overtime',JSON.stringify(this.overData),{
					headers: {
						'Content-Type': 'application/json'
					}
				})
				this.$message.success({message:mes});
				this.dialogFormVisible = false
				this.fetchTableData()
			}catch(err){
				
			}
		},
		async edit(){
			let row = this.table_selectedRows[0]
			this.form1 = await this.api_resource.find(row.id)
			this.dialogForm1Visible = true
		},
		async handleForm1Submit(){
			await this.form_validate('form1')
			let form1 = Object.assign({},this.form1)
			try{
				console.log(form1,'11111111111')
				await this.api_resource.update(form1.id,form1,{alert:false})
				this.$message.success('修改成功')
				this.dialogForm1Visible = false
				this.fetchTableData()
			}catch(err){
				this.$message.error(err.response.data);
			}
		},
		changeStatus(val){
			this.depart = val
			this.fetchTableData()
		},
		async fetchTableData() {
			if(this.m==4){
				this.table_form.orgid = this.depart
			}
			this.table_loading = true;
			this.table_form.auditStatus = this.auditStatus
			if(this.m!=1 && this.m!=4){
				this.table_form.dateLap = this.dateLap1
			}else{
				this.table_form.dateLap = this.dateLap
			}
			const {rows , total, main }= await this.api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			this.main = main
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
		async fetchMenu(){
			const { field, action,table } = await api_common.menuInit(this.url+(this.auditStatus||''));
			this.table_field = field;
			this.table_actions = action;
			this.table_config = table
        }
	},
	async created() {
		this.fetchMenu()
		this.departList = await this.$request.get('/hrm/jobtype?tag=OvertimeRatioDepts')
		this.depart = this.departList[0].value
		this.dateLap = dayjs().format('YYYY-MM')
		this.dateLap1 = dayjs().format('YYYY-MM-DD')
		this.fetchTableData();
	}
};
</script>