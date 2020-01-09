  <template>
	<ui-table 
		class="public-table-container"
		ref="table" 
		:table_column="table_field" 
		:table_query.sync="table_form.query"
		@query="querySubmit"
		>

		
		<el-dialog
            :title="dialogStatus==='insert'?'添加坐席':'修改坐席'"
            :visible.sync="dialogFormVisible"
            class="public-dialog"
            v-el-drag-dialog
		    width="800px"
            >
           	<div>
                <el-form ref="form" :model="form" label-width="70px" :rules="rules">
					<el-row :gutter="20">
						<el-col :span="16" :offset="4">
							<form-render v-if="isInsert" :type="`input`" prop="siteNumber" :field="{name:'坐席数量'}" v-model="form.siteNumber"/>
							<form-render v-if="!isInsert" :type="`input`" prop="deckCode" :field="{name:'桌号'}" v-model="form.deckCode" :disabled="true"/>
						</el-col>
						<el-col :span="16" :offset="4">
							<form-render :type="`year`" prop="year" :field="{name:'年份'}" v-model="form.year"/>
						</el-col>
						<el-col :span="16" :offset="4">
							<form-render :type="`input`" prop="zone" :field="{name:'区域'}" v-model="form.zone"/>
						</el-col>
						<el-col :span="16" :offset="4">
							<form-render :type="`select`" prop="staffType" :field="{name:'类型',options:typeData}" v-model="form.staffType"/>
						</el-col>
						<el-col :span="16" :offset="4">
							<form-render :type="`radio`" :field="{name:'排位方式',options:[
								{ value: 1, label: '自动' },
								{ value: 2, label: '手动' }
							]}" v-model="form.rankType"/>
						</el-col>
						<el-col :span="16" :offset="4">
							<form-render :type="`textarea`" :field="{name:'备注'}" v-model="form.remark"/>
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
const api_resource = api_common.resource("invitation/sitemanager/siteset");
import dayjs from 'dayjs'
export default {
	mixins: [table_mixin],
	data() {
        const defaultForm = () => {
            return {
				rankType: 1,
				year:'2019'
            }
        }
        var checkNumber = (rule, value, callback)=>{
			if (value==='') {
				return callback(new Error('请输入'));
			}else if (!(/^[1-9]\d*$/.test(value))) {
				callback(new Error('请输入正整数'));
			}else{
				callback();
			}
		}
		return {
			loading: true,
			api_resource,
			queryDialogFormVisible:true,
			form:{},
            defaultForm,
            rules:{
                siteNumber:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
                year:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                zone:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                staffType:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                rankType:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
			},
			areaData:[],
			typeData:[],
            importUploadUrl:'/invitation/sitemanager/siteset/upload',
            downloadUrl:'/invitation/sitemanager/siteset/upload',
		};
	},
	methods: {
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		async getType(){
 			this.typeData = (await this.$request.get('invitation/sitemanager/siteset/stafftypelist')).map(o=>{return {label:o.staffTypeDesc,value:o.staffType}})
		},
        add(){
			this.getType()
			this.form = this.defaultForm()
			this.$nextTick(()=>{
				this.$refs['form'].clearValidate()
			})
            this.dialogFormVisible = true
		},
		async edit(){
            this.getType()
            let row = this.table_selectedRows[0];
            this.form = (await api_resource.find(row.id))[0]
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
		const { field, action,table } = await api_common.menuInit("invitation/sitemanager/siteset");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		if(new Date()<new Date('2020-01-01 00:00:00')){
			this.table_form.dateLap = dayjs().add(1,'year').format('YYYY')
		}else{
			this.table_form.dateLap = dayjs().format('YYYY')
		}
		this.fetchTableData();
	}
};
</script>


