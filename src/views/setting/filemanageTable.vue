  <template>
  <ui-table ref="table" 
	:table_column="table_field" 
	:table_query.sync="table_form.query"
	@query="querySubmit"
  >

  	<el-dialog
		:title="dialogStatus==='insert'?'添加':'编辑'"
		:visible.sync="dialogFormVisible"
		class="public-dialog"
		v-el-drag-dialog
		width="800px"
    >
		<div>
			<el-form ref="form" :model="form" label-width="100px" :rules="rule">
				<el-row :gutter="20">
					<el-col :span="22">
						<form-render :type="`input`" prop="department" :field="{name:'部门编号'}" v-model="form.department"/>
					</el-col>
					<el-col :span="22">
						<form-render :type="`input`" prop="file_suffix" :field="{name:'文件后缀'}" v-model="form.file_suffix"/>
					</el-col>
					<el-col :span="22">
						<form-render :type="`input`" prop="fileName" :field="{name:'文件名'}" v-model="form.fileName"/>
					</el-col>
					<el-col :span="22">
						<form-render :type="`input`" prop="menu" :field="{name:'文件目录'}" v-model="form.menu"/>
					</el-col>
					<el-col :span="22">
						<form-render :type="`input`" prop="barcode" :field="{name:'条码'}" v-model="form.barcode"/>
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
const api_resource = api_common.resource("removefiles/filemodify");
export default {
	mixins: [table_mixin],
	data() {
		return {
			loading: true,
			form:{},
			api_resource,
			orgCategory:[],
			queryDialogFormVisible:true,
			dialogFormVisible:false,
			rule:{
				department:[
					{ required: true, message: '请输入', trigger: ['blur','change'] },
				],
				file_suffix:[
					{ required: true, message: '请输入', trigger: ['blur','change'] },
				],
				fileName:[
					{ required: true, message: '请输入', trigger: ['blur','change'] },
				],
				menu:[
					{ required: true, message: '请输入', trigger: ['blur','change'] },
				],
				barcode:[
					{ required: true, message: '请输入', trigger: ['blur','change'] },
				],
			},
		};
	},
	methods: {
		add(){
			this.form={}
			this.dialogFormVisible = true
		},
		async edit(){
			let row = this.table_selectedRows[0]
			this.form = await api_resource.find(row.id)
			this.dialogFormVisible = true;
		},
		async delete(){
			let rows = this.table_selectedRows.map(row=>row.id)
			try{
				let mes = await this.$request.get('removefiles/fileBluk',{params:{ids:rows.join(',')}})
				this.$message.success(mes)
				this.fetchTableData()
			}catch(e){

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
		async handleFormSubmit(){
			let form = Object.assign({},this.form)
			form.main = this.id
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
		const { field, action,table } = await api_common.menuInit("removefiles/filemanage");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.fetchTableData();
	}
};
</script>


