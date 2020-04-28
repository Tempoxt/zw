  <template>

	<ui-table
	class="public-table-container"
	ref="table" 
	:table_column="table_field" 
	:table_query.sync="table_form.query"
	@query="querySubmit"
	>

		<el-dialog
			:title="dialogStatus==='insert'?'新增班次':'编辑班次'"
			:visible.sync="dialogFormVisible"
			class="public-dialog"
			v-el-drag-dialog
			width="1160px"
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
								<form-render :type="`inputSuffix`" prop="positiveTime" suffix="时" :field="{name:'班次时间'}" v-model="form.positiveTime"/>
							</el-col>
							<el-col :span="10">
								<form-render :type="`inputSuffix`" suffix="时" :field="{name:'加班'}" v-model="form.overTime"/>
							</el-col>
							<el-col :span="10" :offset="4">
								<form-render :type="`radio`" :field="{name:'班次类型',options:[{
									value:1,
									label:'白班'
								},{
									value:2,
									label:'夜班'
								}]}" v-model="form.classType"/>
							</el-col>
						</el-row>
						<el-row class="shift_set">
							<el-col :span="5" style="margin-left:10px;" class="mt10">
								<el-row type="flex" align="middle">
									<el-col :span="6">
										<el-checkbox v-model="timeSolt1">正班1</el-checkbox>
									</el-col>
									<el-col :span="14" class="mt20">
										<form-render prop="fakeHour1"  label-width="10" :type="`input`" :field="{name:''}" placeholder="" v-model="form.fakeHour1"/>
									</el-col>
									<el-col :span="4" class="fs12">工时</el-col>
								</el-row>
							</el-col>
							<el-col :span="14">
								<el-row>
									<el-col :span="9">
										<form-render label-width="52px"  prop="onDutyTime1" :type="`time`" :field="{name:'上班1'}" placeholder="上班时间" v-model="form.onDutyTime1"/>
									</el-col>
									<el-col :span="2" class="mt5">
										<el-checkbox v-model="form.isExcuseOnDutyCard1">免卡</el-checkbox>
									</el-col>
									<el-col :span="6">
										<form-render class="range_time" :disabled="form.isExcuseOnDutyCard1==1" prop="signInStartTime1" label-width="90px" :type="`time`" :field="{name:'签到时间'}" placeholder="起始时间" v-model="form.signInStartTime1"/>
									</el-col>
									<el-col :span="6">
										<form-render class="range_time end_time" :disabled="form.isExcuseOnDutyCard1==1" prop="signInEndTime1" :type="`time`" placeholder="结束时间" :field="{name:''}" v-model="form.signInEndTime1"/>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="9">
										<form-render label-width="52px" prop="offDutyTime1" :type="`time`" :field="{name:'下班1'}" placeholder="下班时间" v-model="form.offDutyTime1"/>
									</el-col>
									<el-col :span="2" class="mt5">
										<el-checkbox v-model="form.isExcuseOffDutyCard1">免卡</el-checkbox>
									</el-col>
									<el-col :span="6">
										<form-render class="range_time" :disabled="form.isExcuseOffDutyCard1==1" prop="signOutStartTime1" label-width="90px" :type="`time`" :field="{name:'签退时间'}" placeholder="起始时间" v-model="form.signOutStartTime1"/>
									</el-col>
									<el-col :span="6">
										<form-render class="range_time end_time" :disabled="form.isExcuseOffDutyCard1==1" :type="`time`" :field="{name:''}" placeholder="结束时间" v-model="form.signOutEndTime1"/>
									</el-col>
								</el-row>
							</el-col>
						
							<el-col :span="4" style="margin-left:15px">
								<el-form-item class="line-height" label="休息时间" label-width="30px">
									<el-time-picker v-model="form.restStartTime1" format="HH:mm" value-format="HH:mm" placeholder="起始时间"></el-time-picker>
									<el-time-picker class="mt17" v-model="form.restEndTime1" format="HH:mm" value-format="HH:mm" placeholder="结束时间"></el-time-picker>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row class="straight">
							<el-col :span="24"><el-checkbox v-model="form.straight1_2" @change="cstraight1_2">直通</el-checkbox></el-col>
						</el-row>
						<el-row class="shift_set">
							<el-col :span="5" style="margin-left:10px;" class="mt10">
								<el-row type="flex" align="middle">
									<el-col :span="6">
										<el-checkbox v-model="timeSolt2">正班2</el-checkbox>
									</el-col>
									<el-col :span="14" class="mt20">
										<form-render prop="fakeHour2"  label-width="10" :type="`input`" :field="{name:''}" placeholder="" v-model="form.fakeHour2"/>
									</el-col>
									<el-col :span="4" class="fs12">工时</el-col>
								</el-row>
							</el-col>
							<el-col :span="14">
								<el-row>
									<el-col :span="9">
										<form-render label-width="52px"  prop="onDutyTime2" :type="`time`" :field="{name:'上班2'}" placeholder="上班时间" v-model="form.onDutyTime2"/>
									</el-col>
									<el-col :span="2" class="mt5">
										<el-checkbox v-model="form.isExcuseOnDutyCard2">免卡</el-checkbox>
									</el-col>
									<el-col :span="6">
										<form-render class="range_time" :disabled="form.isExcuseOnDutyCard2==1" prop="signInStartTime2" label-width="90px" :type="`time`" :field="{name:'签到时间'}" placeholder="起始时间" v-model="form.signInStartTime2"/>
									</el-col>
									<el-col :span="6">
										<form-render class="range_time end_time" :disabled="form.isExcuseOnDutyCard2==1" :type="`time`" :field="{name:''}" placeholder="结束时间" v-model="form.signInEndTime2"/>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="9">
										<form-render label-width="52px" prop="offDutyTime2" :type="`time`" :field="{name:'下班2'}" placeholder="下班时间" v-model="form.offDutyTime2"/>
									</el-col>
									<el-col :span="2" class="mt5">
										<el-checkbox v-model="form.isExcuseOffDutyCard2">免卡</el-checkbox>
									</el-col>
									<el-col :span="6">
										<form-render class="range_time" :disabled="form.isExcuseOffDutyCard2==1" prop="signOutStartTime2" label-width="90px" :type="`time`" :field="{name:'签退时间'}" placeholder="起始时间" v-model="form.signOutStartTime2"/>
									</el-col>
									<el-col :span="6">
										<form-render class="range_time end_time" :disabled="form.isExcuseOffDutyCard2==1" :type="`time`" :field="{name:''}" placeholder="结束时间" v-model="form.signOutEndTime2"/>
									</el-col>
								</el-row>
							</el-col>
						
							<el-col :span="4" style="margin-left:15px">
								<el-form-item class="line-height" label="休息时间" label-width="30px">
									<el-time-picker v-model="form.restStartTime2" format="HH:mm" value-format="HH:mm" placeholder="起始时间"></el-time-picker>
									<el-time-picker class="mt17" v-model="form.restEndTime2" format="HH:mm" value-format="HH:mm" placeholder="结束时间"></el-time-picker>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row class="straight">
							<el-col :span="24"><el-checkbox v-model="form.straight2_3" @change="cstraight2_3">直通</el-checkbox></el-col>
						</el-row>
						<el-row class="shift_set">
							<el-col :span="5" style="margin-left:10px;" class="mt10">
								<el-row type="flex" align="middle">
									<el-col :span="6">
										<el-checkbox v-model="timeSolt3">加班1</el-checkbox>
									</el-col>
									<el-col :span="14" class="mt20">
										<form-render prop="fakeHour3"  label-width="10" :type="`input`" :field="{name:''}" placeholder="" v-model="form.fakeHour3"/>
									</el-col>
									<el-col :span="4" class="fs12">工时</el-col>
								</el-row>
							</el-col>
							<el-col :span="14">
								<el-row>
									<el-col :span="9">
										<form-render label-width="52px" :type="`time`" :field="{name:'上班3'}" placeholder="上班时间" v-model="form.onDutyTime3"/>
									</el-col>
									<el-col :span="2" class="mt5">
										<el-checkbox v-model="form.isExcuseOnDutyCard3">免卡</el-checkbox>
									</el-col>
									<el-col :span="6">
										<form-render class="range_time" :disabled="form.isExcuseOnDutyCard3==1" label-width="90px" :type="`time`" :field="{name:'签到时间'}" placeholder="起始时间" v-model="form.signInStartTime3"/>
									</el-col>
									<el-col :span="6">
										<form-render class="range_time end_time" :disabled="form.isExcuseOnDutyCard3==1" :type="`time`" :field="{name:''}" placeholder="结束时间" v-model="form.signInEndTime3"/>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="9">
										<form-render label-width="52px" :type="`time`" :field="{name:'下班3'}" placeholder="下班时间" v-model="form.offDutyTime3"/>
									</el-col>
									<el-col :span="2" class="mt5">
										<el-checkbox v-model="form.isExcuseOffDutyCard3">免卡</el-checkbox>
									</el-col>
									<el-col :span="6">
										<form-render class="range_time" :disabled="form.isExcuseOffDutyCard3==1" label-width="90px" :type="`time`" :field="{name:'签退时间'}" placeholder="起始时间" v-model="form.signOutStartTime3"/>
									</el-col>
									<el-col :span="6">
										<form-render class="range_time end_time" :disabled="form.isExcuseOffDutyCard3==1" :type="`time`" :field="{name:''}" placeholder="结束时间" v-model="form.signOutEndTime3"/>
									</el-col>
								</el-row>
							</el-col>
						
							<el-col :span="4" style="margin-left:15px">
								<el-form-item class="line-height" label="休息时间" label-width="30px">
									<el-time-picker v-model="form.restStartTime3" format="HH:mm" value-format="HH:mm" placeholder="起始时间"></el-time-picker>
									<el-time-picker class="mt17" v-model="form.restEndTime3" format="HH:mm" value-format="HH:mm" placeholder="结束时间"></el-time-picker>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row class="straight">
							<el-col :span="24"><el-checkbox v-model="form.straight3_4" @change="cstraight3_4">直通</el-checkbox></el-col>
						</el-row>
						
						<el-row class="shift_set">
							<el-col :span="5" style="margin-left:10px;" class="mt10">
								<el-row type="flex" align="middle">
									<el-col :span="6">
										<el-checkbox v-model="timeSolt4">加班2</el-checkbox>
									</el-col>
									<el-col :span="14" class="mt20">
										<form-render prop="fakeHour4"  label-width="10" :type="`input`" :field="{name:''}" placeholder="" v-model="form.fakeHour4"/>
									</el-col>
									<el-col :span="4" class="fs12">工时</el-col>
								</el-row>
							</el-col>
							<el-col :span="14">
								<el-row>
									<el-col :span="9">
										<form-render label-width="52px" :type="`time`" :field="{name:'上班4'}" placeholder="上班时间" v-model="form.onDutyTime4"/>
									</el-col>
									<el-col :span="2" class="mt5">
										<el-checkbox v-model="form.isExcuseOnDutyCard4">免卡</el-checkbox>
									</el-col>
									<el-col :span="6">
										<form-render class="range_time" :disabled="form.isExcuseOnDutyCard4==1" label-width="90px" :type="`time`" :field="{name:'签到时间'}" placeholder="起始时间" v-model="form.signInStartTime4"/>
									</el-col>
									<el-col :span="6">
										<form-render class="range_time end_time" :disabled="form.isExcuseOnDutyCard4==1" :type="`time`" :field="{name:''}" placeholder="结束时间" v-model="form.signInEndTime4"/>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="9">
										<form-render label-width="52px" :type="`time`" :field="{name:'下班4'}" placeholder="下班时间" v-model="form.offDutyTime4"/>
									</el-col>
									<el-col :span="2" class="mt5">
										<el-checkbox v-model="form.isExcuseOffDutyCard4">免卡</el-checkbox>
									</el-col>
									<el-col :span="6">
										<form-render class="range_time" :disabled="form.isExcuseOffDutyCard4==1" label-width="90px" :type="`time`" :field="{name:'签退时间'}" placeholder="起始时间" v-model="form.signOutStartTime4"/>
									</el-col>
									<el-col :span="6">
										<form-render class="range_time end_time" :disabled="form.isExcuseOffDutyCard4==1" :type="`time`" :field="{name:''}" placeholder="结束时间" v-model="form.signOutEndTime4"/>
									</el-col>
								</el-row>
							</el-col>
						
							<el-col :span="4" style="margin-left:15px">
								<el-form-item class="line-height" label="休息时间" label-width="30px">
									<el-time-picker v-model="form.restStartTime4" format="HH:mm" value-format="HH:mm" placeholder="起始时间"></el-time-picker>
									<el-time-picker class="mt17" v-model="form.restEndTime4" format="HH:mm" value-format="HH:mm" placeholder="结束时间"></el-time-picker>
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
										value: 1,
										label: '1'
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
										value: 1,
										label: '1'
									},{
										value: 60,
										label: '60'
									}
								]}" v-model="form.allowEarlyTime"/>
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
				classType: 1,//班次类型
				restStartTime1: '10:00',
				restEndTime1: '10:10',
				restStartTime2: "15:00",
				restEndTime2: '15:10',
				restStartTime3: '',
				restEndTime3: '',
				restStartTime4: '',
				restEndTime4: '',
				allowLateTime: 1,
				allowEarlyTime: 1,
				allowAbsent: 30,
				startOverTime: 30,
				startLeaveTime: 30,
				className: '',
				onDutyTime1: '08:00',//上班时间1
				offDutyTime1: '12:00',//下班时间1
				onDutyTime2: '13:30',//上班时间2
				offDutyTime2: '17:30',//下班时间2
				signInStartTime1: '07:30',//签到开始时间1
				signInEndTime1: '08:30',//签到结束时间1
				signOutStartTime1: '11:30',//签退开始时间1
				signOutEndTime1: '12:30',//签退结束时间1
				signInStartTime2: '13:00',//签到开始时间2
				signInEndTime2: '14:00',//签到结束时间2
				signOutStartTime2: '17:00',//签退开始时间2
				signOutEndTime2: '18:00',//签退结束时间2
				straight1_2: 0,
				straight2_3: 0,
				straight3_4: 0,
				isExcuseOnDutyCard1: 0,
				isExcuseOffDutyCard1: 0,
				isExcuseOnDutyCard2: 0,
				isExcuseOffDutyCard2: 0,
				isExcuseOnDutyCard3: 0,
				isExcuseOffDutyCard3: 0,
				isExcuseOnDutyCard4: 0,
				isExcuseOffDutyCard4: 0,
			}
		}
        var checkNumber = (rule, value, callback)=>{
            if(value!==''&&value!=undefined){
                if (!(/^\d+(\.[05])?$/.test(value))) {
                    callback(new Error('请输入0.5的倍数'));
                }else{
                    callback();
                }
            }
		}
		return {
			loading: true,
			api_resource,
			queryDialogFormVisible:true,
			dialogFormVisible:false,
			dialogForm1Visible:false,
			table_topHeight:235,
			form:{},
            defaultForm,
			rule:{
				className:[
					{ required: true, message: '请输入', trigger: ['blur','change'] },
				],
				positiveTime:[
					{ required: true, message: '请输入', trigger: ['blur','change'] },
				],
				onDutyTime1:[
					{ required: true, message: '请选择时间', trigger: ['blur','change'] },
				],
				offDutyTime1:[
					{ required: true, message: '请选择时间', trigger: ['blur','change'] },
				],
				// signInStartTime1:[
				// 	{ required: true, message: '请选择时间', trigger: ['blur','change'] },
				// ],
				// signOutStartTime1:[
				// 	{ required: true, message: '请选择时间', trigger: ['blur','change'] },
				// ],
				onDutyTime2:[
					{ required: true, message: '请选择时间', trigger: ['blur','change'] },
				],
				offDutyTime2:[
					{ required: true, message: '请选择时间', trigger: ['blur','change'] },
				],
				fakeHour1:[
                    { validator: checkNumber, trigger: 'blur' }
				],
				fakeHour2:[
                    { validator: checkNumber, trigger: 'blur' }
				],
				fakeHour3:[
                    { validator: checkNumber, trigger: 'blur' }
				],
				fakeHour4:[
                    { validator: checkNumber, trigger: 'blur' }
				]
				// signInStartTime2:[
				// 	{ required: true, message: '请选择时间', trigger: ['blur','change'] },
				// ],
				// signOutStartTime2:[
				// 	{ required: true, message: '请选择时间', trigger: ['blur','change'] },
				// ],
			},
			timeSolt1: false,
			timeSolt2: false,
			timeSolt3: false,
			timeSolt4: false,
		};
	},
	computed:{
		disableSubmit(){
			if((this.form.className!=''&&this.form.positiveTime!=''&&this.form.onDutyTime1!=null&&this.form.onDutyTime2!=null&&this.form.offDutyTime1!=null&&this.timeSolt1==true
			&&this.form.offDutyTime2!=null&&this.timeSolt2==true&&this.form.onDutyTime1!=''&&this.form.onDutyTime2!=''&&this.form.offDutyTime1!=''&&this.form.offDutyTime2!='')
			&&((this.form.signInStartTime1!=null&&this.form.signInEndTime1!=null&&this.form.signInStartTime1!=''&&this.form.signInEndTime1!='')||this.form.isExcuseOnDutyCard1==true)
			&&((this.form.signOutStartTime1!=null&&this.form.signOutEndTime1!=null&&this.form.signOutStartTime1!=''&&this.form.signOutEndTime1!='')||this.form.isExcuseOffDutyCard1==true)
			&&((this.form.signInStartTime2!=null&&this.form.signInEndTime2!=null&&this.form.signInStartTime2!=''&&this.form.signInEndTime2!='')||this.form.isExcuseOnDutyCard2==true)
			&&((this.form.signOutStartTime2!=null&&this.form.signOutEndTime2!=null&&this.form.signOutStartTime2!=''&&this.form.signOutEndTime2!='')||this.form.isExcuseOffDutyCard2==true)
			){
				if(this.form.isExcuseOnDutyCard1==true){

				}
				return false
			}
			return true
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
		'form.isExcuseOnDutyCard1'(){
			if(this.form.isExcuseOnDutyCard1==1){
				this.form.isExcuseOnDutyCard1 = true
				this.form.signInStartTime1 = ''
				this.form.signInEndTime1 = ''
			}else{
				this.form.isExcuseOnDutyCard1 = false
			}
		},
		'form.isExcuseOnDutyCard2'(){
			if(this.form.isExcuseOnDutyCard2==1||this.form.isExcuseOnDutyCard2 == true){
				this.form.isExcuseOnDutyCard2 = true
				this.form.signInStartTime2 = ''
				this.form.signInEndTime2 = ''
				if(this.form.isExcuseOffDutyCard1==true){
					this.form.straight1_2 = true
				}
			}else{
				this.form.isExcuseOnDutyCard2 = false
				this.form.straight1_2 = false
			}
		},
		'form.isExcuseOnDutyCard3'(){
			if(this.form.isExcuseOnDutyCard3==1){
				this.form.isExcuseOnDutyCard3 = true
				this.form.signInStartTime3 = ''
				this.form.signInEndTime3 = ''
				if(this.form.isExcuseOffDutyCard2==true){
					this.form.straight2_3 = true
				}
			}else{
				this.form.isExcuseOnDutyCard3 = false
				this.form.straight2_3 = false
			}
		},
		'form.isExcuseOnDutyCard4'(){
			if(this.form.isExcuseOnDutyCard4==1){
				this.form.isExcuseOnDutyCard4 = true
				this.form.signInStartTime4 = ''
				this.form.signInEndTime4 = ''
				if(this.form.isExcuseOffDutyCard3==true){
					this.form.straight3_4 = true
				}
			}else{
				this.form.isExcuseOnDutyCard4 = false
				this.form.straight3_4 = false
			}
		},
		'form.isExcuseOffDutyCard1'(){
			if(this.form.isExcuseOffDutyCard1==1){
				this.form.isExcuseOffDutyCard1 = true
				this.form.signOutStartTime1 = ''
				this.form.signOutEndTime1 = ''
				if(this.form.isExcuseOnDutyCard2==true||this.form.isExcuseOnDutyCard2==1){
					this.form.straight1_2 = true
				}
			}else{
				this.form.isExcuseOffDutyCard1 = false
				this.form.straight1_2 = false
			}
		},
		'form.isExcuseOffDutyCard2'(){
			if(this.form.isExcuseOffDutyCard2==1){
				this.form.isExcuseOffDutyCard2 = true
				this.form.signOutStartTime2 = ''
				this.form.signOutEndTime2 = ''
				if(this.form.isExcuseOnDutyCard3==true||this.form.isExcuseOnDutyCard3==1){
					this.form.straight2_3 = true
				}
			}else{
				this.form.isExcuseOffDutyCard2 = false
				this.form.straight2_3 = false
			}
		},
		'form.isExcuseOffDutyCard3'(){
			if(this.form.isExcuseOffDutyCard3==1){
				this.form.isExcuseOffDutyCard3 = true
				this.form.signOutStartTime3 = ''
				this.form.signOutEndTime3 = ''
				if(this.form.isExcuseOnDutyCard4==true||this.form.isExcuseOnDutyCard4==1){
					this.form.straight3_4 = true
				}
			}else{
				this.form.isExcuseOffDutyCard3 = false
				this.form.straight3_4 = false
			}
		},
		'form.isExcuseOffDutyCard4'(){
			if(this.form.isExcuseOffDutyCard4==1){
				this.form.isExcuseOffDutyCard4 = true
				this.form.signOutStartTime4 = ''
				this.form.signOutEndTime4 = ''
			}else{
				this.form.isExcuseOffDutyCard4 = false
			}
		},
	},
	methods: {
		cstraight1_2(){
			if(this.form.straight1_2==true||this.form.straight1_2==1){
				this.form.isExcuseOffDutyCard1 = true
				this.form.isExcuseOnDutyCard2 = true
			}else{
				this.form.isExcuseOffDutyCard1 = false
				this.form.isExcuseOnDutyCard2 = false
			}
		},
		cstraight2_3(){
			if(this.form.straight2_3==true||this.form.straight2_3==1){
				this.form.isExcuseOffDutyCard2 = true
				this.form.isExcuseOnDutyCard3 = true
			}else{
				this.form.isExcuseOffDutyCard2 = false
				this.form.isExcuseOnDutyCard3 = false
			}
		},
		cstraight3_4(){
			if(this.form.straight3_4==true||this.form.straight3_4==1){
				this.form.isExcuseOffDutyCard3 = true
				this.form.isExcuseOnDutyCard4 = true
			}else{
				this.form.isExcuseOffDutyCard3 = false
				this.form.isExcuseOnDutyCard4 = false
			}
		},
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
			this.timeSolt1 = true
			this.timeSolt2 = true
			this.timeSolt3 = false
			this.timeSolt4 = false
			this.dialogFormVisible = true
		},
		async edit(){
			this.form = this.defaultForm()
			this.dialogFormVisible = true 
			let row = this.table_selectedRows[0];
			this.form = (await api_resource.find(row.id))[0];
			if(this.form.onDutyTime1!=null&&this.form.offDutyTime1!=null){
				this.timeSolt1 = true
			}else{
				this.timeSolt1 = false
			}
			if(this.form.onDutyTime2!=null&&this.form.offDutyTime2!=null){
				this.timeSolt2 = true
			}else{
				this.timeSolt2 = false
			}
			if(this.form.onDutyTime3!=null&&this.form.offDutyTime3!=null){
				this.timeSolt3 = true
			}else{
				this.timeSolt3 = false
			}
			if(this.form.onDutyTime4!=null&&this.form.offDutyTime4!=null){
				this.timeSolt4 = true
			}else{
				this.timeSolt4 = false
			}
		},
		async handleFormSubmit(){
			// await this.form_validate()
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

			if(form.restStartTime1==''||form.restStartTime1==null){
				delete form.restStartTime1
			}
			if(form.restStartTime2==''||form.restStartTime2==null){
				delete form.restStartTime2
			}
			if(form.restStartTime3==''||form.restStartTime3==null){
				delete form.restStartTime3
			}
			if(form.restStartTime4==''||form.restStartTime4==null){
				delete form.restStartTime4
			}

			if(form.restEndTime1==''||form.restEndTime1==null){
				delete form.restEndTime1
			}
			if(form.restEndTime2==''||form.restEndTime2==null){
				delete form.restEndTime2
			}
			if(form.restEndTime3==''||form.restEndTime3==null){
				delete form.restEndTime3
			}
			if(form.restEndTime4==''||form.restEndTime4==null){
				delete form.restEndTime4
			}
			if(this.timeSolt3==true||this.timeSolt4==true){
                if(this.timeSolt3==true&&this.timeSolt4==false){
					if(form.onDutyTime3==undefined||form.offDutyTime3==undefined||
					(form.signInEndTime3==undefined&&form.isExcuseOnDutyCard3==false)||
					(form.signOutEndTime3==undefined&&form.isExcuseOffDutyCard3==false)){
						this.$message.error({ message: '请填写时段3的信息'});
					}else{
						if(form.onDutyTime4!=null&&form.offDutyTime4!=null&&this.timeSolt4==false&&
						(form.signInStartTime4!=null&&form.signOutStartTime4!=null||form.isExcuseOnDutyCard4==true)&&
						(form.signInEndTime4!=null&&form.signOutEndTime4!=null||form.isExcuseOffDutyCard4==true)){
							this.$message.error({ message: '请勾选时段4'});
							return
						}else{
							delete form.onDutyTime4
							delete form.offDutyTime4
							delete form.signInStartTime4
							delete form.signOutStartTime4
							delete form.signInEndTime4
							delete form.signOutEndTime4
							delete form.isExcuseOnDutyCard4
							delete form.isExcuseOffDutyCard4
							delete form.straight3_4
							delete form.restStartTime4
							delete form.restEndTime4
							if(this.isInsert){
								const mes = await api_resource.create(form)
								this.$message.success({ message: mes})
								this.dialogFormVisible = false
								this.fetchTableData()
							}else{
								await api_resource.update(form.id,form)
								this.dialogFormVisible = false
								this.fetchTableData()
							}
						}
					}
				}

				if(this.timeSolt4==true&&this.timeSolt3==false){
					if(form.onDutyTime4==undefined||form.offDutyTime4==undefined||
					(form.signInEndTime4==undefined&&form.isExcuseOnDutyCard4==false)||
					(form.signOutEndTime4==undefined&&form.isExcuseOffDutyCard4==false)){
						this.$message.error({ message: '请填写时段4的信息'});
					}else{
						if(form.onDutyTime3!=null&&form.offDutyTime3!=null&&this.timeSolt3==false&&
						(form.signInStartTime3!=null&&form.signOutStartTime3!=null||form.isExcuseOnDutyCard3==true)&&
						(form.signInEndTime3!=null&&form.signOutEndTime3!=null||form.isExcuseOffDutyCard3==true)){
							this.$message.error({ message: '请勾选时段3'});
							return
						}else{
							delete form.onDutyTime3
							delete form.offDutyTime3
							delete form.signInStartTime3
							delete form.signOutStartTime3
							delete form.signInEndTime3
							delete form.signOutEndTime3
							delete form.isExcuseOnDutyCard3
							delete form.isExcuseOffDutyCard3
							delete form.straight2_3
							delete form.restStartTime3
							delete form.restEndTime3
							if(this.isInsert){
								const mes = await api_resource.create(form)
								this.$message.success({ message: mes})
								this.dialogFormVisible = false
								this.fetchTableData()
							}else{
								await api_resource.update(form.id,form)
								this.dialogFormVisible = false
								this.fetchTableData()
							}
						}
					}
				}
                
                if(this.timeSolt3==true&&this.timeSolt4==true){
					if(form.onDutyTime3==undefined||form.offDutyTime3==undefined||
					((form.signInStartTime3==''||form.signInEndTime3==undefined)&&form.isExcuseOnDutyCard3==false)||
					((form.signOutStartTime3==''||form.signOutEndTime3==undefined)&&form.isExcuseOffDutyCard3==false)){
						this.$message.error({ message: '请填写时段3的信息'});
					}else if(form.onDutyTime4==undefined||form.offDutyTime4==undefined||
					(form.signInEndTime4==undefined&&form.isExcuseOnDutyCard4==false)||
					(form.signOutEndTime4==undefined&&form.isExcuseOffDutyCard4==false)){
						this.$message.error({ message: '请填写时段4的信息'});
					}else{
                        if(this.isInsert){
                            const mes = await api_resource.create(form)
                            this.$message.success({ message: mes})
                            this.dialogFormVisible = false
                            this.fetchTableData()
                        }else{
                            await api_resource.update(form.id,form)
                            this.dialogFormVisible = false
                            this.fetchTableData()
                        }
                    }
                }
			}else{
				if(form.onDutyTime3!=null&&form.offDutyTime3!=null&&this.timeSolt3==false&&
				(form.signInStartTime3!=null&&form.signOutStartTime3!=null||form.isExcuseOnDutyCard3==true)&&
				(form.signInEndTime3!=null&&form.signOutEndTime3!=null||form.isExcuseOffDutyCard3==true)){
					this.$message.error({ message: '请勾选时段3'});
					return
				}
				if(form.onDutyTime4!=null&&form.offDutyTime4!=null&&this.timeSolt4==false&&
				(form.signInStartTime4!=null&&form.signOutStartTime4!=null||form.isExcuseOnDutyCard4==true)&&
				(form.signInEndTime4!=null&&form.signOutEndTime4!=null||form.isExcuseOffDutyCard4==true)){
					this.$message.error({ message: '请勾选时段4'});
					return
				}
				if(this.timeSolt3==false){
					delete form.onDutyTime3
					delete form.offDutyTime3
					delete form.signInStartTime3
					delete form.signOutStartTime3
					delete form.signInEndTime3
					delete form.signOutEndTime3
					delete form.isExcuseOnDutyCard3
					delete form.isExcuseOffDutyCard3
					delete form.straight2_3
					delete form.restStartTime3
					delete form.restEndTime3
				}
				if(this.timeSolt4==false){
					delete form.onDutyTime4
					delete form.offDutyTime4
					delete form.signInStartTime4
					delete form.signOutStartTime4
					delete form.signInEndTime4
					delete form.signOutEndTime4
					delete form.isExcuseOnDutyCard4
					delete form.isExcuseOffDutyCard4
					delete form.straight3_4
					delete form.restStartTime4
					delete form.restEndTime4
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
.shift_form {
	.el-date-editor.el-input,.shift_form .el-date-editor.el-input__inner{
		width: 150px!important;
	}
	.range_time .el-date-editor.el-input{
		width:110px!important;
	}
	.el-select.el-select--small{
		width: 130px!important;
	}
	.el-range-editor--small .el-range-separator{
		margin-right:15px;
		font-size:12px;
	}
	.el-range-editor--small .el-range-input{
		width: 70px!important;
	}
	.el-checkbox__label{font-size: 12px;}
	.range_time .el-date-editor.el-input__inner{
		width: 210px!important;
	}
	.end_time .el-form-item__content{
		margin-left: 50px!important;
	}
	
	.line-height{
		border-left: 1px dotted #B1B9BD;
		.el-form-item__label{
			line-height: 15px!important;
			margin: 12px 16px 0 0;
			padding-left: 25px;
		}
		.el-input{
			width: 120px!important;
		}
	}
}
.mt5{margin-top: 5px;}
.mt10{margin-top: 10px;}
.mt20{margin-top: 20px;}
.mt17{margin-top: 18px;}
.fs12{font-size: 12px}
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