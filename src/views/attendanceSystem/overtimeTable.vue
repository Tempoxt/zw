  <template>
  <ui-table ref="table" 
	:table_column="table_field" 
	:table_query.sync="table_form.query"
	@query="querySubmit"
	>

	<el-dialog
		title="加班申请"
		:visible.sync="dialogFormVisible"
		class="public-dialog"
		v-el-drag-dialog
		width="800px"
		>

		<el-form ref="form" :model="form" label-width="100px" :rules="rule">
			<el-row>
				<el-col :span="12">
					<form-render prop="startTime" :picker-options="pickerOptions" :type="`datetime`" :field="{name:'开始时间'}" v-model="form.startTime"/>
				</el-col>
				<el-col :span="12">
					<form-render prop="endTime" :picker-options="pickerOptions" :type="`datetime`" :field="{name:'结束时间'}" v-model="form.endTime"/>
				</el-col>
				<el-col :span="12">
					<form-render prop="duration" :type="`input`" :field="{name:'加班工时'}" v-model="form.duration"/>
				</el-col>
				<el-col :span="12">
					<form-render :type="`select`" :disabled="true" :field="{name:'加班类别',options:[{
							value: 1,
							label: '生产需要'
						},{
							value: 2,
							label: '随线加班'
						},{
							value: 3,
							label: '周末（法定）特殊加班'
					}]}" v-model="form.overtimeType"/>
				</el-col>
				<el-col :span="12">
					<form-render :type="`input`" :field="{name:'备注'}" v-model="form.remark"/>
				</el-col>
			</el-row>
		</el-form>

      	<OrgSelect :result="result" v-model="form.ids" activeNam="first" ref="OrgSelect" v-if="dialogFormVisible"/>

		<div slot="footer" class="dialog-footer">
			<el-button @click="handleFormSubmit(0)">预 览</el-button>
			<el-button @click="dialogFormVisible = false">取 消</el-button>
			<el-button type="primary" @click="handleFormSubmit(1)">确 定</el-button>
		</div>
    </el-dialog>

	<el-dialog
		title="加班申请单预览"
		:visible.sync="dialogForm1Visible"
		class="public-dialog"
		v-el-drag-dialog
		width="800px"
		>

		<div v-html="html"></div>
		
    </el-dialog>

    <table-header
		:table_actions="table_actions"
		:table_selectedRows="table_selectedRows"
		@action="handleAction"
		:table_form.sync="table_form"
		:table_column="table_field"
		>
		<div style="padding-left:10px" v-show="this.auditStatus==0">
			<dateLap type="1" v-model="dateLap1" @change="fetch"/>
		</div>
		<div style="padding-left:10px" v-show="this.auditStatus==1">
			<dateLap type='2' v-model="dateLap" @change="fetch"/>
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
const api_resource = api_common.resource("attendance/overtime");
import OrgSelect from '@/components/Org/OrgSelect'
import dayjs from 'dayjs'
const download = require('downloadjs')
export default {
	mixins: [table_mixin],
	props:['auditStatus'],
	components:{
		OrgSelect
	},
	data() {
		var checkHours = (rule, value, callback) => {
			if(this.form.endTime!=''&&this.form.startTime!=''&&this.form.endTime!=undefined&&this.form.startTime!=undefined){
				var dur = new Date(this.form.endTime).getTime()-new Date(this.form.startTime).getTime()
				if (!value) {
					return callback(new Error('请输入'));
				}else if (value<3.5) {
					callback(new Error('加班工时必须大于等于3.5小时'));
				}else if (value>dur/(60*1000*60)) {
					callback(new Error('加班工时必须小于等于加班结束时间-加班开始时间'));
				}else{
					callback();
				}
			}
		};
		return {
			loading: true,
			api_resource,
			queryDialogFormVisible:true,
			dialogFormVisible:false,
			dialogForm1Visible:false,
			table_topHeight:276,
			form:{},
			result:[],
			rule:{
				startTime:[
					{ required: true, message: '请选择日期时间', trigger: ['blur','change'] },
				],
				endTime:[
					{ required: true, message: '请选择日期时间', trigger: ['blur','change'] },
				],
				duration:[
					{ required: true, message: '请输入', trigger: ['blur','change'] },
					{ validator: checkHours, trigger:  ['blur', 'change'] }
				]
			},
			html:'',
			dateLap:'',
			dateLap1:'',
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() < new Date().getTime() + 3600*1*1000;
				}
			},
		};
	},
	watch:{
		auditStatus(){
			delete this.table_form.keyword
			// delete this.table_form.dateLap
			this.table_form.currentpage = 1
			
			this.fetchMenu()
			this.fetchTableData()
		},
	},
	methods: {
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		async delete(){
			let rows = this.table_selectedRows.map(row=>row.id)
			const mes = await this.$request.post('attendance/overtimedelete',{ids:rows.join(',')})
			this.$message.success({message:mes})
			this.fetchTableData();
		},
		async confirm(){
			let rows = this.table_selectedRows.map(row=>row.id)
			await this.$request.put('attendance/overtimeaudit',{ids:rows.join(',')})
			this.fetchTableData();
		},
		add(){
			this.result = []
			this.$nextTick(()=>{
				this.$refs['form'].clearValidate()
			})
			this.form = {
				overtimeType:1
			}
			this.dialogFormVisible = true
		},
		ab2str(u,f) {
			var b = new Blob([u]);
			var r = new FileReader();
			r.readAsText(b, 'utf-8');
			r.onload = function (){if(f)f.call(null,r.result)}
		},
		async handleFormSubmit(n){
			await this.form_validate()
			let ids = this.$refs.OrgSelect.getIdsResult()
			this.form.ids = ids;
			this.form.submitTYPE = n
			if(this.form.ids!==''){
				if(n==1){
					try{
						const { data,name,contentType} = await this.$request.post('attendance/overtime',this.form,{responseType:'arraybuffer',alert:false})
						this.$message.success('添加成功')
						let namei = '加班申请单';
						download(data,namei,contentType)
						this.fetchTableData();
						this.dialogFormVisible = false
					}catch(err){
						var that = this;
						that.ab2str(err.error.response.data,function(str){
							that.$message.error({ message: str ,duration:5000});
						});
					}
				}else{
					try{
						const data = await this.$request.post('attendance/overtime',this.form,{alert:false})
						this.html = data
						this.dialogForm1Visible = true
					}catch(err){
						this.$message.error({ message: err.response.data ,duration:5000});
					}
				}
			}else{
				this.$message.error('请选择要添加的人员');
			}
		},
		async fetchTableData() {
			this.table_loading = true;
			this.table_form.auditStatus = this.auditStatus
			if(this.auditStatus==0){
				this.table_form.dateLap = this.dateLap1
			}else{
				this.table_form.dateLap = this.dateLap
			}
			const {rows , total }= await api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
		async fetchMenu(){
			const { field, action,table } = await api_common.menuInit("attendance/overtime"+this.auditStatus);
            this.table_field = field;
            this.table_actions = action;
            this.table_config = table
        }
	},
	async created() {
		this.fetchMenu()
		this.dateLap = dayjs().format('YYYY-MM')
		this.dateLap1 = dayjs().format('YYYY-MM-DD')
		this.fetchTableData();
	}
};
</script>