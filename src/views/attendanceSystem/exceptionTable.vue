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
		<el-form ref="form" :model="form" label-width="100px" :rules="rule">
 			<el-tabs v-model="form_activeName" >
				<el-tab-pane label="添加补卡" name="first">
					<el-row>
						<el-col :span="12">
							<form-render prop="exceptionType" :type="`select`" :field="{name:'补卡类型',options:attenData}" v-model="form.exceptionType"/>
						</el-col>
						<el-col :span="12">
							<form-render prop="exceptionTime" :type="`datetime`" :field="{name:'补打卡时间'}" v-model="form.exceptionTime"/>
						</el-col>
						<el-col :span="12">
							<form-render :type="`input`" :field="{name:'补卡原因'}" v-model="form.exceptionReason"/>
						</el-col>
					</el-row>
					
      				<OrgSelect :result="result" v-model="form.ids" activeNam="first" ref="OrgSelect" v-if="dialogFormVisible"/>

				</el-tab-pane>
				<el-tab-pane label="补卡汇总" name="second">
					<p>补卡人员汇总表</p>
					<el-table
						class="dtable"
						:data="summarData"
						:header-cell-style="headerStyle"
						height="450"
						style="width: 100%;margin-top:20px"
						>
						<el-table-column prop="departmentName" label="部门"></el-table-column>
						<el-table-column prop="teamName" label="小组"></el-table-column>
						<el-table-column prop="chineseName" label="姓名"></el-table-column>
						<el-table-column prop="employeeCode" label="工号"></el-table-column>
						<el-table-column prop="exceptionTime" label="补卡时间"></el-table-column>
						<el-table-column prop="exceptionTypeDesc" label="补卡类型"></el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible = false">取 消</el-button>
			<el-button type="primary" @click="goSummary" v-if="this.form_activeName=='first'">确 定</el-button>
			<el-button type="primary" @click="handleFormSubmit" v-if="this.form_activeName=='second'">提 交</el-button>
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
			<el-form ref="form1" :model="form1" label-width="110px" :rules="rule">
				<el-row :gutter="20">
					<el-col :span="17" :offset="3">
						<form-render :type="`input`" :field="{name:'员工'}" v-model="form1.staff__chineseName" disabled/>
					</el-col>
					<el-col :span="17" :offset="3">
						<form-render prop="exceptionType" :type="`select`" :field="{name:'补卡类型',options:attenData}" v-model="form1.exceptionType"/>
					</el-col>
					<el-col :span="17" :offset="3">
						<form-render prop="exceptionTime" :type="`datetime`" :field="{name:'补打卡时间'}" v-model="form1.exceptionTime"/>
					</el-col>
					<el-col :span="17" :offset="3">
						<form-render :type="`input`" :field="{name:'补卡原因'}" v-model="form1.exceptionReason"/>
					</el-col>
				</el-row>
			</el-form>
		</div>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm1Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm1Submit" :disabled="disabled">确 定</el-button>
		</div>
    </el-dialog>

	<el-dialog
		title="添加"
		:visible.sync="dialogForm3Visible"
		class="public-dialog"
		v-el-drag-dialog
		width="800px"
		>

		<el-form ref="form3" :model="form3" label-width="110px" :rules="rule3">
			<el-row>
				<el-col :span="12">
					<el-form-item label="调休日期" prop="fallsDate">
						<el-date-picker
							:picker-options="pickerOptions1"
							v-model="form3.fallsDate"
							type="date"
							format="yyyy-MM-dd"
							value-format="yyyy-MM-dd"
							style="width:100%"
							placeholder="选择日期">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="调休加班日期" prop="fallsWorkDate">
						<el-date-picker
							:picker-options="pickerOptions2"
							v-model="form3.fallsWorkDate"
							type="date"
							format="yyyy-MM-dd"
							value-format="yyyy-MM-dd"
							style="width:100%"
							placeholder="选择日期">
						</el-date-picker>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>

      	<OrgSelect :result="result" v-model="form3.ids" ref="OrgSelect3" :activeNam="this.judge?'':'first'" v-if="dialogForm3Visible"/>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm3Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm3Submit" :disabled="disabled3">确 定</el-button>
		</div>
    </el-dialog>

	<el-dialog
		title='编辑'
		:visible.sync="dialogForm4Visible"
		class="public-dialog"
		v-el-drag-dialog
		width="800px"
		>
		<div>
			<el-form ref="form4" :model="form4" label-width="110px" :rules="rule3">
				<el-row :gutter="20">
					<el-col :span="17" :offset="3">
						<form-render :type="`input`" :field="{name:'员工姓名'}" v-model="form4.staff__chineseName" disabled/>
					</el-col>
					<el-col :span="17" :offset="3">
						<el-form-item label="调休日期" prop="fallsDate">
							<el-date-picker
								:picker-options="pickerOptions1"
								v-model="form4.fallsDate"
								type="date"
								format="yyyy-MM-dd"
								value-format="yyyy-MM-dd"
								style="width:100%"
								placeholder="选择日期">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="17" :offset="3">
						<el-form-item label="调休加班日期" prop="fallsWorkDate">
							<el-date-picker
								:picker-options="pickerOptions3"
								v-model="form4.fallsWorkDate"
								type="date"
								format="yyyy-MM-dd"
								value-format="yyyy-MM-dd"
								style="width:100%"
								placeholder="选择日期">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm4Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm4Submit" :disabled="disabled4">确 定</el-button>
		</div>
    </el-dialog>

	<el-dialog
		:title="dialogStatus=='letoffAdd'?'添加':'编辑'"
		:visible.sync="dialogForm5Visible"
		class="public-dialog"
		v-el-drag-dialog
		width="800px"
		>
		<el-form ref="form5" :model="form5" label-width="110px" :rules="rule3">
			<el-row v-if="dialogStatus=='letoffEdit'">
				<el-col :span="12">
					<form-render :type="`input`" :field="{name:'姓名'}" disabled v-model="form5.staff__chineseName"/>
				</el-col>
				<el-col :span="12">
					<form-render :type="`input`" :field="{name:'工号'}" disabled v-model="form5.staff__employeeCode"/>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<form-render prop="letOffStartDate" :type="`day`" :field="{name:'放休开始日期'}" v-model="form5.letOffStartDate"/>
				</el-col>
				<el-col :span="12">
					<form-render prop="letOffEndDate" :type="`day`" :field="{name:'放休结束日期'}" v-model="form5.letOffEndDate"/>
				</el-col>
				<el-col :span="12">
					<form-render prop="letOffDay" :type="`inputSuffix`" placeholder="系统自动计算" suffix="小时" :field="{name:'放休工时'}" disabled v-model="letOffDay"/>
				</el-col>
				<el-col :span="12">
					<form-render prop="lefOffReason" :type="`textarea`"  autosize :row="1" :field="{name:'放休原因'}" v-model="form5.lefOffReason"/>
				</el-col>
			</el-row>
		</el-form>

      	<OrgSelect :result="result" v-model="form5.ids" ref="OrgSelect5" :activeNam="this.judge?'':'first'" v-if="dialogForm5Visible&&dialogStatus=='letoffAdd'"/>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm5Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm5Submit">确 定</el-button>
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
			<el-select v-model="status" placeholder="请选择" @change="changeStatus" style="width:140px">
				<el-option
					v-for="item in optionDatas"
					:key="item.type"
					:label="item.label"
					:value="item.value">
				</el-option>
			</el-select>
		</div>
		<div style="padding-left:10px" v-if="this.m==3">
			<el-select v-model="status3" placeholder="请选择" @change="changeStatus3" style="width:140px" :clearable="true">
				<el-option
					v-for="item in attenDatas"
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
import OrgSelect from '@/components/Org/OrgSelect'
import dayjs from 'dayjs'
export default {
	mixins: [table_mixin],
	props:['id','url','m'],
	components:{
		OrgSelect
	},
	data() {
		return {
			loading: true,
            form_activeName:'first',
			api_resource:api_common.resource(this.url),
			table_topHeight:293,
			queryDialogFormVisible:true,
			dialogFormVisible:false,
			dialogForm1Visible:false,
			dialogForm3Visible:false,
			dialogForm4Visible:false,
			dialogForm5Visible:false,
			optionDatas: [],
			attenDatas:[],
			attenData:[],
			status:'全部',
			status3:'',
			form:{},
			form1:{
				exceptionType: null,
				exceptionTime: null
			},
			form3:{},
			form4:{
				fallsDate: null,
				fallsWorkDate: null
			},
			form5:{
				letOffStartDate:'',
				letOffEndDate:'',
			},
			result:[],
			rule:{
				exceptionType:[
					{ required: true, message: '请选择', trigger: ['blur','change'] },
				],
				exceptionTime:[
					{ required: true, message: '请选择日期时间', trigger: ['blur','change'] },
				],

			},
			rule3:{
				letOffStartDate:[
					{ required: true, message: '请选择日期', trigger: ['blur','change'] },
				],
				letOffEndDate:[
					{ required: true, message: '请选择日期', trigger: ['blur','change'] },
				],
				// letOffDay:[
				// 	{ required: true, message: '请输入', trigger: ['blur','change'] },
				// ],
				lefOffReason:[
					{ required: true, message: '请输入', trigger: ['blur','change'] },
				],
			},
			pickerOptions1: {
				disabledDate(time) {
					return time.getTime() < new Date().getTime() + 3600*1*1000;
				}
			},
            pickerOptions2: {
				disabledDate:time=> {
                    if (this.form3.fallsDate) {
                        return time.getTime() < new Date(this.form3.fallsDate).getTime();
                    }else{
						return time.getTime() < new Date().getTime() + 3600*1*1000
					}
				}
			},
            pickerOptions3: {
				disabledDate:time=> {
                    if (this.form4.fallsDate) {
                        return time.getTime() < new Date(this.form4.fallsDate).getTime();
                    }else{
						return time.getTime() < new Date().getTime() + 3600*1*1000
					}
				}
			},
			judge:false,
			timer:'',
			statusk:1,
			val:'',
			letOffDay:'',
			summarData: [],
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
			if (this.form3.fallsDate!=null&&this.form3.fallsWorkDate!=null) {
				return false
			}
			return true
		},
		disabled4(){
			if (this.form4.fallsDate!=null&&this.form4.fallsWorkDate!=null) {
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
			this.table_form.currentpage = 1
			this.table_form.query.query= []
			this.fetchMenu()
		},
		'form5.letOffStartDate'(){
			this.getComputeDay()
		},
		'form5.letOffEndDate'(){
			this.getComputeDay()
		},
	},
	methods: {
        headerStyle(row,rowIndex,column,columnIndex){
            return "background:rgba(245,250,251,1);box-shadow:0px 1px 0px rgba(228,234,236,1);"
        },
		async goSummary(){
			await this.form_validate()
			let ids = this.$refs.OrgSelect.getAryResult()
			this.form.ids = ids;
			let exceptionTypeDesc = (this.attenData.filter(o=>o.value==this.form.exceptionType))[0].label
			if(this.form.ids.length!=0){
				ids.map(o=>{
					o.exceptionTime = this.form.exceptionTime
					o.exceptionType = this.form.exceptionType
					o.exceptionTypeDesc = exceptionTypeDesc
					o.exceptionReason = this.form.exceptionReason
					this.summarData.push(o)
				})
				this.form_activeName = 'second'
				this.form = {}
				this.result = []
				this.$nextTick(()=>{
					this.$refs['form'].clearValidate()
				})
			}else{
				this.$message.error('请选择要添加的人员');
			}
		},
		async getComputeDay(){
			if(this.form5.letOffStartDate!==''&&this.form5.letOffEndDate!==''&&this.form5.letOffStartDate!==undefined&&this.form5.letOffEndDate!==undefined){
				const {day,hour} = await this.$request.get('holidaymanager/outoffmanager/computeday',{params:{
					letOffStartDate:this.form5.letOffStartDate,
					letOffEndDate:this.form5.letOffEndDate,
				}})
				this.letOffDay = hour
			}
		},
		table_disable_selected(row){
			if(this.m=='3'&&row.creator&&row.creator=='OA'){
				return false
			}else{
				return true
			}
		},
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		changeStatus(val){
			this.status = val
			this.fetchTableData()
		},
		changeStatus3(val){
			this.status3 = val
			this.fetchTableData()
		},
		async getResult(){//获取异步结果
			if(this.statusk!=0){
				this.val = await this.$request.get('holidaymanager/leavemanager/resetresult',{alert:false})
				if(this.val=='重置成功'){
					this.statusk = 0
					this.$message.success({ message: this.val})
					this.fetchTableData()
				}
			}else{
				clearInterval(this.timer)
			}
		},
		async reset(){
			const mes = await this.$request.post(this.url+'/reset',{dateLap:this.table_form.dateLap})
			this.$message.success(mes)
			if(this.m==1){
				this.fetchTableData();
			}else if(this.m==2){
				this.timer = setInterval(()=>{
					this.getResult()
				},10000)
			}
		},
		async delete(){
			let rows = this.table_selectedRows.map(row=>row.id)
			if(this.m==3){
				var mes = await this.$request.post('/attendance/exception/exceptiondelete',{ids:rows.join(',')})
			}else if(this.m==4){
				var mes = await this.$request.get('holidaymanager/currentmonthfalls/bluk',{params:{ids:rows.join(',')}})
			}else if(this.m==5){
				var mes = await this.$request.get('holidaymanager/outoffmanager/bluk',{params:{ids:rows.join(',')}})
			}
			this.$message.success(mes)
			this.fetchTableData()
		},
		async add(){
			this.result = []
			this.summarData = []
			this.form_activeName = 'first'
			if(this.m==3){
				this.form={}
				this.attenData = (await api_common.resource('attendance/exceptionfields').get()).map(o=>{return {label:o.name,value:o.id}});
				// let attend = this.attenData.slice(1)
				// this.attenData = attend
				this.$nextTick(()=>{
					this.$refs['form'].clearValidate()
				})
				this.dialogFormVisible = true
			}else if(this.m==4){
				this.form3={}
				this.$nextTick(()=>{
					this.$refs['form3'].clearValidate()
				})
				this.dialogForm3Visible = true
				this.judge = await this.$request.get('holidaymanager/currentmonthfalls/judge')
			}else if(this.m==5){
				this.dialogStatus = 'letoffAdd'
				this.letOffDay = ''
				this.form5={}
				this.$nextTick(()=>{
					this.$refs['form5'].clearValidate()
				})
				this.dialogForm5Visible = true
				this.judge = await this.$request.get('holidaymanager/currentmonthfalls/judge')
			}
		},
		async edit(){
			let row = this.table_selectedRows[0]
			if(this.m==3){
				this.attenData = (await api_common.resource('attendance/exceptionfields').get()).map(o=>{return {label:o.name,value:o.id}});
				let attend = this.attenData.slice(1)
				this.attenData = attend
				this.dialogForm1Visible = true;
				this.form1 = (await this.api_resource.find(row.id))[0]
				let exceptionReason = this.form1.exceptionReason.replace(/<[^>]+>/g, "");//去除字符串中的html
				this.form1.exceptionReason = exceptionReason.replace(/&nbsp;/ig, " ");//去除字符串中的&nbsp;
			}else if(this.m==4){
				this.form4 = await this.api_resource.find(row.id)
				this.dialogForm4Visible = true
			}else if(this.m==5){
				this.form5 = (await this.api_resource.find(row.id))[0]
				this.dialogStatus = 'letoffEdit'
				this.dialogForm5Visible = true
			}
		},
		async handleFormSubmit(){
			// if(this.summarData)
			try{
				let mes = await this.$request.post('attendance/exception',JSON.stringify(this.summarData),{
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
		async handleForm1Submit(){
			await this.form_validate('form1')
			let form1 = Object.assign({},this.form1)
			try{
				await this.api_resource.update(form1.id,form1,{alert:false})
				this.$message.success('修改成功')
				this.dialogForm1Visible = false
				this.fetchTableData()
			}catch(err){
				this.$message.error(err.response.data);
			}
		},
		async handleForm3Submit(){
			await this.form_validate('form3')
			let ids3 = this.$refs.OrgSelect3.getIdsResult()
			this.form3.ids = ids3;
			if(this.form3.ids!==''){
				try{
					let mes = await this.api_resource.create(this.form3)
					this.$message.success({message:mes});
					this.dialogForm3Visible = false
					this.fetchTableData()
				}catch(err){
					
				}
			}else{
				this.$message.error('请选择要添加的人员');
			}
		},
		async handleForm4Submit(){
			await this.form_validate('form4')
			let form4 = Object.assign({},this.form4)
			try{
				await this.api_resource.update(form4.id,form4,{alert:false})
				this.$message.success('修改成功')
				this.dialogForm4Visible = false
				this.fetchTableData()
			}catch(err){
				this.$message.error(err.response.data);
			}
		},
		async handleForm5Submit(){
			await this.form_validate('form5')
			if(this.dialogStatus=='letoffAdd'){
				let ids5 = this.$refs.OrgSelect5.getIdsResult()
				this.form5.ids = ids5;
				let form5 = Object.assign({},this.form5)
				if(form5.ids!==''){
					try{
						let mes = await this.api_resource.create(form5)
						this.$message.success({message:mes});
						this.dialogForm5Visible = false
						this.fetchTableData()
					}catch(err){
						
					}
				}else{
					this.$message.error('请选择要添加的人员');
				}
			}else{
				let form5 = Object.assign({},this.form5)
				let mes = await this.api_resource.update(form5.id,form5)
				this.dialogForm5Visible = false
				this.fetchTableData()
			}
		},
		async fetchTableData() {
			if(!this.id){
				return
			}
			this.table_loading = true;
			this.table_form.org_id = this.id
			if(this.m==2){
				this.optionDatas = (await api_common.resource('holidaymanager/leavetypelist').get()).map(o=>{return {label:o.selectname,value:o.selectname}});
				this.optionDatas.unshift({value:'全部',label:'全部'})
				this.table_form.leaveType = this.status
				delete this.table_form.exceptionType 
			}else if(this.m==3){
				this.attenDatas = (await api_common.resource('attendance/exceptionfields').get()).map(o=>{return {label:o.name,value:o.id}});
				this.table_form.exceptionType = this.status3
				delete this.table_form.leaveType 
			}else{
				delete this.table_form.exceptionType 
				delete this.table_form.leaveType 
			}
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
		await this.fetchMenu()
	}
};
</script>