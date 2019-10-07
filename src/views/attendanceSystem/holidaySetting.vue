  <template>
	<div>
		<el-calendar>
		<!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
			<template
				slot="dateCell"
				slot-scope="{date, data}">
				<div :class="data.isSelected ? 'is-selected' : ''">
					<span style="font-size:16px">{{ data.day.split('-').slice(2).join('-') }}</span>
					<div style="display:flex;justify-content:space-between;margin-top:20px">
						<span>
							{{ data.isSelected ? showHoliday=true : ''}}
						</span>
						<!-- <span class="calType"></span> -->
					</div>
				</div>

				<!-- <el-dialog
					@close="close"
					title="假日设定"
					:visible.sync="data.isSelected"
					class="public-dialog"
					v-el-drag-dialog
					width="800px"
					>
					<el-form ref="form" :model="form" label-width="38px" >
						<el-row>
							<el-col :span="12" :offset="6" style="color:#37474F;padding:20px 0 30px;font-weight:bold">
								2019年10月1日  星期二
							</el-col>
							<el-col :span="12" :offset="6">
								<el-radio-group v-model="form.radio">
									<el-radio :label="1">休息</el-radio>
									<br/>
									<el-radio style="margin-top:20px" :label="2">放假</el-radio>
								</el-radio-group>
							</el-col>
							<el-col :span="12" :offset="6" style="margin-top:20px">
								<form-render :type="`input`" :field="{name:'备注'}" v-model="form.remark"/>
							</el-col>
						</el-row>
					</el-form>

					<div slot="footer" class="dialog-footer">
						<el-button @click="handleHide(data)">取 消</el-button>
						<el-button type="primary" @click="handleFormSubmit">确 定</el-button>
					</div>
				</el-dialog> -->
			</template>
		</el-calendar>
		<el-dialog
			@close="close"
			title="假日设定"
			:visible.sync="showHoliday"
			class="public-dialog"
			v-el-drag-dialog
			width="800px"
			>
			<el-form ref="form" :model="form" label-width="38px" >
				<el-row>
					<el-col :span="12" :offset="6" style="color:#37474F;padding:20px 0 30px;font-weight:bold">
						2019年10月1日  星期二
					</el-col>
					<el-col :span="12" :offset="6">
						<el-radio-group v-model="form.radio">
							<el-radio :label="1">休息</el-radio>
							<br/>
							<el-radio style="margin-top:20px" :label="2">放假</el-radio>
						</el-radio-group>
					</el-col>
					<el-col :span="12" :offset="6" style="margin-top:20px">
						<form-render :type="`input`" :field="{name:'备注'}" v-model="form.remark"/>
					</el-col>
				</el-row>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click="handleHide">取 消</el-button>
				<el-button type="primary" @click="handleFormSubmit" :disabled="disabled">确 定</el-button>
			</div>
		</el-dialog>
				
	</div>
</template>
<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
import dayjs from 'dayjs'
export default {
	mixins: [table_mixin],
	data() {
		return {
			queryDialogFormVisible:true,
			form:{
				radio:''
			},
			dialogFormVisible:false,
			showHoliday:false,
			isSelected:true,
			radio:''
		};
	},
	computed:{
		disabled(){
			if(this.form.radio!==''&&this.form.radio!==undefined){
                return false
            }
            return true
		},
	},
	methods: {
		close(){
			this.form.radio = ''
			// this.isSelected = false
		},
		handleHide(data){
			data.isSelected = false
			this.showHoliday = false
			console.log(data,'dddd')
		},
		async handleFormSubmit(){
			this.form.radio = ''
			this.dialogFormVisible = false
			const mes = await this.$request.post('prodpropelplan/materialsexware/list/reset',{dateLap:this.form.dateLap})
			this.$message.success({message: mes})
		},
	},
	async created() {

	}
};
</script>
<style>
.el-calendar-table thead{
    background:rgba(245,245,245,1);
}
.el-calendar-table thead th{
    border-right:1px solid rgba(234,234,234,1);
}
.el-calendar__title{
    font-size:16px;
}
.calType{
	font-size:14px;width:40px;height:26px;line-height:26px;border-radius:4px;background-color:rgba(31,211,97,.2);text-align:center;color:#1FD361
}
</style>


