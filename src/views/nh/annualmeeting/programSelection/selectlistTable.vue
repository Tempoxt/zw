  <template>
	<ui-table ref="table" 
		:table_column="table_field" 
		:table_query.sync="table_form.query"
		@query="querySubmit"
		>
		<el-dialog
            :title="dialogStatus==='insert'?'添加':'修改'"
            :visible.sync="dialogFormVisible"
            class="public-dialog"
            v-el-drag-dialog
		    width="800px"
            >
           	<div>
                <el-form ref="form" :model="form" label-width="70px" :rules="rules">
					<el-row :gutter="20">
						<el-col :span="16" :offset="4">
							<form-render :type="`input`" prop="programName" :field="{name:'节目名称'}" v-model="form.programName"/>
						</el-col>
						<el-col :span="16" :offset="4">
							<form-render :type="`input`" prop="programIntroduce" :field="{name:'节目简介'}" v-model="form.programIntroduce"/>
						</el-col>
						<el-col :span="16" :offset="4">
							<form-render :type="`select`" prop="department" :field="{name:'表演部门',options:departData}" filterable  multiple  v-model="form.department"/>
						</el-col>
						<el-col :span="16" :offset="4">
							<form-render :type="`img`" prop="programImage" :data="{'upload_msg':'article_photo'}" :field="{name:'节目图片'}" v-model="form.programImage"/>
						</el-col>
					</el-row>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
            </div>
        </el-dialog>

		
		<el-dialog
            title="设置规则"
            :visible.sync="dialogForm1Visible"
            class="public-dialog"
            v-el-drag-dialog
		    width="800px"
            >
           	<div>
                <el-form ref="form1" :model="form1" label-width="120px" :rules="rules1">
					<el-row :gutter="20">
						<el-col :span="24"  style="border-bottom:1px solid #E4E4E4">
							<form-render :type="`input`" prop="title" :field="{name:'标题'}" v-model="form1.title" style="width:60%"/>
						</el-col>
						<el-col :span="24" style="margin-top:10px;">
							<el-row>
								<el-col :span="10">
									<form-render :type="`radio`" :field="{name:'评选开始时间',options:[
										{ value: 1, label: '手动' },
										{ value: 2, label: '自动' }
									]}" v-model="startTime"/>
								</el-col>
								<el-col :span="8">
									<el-date-picker
										v-model="form.starttime"
										type="datetime"
										placeholder="选择日期时间">
									</el-date-picker>
								</el-col>
							</el-row>
						</el-col>
						<el-col :span="24" style="border-bottom:1px solid #E4E4E4;margin-bottom:10px;">
							<el-row>
								<el-col :span="10">
									<form-render :type="`radio`" :field="{name:'评选结束时间',options:[
										{ value: 1, label: '手动' },
										{ value: 2, label: '自动' }
									]}" v-model="endTime"/>
								</el-col>
								<el-col :span="8">
									<el-date-picker
										v-model="form.endtime"
										type="datetime"
										placeholder="选择日期时间">
									</el-date-picker>
								</el-col>
							</el-row>
						</el-col>
						<p style="color:#A3AFB7;font-size:12px;margin:0 0 10px 53px"> <span>评委打分</span> </p>
						<el-col :span="24">
							<form-render :type="`inputSuffix`" suffix="%" :field="{name:'评委打分占比'}" v-model="form1.juryRate" style="width:40%!important"/>
						</el-col>
						<el-col :span="24">
							<form-render :type="`radio`" :field="{name:'计分类型',options:[
								{ value: 0, label: '总分' },
								{ value: 1, label: '平均分' }
							]}" v-model="form1.juryPointType"/>
						</el-col>
						<el-col :span="24">
							<form-render :type="`radio`"  :field="{name:'评分模式',options:[
								{ value: 0, label: '默认' },
								{ value: 1, label: '去掉最高分，去掉最低分' }
							]}" v-model="form1.juryMode"/>
						</el-col>
						<el-col :span="24">
							<form-render :type="`radio`" :field="{name:'为本部门打分',options:[
								{ value: true, label: '允许' },
								{ value: false, label: '不允许' }
							]}" v-model="form1.isJuryDeprtPoint"/>
						</el-col>
						<el-col :span="24" class="vote" style="border-top:1px solid #E4E4E4;padding-top:10px;">
							<el-form-item label="观众投票">
								<el-switch v-model="form1.isAudiencePoint"></el-switch>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<form-render :type="`inputSuffix`" suffix="%" :field="{name:'观众投票占比'}" v-model="form1.audienceRate" style="width:40%!important"/>
						</el-col>
						<el-col :span="24">
							<el-row>
								<el-col :span="10">
									<form-render :type="`radio`" prop="programIntroduce" :field="{name:'每人可投票数',options:[
										{ value: 1, label: '自由' },
										{ value: 2, label: '固定范围' }
									]}" v-model="vote"/>
								</el-col>
								<el-col :span="5">
									<form-render :type="`inputSuffix`" suffix="票" :field="{name:'最少'}" v-model="form1.audienceMinPoint" label-width="60px"/>
								</el-col>
								<el-col :span="5">
									<form-render :type="`inputSuffix`" suffix="票" :field="{name:'最多'}" v-model="form1.audienceMaxPoint" label-width="60px"/>
								</el-col>
							</el-row>
						</el-col>
						<el-col :span="24">
							<form-render :type="`radio`" prop="program" :field="{name:'为本部门投票',options:[
								{ value: true, label: '允许' },
								{ value: false, label: '不允许' }
							]}" v-model="form1.isAudienceDeprtPoint"/>
						</el-col>
					</el-row>
                </el-form>
            </div>

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
			<div style="padding-left:10px">
                <dateLap type="3" v-model="table_form.dateLap" @change="fetch" :disabled="true"/>
            </div>
		</table-header>
		<el-table
			ref="elTable"
			@selection-change="handleChangeSelection"
			:row-class-name="table_state_className"
			:data="table_data"
			border
			style="width: 100%"
			v-loading="table_loading"
			:header-cell-style="headerCellStyle"
			:height="table_height"
			@header-dragend="table_dragend"
			@sort-change="table_sort_change"
			>
			<el-table-column  type="selection" width="60" class-name="table-column-disabled" :selectable="table_disable_selected"></el-table-column>
			<el-table-column type="index" :index="indexMethod" />
			<each-table-column :table_field="table_field" :template="template"/>
			
            <el-table-column label="投票/打分通道">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini">打开</el-button>
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
const api_resource = api_common.resource("annualmeeting/programlist");
let baseUrl = process.env.VUE_APP_STATIC
import dayjs from 'dayjs'
export default {
	mixins: [table_mixin],
	data() {
        const defaultForm1 = () => {
            return {
				title:'',
				starttime: null,
				endtime: null,
				juryRate: 95,
				juryPointType: 1,
				juryMode: 1,
				isJuryDeprtPoint: false,
				isAudiencePoint: true,
				audienceRate: 5,
				audienceMinPoint: 6,
				audienceMaxPoint: 6,
				isAudienceDeprtPoint: false,
            }
        }
		return {
			loading: true,
			api_resource,
			queryDialogFormVisible:true,
			form:{},
			defaultForm1,
            rules:{
                programName:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
				],
				department:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
				],
			},
            rules1:{
                title:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
				],
			},
			form1:{},
			departData:[],
            importUploadUrl:'/invitation/sitemanager/siteset/upload',
			downloadUrl:'/invitation/sitemanager/siteset/upload',
			template:{
				programImage(row,column){
					if(column.programImage!=''&&column.programImage!=undefined){
                        return <img src={baseUrl+column.programImage} width="30" height="30"></img>
                    }
				}
			},
			dialogForm1Visible:false,
			startTime: 1,
			endTime: 1,
			vote: 2,
		};
	},
	computed:{
		disabled1(){
			if(this.form1.title!=''){
				return false
			}
			return true
		}
	},
	methods: {
		async settingRule(){
			let form1 = await this.$request.get('annualmeeting/ruleset?year='+ this.table_form.dateLap)
			if(form1[0]&&form1[0].id!=undefined){
				this.form1 = form1
			}else{
				this.form1 = this.defaultForm1()
			}
            this.dialogForm1Visible = true
		},
        async handleForm1Submit(){
			this.form1.year = this.table_form.dateLap
			if(this.form1.id!=undefined){
				await this.$request.put('annualmeeting/ruleset/'+this.form1.id,this.form1)
			}else{
				let mes = await this.$request.post('annualmeeting/ruleset',this.form1)
				this.$message.success({message:mes});
			}
            this.fetchTableData();
        },
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		async getDepart(){
 			this.departData = (await this.$request.get('annualmeeting/programlist/department')).map(o=>{return {label:o.name,value:o.id}})
		},
        add(){
			this.getDepart()
			this.form = {}
			this.$nextTick(()=>{
				this.$refs['form'].clearValidate()
			})
            this.dialogFormVisible = true
		},
		async edit(){
            this.getDepart()
            let row = this.table_selectedRows[0];
			let form = (await api_resource.find(row.id))[0]
			this.form = form
			this.form.department = form.department.split(',').map(o=>Number(o))
			this.dialogFormVisible = true
		},
        async handleFormSubmit(){
            await this.form_validate()
			let form = Object.assign({},this.form)
			if(this.dialogStatus=='insert'){
                let mess = await api_resource.create(form)
                this.$message.success(mess);
                this.fetch()
                this.dialogFormVisible = false
            }else{
                await api_resource.update(form.id,form)
                this.fetch()
                this.dialogFormVisible = false
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
	},
	async created() {
		const { field, action,table } = await api_common.menuInit("annualmeeting/programlist");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.table_form.dateLap = dayjs().format('YYYY')
		this.fetchTableData();
	}
};
</script>
<style>
	.vote .el-form-item__label{
		color:#A3AFB7
	}
</style>


