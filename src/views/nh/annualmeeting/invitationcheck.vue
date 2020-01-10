  <template>
	<ui-table 
		class="public-table-container"
		ref="table" 
		:table_column="table_field" 
		:table_query.sync="table_form.query"
		@query="querySubmit"
		>

		 <el-dialog
            :title="dialogStatus==='insert'?'添加受邀人':'编辑受邀人'"
            :visible.sync="dialogFormVisible"
            class="public-dialog"
            v-el-drag-dialog
		    width="800px"
            >
           	<div>
                <el-form ref="form" :model="form" label-width="70px" :rules="rules">
                        <el-row :gutter="20">
                            <el-col :span="16" :offset="4">
                                <form-render :type="`input`" prop="company" :field="{name:'受邀单位'}" v-model="form.company"/>
                            </el-col>
                            <el-col :span="16" :offset="4">
                                <form-render :type="`input`" prop="name" :field="{name:'受邀人'}" v-model="form.name"/>
                            </el-col>
                            <el-col :span="16" :offset="4">
                                <form-render :type="`input`" prop="job" :field="{name:'职位'}" v-model="form.job"/>
                            </el-col>
                            <el-col :span="16" :offset="4">
                                <form-render :type="`input`" prop="tel" :field="{name:'手机号码'}" v-model="form.tel"/>
                            </el-col>
                            <el-col :span="16" :offset="4">
                                <form-render :type="`radio`" prop="sex" :field="{name:'性别',options:[
                                    {
                                        value: 1,
                                        label: '男'
                                    },
                                    {
                                        value: 0,
                                        label: '女'
                                    }
                                ]}" v-model="form.sex"/>
                            </el-col>
                        </el-row>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
            </div>
        </el-dialog>

		<table-header
			:table_actions="table_actions"
			:table_selectedRows="table_selectedRows"
			@action="handleAction"
			:table_form.sync="table_form"
			:table_column="table_field"
		></table-header>
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
const api_resource = api_common.resource("annualmeeting/invitationcheck");
export default {
	mixins: [table_mixin],
	data() {
        var checkPhone = (rule, value, callback)=>{
			if (value==='') {
				return callback(new Error('请输入'));
			}else if (!(/^1\d{10}$/.test(value))) {
				callback(new Error('请输入11位手机号'));
			}else{
				callback();
			}
		}
		return {
			loading: true,
			api_resource,
			queryDialogFormVisible:true,
			dialogFormVisible:false,
			form:{},
            rules:{
                company:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                name:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                job:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                tel:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                    { validator: checkPhone, trigger: 'blur' }
                ],
                sex:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
			},
			template:{
				STATUS(row,column){
					if(column.STATUS=='已确认'){
						return <el-tag size="mini" type="success">{column.STATUS}</el-tag>
					}else{
						return <el-tag size="mini" type="warning">{column.STATUS}</el-tag>
					}
				},
				arrivestatus(row,column){
					if(column.arrivestatus=='已回复'){
						return <el-tag size="mini" type="warning">{column.arrivestatus}</el-tag>
					}else if(column.arrivestatus=='已邀请'){
						return <el-tag size="mini">{column.arrivestatus}</el-tag>
					}else if(column.arrivestatus=='已到场'){
						return <el-tag size="mini" type="success">{column.arrivestatus}</el-tag>
					}
				},
			}
		};
	},
	methods: {
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
        add(){
            this.form = {}
            this.dialogFormVisible = true
        },
        async handleFormSubmit(){
            await this.form_validate()
            let form = Object.assign({},this.form)
            // console.log(form,'dddd')
			let mess = await api_resource.create(form)
			this.$message.success(mess);
			this.fetch()
			this.dialogFormVisible = false
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
		const { field, action,table } = await api_common.menuInit("annualmeeting/invitationcheck");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.fetchTableData();
	}
};
</script>


