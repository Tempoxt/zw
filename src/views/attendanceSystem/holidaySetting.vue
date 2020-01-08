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
			<el-form ref="form" :model="form" label-width="60px" >
				<el-row>
					<el-col :span="12" :offset="6" style="color:#37474F;padding:20px 0 30px;font-weight:bold">
						{{this.paramVal.date}}  {{this.paramVal.week}}
					</el-col>
					<el-col :span="12" :offset="6">
						<form-render :type="`select`" :field="{name:'日期设置',options:dataList}" clearable v-model="form.workType"/>
						<!-- <el-checkbox  v-model="rest">休息</el-checkbox>
						<br/>
						<el-checkbox style="margin-top:20px" v-model="work">上班</el-checkbox> -->
					</el-col>
					<el-col :span="12" :offset="6" >
						<form-render :type="`input`" :field="{name:'备注'}" maxlength="20" v-model="form.remake"/>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<!-- <el-button type="text" style="color:#F2353C" @click="deleSet">取消设置</el-button>  dialog-multiple-footer-->
				<div>
					<el-button @click="handleHide">取 消</el-button>
					<el-button type="primary" @click="handleFormSubmit" :disabled="disabled">确 定</el-button>
				</div>
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
				workType:''
			},
			showHoliday:false,
			dateLap:dayjs().format('YYYY-MM'),
			value: new Date(),
			datedef:[],
			paramVal:{},
			prop:'date', //对应日期字段名
			rest: false,
			work: false,
			dataList:[]
		};
	},
	components: {
		eleCalendar
	},
	watch:{
		rest(){
			if(this.rest==true){
				this.work = false
				this.form.workType = 2
			}
		},
		work(){
			if(this.work==true){
				this.rest = false
				this.form.workType = 1
			}
		}
	},
	computed:{
		disabled(){
			if(this.form.workType!==''&&this.form.workType!==undefined){
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
						<div class="fs15" style={{color:data.defvalue.column==6||data.defvalue.column==0?'#F2353C':''}}>{data.defvalue.text}</div>
						<div class="restWork">
							<div style="display:inline-block;color:#F2353C;line-height:15px;text-align:left;width:88%">{data.defvalue.value.holidayTitle} 
								<span style="color:#606266;font-weight:normal">{data.defvalue.value.remake}</span>
							</div>
							<div v-show={data.defvalue.value.workType==1} class="calType work">班</div>
							<div v-show={data.defvalue.value.workType==2} class="calType rest">休</div>
							<div v-show={data.defvalue.value.workType==3} class="calType holid">假</div>
							<div v-show={data.defvalue.value.workType==4} class="calType saturday">周六</div>
							<div v-show={data.defvalue.value.workType==5} class="calType sunday">周日</div>
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
			this.form.workType = ''
			this.rest = false
			this.work = false
		},
		add0(m){
			return m<10?'0'+m:m 
		},
		async getList(){
			this.dataList = (await api_common.resource('holidaymanager/holidaydatesettypelist').get()).map(o=>{return {label:o.name,value:o.value}})
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
					this.getList()
					this.form = (await this.$request.get('holidaymanager/holidaydatesetlist/'+this.paramVal.id))[0];
					if(this.form.workType==''){
						this.form.workType = ''
					}else{
						this.form.workType = Number(this.form.workType)
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
		async deleSet(){
			this.form.workType = ''
			this.form.remake = ''
			this.form.workTypeTag = ''
			this.showHoliday = false
			const mes = await this.$request.post('holidaymanager/holidaydatesetlist/'+this.form.id,this.form)
			this.$message.success({message: mes})
			this.fetchTableData()
		},
		async handleHide(data){
			this.form.workType = ''
			this.form.remake = ''
			this.showHoliday = false
			this.rest = false
			this.work = false
		},
		async handleFormSubmit(){
			const mes = await this.$request.post('holidaymanager/holidaydatesetlist/'+this.form.id,this.form)
			this.$message.success({message: mes})
			this.showHoliday = false
			this.rest = false
			this.work = false
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
<style  lang="scss">
.click{
	height:90px;
}
.calendar{
	margin: 20px;
	.el-table-calendar th[data-v-55be3324]:first-child,.el-table-calendar th[data-v-55be3324]:last-child{
		color:  #F2353C
	}
	.el-table-calendar th[data-v-55be3324]{
		background:  #F5F5F5
	}
	.el-date-table-calendar tbody tr th{
		background:  #F5F5F5
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
	.el-calendar__header{
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
	.prev-month,.next-month{
		height:90px;
	}
	.fs15{
		font-size:14px;
		text-align: left;
		margin: 8px 0 0 20px;
	}
	.titleC{
		font-size: 16px;
		font-weight: bold;
		padding:0 0 20px 0px;
	}
	.restWork{
		display:flex;justify-content:space-between;margin:23px 10px 0 8px;
	}
	.calType{
		font-size:12px;width:36px;height:22px;line-height:22px;border-radius:4px;text-align:center;font-weight:normal
	}
	.rest{
		background-color:rgba(244,122,36,.2);
		color:#F47A24;
	}
	.work{
		background-color:rgba(31,211,97,.2);
		color:#1FD361;
	}
	.holid{
		color: #F2353C;
		background-color:rgba(242,53,60,.2)
	}
	.saturday{
		color: #0B55D4;
		background-color:rgba(11,85,212,.2)
	}
	.sunday{
		color: #6E00DB;
		background-color:rgba(110,0,219,.2)
	}
}
</style>


