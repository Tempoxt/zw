  <template>
	<ui-table 
		class="public-table-container"
		ref="table" 
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
									:key="item.cusCode"
									:label="item.cusAbbname +`(${item.cusCode})`"
									:value="item.cusCode">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="14" :offset="4">
						<el-form-item prop="staff" label="员工姓名">
							<el-select
								style="width:100%"
								v-model="form.staff"
								filterable
								clearable
								placeholder="请搜索或选择"
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
					<!-- <el-col :span="14" :offset="4">
						<form-render :type="`select`" prop="projectType" :field="{name:'项目类型',options:projectData}" v-model="form.projectType" />
					</el-col> -->
					<el-col :span="14" :offset="4">
						<form-render :type="`inputSuffix`" suffix="%" prop="valueIncrease" :field="{name:'标准增值率'}" v-model="form.valueIncrease" />
					</el-col>
					<!-- <el-col :span="14" :offset="4">
						<form-render :type="`inputSuffix`" suffix="%" prop="modelCommission" :field="{name:'模具提成系数'}" v-model="form.modelCommission" />
					</el-col> -->
					<el-col :span="14" :offset="4">
						<form-render :type="`inputSuffix`" suffix="%" prop="commissionRatio" :field="{name:'业务提成系数'}" v-model="form.commissionRatio" />
					</el-col>
					<!-- <el-col :span="14" :offset="4">
						<form-render :type="`input`" :field="{name:'零件收款天数'}" v-model="form.partsCollectionDay" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" :field="{name:'组件收款天数'}" v-model="form.moduleCollectionDay" />
					</el-col> -->
					<!-- <el-col :span="14" :offset="4">
						<form-render :type="`input`" :field="{name:'客户信息来源'}" v-model="form.cusSource" />
					</el-col> -->
					<el-col :span="14" :offset="4">
						<form-render :type="`textarea`" autosize :row="1" :field="{name:'备注'}" v-model="form.remark" />
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
		:show-summary="table_config.isShowFooter"
		:summary-method="getSummaries"
      
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
// const api_resource = api_common.resource("commission/commissionSet");
const api_resource = api_common.resource("commission/getcommission");
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
			table_topHeight:234,
			dialogFormVisible:false,
			dialogForm1Visible:false,
			allIds:[],
			productData:[],
			nameData:[],
			projectData:[],
			rules:{
				staff: [
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
				],
				valueIncrease: [
					{ required: true, message: '请输入', trigger:  ['blur', 'change'] },
					{ validator: checkAmount, trigger:  ['blur', 'change'] }
				],
				commissionRatio: [
					{ required: true, message: '请输入', trigger:  ['blur', 'change'] },
					{ validator: checkAmount, trigger:  ['blur', 'change'] }
				],
				modelCommission: [
					{ required: true, message: '请输入', trigger:  ['blur', 'change'] },
					{ validator: checkAmount, trigger:  ['blur', 'change'] }
				],
				cusCode: [
					{ required: true, message: '请输入', trigger:  ['blur', 'change'] },
				],
				projectType: [
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
				],
			},
			importUploadUrl:'commission/commissionSet/upload',
			downloadUrl:'commission/commissionSet/downtemplate',
		}
	},
	methods: {
        async remoteMethod(query){
            if (query !== '') {
                this.productData = await api_common.resource('commission/getonecommission').get({
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
			this.projectData = (await api_common.resource('commission/getProjectType').get()).map(o=>{return {label:o.name,value:o.id}})
		},
		async edit(){
			this.dialogFormVisible = true
			this.$nextTick(()=>{
				this.$refs['form'].clearValidate()
			})
			this.form = await this.$request.get('commission/royaltycoefficient/'+this.table_selectedRowsInfo[0].id)
			// this.form = await this.api_resource.find(this.table_selectedRowsInfo[0].id)
			this.nameData = await api_common.resource('commission/getSalesStaff').get()
			this.projectData = (await api_common.resource('commission/getProjectType').get()).map(o=>{return {label:o.name,value:o.id}})
		},
		async handleFormSubmit(){
			await this.form_validate()
            let form = Object.assign({},this.form)
            if(this.isInsert){
				await this.$request.post('/commission/royaltycoefficient',form)
				// await this.throwFormError(api_common.resource('commission/royaltycoefficient').create(form))
				// await this.throwFormError(api_resource.create(form))
            }else{
				await this.$request.put('/commission/royaltycoefficient/'+form.id,form)
				// await this.throwFormError(api_common.resource('commission/commissionSet').update(this.form.id,this.form))
				// await this.throwFormError(api_resource.update(this.form.id,this.form))
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
		const { field, action,table } = await api_common.menuInit("commission/getcommission");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.fetchTableData();
	}
};
</script>