  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  >

	<el-dialog
		title="请选择重置月份"
		:visible.sync="dialogFormVisible"
		class="public-dialog"
		v-el-drag-dialog
		width="520px"
		>
		<el-form ref="form" :model="form">
			<el-row>
				<el-col :span="24" style="padding:20px;">
					<el-date-picker
					   	:clearable="false"
						v-model="form.dateLap"
						type="month"
						size="small"
						format="yyyy年MM月"
						value-format="yyyy-MM"
						placeholder="选择月份">
					</el-date-picker>
				</el-col>
			</el-row>
		</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible = false">取 消</el-button>
			<el-button type="primary" @click="handleFormSubmit" :disabled="disabled">确 定</el-button>
		</div>
	</el-dialog>


	<el-dialog
		title="请选择月份"
		:visible.sync="dialogForm1Visible"
		class="public-dialog"
		v-el-drag-dialog
		width="520px"
		>
		<el-form ref="form1" :model="form1">
			<el-row>
				<el-col :span="24" style="padding:20px;">
					<el-date-picker
					   	:clearable="false"
						v-model="form1.dateLap"
						type="month"
						size="small"
						format="yyyy年MM月"
						value-format="yyyy-MM"
						placeholder="选择月份">
					</el-date-picker>
				</el-col>
			</el-row>
		</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm1Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm1Submit" :disabled="disabled1">确 定</el-button>
		</div>
	</el-dialog>


    <table-header
		:table_actions="table_actions"
		:table_selectedRows="table_selectedRows"
		@action="handleAction"
		:table_form.sync="table_form"
		:table_column="table_field"
		>
		<div style="padding-left:10px" v-if="m==1"> 
			<DateLapRange :disabled="true" v-model="table_form.dateLap" @change="fetch"/>
		</div>
		<div style="padding-left:10px" v-if="m==2">
			<el-select v-model="form.quarter" placeholder="请选择" @change="fetch">
				<el-option
				v-for="item in quarter"
				:key="item.season"
				:label="item.title"
				:value="item.season">
				</el-option>
			</el-select>
		</div>
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
import dayjs from 'dayjs'
const api_resource = api_common.resource("commission/valueIncrease");
export default {
	mixins: [table_mixin],
	props:['id','url','m'],
	data() {
		return {
			loading: true,
			api_resource,
			orgCategory:[],
			form:{
				dateLap:''
			},
			form1:{
				dateLap:''
			},
			queryDialogFormVisible:true,
			table_topHeight:276,
			dialogFormVisible:false,
			dialogForm1Visible:false,
			quarter:[],
			timer:'',
			statusk:1,
			val:'',
			month:dayjs().format('YYYY-MM'),
			f:""
		};
	},
	computed:{
		disabled(){
			if(this.form.dateLap!==''&&this.form.dateLap!==undefined){
                return false
            }
            return true
		},
		disabled1(){
			if(this.form1.dateLap!==''&&this.form1.dateLap!==undefined){
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
			this.table_form.currentpage = 1
			this.table_form.query.query= []
			this.fetchMenu()
			this.fetchQuarter()
			this.form.quarter = this.quarter[0].season;
			this.$set(this.table_form,'dateLap',[this.month,this.month])
			if(this.url=='commission/monthDetail'){
				this.api_resource = api_common.resource("commission/valueIncrease");
			}else if(this.url=='commission/quarterstat'){
				this.api_resource = api_common.resource("commission/seasonValueIncrease");
			}
		}
	},
	methods: {
        fetch(){
            this.table_form.currentpage = 1
            this.fetchTableData()
		},
		async getDa(){
			if(this.statusk!=0){
				this.val = await this.$request.get('commission/valueIncrease/resetresult',{alert:false})
				if(this.val=='已完成'){
					this.statusk = 0
					this.$message.success({ message: this.val})
					this.fetchTableData()
				}
			}else{
				clearInterval(this.timer)
			}
		},
		disableModify(){
			this.form1.dateLap = ''
			this.dialogForm1Visible = true
			this.f = 0
		},
		enableModify(){
			this.form1.dateLap = ''
			this.dialogForm1Visible = true
			this.f = 1
		},
		async handleForm1Submit(){
			this.dialogForm1Visible = false
			await this.$request.put('commission/valueIncrease/lock',{dateLap:this.form1.dateLap,actionType:this.f})
			this.fetchTableData()
		},
		async handleFormSubmit(){
			this.dialogFormVisible = false
			this.statusk = 1
			const mes = await this.$request.post('commission/valueIncrease/reset',{dateLap:this.form.dateLap})
			this.$message.success({message: mes})
			this.timer = setInterval(()=>{
				this.getDa()
			},10000)
		},
		async reset(){
			this.form={}
			this.dialogFormVisible = true
		},
		async fetchQuarter(){
			this.quarter = await api_common.resource('commission/seasonValueIncrease/optional').get()
		},
		async fetchTableData() {
			if(!this.id){
				return
			}
			this.table_loading = true;
			this.table_form.org_id = this.id
			if(this.url=="commission/monthDetail"){
				const {rows , total } = await api_resource.get(this.table_form)
				this.table_data  = rows
				this.table_form.total = total
			}else{
				this.table_form.dateLap = this.form.quarter
				const {rows , total }= await api_common.resource('commission/seasonValueIncrease').get(this.table_form)
				this.table_data  = rows
				this.table_form.total = total
			}
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
    	},
		async fetchMenu(){
			const { field, action,table } = await api_common.menuInit(this.url);
			this.table_field = field;
			this.table_actions = action;
			this.table_config = table
			this.fetchTableData();
		}
	},
	async created() {
		this.$set(this.table_form,'dateLap',[this.month,this.month])
		await this.fetchMenu()
		await this.fetchQuarter()
	}
};
</script>


