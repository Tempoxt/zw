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
									<el-input v-model="item.productStart" placeholder="输入正整数"></el-input>
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
									<el-input v-model="item.productEnd" placeholder="输入正整数"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label-width="80px"
									:prop="'data.' + i + '.productRatio'"
									label="年限系数"
									:rules="{ required: true, message: '请输入', trigger: 'blur' }"
									>
									<el-input v-model="item.productRatio" placeholder="请输入"></el-input>
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
		title="编辑年限系数"
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

	<el-dialog
		title="添加计提金额系数"
		:visible.sync="dialogForm2Visible"
		class="public-dialog"
		v-el-drag-dialog
		width="800px"
		>
		<div>
			<el-form ref="form2" :model="form2" label-width="118px">
					<div style="border-top: 1px solid #E4E4E4;padding-top: 30px;">
						<el-row v-for="(item,i) in form2.data" :key="i" :gutter="10">
							<el-col :span="7">
								<el-form-item label-width="80px"
									:prop="'data.' + i + '.dispatchStart'"
									label="起始金额"
									:rules="[
										{ required: true, validator: checkNumber, trigger: 'blur' }
									]"
									>
									<el-input v-model="item.dispatchStart" placeholder="输入正整数"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="7">
								<el-form-item label-width="80px"
									:prop="'data.' + i + '.dispatchEnd'"
									label="结束金额"
									:rules="[
										{ required: true, validator: checkNumber, trigger: 'blur' }
									]"
									>
									<el-input v-model="item.dispatchEnd" placeholder="输入正整数"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item
									:prop="'data.' + i + '.dispatchRatio'"
									label="产品阶梯系数"
									:rules="{ required: true, message: '请输入', trigger: 'blur' }"
									>
									<el-input v-model="item.dispatchRatio" placeholder="请输入"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="1">
								<el-button icon="el-icon-plus" circle @click="addShipRatio" v-if="i==0"></el-button>
								<el-button icon="el-icon-minus" circle @click="deleteShipRatio(item)" v-else></el-button>
							</el-col>
						</el-row>
					</div>
			</el-form>
		</div>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm2Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm2Submit">确 定</el-button>
		</div>
	</el-dialog>

	<el-dialog
		title="编辑计提金额系数"
		:visible.sync="dialogForm3Visible"
		class="public-dialog"
		v-el-drag-dialog
		>
    	<el-form ref="form3" :model="form3"  label-width="120px" :rules="rules3">
				<el-row >
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="dispatchStart" :field="{name:'起始金额'}" v-model="form3.dispatchStart" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="dispatchEnd" :field="{name:'结束金额'}" v-model="form3.dispatchEnd" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="shipStep" disabled :field="{name:'产品出货阶梯金额'}" v-model="form3.shipStep" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="dispatchRatio" :field="{name:'产品阶梯系数'}" v-model="form3.dispatchRatio" />
					</el-col>
				</el-row>
			</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm3Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm3Submit">确 定</el-button>
		</div>
    </el-dialog>

	<el-dialog
		title="添加阶梯提成系数"
		:visible.sync="dialogForm4Visible"
		class="public-dialog"
		v-el-drag-dialog
		width="800px"
		>
		<div>
			<el-form ref="form4" :model="form4" label-width="118px" :rules="rules4">
					<el-row :gutter="20">
						<el-col :span="12">
							<form-render :type="`select`" prop="productYearsType" :field="{name:'产品年限',options:typeList}" v-model="form4.productYearsType"/>
						</el-col>
					</el-row>
					<div style="border-top: 1px solid #E4E4E4;padding-top: 30px;">
						<el-row v-for="(item,i) in form4.data" :key="i" :gutter="10">
							<el-col :span="7">
								<el-form-item label-width="80px"
									:prop="'data.' + i + '.commissionStart'"
									label="起始金额"
									:rules="[
										{ required: true, validator: checkNumber, trigger: 'blur' }
									]"
									>
									<el-input v-model="item.commissionStart" placeholder="输入正整数"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="7">
								<el-form-item label-width="80px"
									:prop="'data.' + i + '.commissionEnd'"
									label="结束金额"
									:rules="[
										{ required: true, validator: checkNumber, trigger: 'blur' }
									]"
									>
									<el-input v-model="item.commissionEnd" placeholder="输入正整数"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item
									:prop="'data.' + i + '.commissionStepRatio'"
									label="产品阶梯系数"
									:rules="{ required: true, message: '请输入', trigger: 'blur' }"
									>
									<el-input v-model="item.commissionStepRatio" placeholder="请输入"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="1">
								<el-button icon="el-icon-plus" circle @click="addCommissRatio" v-if="i==0"></el-button>
								<el-button icon="el-icon-minus" circle @click="deleteCommissRatio(item)" v-else></el-button>
							</el-col>
						</el-row>
					</div>
			</el-form>
		</div>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm4Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm4Submit">确 定</el-button>
		</div>
	</el-dialog>

	<el-dialog
		title="编辑阶梯提成系数"
		:visible.sync="dialogForm5Visible"
		class="public-dialog"
		v-el-drag-dialog
		>
    	<el-form ref="form5" :model="form5"  label-width="120px" :rules="rules5">
				<el-row >
					<el-col :span="14" :offset="4">
						<form-render :type="`select`" prop="productYearsType" :field="{name:'产品年限',options:typeList}" v-model="form5.productYearsType" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="commissionStart" :field="{name:'起始金额'}" v-model="form5.commissionStart" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="commissionEnd" :field="{name:'结束金额'}" v-model="form5.commissionEnd" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="commissionStep" disabled :field="{name:'阶梯金额'}" v-model="form5.commissionStep" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="commissionStepRatio" :field="{name:'产品阶梯系数'}" v-model="form5.commissionStepRatio" />
					</el-col>
				</el-row>
			</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm5Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm5Submit">确 定</el-button>
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
        const defaultForm = () => {
            return {
                data:[{
					productStart: '',
					productEnd: '',
					productRatio: '',
				}]
            }
        }
        const defaultForm2 = () => {
            return {
                data:[{
					dispatchStart: '',
					dispatchEnd: '',
					dispatchRatio: '',
				}]
            }
        }
        const defaultForm4 = () => {
            return {
				productYearsType: '',
                data:[{
					commissionStart: '',
					commissionEnd: '',
					commissionStepRatio: '',
				}]
            }
        }
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
			form:{},
			defaultForm,
			defaultForm2,
			defaultForm4,
			form1: {},
			form2: {},
			form3: {},
			form4: {},
			form5: {},
			queryDialogFormVisible:true,
			table_topHeight:293,
			dialogFormVisible:false,
			dialogForm1Visible:false,
			dialogForm2Visible:false,
			dialogForm3Visible:false,
			dialogForm4Visible:false,
			dialogForm5Visible:false,
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
            rules3:{
                dispatchStart:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                    { validator: checkNumber2, trigger: 'blur' }
                ],
                dispatchEnd:[
                    { required: true, message: '请输入', trigger: ['blur','change'], },
                    { validator: checkNumber2, trigger: 'blur' }
                ],
                dispatchRatio:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                shipStep:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
			},
            rules4:{
                productYearsType:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
			},
            rules5:{
                productYearsType:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                commissionStart:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                    { validator: checkNumber2, trigger: 'blur' }
                ],
                commissionEnd:[
                    { required: true, message: '请输入', trigger: ['blur','change'], },
                    { validator: checkNumber2, trigger: 'blur' }
                ],
                commissionStepRatio:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                commissionStep:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
			},
			typeList: [],
		};
	},
	watch:{
		id(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		url(){
			this.api_resource = api_common.resource(this.url),
			delete this.table_form.keyword
			this.table_form.currentpage = 1
			this.table_form.query.query= []
			this.fetchMenu()
		},
		'form3.dispatchStart'(){
			this.form3.shipStep = this.form3.dispatchEnd - this.form3.dispatchStart
		},
		'form3.dispatchEnd'(){
			this.form3.shipStep = this.form3.dispatchEnd - this.form3.dispatchStart
		},
		'form5.commissionStart'(){
			this.form5.commissionStep = this.form5.commissionEnd - this.form5.commissionStart
		},
		'form5.commissionEnd'(){
			this.form5.commissionStep = this.form5.commissionEnd - this.form5.commissionStart
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
		addShipRatio(){
			this.form2.data.push({
				dispatchStart: '',
				dispatchEnd: '',
				dispatchRatio: '',
			});
        },
        deleteShipRatio(item) {
			var index = this.form2.data.indexOf(item)
			if (index !== -1) {
				this.form2.data.splice(index, 1)
			}
        },
		addCommissRatio(){
			this.form4.data.push({
				commissionStart: '',
				commissionEnd: '',
				commissionStepRatio: '',
			});
        },
        deleteCommissRatio(item) {
			var index = this.form4.data.indexOf(item)
			if (index !== -1) {
				this.form4.data.splice(index, 1)
			}
        },
        async delete(){
            let rows = this.table_selectedRows.map(row=>row.id)
            const mes = await this.$request.delete(this.url+'?ids='+rows.join(','));
            this.$message.success({message:mes});
            this.fetchTableData();
		},
		async getTypeList(){
			this.typeList = (await this.$request.get('/commission/stepcommission/productyearschoice')).map(o=>{return {label:o.name,value:o.id}});
		},
		add(){
			if(this.m == 1){
				this.form = this.defaultForm()
				this.dialogFormVisible = true
			}else if(this.m == 2){
				this.form2 = this.defaultForm2()
				this.dialogForm2Visible = true
			}else{
				this.form4 = this.defaultForm4()
				this.getTypeList()
				this.dialogForm4Visible = true
			}
		},
		async edit(){
			if(this.m == 1){
				this.dialogForm1Visible = true
				let row = this.table_selectedRows[0];
            	this.form1 = await this.api_resource.find(row.id)
			}else if(this.m == 2){
				this.dialogForm3Visible = true
				let row = this.table_selectedRows[0];
            	this.form3 = await this.api_resource.find(row.id)
			}else{
				this.dialogForm5Visible = true
				this.getTypeList()
				let row = this.table_selectedRows[0];
            	this.form5 = await this.api_resource.find(row.id)
			}
		},
		async handleFormSubmit(){
			await this.form_validate()
			let form = JSON.stringify(this.form.data)
			await this.$request.post('/commission/productyearsview',{data:form});
			this.dialogFormVisible = false
			this.fetchTableData()
		},
		async handleForm1Submit(){
			await this.form_validate('form1')
			let form1 = Object.assign({},this.form1)
			await this.api_resource.update(form1.id,form1)
			this.dialogForm1Visible = false
			this.fetchTableData()
		},
		async handleForm2Submit(){
			await this.form_validate('form2')
			let form2 = JSON.stringify(this.form2.data)
			await this.$request.post('/commission/shippingratio',{data:form2});
			this.dialogForm2Visible = false
			this.fetchTableData()
		},
		async handleForm3Submit(){
			await this.form_validate('form3')
			delete this.form3.shipStep
			let form3 = Object.assign({},this.form3)
			await this.api_resource.update(form3.id,form3)
			this.dialogForm3Visible = false
			this.fetchTableData()
		},
		async handleForm4Submit(){
			await this.form_validate('form4')
			this.form4.data.forEach((o)=>{
                this.$set(o,'productYearsType',this.form4.productYearsType)
            })
			let form4 = JSON.stringify(this.form4.data)
			await this.$request.post('/commission/stepcommission',{data:form4});
			this.dialogForm4Visible = false
			this.fetchTableData()
		},
		async handleForm5Submit(){
			await this.form_validate('form5')
			let form5 = Object.assign({},this.form5)
			await this.api_resource.update(form5.id,form5)
			this.dialogForm5Visible = false
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


