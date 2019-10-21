  <template>
  <!-- 假日设定 -->
	<div class="calendar">
		<div class="titleC">假日设定</div>
		<ele-calendar
			:render-content="renderContent"
			:data="datedef"
			:prop="prop"
			:border="true"
			@pick="pick"
			@date-change="changeDate"
		></ele-calendar>
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
						{{this.paramVal.date}}  {{this.paramVal.week}}
					</el-col>
					<el-col :span="12" :offset="6">
						<el-radio-group v-model="form.isWork">
							<el-radio :label="2">休息</el-radio>
							<br/>
							<el-radio style="margin-top:20px" :label="1">上班</el-radio>
						</el-radio-group>
					</el-col>
					<el-col :span="12" :offset="6" style="margin-top:20px">
						<form-render :type="`input`" :field="{name:'备注'}" v-model="form.remake"/>
					</el-col>
				</el-row>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click="handleHide">取消设置</el-button>
				<el-button type="primary" @click="handleFormSubmit" :disabled="disabled">确 定</el-button>
			</div>
		</el-dialog>
				
	</div>
</template>
<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
import dayjs from 'dayjs'
import eleCalendar from 'ele-calendar'
import 'ele-calendar/dist/vue-calendar.css' 
export default {
	mixins: [table_mixin],
	data() {
		return {
			queryDialogFormVisible:true,
			form:{
				isWork:''
			},
			showHoliday:false,
			dateLap:dayjs().format('YYYY-MM'),
			value: new Date(),
			datedef:[],
			paramVal:{},
			prop:'date', //对应日期字段名
		};
	},
	components: {
		eleCalendar
	},
	computed:{
		disabled(){
			if(this.form.isWork!==''&&this.form.isWork!==undefined){
                return false
            }
            return true
		},
	},
	methods: {
		renderContent(h,parmas) {
            const loop = data =>{
				return (
					data.defvalue.value ? (<div class="click">
						<div class="fs15">{data.defvalue.text}</div>
						<div class="restWork">
							<span style="display: inline-block;color:#F2353C">{data.defvalue.value.holidayTitle} 
								<span style="margin-left:5px;color:#606266">{data.defvalue.value.remake}</span>
							</span>
							<span v-show={data.defvalue.value.isWork==2} class="calType rest">休</span>
							<span v-show={data.defvalue.value.isWork==1} class="calType work">班</span>
						</div>
					</div>) : <div class="fs15">{data.defvalue.text}</div>
				)
           }
           return (
				<div style="height:90px;">
					{loop(parmas)}
				</div>
			);
		},
		async changeDate(date){
			const y = date.getFullYear()
			const m = date.getMonth()+1
			const d = date.getDate()
			const curr = y+'-'+this.add0(m)+'-'+this.add0(d)
			var currmonth = this.dateLap.split('-')[1]
			if((y+'-'+this.add0(m))!=this.dateLap){
				this.datedef = []
				this.dateLap = y+'-'+this.add0(m)
				this.datedef = await this.$request.get('holidaymanager/holidaydatesetlist?datelap='+this.dateLap)
			}
		},
		close(){
			this.form.isWork = ''
		},
		add0(m){
			return m<10?'0'+m:m 
		},
		async pick(date, mouseEvent, parmas) {
			this.paramVal = parmas.value
			const y = date.getFullYear()
			const m = date.getMonth()+1
			const d = date.getDate()
			const curr = y+'-'+this.add0(m)+'-'+this.add0(d)
			var currmonth = this.dateLap.split('-')[1]
			if(m!=currmonth){
				this.datedef = []
				this.dateLap = y+'-'+this.add0(m)
				this.datedef = await this.$request.get('holidaymanager/holidaydatesetlist?datelap='+this.dateLap)
			}
			if(this.datedef.length!=0){
				const today = new Date(dayjs().format('YYYY-MM-DD')).getTime()
				const selectDay = new Date(curr).getTime()
				if(today<=selectDay){
					if(this.paramVal==''){
						this.datedef.map(o=>{
							if(o.date==curr){
								this.paramVal = o
								return o
							}
						})
					}
					this.form = (await this.$request.get('holidaymanager/holidaydatesetlist/'+this.paramVal.id))[0];
					if(this.form.isWork==0){
						this.form.isWork = ''
					}else{
						this.form.isWork = Number(this.form.isWork)
					}
					this.showHoliday = true
				}else{
					this.$message({
						message: '今天之前的日期不允许设置',
						type: 'warning'
					});
				}
			}
		},
		async handleHide(data){
			this.form.isWork = ''
			this.form.isWorkTag = ''
			this.form.remake = ''
			const mes = await this.$request.post('holidaymanager/holidaydatesetlist/'+this.form.id,this.form)
			this.$message.success({message: mes})
			this.showHoliday = false
			this.fetchTableData()
		},
		async handleFormSubmit(){
			const mes = await this.$request.post('holidaymanager/holidaydatesetlist/'+this.form.id,this.form)
			this.$message.success({message: mes})
			this.showHoliday = false
			this.fetchTableData()
		},
		async fetchTableData() {
			this.datedef = await this.$request.get('holidaymanager/holidaydatesetlist?datelap='+this.dateLap)
		},
	},
	async created() {
		this.fetchTableData()
	}
};
</script>
<style>
.prev-month,.next-month{
	height:90px;
}
.fs15{
	font-size:14px;
	text-align: left;
	margin: 8px 0 0 20px;
}
.el-date-picker-calendar__header{
	font-size: 15px;
}
.el-date-table-calendar td.current[data-v-55be3324]:not(.disabled){
	background:#f2f8fe;
	color: #1989FA;
}
.el-date-table-calendar td.current:not(.disabled){
	background:#f2f8fe;
	color: #1989FA;
}
.titleC{
	font-size: 16px;
	font-weight: bold;
	padding:0 0 20px 0px;
	/* border-bottom: 1px solid #E4EAEC; */
	/* margin:0 0 0px 0px; */
}
.calendar{
	margin: 20px;
}
.calendar .el-calendar__header{
	border:0;
}
.el-calendar-table thead, .el-table-calendar th{
    background:rgba(245,245,245,1);
}
.el-calendar-table thead th,.el-table-calendar th{
    border-right:1px solid rgba(234,234,234,1);
}
.el-calendar__title{
    font-size:16px;
}
.restWork{
	display:flex;justify-content:space-between;margin:15px 10px 0 8px;align-items: center;
}
.calType{
	font-size:12px;width:36px;height:22px;line-height:22px;border-radius:4px;text-align:center;
}
.rest{
	background-color:rgba(244,122,36,.2);
	color:#F47A24;
}
.work{
	background-color:rgba(31,211,97,.2);
	color:#1FD361;
}
</style>


