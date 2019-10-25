  <template>
  <ui-table ref="table" 
	:table_column="table_field" 
	:table_query.sync="table_form.query"
	@query="querySubmit"
	>

	<el-dialog
		:title="dialogStatus==='insert'?'新增班次':'编辑班次'"
		:visible.sync="dialogFormVisible"
		class="public-dialog"
		v-el-drag-dialog
		width="960px"
		>
		<div class="h-full">
			<el-form ref="form" :model="form" label-width="70px" :rules="rule"  class="h-full shift_form" style="height:630px;margin:0 10px;">
				<el-scrollbar wrap-class="scrollbar-wrapper" class="scroll"> 
					<p class="shift_time" style="color:#0BB2D4;margin:12px 0 25px 0px;font-weight:bold">班次时间</p>
					<el-row>
						<el-col :span="10">
							<form-render prop="className" :type="`input`" :field="{name:'班次名称'}" v-model="form.className"/>
						</el-col>
						<el-col :span="10" :offset="4">
							<form-render prop="classDesc" :type="`input`" :field="{name:'班次说明'}" v-model="form.classDesc"/>
						</el-col>
						<el-col :span="10">
							<form-render :type="`inputSuffix`" prop="positiveTime" suffix="时" :field="{name:'班次时间'}" v-model="form.positiveTime"/>
						</el-col>
						<el-col :span="10" :offset="4">
							<form-render :type="`inputSuffix`" suffix="时" :field="{name:'考勤加班'}" v-model="form.overTime"/>
						</el-col>
						<el-col :span="10">
							<form-render :type="`inputSuffix`" suffix="分" :field="{name:'打卡间隔'}" v-model="form.punchCardGap"/>
						</el-col>
					</el-row>
					<el-row class="shift_set">
						<el-col :span="1" style="margin-left:10px" class="mt10">
							<div>&nbsp;</div>
							<el-checkbox v-model="timeSolt1"></el-checkbox>
						</el-col>
						<el-col :span="17">
							<el-row>
								<el-col :span="9">
									<form-render label-width="52px"  prop="onDutyTime1" :type="`time`" :field="{name:'上班1'}" v-model="form.onDutyTime1"/>
								</el-col>
								<el-col :span="2" class="mt5">
									<el-checkbox v-model="form.isExcuseOnDutyCard1">免卡</el-checkbox>
								</el-col>
								<el-col :span="12">
									<form-render class="range_time" prop="signInTime1" label-width="90px" :type="`timerange`" :field="{name:'签到时间'}" v-model="form.signInTime1"/> 
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="9">
									<form-render label-width="52px" prop="offDutyTime1" :type="`time`" :field="{name:'下班1'}" v-model="form.offDutyTime1"/>
								</el-col>
								<el-col :span="2" class="mt5">
									<el-checkbox v-model="form.isExcuseOffDutyCard1">免卡</el-checkbox>
								</el-col>
								<el-col :span="12">
									<form-render class="range_time" prop="signOutTime1" label-width="90px" :type="`timerange`" :field="{name:'签退时间'}" v-model="form.signOutTime1"/> 
								</el-col>
							</el-row>
						</el-col>
					
						<el-col :span="5">
							<div>&nbsp;</div>
							<el-form-item label="休息时间(分)" label-width="85px">
								<el-input-number v-model="form.restTime1" :min="0" :max="30"></el-input-number>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row class="straight">
						<el-col :span="24"><el-checkbox v-model="form.straight1_2">直通</el-checkbox></el-col>
					</el-row>
					<el-row class="shift_set">
						<el-col :span="1" style="margin-left:10px" class="mt10">
							<div>&nbsp;</div>
							<el-checkbox v-model="timeSolt2"></el-checkbox>
						</el-col>
						<el-col :span="17">
							<el-row>
								<el-col :span="9">
									<form-render label-width="52px"  prop="onDutyTime2" :type="`time`" :field="{name:'上班2'}" v-model="form.onDutyTime2"/>
								</el-col>
								<el-col :span="2" class="mt5">
									<el-checkbox v-model="form.isExcuseOnDutyCard2">免卡</el-checkbox>
								</el-col>
								<el-col :span="12">
									<form-render class="range_time" prop="signInTime2" label-width="90px" :type="`timerange`" :field="{name:'签到时间'}" v-model="form.signInTime2"/> 
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="9">
									<form-render label-width="52px" prop="offDutyTime2" :type="`time`" :field="{name:'下班2'}" v-model="form.offDutyTime2"/>
								</el-col>
								<el-col :span="2" class="mt5">
									<el-checkbox v-model="form.isExcuseOffDutyCard2">免卡</el-checkbox>
								</el-col>
								<el-col :span="12">
									<form-render class="range_time" prop="signOutTime2" label-width="90px" :type="`timerange`" :field="{name:'签退时间'}" v-model="form.signOutTime2"/> 
								</el-col>
							</el-row>
						</el-col>
					
						<el-col :span="5">
							<div>&nbsp;</div>
							<el-form-item label="休息时间(分)" label-width="85px">
								<el-input-number v-model="form.restTime2" :min="0" :max="30"></el-input-number>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row class="straight">
						<el-col :span="24"><el-checkbox v-model="form.straight2_3">直通</el-checkbox></el-col>
					</el-row>
					<el-row class="shift_set">
						<el-col :span="1" style="margin-left:10px" class="mt10">
							<div>&nbsp;</div>
							<el-checkbox v-model="timeSolt3"></el-checkbox>
						</el-col>
						<el-col :span="17">
							<el-row>
								<el-col :span="9">
									<form-render label-width="52px" :type="`time`" :field="{name:'上班3'}" v-model="form.onDutyTime3"/>
								</el-col>
								<el-col :span="2" class="mt5">
									<el-checkbox v-model="form.isExcuseOnDutyCard3">免卡</el-checkbox>
								</el-col>
								<el-col :span="12">
									<form-render class="range_time" label-width="90px" :type="`timerange`" :field="{name:'签到时间'}" v-model="form.signInTime3"/>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="9">
									<form-render label-width="52px" :type="`time`" :field="{name:'下班3'}" v-model="form.offDutyTime3"/>
								</el-col>
								<el-col :span="2" class="mt5">
									<el-checkbox v-model="form.isExcuseOffDutyCard3">免卡</el-checkbox>
								</el-col>
								<el-col :span="12">
									<form-render class="range_time" label-width="90px" :type="`timerange`" :field="{name:'签退时间'}" v-model="form.signOutTime3"/>
								</el-col>
							</el-row>
						</el-col>
					
						<el-col :span="5">
							<div>&nbsp;</div>
							<el-form-item label="休息时间(分)" label-width="85px">
								<el-input-number v-model="form.restTime3" :min="0" :max="30"></el-input-number>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row class="straight">
						<el-col :span="24"><el-checkbox v-model="form.straight3_4">直通</el-checkbox></el-col>
					</el-row>
					
					<el-row class="shift_set">
						<el-col :span="1" style="margin-left:10px" class="mt10">
							<div>&nbsp;</div>
							<el-checkbox v-model="timeSolt4"></el-checkbox>
						</el-col>
						<el-col :span="17">
							<el-row>
								<el-col :span="9">
									<form-render label-width="52px" :type="`time`" :field="{name:'上班4'}" v-model="form.onDutyTime4"/>
								</el-col>
								<el-col :span="2" class="mt5">
									<el-checkbox v-model="form.isExcuseOnDutyCard4">免卡</el-checkbox>
								</el-col>
								<el-col :span="12">
									<form-render class="range_time" label-width="90px" :type="`timerange`" :field="{name:'签到时间'}" v-model="form.signInTime4"/>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="9">
									<form-render label-width="52px" :type="`time`" :field="{name:'下班4'}" v-model="form.offDutyTime4"/>
								</el-col>
								<el-col :span="2" class="mt5">
									<el-checkbox v-model="form.isExcuseOffDutyCard4">免卡</el-checkbox>
								</el-col>
								<el-col :span="12">
									<form-render class="range_time" label-width="90px" :type="`timerange`" :field="{name:'签退时间'}" v-model="form.signOutTime4"/>
								</el-col>
							</el-row>
						</el-col>
					
						<el-col :span="5">
							<div>&nbsp;</div>
							<el-form-item label="休息时间(分)" label-width="85px">
								<el-input-number v-model="form.restTime4" :min="0" :max="30"></el-input-number>
							</el-form-item>
						</el-col>
					</el-row>
					<p class="shift_time" style="color:#0BB2D4;margin:30px 0 25px 0px;font-weight:bold">班次规则</p>
					<el-row class="position_left">
						<el-col :span="11">
							<form-render label-width="180px" :type="`select`" :field="{name:'迟到时间在(分)内不计',options:[
								{
									value: 0,
									label: '0'
								},{
									value: 3,
									label: '3'
								},{
									value: 60,
									label: '60'
								}
							]}" v-model="form.allowLateTime"/>
							<!-- <el-form-item label="迟到时间在(分)内不计" label-width="180px">
								<el-input-number v-model="form.allowLateTime" :min="0"></el-input-number>
							</el-form-item> -->
						</el-col>
						<el-col :span="7" :offset="5">
							<form-render label-width="180px" :type="`select`" :field="{name:'早退时间在(分)内不计',options:[
								{
									value: 0,
									label: '0'
								},{
									value: 3,
									label: '3'
								},{
									value: 60,
									label: '60'
								}
							]}" v-model="form.allowEarlyTime"/>
							<!-- <el-form-item label="早退时间在(分)内不计" label-width="180px">
								<el-input-number v-model="form.allowEarlyTime" :min="0"></el-input-number>
							</el-form-item> -->
						</el-col>
						<el-col :span="11">
							<el-form-item label="迟到早退时间在(分)不计旷工" label-width="180px">
								<el-input-number v-model="form.allowAbsent" :min="0" :disabled="true"></el-input-number>
							</el-form-item>
						</el-col>
						<el-col :span="7" :offset="5">
							<el-form-item label="加班计算起始(分)" label-width="180px">
								<el-input-number v-model="form.startOverTime" :min="0" :disabled="true"></el-input-number>
							</el-form-item>
						</el-col>
						<el-col :span="11">
							<el-form-item label="请假计算起始(分)" label-width="180px">
								<el-input-number v-model="form.startLeaveTime" :min="0" :disabled="true"></el-input-number>
							</el-form-item>
						</el-col>
					</el-row>
				</el-scrollbar>
			</el-form>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible = false">取 消</el-button>
			<el-button type="primary" @click="handleFormSubmit" :disabled="disableSubmit">确 定</el-button>
		</div>
    </el-dialog>

    <table-header
		:table_actions="table_actions"
		:table_selectedRows="table_selectedRows"
		@action="handleAction"
		:table_form.sync="table_form"
		:table_column="table_field"
		>
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
import { log } from 'util';
const api_resource = api_common.resource("attendance/classset/list");
export default {
	mixins: [table_mixin],
	data() {
		const defaultForm  = function(){
			return {
				positiveTime: 8,
				restTime1: 0,
				restTime2: 0,
				restTime3: 0,
				restTime4: 0,
				allowLateTime: 3,
				allowEarlyTime: 3,
				allowAbsent: 30,
				startOverTime: 30,
				startLeaveTime: 30,
				className: '',
				classDesc: '',
				onDutyTime1: '',
				onDutyTime2: '',
				offDutyTime1: '',
				offDutyTime2: '',
				signInTime1: '',
				signInTime2: '',
				signOutTime1: '',
				signOutTime2: '',
				// straight1_2: 0,
				// straight2_3: 0,
				// straight3_4: 0,
				// isExcuseOnDutyCard1: 0,
				// isExcuseOnDutyCard2: 0,
				// isExcuseOnDutyCard3: 0,
				// isExcuseOnDutyCard4: 0,
				// isExcuseOffDutyCard1: 0,
				// isExcuseOffDutyCard2: 0,
				// isExcuseOffDutyCard3: 0,
				// isExcuseOffDutyCard4: 0,
			}
		}
		return {
			loading: true,
			api_resource,
			queryDialogFormVisible:true,
			dialogFormVisible:false,
			dialogForm1Visible:false,
			table_topHeight:276,
			form:{},
            defaultForm,
			rule:{
				className:[
					{ required: true, message: '请输入', trigger: ['blur','change'] },
				],
				classDesc:[
					{ required: true, message: '请输入', trigger: ['blur','change'] },
				],
				positiveTime:[
					{ required: true, message: '请输入', trigger: ['blur','change'] },
				],
				onDutyTime1:[
					{ required: true, message: '请选择时间', trigger: ['blur','change'] },
				],
				onDutyTime2:[
					{ required: true, message: '请选择时间', trigger: ['blur','change'] },
				],
				offDutyTime1:[
					{ required: true, message: '请选择时间', trigger: ['blur','change'] },
				],
				offDutyTime2:[
					{ required: true, message: '请选择时间', trigger: ['blur','change'] },
				],
				signInTime1:[
					{ required: true, message: '请选择时间', trigger: ['blur','change'] },
				],
				signInTime2:[
					{ required: true, message: '请选择时间', trigger: ['blur','change'] },
				],
				signOutTime1:[
					{ required: true, message: '请选择时间', trigger: ['blur','change'] },
				],
				signOutTime2:[
					{ required: true, message: '请选择时间', trigger: ['blur','change'] },
				],
			},
			timeSolt1: false,
			timeSolt2: false,
			timeSolt3: false,
			timeSolt4: false,
		};
	},
	computed:{
		disableSubmit(){
			if(this.form.className!=''&&this.form.classDesc!=''&&this.form.positiveTime!=''&&this.form.onDutyTime1!=''&&this.form.onDutyTime2!=''&&this.form.offDutyTime1!=''
			&&this.form.offDutyTime2!=''&&this.timeSolt1==true&&this.timeSolt2==true&&this.form.signInTime1!=''&&this.form.signInTime2!=''&&this.form.signOutTime1!=''
			&&this.form.signOutTime2!=''){
				return false
			}else{
				return true
			}
		}
	},
	watch:{
		'form.straight1_2'(){
			if(this.form.straight1_2==1){
				this.form.straight1_2 = true
			}else{
				this.form.straight1_2 = false
			}
		},
		'form.straight2_3'(){
			if(this.form.straight2_3==1){
				this.form.straight2_3 = true
			}else{
				this.form.straight2_3 = false
			}
		},
		'form.straight3_4'(){
			if(this.form.straight3_4==1){
				this.form.straight3_4 = true
			}else{
				this.form.straight3_4 = false
			}
		},
		'form.straight3_4'(){
			if(this.form.straight3_4==1){
				this.form.straight3_4 = true
			}else{
				this.form.straight3_4 = false
			}
		},
		'form.straight3_4'(){
			if(this.form.straight3_4==1){
				this.form.straight3_4 = true
			}else{
				this.form.straight3_4 = false
			}
		},
		'form.straight3_4'(){
			if(this.form.straight3_4==1){
				this.form.straight3_4 = true
			}else{
				this.form.straight3_4 = false
			}
		},
		'form.isExcuseOnDutyCard1'(){
			if(this.form.isExcuseOnDutyCard1==1){
				this.form.isExcuseOnDutyCard1 = true
			}else{
				this.form.isExcuseOnDutyCard1 = false
			}
		},
		'form.isExcuseOnDutyCard2'(){
			if(this.form.isExcuseOnDutyCard2==1){
				this.form.isExcuseOnDutyCard2 = true
			}else{
				this.form.isExcuseOnDutyCard2 = false
			}
		},
		'form.isExcuseOnDutyCard3'(){
			if(this.form.isExcuseOnDutyCard3==1){
				this.form.isExcuseOnDutyCard3 = true
			}else{
				this.form.isExcuseOnDutyCard3 = false
			}
		},
		'form.isExcuseOnDutyCard4'(){
			if(this.form.isExcuseOnDutyCard4==1){
				this.form.isExcuseOnDutyCard4 = true
			}else{
				this.form.isExcuseOnDutyCard4 = false
			}
		},
		'form.isExcuseOffDutyCard1'(){
			if(this.form.isExcuseOffDutyCard1==1){
				this.form.isExcuseOffDutyCard1 = true
			}else{
				this.form.isExcuseOffDutyCard1 = false
			}
		},
		'form.isExcuseOffDutyCard2'(){
			if(this.form.isExcuseOffDutyCard2==1){
				this.form.isExcuseOffDutyCard2 = true
			}else{
				this.form.isExcuseOffDutyCard2 = false
			}
		},
		'form.isExcuseOffDutyCard3'(){
			if(this.form.isExcuseOffDutyCard3==1){
				this.form.isExcuseOffDutyCard3 = true
			}else{
				this.form.isExcuseOffDutyCard3 = false
			}
		},
		'form.isExcuseOffDutyCard4'(){
			if(this.form.isExcuseOffDutyCard4==1){
				this.form.isExcuseOffDutyCard4 = true
			}else{
				this.form.isExcuseOffDutyCard4 = false
			}
		},
	},
	methods: {
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		async delete(){
			let rows = this.table_selectedRows.map(row=>row.id)
			const mes = await this.$request.get('/attendance/classset/list/bluk?ids='+rows.join(','))
			this.$message.success({message:mes})
			this.fetchTableData();
		},
		add(){
			this.$nextTick(()=>{
				this.$refs['form'].clearValidate()
			})
			this.form = this.defaultForm()
			this.timeSolt1 = false
			this.timeSolt2 = false
			this.timeSolt3 = false
			this.timeSolt4 = false
			this.dialogFormVisible = true
		},
		async edit(){
			this.timeSolt1 = true
			this.timeSolt2 = true
			this.form = this.defaultForm()
			this.dialogFormVisible = true 
			let row = this.table_selectedRows[0];
            this.form = (await api_resource.find(row.id))[0];
		},
		async handleFormSubmit(){
			await this.form_validate()
            let form = Object.assign({},this.form)
			if(isNaN(+form.straight1_2)){
				delete form.straight1_2
			}else{
				form.straight1_2 = +this.form.straight1_2
			}
			if(isNaN(+form.straight2_3)){
				delete form.straight2_3
			}else{
				form.straight2_3 = +this.form.straight2_3
			}
			if(isNaN(+form.straight3_4)){
				delete form.straight3_4
			}else{
				form.straight3_4 = +this.form.straight3_4
			}
			if(isNaN(+form.isExcuseOnDutyCard1)){
				delete form.isExcuseOnDutyCard1
			}else{
				form.isExcuseOnDutyCard1 = +this.form.isExcuseOnDutyCard1
			}
			if(isNaN(+form.isExcuseOnDutyCard2)){
				delete form.isExcuseOnDutyCard2
			}else{
				form.isExcuseOnDutyCard2 = +this.form.isExcuseOnDutyCard2
			}
			if(isNaN(+form.isExcuseOnDutyCard3)){
				delete form.isExcuseOnDutyCard3
			}else{
				form.isExcuseOnDutyCard3 = +this.form.isExcuseOnDutyCard3
			}
			if(isNaN(+form.isExcuseOnDutyCard4)){
				delete form.isExcuseOnDutyCard4
			}else{
				form.isExcuseOnDutyCard4 = +this.form.isExcuseOnDutyCard4
			}
			if(isNaN(+form.isExcuseOffDutyCard1)){
				delete form.isExcuseOffDutyCard1
			}else{
				form.isExcuseOffDutyCard1 = +this.form.isExcuseOffDutyCard1
			}
			if(isNaN(+form.isExcuseOffDutyCard2)){
				delete form.isExcuseOffDutyCard2
			}else{
				form.isExcuseOffDutyCard2 = +this.form.isExcuseOffDutyCard2
			}
			if(isNaN(+form.isExcuseOffDutyCard3)){
				delete form.isExcuseOffDutyCard3
			}else{
				form.isExcuseOffDutyCard3 = +this.form.isExcuseOffDutyCard3
			}
			if(isNaN(+form.isExcuseOffDutyCard4)){
				delete form.isExcuseOffDutyCard4
			}else{
				form.isExcuseOffDutyCard4 = +this.form.isExcuseOffDutyCard4
			}
			if(this.timeSolt3==true||this.timeSolt4==true){
				if(this.timeSolt4==true){
					if(form.onDutyTime4==''||form.offDutyTime4==''||form.signInTime4==''||form.signOutTime4==''||form.onDutyTime4==undefined
					||form.offDutyTime4==undefined||form.signInTime4==undefined||form.signOutTime4==undefined){
						this.$message.error({ message: '请填写时段4的信息'});
					}
				}
				else{
					delete form.onDutyTime4
					delete form.offDutyTime4
					delete form.signInTime4
					delete form.signOutTime4
					delete form.isExcuseOnDutyCard4
					delete form.isExcuseOffDutyCard4
					delete form.straight3_4
				}
				if(this.timeSolt3==true){
					if(form.onDutyTime3==''||form.onDutyTime3==undefined||form.offDutyTime3==''||form.offDutyTime3==undefined||form.signInTime3==''
					||form.signInTime3==undefined||form.signOutTime3==''||form.signOutTime3==undefined){
						this.$message.error({ message: '请填写时段3的信息'});
					}
				}
				else{
					delete form.onDutyTime3
					delete form.offDutyTime3
					delete form.signInTime3
					delete form.signOutTime3
					delete form.isExcuseOnDutyCard3
					delete form.isExcuseOffDutyCard3
					delete form.straight2_3
				}
			}else{
				if(this.timeSolt3==false){
					delete form.onDutyTime3
					delete form.offDutyTime3
					delete form.signInTime3
					delete form.signOutTime3
					delete form.isExcuseOnDutyCard3
					delete form.isExcuseOffDutyCard3
					delete form.straight2_3
				}
				if(this.timeSolt4==false){
					delete form.onDutyTime4
					delete form.offDutyTime4
					delete form.signInTime4
					delete form.signOutTime4
					delete form.isExcuseOnDutyCard4
					delete form.isExcuseOffDutyCard4
					delete form.straight3_4
				}
				if(this.isInsert){
					try{
						const mes = await api_resource.create(form)
						this.$message.success({ message: mes})
						this.dialogFormVisible = false
						this.fetchTableData()
					}catch(err){
						// this.$message.error(err.field[0]);
					}
				}else{
					await api_resource.update(form.id,form)
					this.dialogFormVisible = false
					this.fetchTableData()
				}
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
	},
	async created() {
		const { field, action,table } = await api_common.menuInit("attendance/classset/list");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.fetchTableData();
	}
};
</script>
<style lang="scss">
.shift_form .el-select.el-select--small{
	width: 130px!important;
}
.theme-0BB2D4 .shift_form .el-range-editor--small .el-range-separator{
	margin-right:15px;
	font-size:12px;
}
.theme-0BB2D4 .shift_form .range_time .el-date-editor.el-input__inner{
	width: 210px!important;
}
.theme-0BB2D4 .shift_form .el-range-editor--small .el-range-input{
	width: 70px!important;
}
.theme-0BB2D4 .shift_form .el-checkbox__label{font-size: 12px;}
.theme-0BB2D4 .shift_form .el-date-editor.el-input, .theme-0BB2D4 .shift_form .el-date-editor.el-input__inner{
	width: 150px!important;
}
.mt5{margin-top: 5px;}
.mt10{margin-top: 10px;}
.shift_set{
	border: 1px solid #E4E4E4;
	padding: 20px 12px 3px 0;
}
.straight{
	line-height: 40px;
	margin: 0 auto;
	text-align: center;
}
.position_left {
	margin-right: 20px;
}
.position_left .el-form-item__label{
	text-align: left;
}
</style>
<style lang="scss" scoped>

.scroll {
  height: calc(100%);
  width: 100%;

 /deep/ .scrollbar-wrapper {
    overflow-x: hidden;
  }
}
</style>