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
					<el-col :span="12">
						<el-form-item label="月份" prop="month">
							<el-date-picker
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
					<el-col :span="12">
						<form-render :type="`input`" prop="assessBonus" :field="{name:'考核奖金'}" v-model="form.assessBonus" />
					</el-col>
				</el-row>
			</el-form>

			<OrgSelect searchApi='/hrm/ahpartstaff' :month="this.form.month" filter_mark="achievement"  ref="OrgSelect" v-if="dialogFormVisible"/>

        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
        </div>
    </el-dialog>

	 <el-dialog
		title="编辑月度绩效"
		:visible.sync="dialogForm1Visible"
		class="public-dialog"
		v-el-drag-dialog
		>
    	<el-form ref="form" :model="form1"  label-width="100px" :rules="rules1">
				<el-row >
					<el-col :span="14" :offset="4">
						<el-form-item label="月份" prop="month">
							<el-date-picker
							    disabled
								:clearable="false"
								v-model="form1.month"
								type="month"
								style="width:100%"
								format="yyyy-MM"
								value-format="yyyy-MM"
								placeholder="请选择月份">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`member`" prop="chineseName" :field="{name:'姓名'}" disabled v-model="form1.chineseName"/>
						<!-- <el-form-item label="姓名" prop="ids">
							<el-select v-model="form.ids" multiple placeholder="请选择" :disabled="!isInsert" @focus="focus" style="width:100%" @remove-tag="removeTag">
								<option value="" key="1"></option>
							</el-select>
						</el-form-item> -->
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="assessBase" :field="{name:'考核基数'}" disabled v-model="form1.assessBase"/>
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="assessBonus" :field="{name:'考核奖金'}" v-model="form1.assessBonus" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="unAssessBase" :field="{name:'不考核绩效'}" disabled v-model="form1.unAssessBase"/>
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="totalBonus" :field="{name:'总奖金'}" disabled v-model="form1.totalBonus"/>
					</el-col>
				</el-row>
			</el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogForm1Visible = false">取 消</el-button>
            <el-button type="primary" @click="handleForm1Submit">确 定</el-button>
        </div>
    </el-dialog>

    <!-- <el-dialog
      title="选择员工"
      :visible.sync="dialogForm1Visible"
      class="public-dialog"
      v-el-drag-dialog
      >

		<OrgSelect searchApi='/hrm/ahpartstaff' :month="this.form.month" filter_mark="achievement"  ref="OrgSelect" v-if="dialogForm1Visible"/>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm1Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm1Submit">确 定</el-button>
		</div>
    </el-dialog> -->

    <table-header
      :table_actions="table_actions"
      :table_selectedRows="table_selectedRows"
      @action="handleAction"
      :table_form.sync="table_form"
      :table_column="table_field"
    >
          <div style="padding-left:10px">
            <dateLap v-model="table_form.dateLap" @change="fetch"/>
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
import OrgSelect from '@/components/Org/OrgSelect'
import dayjs from 'dayjs'
const api_resource = api_common.resource("salary/achievement");
export default {
	mixins: [table_mixin],
	props:['id'],
	components:{
		OrgSelect
	},
	data() {
		return {
			loading: true,
			form:{},
			form1:{},
			api_resource,
			table_topHeight:226,
			orgCategory:[],
			queryDialogFormVisible:true,
			dialogFormVisible:false,
			dialogForm1Visible:false,
			rules:{
				month: [
					{ required: true, message: '请选择', trigger: 'change' },
				],
				assessBonus: [
					{ required: true, message: '请输入', trigger: 'blur' },
				],
			},
			rules1:{
				chineseName: [
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
			importUploadUrl:"/salary/ahupload",
			downloadUrl:'salary/ahuploadtemplate',
			// allIds:[],
		};
	},
	watch:{
		id(){
            this.table_form.currentpage = 1
			this.fetchTableData()
		}
	},
	methods: {
        fetch(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
		add(){
			this.form = {}
			this.$nextTick(()=>{
				this.$refs['form'].clearValidate()
			})
			this.dialogFormVisible = true
		},
		async edit(){
			this.$nextTick(()=>{
				this.$refs['form'].clearValidate()
			})
			let row = this.table_selectedRows[0]
			let form1 = await api_resource.find(row.id)
			this.form1 = form1
			this.dialogForm1Visible = true;
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
            await this.form_validate()
			let ids = this.$refs.OrgSelect.getIdsResult()
			this.form.ids = ids;
			// if(this.form.ids!==''){
				let form = Object.assign({},this.form)
				await api_resource.create(form)
				this.dialogFormVisible = false
				this.fetchTableData()
			// }else{
			// 	this.$message.error('请选择要添加的人员');
			// }
		},
		async handleForm1Submit(){
            await this.form_validate()
			
			let form1 = Object.assign({},this.form1)
			await api_resource.update(form1.id,form1)
			
			this.dialogForm1Visible = false
			this.fetchTableData()
		},
	},
	async created() {
		console.log(1111111111111)
		const { field, action,table } = await api_common.menuInit("salary/achievement");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM'))
		this.fetchTableData();
	}
};
</script>


