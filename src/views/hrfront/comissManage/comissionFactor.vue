  <template>
	<ui-table ref="table" 
		:table_column="table_field" 
		:table_query.sync="table_form.query"
		@query="querySubmit"
		
	>

  	<el-dialog
		:title="dialogStatus==='insert'?'添加业务提成系数':'编辑业务提成系数'"
		:visible.sync="dialogFormVisible"
		class="public-dialog"
		v-el-drag-dialog
		>
    	<el-form ref="form" :model="form"  label-width="110px" :rules="rules">
				<el-row >
					<el-col :span="14" :offset="4">
						<el-form-item prop="cusCode" label="客户编码">
							<el-select
								style="width:100%"
								v-model="form.cusCode"
								filterable
								clearable
								remote
								reserve-keyword
								placeholder="请输入客户编码"
								:remote-method="remoteMethod"
								:disabled="!isInsert"
								>
								<el-option
									v-for="item in productData"
									:key="item.CusCode"
									:label="item.CusName +`(${item.CusCode})`"
									:value="item.CusCode">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="14" :offset="4">
						<el-form-item prop="staff" label="姓名">
							<el-select
								style="width:100%"
								v-model="form.staff"
								filterable
								clearable
								placeholder="请选择"
								:disabled="!isInsert"
								>
								<el-option
									v-for="item in nameData"
									:key="item.id"
									:label="item.chineseName  +`(${item.employeeCode})`"
									:value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`inputSuffix`" prop="valueIncrease" :field="{name:'标准增值率'}" v-model="form.valueIncrease" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`inputSuffix`" prop="modelCommission" :field="{name:'模具提成系数'}" v-model="form.modelCommission" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`inputSuffix`" prop="productCommission" :field="{name:'贷款提成系数'}" v-model="form.productCommission" />	
					</el-col>
				</el-row>
			</el-form>

      <div slot="footer" class="dialog-footer dialog-multiple-footer">
        <div>
            <el-switch
                v-if="isInsert"
                v-model="form_multiple"
                active-text="连续添加"
                inactive-text="">
            </el-switch>
        </div>
        <div>
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
        </div>
      </div>
    </el-dialog>

    <table-header
		:table_actions="table_actions"
		:table_selectedRows="table_selectedRows"
		@action="handleAction"
		:table_form.sync="table_form"
		:table_column="table_field"
		>
      	<!-- <div style="padding-left:10px">
          <dateLap v-model="table_form.dateLap" @change="fetchTableData"/>
        </div> -->
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
    <each-table-column :table_field="table_field" />
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
// import dateLap from '@/components/Table/DateLap'
// import dayjs from 'dayjs'
const api_resource = api_common.resource("commission/commissionSet");
const defaultForm = () => {
    return {
      assessBase:'',
      unAssessBase:'',
	  totalBonus:'',
	  ids:''
    }
}
export default {
	mixins: [table_mixin],
	components:{
		OrgSelect,
		// dateLap
	},
	data() {
		var checkAmount = (rule, value, callback) => {
			if (!value) {
				return callback(new Error('请输入'));
			}else if (!(/^\d+(\.\d{1,2})?$/.test(value))) {
				callback(new Error('请输入精度为两位小数以内的正数'));
			}else{
				callback();
			}
		
		};
		return {
			form:{},
			loading: true,
			defaultForm,
			api_resource,
			orgCategory:[],
			queryDialogFormVisible:true,
			table_topHeight:236,
			dialogFormVisible:false,
			dialogForm1Visible:false,
			allIds:[],
			productData:[],
			nameData:[],
			rules:{
				staff: [
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
				],
				valueIncrease: [
					{ required: true, message: '请输入', trigger:  ['blur', 'change'] },
					{ validator: checkAmount, trigger:  ['blur', 'change'] }
				],
				productCommission: [
					{ required: true, message: '请输入', trigger:  ['blur', 'change'] },
					{ validator: checkAmount, trigger:  ['blur', 'change'] }
				],
				modelCommission: [
					{ required: true, message: '请输入', trigger:  ['blur', 'change'] },
					{ validator: checkAmount, trigger:  ['blur', 'change'] }
				],
				cusCode: [
					{ required: true, message: '请输入', trigger:  ['blur', 'change'] },
				]
			},
			importUploadUrl:'commission/commissionSet/upload',
			downloadUrl:'commission/commissionSet/downtemplate',
		}
	},
	methods: {
        async remoteMethod(query){
            if (query !== '') {
                this.productData = await api_common.resource('commission/getCusNameByCusCode').get({
                    CusCode:query
                })
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
		async add(){
			this.dialogFormVisible = true
			this.form = {}
			this.nameData = await api_common.resource('commission/getSalesStaff').get()
		},
		async edit(){
			this.dialogFormVisible = true
			this.form = await this.api_resource.find(this.table_selectedRowsInfo[0].id)
			this.nameData = await api_common.resource('commission/getSalesStaff').get()
		},
		async handleFormSubmit(){
			await this.form_validate()
            let form = Object.assign({},this.form)
            if(this.isInsert){
				await this.throwFormError(api_resource.create(form))
            }else{
				await this.throwFormError(api_resource.update(this.form.id,this.form))
			}
			if(this.isInsert&&this.form_multiple){
				this.form.staff = ''
            	this.$nextTick(()=>{
					this.$refs['form'].clearValidate()
				})
				this.fetchTableData()
			}else{
				this.dialogFormVisible = false
				this.fetchTableData()
			}
        },
	},
	async created() {
		const { field, action,table } = await api_common.menuInit("commission/commfactor");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		// this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM'))
		this.fetchTableData();
	}
};
</script>


