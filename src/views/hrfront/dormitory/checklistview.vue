  <template>
  <ui-table 
  class="public-table-container"
  ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  
  >


	<el-dialog
		title="请选择起始日期"
		:visible.sync="dialogForm1Visible"
		class="public-dialog"
		v-el-drag-dialog
		width="520px"
		>

		<el-form ref="form1" :model="form1" label-width="100px" :inline="true" >
			<el-row>
				<el-col :span="24" style="padding:20px;">
					<form-render :type="`day`" prop="dateLap" :field="{name:''}" v-model="form1.dateLap"/>
				</el-col>
			</el-row>
		</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm1Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm1Submit" :disabled="disabled">确 定</el-button>
		</div>
	</el-dialog>


	<el-dialog
		title="入住分配"
		:visible.sync="dialogForm2Visible"
		class="public-dialog"
		v-el-drag-dialog
		width="500px"
		>
		<el-form ref="form2" :model="form2" label-width="100px" v-loading="dialogLoading2">
			<el-row :gutter="20">
				<el-col :span="24">
					<el-form-item label="人员">
						{{distributionRow.chineseName}}
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="部门">
						{{distributionRow.department}}
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="职位">
						{{distributionRow.jobtitle}}
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<form-render :type="`dormselect`" :field="{name:'宿舍',id:this.empId}" v-model="distribut_form.bed"/>
				</el-col>
				<el-col :span="24">
					<form-render :type="`textarea`" autosize :row="1" :field="{name:'备注/说明'}" v-model="distribut_form.remark" placeholder="请输入"/>
				</el-col>
			</el-row>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm2Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm2Submit">确 定</el-button>
		</div>
	</el-dialog>

	<el-dialog
		title="入住"
		:visible.sync="dialogFormVisible3"
		class="public-dialog"
		v-el-drag-dialog
		width="500px"
		>
		<el-form ref="form3" :model="checkin_form" label-width="100px">
			<el-row :gutter="20">
				<el-col :span="24">
					<el-form-item label="入住员工">
						<span v-for="(item,i) in checkinRows" :key="i">{{item.chineseName}} </span>
					</el-form-item>
				</el-col>
				
				<el-col :span="24">
					<form-render :type="`day`" :field="{name:'入住时间'}"
						v-model="checkin_form.checkinDate"
					/>
				</el-col>
			</el-row>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible3 = false">取 消</el-button>
			<el-button type="primary" @click="handleFormSubmit3">确 定</el-button>
		</div>
	</el-dialog>

	<el-dialog
		title="搬离"
		:visible.sync="dialogFormVisible4"
		class="public-dialog"
		v-el-drag-dialog
		width="500px"
		>
		<el-form ref="form" :model="checkout_form" label-width="100px">
			<el-row :gutter="20">
				<el-col :span="24">
					<el-form-item label="搬离员工">
						<span v-for="(item,i) in checkoutRows" :key="i">{{item.chineseName}} </span>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<form-render :type="`input`" :field="{name:'电表读数'}"
						v-model="checkout_form.electricView"
					/>
				</el-col>
				<el-col :span="24">
					<form-render :type="`day`" :field="{name:'搬离日期'}"
						v-model="checkout_form.checkoutDate"
					/>
				</el-col>
			</el-row>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible4 = false">取 消</el-button>
			<el-button type="primary" @click="handleFormSubmit4">确 定</el-button>
		</div>
	</el-dialog>



    <table-header
      :table_actions="table_actions"
      :table_selectedRows="table_selectedRows"
      @action="handleAction"
      :table_form.sync="table_form"
      :table_column="table_field"
    >
          <div style="padding-left:10px">
            <el-select v-model="status" placeholder="请选择" @change="changeStatus">
              <el-option
                v-for="item in statusData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
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
     <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
			<el-button v-if="scope.row.selectState==1" @click="distrib({row:scope.row})" type="text" size="small" >分配</el-button>
			<el-button v-if="scope.row.selectState==2" @click="checkIn({row:scope.row})" type="text" size="small" >入住</el-button>
			<el-button v-if="scope.row.selectState==3" @click="review({row:scope.row})" type="text" size="small" >审核</el-button>
			<el-button v-if="scope.row.selectState==4" @click="checkOut({row:scope.row})" type="text" size="small" >搬离</el-button>
            <el-button @click="audit({row:scope.row})" type="text" size="small" >撤销</el-button>
        </template>
    </el-table-column>

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
const api_resource = api_common.resource("dormitory/checklistview");
import dayjs from 'dayjs'
const download = require('downloadjs')
const defaultForm = () => {
    return {
        estate:1,
        sort:1
    }
}
export default {
	mixins: [table_mixin],
	data() {
		return {
			loading: true,
			form:{},
			form1:{
				dateLap:''
			},
			form2:{},
			form3:{},
			distribut_form:{},
			checkin_form:{},
			checkout_form:{},
			api_resource,
			orgCategory:[],
			queryDialogFormVisible:true,
			dialogForm1Visible:false,
			dialogForm2Visible:false,
			dialogFormVisible3:false,
			dialogFormVisible4:false,
			adminList:[],
			defaultForm,
			roomAdminList:[],
			dormList:[],
      		dialogLoading2:false,
			statusData:[
				{ id:0, name:'全部'},
				{ id:1, name:'待分配'},
				{ id:2, name:'待入住'},
				{ id:3, name:'待审核搬离'},
				{ id:4, name:'待搬离'}
			],
			status:0,
			distributionRow:{},
			checkinRows:{},
			checkoutRows:{},
			empId:'',
            table_topHeight:235,
		};
	},
	watch:{
	
	},
	computed:{
		disabled(){
			if(this.form1.dateLap!==''){
				return false
			}
			return true
		},
	},
	methods: {
		changeStatus(val){
			this.table_form.currentpage = 1
			this.status = val
			this.table_form.selectState = this.status
			this.fetchTableData()
		},
		distrib({row}){
			this.distribut_form = {}
			this.dialogForm2Visible = true
			this.distributionRow = row
			this.empId = row.empId
		},
		async handleForm2Submit(){
			this.distribut_form.empId = this.empId;
            let form = Object.assign({},this.distribut_form,this.distributionRow,)
			await this.$request.post('/dormitory/checkinout',form)
			this.$message.success('分配成功');
			this.dialogForm2Visible = false
			this.fetchTableData()
		},
		checkIn({row}){
			this.checkin_form = {}
			this.checkinRows =Array.isArray(row)?row:[row]
			this.dialogFormVisible3 = true
		},
		async handleFormSubmit3(){
			let checkIn = Object.assign({},this.checkinRows[0],this.checkin_form,);
			await this.$request.put('/dormitory/todocheckinconfirm/'+checkIn.id,checkIn)
			this.dialogFormVisible3 = false
			this.fetchTableData()
		},
		async review({row}){
			await this.$request.put('/dormitory/checkoutaudit',{ ids:row.empId })
			this.fetchTableData()
		},
		async checkOut({row}){
			this.checkout_form = {}
			this.checkoutRows =Array.isArray(row)?row:[row]
			this.dialogFormVisible4 = true
		},
		async handleFormSubmit4(){
			let checkOut = Object.assign({},this.checkoutRows[0],this.checkout_form,);
			await this.$request.put('/dormitory/todocheckoutconfirm/'+checkOut.id,checkOut)
			this.dialogFormVisible4 = false
			this.fetchTableData()
		},
		async audit({row}){
			await this.$request.put('dormitory/cancelcheckstate',{
				selectState:row.selectState,
				employeeCode:row.employeeCode
			})
			this.fetchTableData()
		},
		ab2str(u,f) {
			var b = new Blob([u]);
			var r = new FileReader();
			r.readAsText(b, 'utf-8');
			r.onload = function (){if(f)f.call(null,r.result)}
		},
		exportExpireSheet(){
			this.form1.dateLap = ''
			this.dialogForm1Visible = true
		},
		async handleForm1Submit(){
			try{
				const { data,name,contentType} = await this.$request.get('/dormitory/export/expirein?dateLap='+this.form1.dateLap,{ responseType:'arraybuffer'})
				download(data,name||this.$route.meta.title,contentType)
			}catch(err){
				var that = this;
				that.ab2str(err.error.response.data,function(str){
					that.$message.error({ message: str });
				});
			}finally{
				this.dialogForm1Visible = false
			}
		},
		async edit(){
			let row = this.table_selectedRows[0]
			this.form = await api_resource.find(row.id)
			this.dialogFormVisible = true;
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
	
		async handleFormSubmit(){
			let form = Object.assign({},this.form)
			form.org_id = this.id
			if(this.isInsert){
				await api_resource.create(form)
			}else{
				await api_resource.update(form.id,form)
			}
			this.dialogFormVisible = false
			this.fetchTableData()
		},
	},
	async created() {
		const { field, action,table } = await api_common.menuInit("dormitory/checklistview");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.fetchTableData();
		if(this.$route.fullPath.indexOf('=')!==-1){
			let status = this.$route.fullPath.split('=')[1]
			this.table_form.selectState = status
			this.status = Number(status)
		}else{
			this.table_form.selectState = this.status
		}
		// this.table_form.dateLap = dayjs().format('YYYY-MM')
	}
};
</script>


