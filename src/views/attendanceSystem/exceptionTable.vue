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
			<el-row>
				<el-col :span="12">
					<form-render prop="exceptionType" :type="`select`" :field="{name:'补卡类型',options:attenDatas}" v-model="form.exceptionType"/>
				</el-col>
				<el-col :span="12">
					<form-render prop="exceptionTime" :type="`datetime`" :field="{name:'补打卡时间'}" v-model="form.exceptionTime"/>
				</el-col>
				<el-col :span="12">
					<form-render :type="`input`" :field="{name:'补卡原因'}" v-model="form.exceptionReason"/>
				</el-col>
			</el-row>
		</el-form>

      	<OrgSelect :result="result" v-model="form.ids" activeNam="first" ref="OrgSelect" v-if="dialogFormVisible"/>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible = false">取 消</el-button>
			<el-button type="primary" @click="handleFormSubmit">确 定</el-button>
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
						<form-render prop="exceptionType" :type="`select`" :field="{name:'补卡类型',options:attenDatas}" v-model="form1.exceptionType"/>
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

		<el-form ref="form" :model="form3" label-width="110px" :rules="rule">
			<el-row>
				<el-col :span="12">
					<form-render prop="temporaryDate" :type="`day`" :field="{name:'调休日期'}" v-model="form3.temporaryDate"/>
				</el-col>
				<el-col :span="12">
					<form-render prop="temporaryOverDate" :type="`day`" :field="{name:'调休加班日期'}" v-model="form3.temporaryOverDate"/>
				</el-col>
			</el-row>
		</el-form>

      	<OrgSelect :result="result" v-model="form3.ids" ref="OrgSelect3" v-if="dialogForm3Visible"/>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm3Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm3Submit">确 定</el-button>
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
			<el-form ref="form4" :model="form4" label-width="110px" :rules="rule4">
				<el-row :gutter="20">
					<el-col :span="17" :offset="3">
						<form-render :type="`input`" :field="{name:'员工姓名'}" v-model="form4.chineseName" disabled/>
					</el-col>
					<el-col :span="17" :offset="3">
						<form-render prop="temporaryDate" :type="`day`"  :field="{name:'调休日期'}" v-model="form4.temporaryDate"/>
					</el-col>
					<el-col :span="17" :offset="3">
						<form-render prop="temporaryOverDate" :type="`day`" :field="{name:'调休加班日期'}" v-model="form4.temporaryOverDate"/>
					</el-col>
				</el-row>
			</el-form>
		</div>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm4Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm4Submit" :disabled="disabled4">确 定</el-button>
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
			api_resource:api_common.resource(this.url),
			table_topHeight:276,
			queryDialogFormVisible:true,
			dialogFormVisible:false,
			dialogForm1Visible:false,
			dialogForm3Visible:false,
			dialogForm4Visible:false,
			dialogForm5Visible:false,
			optionDatas: [],
			attenDatas:[],
			status:'全部',
			status3:'',
			form:{},
			form1:{
				exceptionType: null,
				exceptionTime: null
			},
			form3:{},
			form4:{
				temporaryDate: null,
				temporaryOverDate: null
			},
			form5:{},
			result:[],
			rule:{
				exceptionType:[
					{ required: true, message: '请选择', trigger: ['blur','change'] },
				],
				exceptionTime:[
					{ required: true, message: '请选择日期时间', trigger: ['blur','change'] },
				],
			},
			rule1:{
				exceptionType:[
					{ required: true, message: '请选择', trigger: ['blur','change'] },
				],
				exceptionTime:[
					{ required: true, message: '请选择日期时间', trigger: ['blur','change'] },
				],
			},
			rule3:{
				temporaryDate:[
					{ required: true, message: '请选择日期', trigger: ['blur','change'] },
				],
				temporaryOverDate:[
					{ required: true, message: '请选择日期', trigger: ['blur','change'] },
				]
			},
			rule4:{
				temporaryDate:[
					{ required: true, message: '请选择日期', trigger: ['blur','change'] },
				],
				temporaryOverDate:[
					{ required: true, message: '请选择日期', trigger: ['blur','change'] },
				]
			}
		};
	},
	computed:{
		disabled(){
			if(this.form1.exceptionType!=null&&this.form1.exceptionTime!=null){
				return false
			}
			return true
		},
		disabled4(){
			if (this.form4.temporaryDate!=null&&this.form4.temporaryOverDate!=null) {
				return false
			}
			return true
		}
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
		}
	},
	methods: {
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
			try{
				let mes = await this.$request.post('/attendance/exception/exceptiondelete',{ids:rows.join(',')})
				this.$message.success(mes)
				this.fetchTableData()
			}catch(e){

			}
		},
		add(){
			this.form={}
			let attend = this.attenDatas.slice(1)
			this.attenDatas = attend
			this.result = []
			this.$nextTick(()=>{
				this.$refs['form'].clearValidate()
			})
			this.dialogFormVisible = true
		},
		async edit(){
			this.attenDatas = (await api_common.resource('attendance/exceptionfields').get()).map(o=>{return {label:o.name,value:o.id}});
			this.dialogForm1Visible = true;
			let row = this.table_selectedRows[0]
			this.form1 = (await this.api_resource.find(row.id))[0]
			let exceptionReason = this.form1.exceptionReason.replace(/<[^>]+>/g, "");//去除字符串中的html
			this.form1.exceptionReason = exceptionReason.replace(/&nbsp;/ig, " ");//去除字符串中的&nbsp;
		},
		async handleFormSubmit(){
			await this.form_validate()
			let ids = this.$refs.OrgSelect.getIdsResult()
			this.form.ids = ids;
			if(this.form.ids!==''){
				try{
					let mes = await this.api_resource.create(this.form)
					this.$message.success({message:mes});
					this.dialogFormVisible = false
					this.fetchTableData()
				}catch(err){
					
				}
			}else{
				this.$message.error('请选择要添加的人员');
			}
		},
		async handleForm1Submit(){
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
			let ids3 = this.$refs.OrgSelect3.getIdsResult()
			this.form3.ids = ids3;
			if(this.form3.ids!==''){
				try{
					// let mes = await this.api_resource.create(this.form)
					// this.$message.success({message:mes});
					this.dialogForm3Visible = false
					this.fetchTableData()
				}catch(err){
					
				}
			}else{
				this.$message.error('请选择要添加的人员');
			}
		},
		async handleForm4Submit(){

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