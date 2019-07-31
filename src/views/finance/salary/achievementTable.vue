  <template>
  <ui-table ref="table" 
    :table_column="table_field" 
    :table_query.sync="table_form.query"
    @query="querySubmit"
    >

    <el-dialog
		:title="dialogStatus==='insert'?'添加月度绩效':'编辑月度绩效'"
		:visible.sync="dialogFormVisible"
		class="public-dialog"
		v-el-drag-dialog
		>
    	<el-form ref="form" :model="form"  label-width="100px" :rules="rules">
				<el-row >
					<el-col :span="14" :offset="4">
						<el-form-item label="月份" prop="month">
							<el-date-picker
								@change="changeMonth"
								:clearable="false"
								v-model="form.month"
								type="month"
								style="width:100%"
								format="yyyy-MM"
								value-format="yyyy-MM"
								placeholder="请选择月份">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="14" :offset="4">
						<el-form-item label="姓名" prop="ids" v-if="isInsert">
							<el-select v-model="form.ids" multiple placeholder="请选择" @focus="focus" style="width:100%" @remove-tag="removeTag">
								<option value="" key="1"></option>
							</el-select>
						</el-form-item>
						<el-form-item label="姓名" prop="ids" v-else>
							<el-select v-model="form.chineseName" style="width:100%" :disabled="!isInsert">
								<option value="" key="1"></option>
							</el-select>
						</el-form-item>
						<!-- <form-render :type="`multiselect`" prop="emID" :field="{name:'姓名'}" :disabled="!isInsert" v-model="form.emID"/> -->
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="assessBase" :field="{name:'考核基数'}" disabled v-model="form.assessBase"/>
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="assessBonus" :field="{name:'考核奖金'}" v-model="form.assessBonus" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="unAssessBase" :field="{name:'不考核绩效'}" disabled v-model="form.unAssessBase"/>
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="totalBonus" :field="{name:'总奖金'}" disabled v-model="form.totalBonus"/>
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
            <el-button type="primary" @click="handleFormSubmit" :disabled="disabled">确 定</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="选择员工"
      :visible.sync="dialogForm1Visible"
      class="public-dialog"
      v-el-drag-dialog
      >

			<OrgSelect v-model="form1.ids" ref="OrgSelect" v-if="dialogForm1Visible"/>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm1Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm1Submit">确 定</el-button>
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
            <dateLap v-model="table_form.dateLap" @change="fetchTableData"/>
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
import dateLap from '@/components/Table/DateLap'
import OrgSelect from '@/components/Org/OrgSelect'
import dayjs from 'dayjs'
const api_resource = api_common.resource("salary/achievement");
const defaultForm = () => {
    return {
      assessBase:'100',
      unAssessBase:'100',
      totalBonus:'1200'
    }
}
export default {
	mixins: [table_mixin],
	props:['id'],
	components:{
		dateLap,
		OrgSelect
	},
	data() {
		return {
			loading: true,
			form:{
				// emID:[]
			},
			api_resource,
			table_topHeight:259,
			orgCategory:[],
			queryDialogFormVisible:true,
			defaultForm,
			dialogFormVisible:false,
			dialogForm1Visible:false,
			rules:{
				ids: [
					{ required: true, message: '请选择', trigger: 'change' },
				],
				month: [
					{ required: true, message: '请选择', trigger: 'change' },
				],
				assessBase: [
					{ required: true, message: '请输入', trigger: 'blur' },
				],
				assessBonus: [
					{ required: true, message: '请输入', trigger: 'blur' },
				],
				unAssessBase: [
					{ required: true, message: '请输入', trigger: 'blur' },
				],
				totalBonus: [
					{ required: true, message: '请输入', trigger: 'blur' },
				],
			},
			form1:{},
			importUploadUrl:"/salary/ahupload",
			allIds:[],
			allNames:[],
			all:[]
		};
	},
	computed:{
		disabled1(){
		if(this.form1.ids!==''){
			return false
		}
		return true
		},
		disabled(){

		}
	},
	watch:{
		id(){
			this.fetchTableData()
		},
	},
	methods: {
		changeMonth(){
			this.form.ids = ''
		},
		removeTag(data){
			var a = this.form.ids.map(o=>o)
			var idx = a.indexOf(data)
			this.all.splice(idx,1)
		},
		focus(){
			this.dialogForm1Visible = true
		},
		handleForm1Submit(){
			let ids = this.$refs.OrgSelect.getIdsAryResult()
			let names = this.$refs.OrgSelect.getNamesAryResult();
			if(this.form.ids.length!==0){
				ids.map(o=>this.allIds.push(o))
				names.map(o=>this.form.ids.push(o))
			}else{
				this.allIds = ids
				this.form.ids = names
			}
			console.log(this.form.ids,'fffffffffff')
			console.log(this.allIds,'aaaaaaaa')
			this.dialogForm1Visible = false
		},
		add(){
			this.$nextTick(()=>{
				this.$refs['form'].clearValidate()
			})
			this.form = defaultForm()
			this.dialogFormVisible = true
		},
		async edit(){
			let row = this.table_selectedRows[0]
			this.form = await api_resource.find(row.id)
			this.dialogFormVisible = true;
		},
		async fetchTableData() {
			if(!this.id){
				return
			}
			this.table_loading = true;
			this.table_form.org_id = this.id
			const {rows , total }= await api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
		async handleFormSubmit(){
			this.form.ids = this.allIds.join(',');
			console.log(this.form,'ddddddddddddddd')
			let form = Object.assign({},this.form)
			// form.org_id = this.id
			if(this.isInsert){
				await api_resource.create(form)
			}else{
				await api_resource.update(form.id,form)
			}
			if(this.form_multiple){
				this.form = defaultForm()
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
		const { field, action,table } = await api_common.menuInit("salary/achievement");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM'))
		this.fetchTableData();
	}
};
</script>


