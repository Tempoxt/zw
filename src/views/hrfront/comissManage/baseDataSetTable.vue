  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  >
	<el-dialog
		:title="dialogStatus==='insert'?'添加年限系数':'编辑年限系数'"
		:visible.sync="dialogFormVisible"
		class="public-dialog"
		v-el-drag-dialog
		width="800px"
		>
		<div>
			<el-form ref="form" :model="form" label-width="118px">
					<div style="border-top: 1px solid #E4E4E4;padding-top: 30px;">
						<el-row v-for="(item,i) in form.data" :key="i" :gutter="10">
							<el-col :span="8">
								<el-form-item
									:prop="'data.' + i + '.productStart'"
									label="产品年限（下限）"
									:rules="[
										{ required: true, validator: checkNumber, trigger: 'blur' }
									]"
									>
									<el-input v-model="item.productStart"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item
									:prop="'data.' + i + '.productEnd'"
									label="产品年限（上限）"
									:rules="[
										{ required: true, validator: checkNumber, trigger: 'blur' }
									]"
									>
									<el-input v-model="item.productEnd"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label-width="80px"
									:prop="'data.' + i + '.productRatio'"
									label="年限系数"
									:rules="{ required: true, message: '请输入', trigger: 'blur' }"
									>
									<el-input v-model="item.productRatio"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="1">
								<el-button icon="el-icon-plus" circle @click="addRatio" v-if="i==0"></el-button>
								<el-button icon="el-icon-minus" circle @click="deleteRatio(item)" v-else></el-button>
							</el-col>
						</el-row>
					</div>
			</el-form>
		</div>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible = false">取 消</el-button>
			<el-button type="primary" @click="handleFormSubmit">确 定</el-button>
		</div>
	</el-dialog>

	<el-dialog
		title="编辑"
		:visible.sync="dialogForm1Visible"
		class="public-dialog"
		v-el-drag-dialog
		>
    	<el-form ref="form1" :model="form1"  label-width="120px" :rules="rules">
				<el-row >
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="productStart" :field="{name:'产品年限（下限）'}" v-model="form1.productStart" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="productEnd" :field="{name:'产品年限（上限）'}" v-model="form1.productEnd" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="productRatio" :field="{name:'年限系数'}" v-model="form1.productRatio" />
					</el-col>
				</el-row>
			</el-form>

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
import dayjs from 'dayjs'
export default {
	mixins: [table_mixin],
	props:['url','m'],
	data() {
        var checkNumber2 = (rule, value, callback)=>{
			if (value==='') {
				return callback(new Error('请输入'));
			}else if (!(/^[0-9]\d*$/.test(value))) {
				callback(new Error('请输入正整数'));
			}else{
				callback();
			}
		}
		return {
			loading: true,
			api_resource :api_common.resource(this.url),
			orgCategory:[],
			form:{
				data:[{
					productStart: '',
					productEnd: '',
					productRatio: '',
				}]
			},
			form1: {},
			queryDialogFormVisible:true,
			table_topHeight:293,
			dialogFormVisible:false,
			dialogForm1Visible:false,
            rules:{
                productStart:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                    { validator: checkNumber2, trigger: 'blur' }
                ],
                productEnd:[
                    { required: true, message: '请输入', trigger: ['blur','change'], },
                    { validator: checkNumber2, trigger: 'blur' }
                ],
                productRatio:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
            },
		};
	},
	computed:{
		disabled(){
			if(this.form.dateLap!==''&&this.form.dateLap!==undefined){
                return false
            }
            return true
		},
	},
	watch:{
		id(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		url(){
			delete this.table_form.keyword
			this.table_form.currentpage = 1
			this.table_form.query.query= []
			this.fetchMenu()
		}
	},
	methods: {
        fetch(){
            this.table_form.currentpage = 1
            this.fetchTableData()
		},
        checkNumber(rule, value, callback){
			if (value==='') {
				return callback(new Error('请输入'));
			}else if (!(/^[0-9]\d*$/.test(value))) {
				callback(new Error('请输入正整数'));
			}else{
				callback();
			}
		},
		addRatio(){
			this.form.data.push({
				productStart: '',
				productEnd: '',
				productRatio: '',
			});
        },
        deleteRatio(item) {
			var index = this.form.data.indexOf(item)
			if (index !== -1) {
				this.form.data.splice(index, 1)
			}
        },
        async delete(){
            let rows = this.table_selectedRows.map(row=>row.id)
            const mes = await this.$request.delete('/commission/productyearsview?ids='+rows.join(','));
            this.$message.success({message:mes});
            this.fetchTableData();
        },
		add(){
			this.dialogFormVisible = true
		},
		async edit(){
			this.dialogForm1Visible = true
			let row = this.table_selectedRows[0];
            this.form1 = await this.api_resource.find(row.id)
		},
		async handleFormSubmit(){
			await this.form_validate()
			let form = JSON.stringify(this.form.data)
			await this.$request.post('/commission/productyearsview',{data:form});
			this.dialogFormVisible = false
			this.fetchTableData()
			// let form = JSON.stringify(this.form)
			// await this.api_resource.update(form.id,form)
			// this.dialogFormVisible = false
			// this.fetchTableData()
		},
		async handleForm1Submit(){
			await this.form_validate('form1')
			let form1 = Object.assign({},this.form1)
			await this.api_resource.update(form1.id,form1)
			this.dialogForm1Visible = false
			this.fetchTableData()
		},
		async fetchTableData() {
			this.table_loading = true;
			const {rows , total } = await this.api_resource.get(this.table_form)
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
    	},
		async fetchMenu(){
			const { field, action,table } = await api_common.menuInit(this.url);
			this.table_field = field;
			this.table_actions = action;
			this.table_config = table
			this.fetchTableData();
		}
	},
	async created() {
		await this.fetchMenu()
	}
};
</script>


