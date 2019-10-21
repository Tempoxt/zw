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
						{{selectDay}}  {{week}}
					</el-col>
					<el-col :span="12" :offset="6">
						<el-radio-group v-model="form.isWorkTag">
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
import eleCalendar from 'ele-calendar'
import 'ele-calendar/dist/vue-calendar.css' 
export default {
	mixins: [table_mixin],
	data() {
		return {
			queryDialogFormVisible:true,
			form:{
				isWorkTag:''
			},
			dialogFormVisible:false,
			showHoliday:false,
			isSelected:true,
			isWorkTag:'',
			selectDay:'',
			week:'',
			dateLap:dayjs().format('YYYY-MM'),
			value: new Date(),
			datedef:[],
			prop:'date' //对应日期字段名
		};
	},
	components: {
		eleCalendar
	},
	computed:{
		disabled(){
			if(this.form.isWorkTag!==''&&this.form.isWorkTag!==undefined){
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
								<span style="margin-left:5px">{data.defvalue.value.remake}</span>
							</span>
							<span v-show={data.defvalue.value.isWorkTag==2} class="calType rest">休</span>
							<span v-show={data.defvalue.value.isWorkTag==1} class="calType work">班</span>
						</div>
					</div>) : <div class="fs15">{data.defvalue.text}</div>
				)
           }
           return (
				<div onClick={()=>{this.showis(parmas)}} style="min-height:90px;">
					{loop(parmas)}
				</div>
			);
		},
		changeDate(data){
			console.log(data,'daadadad')
		},
		close(){
			this.form.isWorkTag = ''
		},
		pick(date, mouseEvent, bbb) {
			console.log(date,'date')
			console.log(mouseEvent,'mouseEvent')
			console.log(bbb,'bbb')
			const curr = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDay()
			console.log(curr,'curr')
			var month1 = date.getMonth()+1
			var month = this.dateLap.split('-')[1]
			console.log(month1,month)
		},
		async showis(parmas){
			const data = parmas.defvalue.value
			console.log(data,'data show')
			const selectDay = new Date(data.date).getTime()
			const today = new Date(dayjs().format('YYYY-MM-DD')).getTime()
			// const today = new Date().getTime()
			if(today<=selectDay){
				this.selectDay = data.date
				this.week = data.week
				this.showHoliday = true
				this.form = (await this.$request.get('holidaymanager/holidaydatesetlist/'+data.id))[0]
				
				// var dt = new Date(this.selectDay.split("-")[0], this.selectDay.split("-")[1]-1,this.selectDay.split("-")[2]);
				// var weekDay = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
				// this.week = weekDay[dt.getDay()];
			}else{
				this.$message({
					message: '今天之前的日期不允许设置',
					type: 'warning'
				});
			}
		},
		handleHide(data){
			this.showHoliday = false
		},
		async handleFormSubmit(){
			this.dialogFormVisible = false
			const mes = await this.$request.post('holidaymanager/holidaydatesetlist/'+this.form.id,this.form)
			this.$message.success({message: mes})
			this.form.isWorkTag = ''
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
.fs15{
	font-size:14px;
}
.click{
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
.titleC{
	font-size: 16px;
	font-weight: bold;
	padding:0 0 20px 0px;
	border-bottom: 1px solid #E4EAEC;
	margin:0 0 30px 0px;
}
.calendar{
	margin: 20px;
}
.calendar .el-calendar__header{
	border:0;
}
.el-calendar-table thead, .el-table-calendar th[data-v-55be3324]{
    background:rgba(245,245,245,1);
}
.el-calendar-table thead th,.el-table-calendar th[data-v-55be3324]{
    border-right:1px solid rgba(234,234,234,1);
}
.el-calendar__title{
    font-size:16px;
}
.restWork{
	display:flex;justify-content:space-between;margin:15px 10px 0 0;align-items: center;
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


