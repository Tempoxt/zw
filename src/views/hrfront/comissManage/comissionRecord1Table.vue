  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  
  >

  	<el-dialog
		title="编辑"
		:visible.sync="dialogFormVisible"
		class="public-dialog"
		v-el-drag-dialog
		>
    	<el-form ref="form" :model="form"  label-width="120px" :rules="rules">
				<el-row >
					<el-col :span="14" :offset="4">
						<el-form-item label="月份" prop="month">
							<el-date-picker
								disabled
								v-model="form.month"
								type="month"
								style="width:100%"
								format="yyyy-MM"
								value-format="yyyy-MM"
								placeholder="选择月份">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" disabled prop="staff__chineseName" :field="{name:'姓名'}" v-model="form.staff__chineseName" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="productOverInterest" placeholder="请输入贷款延期利息" :field="{name:'贷款延期利息'}" v-model="form.productOverInterest" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="modelOverInterest" placeholder="请输入模具款延期利息" :field="{name:'模具款延期利息'}" v-model="form.modelOverInterest" />
					</el-col>
				</el-row>
			</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible = false">取 消</el-button>
			<el-button type="primary" @click="handleFormSubmit" :disabled="disabled">确 定</el-button>
		</div>
    </el-dialog>

	<el-dialog
		title="编辑"
		:visible.sync="dialogForm1Visible"
		class="public-dialog"
		v-el-drag-dialog
		>
    	<el-form ref="form1" :model="form1"  label-width="110px" :rules="rules1">
				<el-row >
					<el-col :span="14" :offset="4">
						<el-form-item label="月份" prop="month">
							<el-date-picker
								disabled
								v-model="form1.month"
								type="month"
								style="width:100%"
								format="yyyy-MM"
								value-format="yyyy-MM"
								placeholder="选择月份">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" disabled prop="cusCode" :field="{name:'客户编码'}" v-model="form1.cusCode" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" disabled prop="cusName" :field="{name:'客户简称'}" v-model="form1.cusName" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="balance" placeholder="请输入" :field="{name:'应收货款余额'}" v-model="form1.balance" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="debtAmount" placeholder="请输入" :field="{name:'欠款金额'}" v-model="form1.debtAmount" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="debtInterest" placeholder="请输入" :field="{name:'欠款利息'}" v-model="form1.debtInterest" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="badDebtAmount" placeholder="请输入" :field="{name:'呆坏账金额'}" v-model="form1.badDebtAmount" />
					</el-col>
					<el-col :span="14" :offset="4">
						<form-render :type="`input`" prop="badDebtInterest" placeholder="请输入" :field="{name:'呆坏账利息'}" v-model="form1.badDebtInterest" />
					</el-col>
				</el-row>
			</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm1Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm1Submit">确 定</el-button>
		</div>
    </el-dialog>

	<div>
		<Drawer title="分配详情" :closable="false" width="860" v-model="openDrawers" class="dispatch">
			<div style="padding:5px">
				<vxe-table
					show-overflow
					ref="dispatchTable"
					class="dtable dispatchTable public-vxe-table"
					:data="dispatchData"
					highlight-hover-row
					border
					height="700px"
      				v-loading="dispatch_loading"
					style="width: 100%"
					:header-cell-style="vxeHeaderStyle"
					:show-footer="true"
					:seq-config="{seqMethod: VxeIndexMethod1}"
					:footer-method="getSummaries1"
					>
					<vxe-table-column 
						type="selection" 
						width="50" 
						class-name="table-column-disabled"
						:selectable="table_disable_selected"
						fixed="left"
					>
					</vxe-table-column>
					<vxe-table-column type="index" :index="indexMethod" align="center" width="60" fixed="left"/>
					<vxe-table-column field="dateLap" title="月份" width="80" fixed="left"></vxe-table-column>
					<vxe-table-column field="employeeCode" title="工号" width="80" fixed="left"></vxe-table-column>
					<vxe-table-column field="chineseName" title="姓名" width="80" fixed="left"></vxe-table-column>
					<vxe-table-column field="cusCode" title="客户编码" width="90px" fixed="left"></vxe-table-column>
					<vxe-table-column field="cusAbbName" title="客户名称" width="100px"></vxe-table-column>
					<vxe-table-column field="cDLCode" title="发货单号" width="100px"></vxe-table-column>
					<vxe-table-column field="invCode" title="产品编码" width="120px" show-overflow></vxe-table-column>
					<vxe-table-column field="dispatchID" title="出货单ID" width="90px"></vxe-table-column>
					<vxe-table-column field="customerRankType" title="项目类型" width="90px"></vxe-table-column>
					<vxe-table-column field="invName" title="产品名称" width="90px"></vxe-table-column>
					<vxe-table-column field="cSTType" title="销售类型" width="80px"></vxe-table-column>
					<vxe-table-column field="invClassName" title="产品分类" width="80px"></vxe-table-column>
					<vxe-table-column field="dispatchDay" title="发货日期" width="90px"></vxe-table-column>
					<vxe-table-column field="quantity" title="发货数量" width="90px"></vxe-table-column>
					<vxe-table-column field="natUnitPrice" title="发货单价" width="100px"></vxe-table-column>
					<vxe-table-column field="natDispatchMoney" title="本币无税金额" width="120px"></vxe-table-column>
					<vxe-table-column field="openTicketAdjust" title="开票调整" width="110px"></vxe-table-column>
					<vxe-table-column field="sellDiscount" title="销售折扣" width="100px" ></vxe-table-column>
					<vxe-table-column field="priceAdjust" title="价格调整" width="100px" ></vxe-table-column>
					<vxe-table-column field="qualityDeduct" title="质量扣款" width="100px"  ></vxe-table-column>
					<vxe-table-column field="natMustPaidMoney" title="应收本币无税金额" width="120px" ></vxe-table-column>
					<vxe-table-column field="taxRate" title="税率" width="70px"></vxe-table-column>
					<vxe-table-column field="mustPaidMoney" title="应收本币含税金额" width="120px"></vxe-table-column>
					<vxe-table-column field="matchAmount" title="已收本币无税金额" width="120px"></vxe-table-column>
					<vxe-table-column field="isIncrease" title="是否计增值率" width="100px"></vxe-table-column>
					<vxe-table-column field="increaseValue" title="增值率计算金额" width="120px"></vxe-table-column>
					<vxe-table-column field="standMaterialAmount" title="本单成本" width="120px"></vxe-table-column>
					<vxe-table-column field="increaseRatio" title="增值率系数" width="90px"></vxe-table-column>
					<vxe-table-column field="baseCommissionRatio" title="业务提成系数" width="95"></vxe-table-column>
					<vxe-table-column field="cusFirstDay" title="客户首次发货日期" width="100"></vxe-table-column>
					<vxe-table-column field="cusMonths" title="客户交易期限(月)" width="80"></vxe-table-column>
					<vxe-table-column field="cusRatio" title="客户交易提成系数%" width="80"></vxe-table-column>
					<vxe-table-column field="prodFirstDay" type="html" title="客户产品首次发货日期" width="90"></vxe-table-column>
					<vxe-table-column field="cusProductMonths"  type="html" title="客户产品交易期限(月)" width="90"></vxe-table-column>
					<vxe-table-column field="cusProductRatio"  type="html" title="客户产品提成系数%" width="90"></vxe-table-column>
					<vxe-table-column  title="阶梯前提成金额" align="center">
						<vxe-table-column field="commissionAmount" title="非手机产品" width="110"></vxe-table-column>
						<vxe-table-column field="mCommissionAmount" title="手机产品" width="110"></vxe-table-column>
						<vxe-table-column field="modelCommissionAmount" title="非手机模具" width="110"></vxe-table-column>
					</vxe-table-column>
				</vxe-table>
				<div class="pagina">
					<el-pagination
						background
						:page-sizes="rowList1"
						:page-size.sync="page"
						layout="total, sizes"
						:total="dispatchTotal"
						:current-page.sync="curr"
						@size-change="handleSizeChange1"
						@current-change="handleCurrentChange1"
					></el-pagination>

					<el-pagination
						background
						:page-sizes="rowList1"
						:page-size.sync="page"
						layout="prev, pager, next"
						:total="dispatchTotal"
						:current-page.sync="curr"
						@size-change="handleSizeChange1"
						@current-change="handleCurrentChange1"
					></el-pagination>
				</div>
			</div>
		</Drawer>
	</div>

    <table-header
		:table_actions="table_actions"
		:table_selectedRows="table_selectedRows"
		@action="handleAction"
		:table_form.sync="table_form"
		:table_column="table_field"
		>
		
		<div style="padding-left:10px">
			<dateLap :disabled="true" v-model="table_form.dateLap" @change="fetch"/>
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
		:show-summary="table_config.isShowFooter"
		:summary-method="getSummaries"
		@cell-click="openDrawer"
		:cell-style="cellStyle"
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
	<!-- <vxe-table
		class="public-vxe-table"
		ref="xTable"
		resizable
		show-overflow
		highlight-hover-row
		@select-all="handleChangeSelection"
		@select-change="handleChangeSelection"
		:data="table_data"
		border
		style="width: 100%"
		v-loading="table_loading"
		:header-cell-style="vxeHeaderStyle"
		:height="table_height"
		@resizable-change="table_dragend"
		@sort-change="table_sort_change"
		@cell-click="cellClickEvent"
      	:cell-class-name="cellClassName"
		:seq-config="{seqMethod: VxeIndexMethod}"
        :show-footer="table_config.isShowFooter"
        :footer-method="footerMethod"
		>
		<vxe-table-column 
			type="selection" 
			width="50" 
			class-name="table-column-disabled"
			:selectable="table_disable_selected"
		>
		</vxe-table-column>
		<vxe-table-column type="index" :index="indexMethod" align="center" width="60"/>
		<vxe-table-column v-for="field in table_field.filter(column=>!column.fed_isvisiable).
			filter(column=>!column.isvisiable)" :key="field.name" :field="field.name" :title="field.showname" :sortable="field.issort" 
			:width="field.width=='auto'?'': parseInt(field.width)"/>
	</vxe-table> -->
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

// const api_pagemanager = api_common.resource('pagemanager/field')
// let api_resource = api_common.resource("commission/staffcommissiondetail");
export default {
	mixins: [table_mixin],
	props:['id','url','a'],
	data() {
		return {
			// api_pagemanager,
            vxeHeaderStyle:{background:'#F5FAFB',color:'#37474F'},
			loading: true,
			api_resource:api_common.resource(this.url),
			orgCategory:[],
			queryDialogFormVisible:true,
			serialnumber:[],
			form:{},
			form1:{},
			form2:{},
			table_topHeight:293,
			dialogForm1Visible:false,
			dialogFormVisible:false,
			rules:{
				staff__chineseName: [
					{ required: true, message: '请输入', trigger: 'change' },
				],
				month: [
					{ required: true, message: '请选择', trigger: 'change' },
				],
			},
			rules1:{
				cusCode: [
					{ required: true, message: '请选择', trigger: 'change' },
				],
				cusName: [
					{ required: true, message: '请选择', trigger: 'change' },
				],
				month: [
					{ required: true, message: '请选择', trigger: 'change' },
				],
				balance: [
					{ required: true, message: '请输入', trigger: 'blur' },
				],
			},
			resultUrl:'',
			timer:'',
			statusk:1,
			val:'',
			openDrawers:false,
			dispatchData: [],
			dispatch_loading: false,
			curr:1,
			page:50,
			dispatchTotal: 0,
			dispatch_config: {
				rowList: '50,100,300,500,1000,'
			},
			month: '',
			cusCode: '',
			field: '',
			resurl: '',
			employeeCode: '',
			invCode: ''
		};
	},
	computed:{
		disabled(){
			if(this.form.productOverInterest!=''||this.form.modelOverInterest!=''){
				return false
			}
			return true
		},
		rowList1(){
			let p = ((this.dispatch_config && this.dispatch_config.rowList) ?this.dispatch_config.rowList.split(',').map(Number).filter(o=>!isNaN(o)):[50,100,300,500,1000])
			return (this.dispatchTotal&&this.dispatchTotal>0)?p.concat(this.dispatchTotal):p
		}
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
			this.api_resource = api_common.resource(this.url);
			this.fetchMenu()
			// if(this.a=='1'){
			// 	this.importUploadUrl = 'commission/commissionSet/person/upload'
			// 	this.downloadUrl= 'commission/commissionSet/person/downtemplate'
			// }else if(this.a=='2'){
			// 	this.api_resource = api_common.resource("commission/commissionSet/customer");
			// 	this.importUploadUrl = 'commission/commissionSet/customer/import'
			// 	this.downloadUrl= 'commission/commissionSet/customer/import'
			// }else if(this.url=='commission/receiptCommDetail'){
			// 	this.api_resource = api_common.resource("commission/commissionSet/receiptDetail");
			// }
		}
	},
	methods: {
		VxeIndexMethod1({ row, rowIndex, column, columnIndex }){
			return (rowIndex+1)+(this.curr-1)*this.page
		},
		handleSizeChange1(val) {
			this.curr = 1
			this.page = val
			this.getData()
		},
		handleCurrentChange1(val) {
			this.curr = val
			this.getData()
		},
		indexMethods(i){
			return (i+1)+(this.curr-1)*this.page
		},
        headerStyle(row,rowIndex,column,columnIndex){
            return "background:rgba(245,250,251,1);box-shadow:0px 1px 0px rgba(228,234,236,1);"
		},
		getSummaries1 ({ columns, data }) {
			const sums = [];
			return [
				columns.map((column, columnIndex) => {
					if (columnIndex === 0) {
						return '合计'
					}
					let columnProper = ['natUnitPrice','natDispatchMoney','openTicketAdjust','sellDiscount',
					'priceAdjust','qualityDeduct','natMustPaidMoney','mustPaidMoney','matchAmount','increaseValue',
					'standMaterialAmount','commissionAmount','mCommissionAmount','modelCommissionAmount']
					if (columnProper.includes(column.property)) {
						const values = data.map(item => Number(item[column.property]));
						if (!values.every(value => isNaN(value))) {
							sums[columnIndex] = values.reduce((prev, curr) => {
								const value = Number(curr);
								if (!isNaN(value)) {
									return prev + curr;
								} else {
									return prev;
								}
							}, 0);
							sums[columnIndex] = sums[columnIndex];
							if(!isNaN(sums[columnIndex])){
								return sums[columnIndex].toFixed(6)
							}
						} else {
							return '';
						}  
					}
				})
			]
		},
		async getData(){
			let data1 = {
				dateLap: this.month,
				cusCode: this.cusCode,
				field: this.field,
				pagesize: this.page,
				currentpage: this.curr,
				employeeCode: this.employeeCode,
			}
			let data2 = {
				dateLap: this.month,
				invCode: this.invCode,
				field: this.field,
				pagesize: this.page,
				currentpage: this.curr,
				employeeCode: this.employeeCode,
			}
			let data = this.a == 2 ? data1 : data2
			const {rows,total} = await this.$request.get(this.resurl,{params:data})
			this.dispatchData = rows
			this.dispatchTotal = total
			this.$nextTick(()=>{
				this.dispatch_loading = false
				this.$refs.dispatchTable && this.$refs.dispatchTable.doLayout && this.$refs.dispatchTable.doLayout()
				this.$refs.dispatchTable && this.$refs.dispatchTable.recalculate && this.$refs.dispatchTable.recalculate()
				this.$refs.dispatchTable && this.$refs.dispatchTable.refreshColumn && this.$refs.dispatchTable.refreshColumn()
			})
		},
		async openDrawer(row,column,cell,event){
			// if((this.a == 2 || this.a == 3) && (column.property=='sourceCommissionAmount' || column.property=='commissionAmount'||column.property=='modelSourceCommissionAmount'
			//  ||column.property=='modelCommissionAmount'||column.property=='mSourceCommissionAmount'||column.property=='mCommissionAmount')){
			// 	this.openDrawers = true
			// 	this.dispatch_loading = true
			// 	this.month = row.dateLap
			// 	this.cusCode = row.cusCode
			// 	this.employeeCode = row.employeeCode
			// 	this.field = column.property
			// 	this.invCode = column.invCode
			// 	this.resurl = this.a==2 ? '/commission/customercommission/detail':'/commission/productcommission/detail'
			// 	await this.getData()
			// }
			if((this.a == 2 || this.a == 3) && (row.sourceCommissionAmount==event.target.innerText || row.commissionAmount==event.target.innerText|| row.modelSourceCommissionAmount==event.target.innerText
			|| row.modelCommissionAmount==event.target.innerText|| row.mSourceCommissionAmount==event.target.innerText|| row.mCommissionAmount==event.target.innerText)){
				this.openDrawers = true
				this.dispatch_loading = true
				this.month = row.dateLap
				this.cusCode = row.cusCode
				this.employeeCode = row.employeeCode
				this.field = column.property
				this.invCode = row.invCode
				this.resurl = this.a==2 ? '/commission/customercommission/detail':'/commission/productcommission/detail'
				await this.getData()
			}
		},
		// cellClassName ({ row, rowIndex, column, columnIndex }) {
		// 	if((this.a == 2 || this.a == 3) && column.property=='natDispatchMoney'){
		// 		// if(row.status==2){
		// 		// 	return 'col-red'
		// 		// }else{
		// 			return 'col-blue'
		// 		// }
		// 	}
		// 	if(this.m==4 && column.property=='natSumMoney'){
		// 		return 'text-right'
		// 	}
		// },
		cellStyle({row, column, rowIndex, columnIndex}){
			if((this.a == 2 || this.a == 3) && (column.property == 'sourceCommissionAmount' || column.property == 'commissionAmount'|| column.property == 'modelSourceCommissionAmount'
			|| column.property == 'modelCommissionAmount'|| column.property == 'mSourceCommissionAmount'|| column.property == 'mCommissionAmount')){
				return 'color:#0BB2D4;cursor: pointer'
			}else{
				return  ''
			}
		},
		fetch(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
		async getResult(){
			if(this.statusk!=0){
				this.val = await this.$request.get('commission/resetresult?restUrl='+this.resultUrl,{alert:false})
				if(this.val==1){
					this.statusk = 0
					this.$message.success({ message: '已完成'})
					this.fetchTableData()
				}else if(this.val==2){
					this.statusk = 0
					this.$message.error({ message: '重置失败,请重试'})
				}
			}else{
				clearInterval(this.timer)
			}
		},
		async reset(){
			if(this.table_form.dateLap!==null){
				if(this.a=='1'){
					this.resultUrl = '/commission/personal/reset'
					const mes = await this.$request.post(this.resultUrl,{dateLap:this.table_form.dateLap})
					this.$message.success({message: mes})
				}else if(this.a=='2'){
					this.resultUrl = '/commission/customer/reset'
					const mes = await this.$request.post(this.resultUrl,{dateLap:this.table_form.dateLap})
					this.$message.success({message: mes})
				}else{
					this.resultUrl = '/commission/reset'
					const mes = await this.$request.post(this.resultUrl,{dateLap:this.table_form.dateLap})
					this.$message.success({message: mes})
					this.timer = setInterval(()=>{
						this.getResult()
					},10000)
				}
			}else{
				this.$message.error({message:'请选择月份'})
			}
		},
		async audit(){
			let rows = this.table_selectedRows.map(row=>row.id)
			await this.$request.put('/commission/commissionSet/detail/audit',{ids:rows.join(','),auditType:0})
			this.fetchTableData()
		},
		async cancelAudit(){
			let rows = this.table_selectedRows.map(row=>row.id)
			await this.$request.put('/commission/commissionSet/detail/audit',{ids:rows.join(','),auditType:1})
			this.fetchTableData()
		},
		async fetchTableData() {
			if(!this.id){
				return
			}
			this.table_loading = true;
			this.table_form.org_id = this.id
			const {rows , total }= await this.api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
		handleClick(row){
			this.$emit('change','收款提成明细',row.staff__id)
		},
		async edit(){
			let row = this.table_selectedRowsInfo[0];
			this.dialogFormVisible = true
			this.form = await this.api_resource.find(row.id)
		},
		async handleFormSubmit(){
            await this.form_validate()
            let form = Object.assign({},this.form)
            await this.api_resource.update(form.id,form)
			this.dialogFormVisible = false
			this.fetchTableData()
		},
		async handleForm1Submit(){
			await this.form_validate('form1')
            let form = Object.assign({},this.form1)
            await this.$request.put('/commission/commissionSet/customer/update/'+form.id,form)
			this.dialogForm1Visible = false
			this.fetchTableData()
		},
		async fetchMenu(){
			const { field, action,table } = await api_common.menuInit(this.url);
			this.table_field = field;
			this.table_actions = action;
			this.table_config = table
			// setTimeout(()=>{
				this.fetchTableData();
			// },500)
		}
	},
	async created() {
		this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM'))
		await this.fetchMenu()
	}
};
</script>
<style lang="scss">
	.pagina{
		display: flex;
		justify-content: space-between;
	}
	.col-primary{
		color:#0BB2D4;
		cursor: pointer
	}
	
	.dispatchTable.vxe-table .vxe-body--column:not(.col--ellipsis), .dispatchTable.vxe-table .vxe-footer--column:not(.col--ellipsis),
	 .dispatchTable.vxe-table .vxe-header--column:not(.col--ellipsis){
		 padding: 4px 0;
	}
	.dispatchTable.vxe-table .vxe-body--column, .dispatchTable.vxe-table .vxe-footer--column, .dispatchTable.vxe-table .vxe-header--column,
	.dispatchTable.vxe-header--column .col--center .col--group .col--ellipsis {
		padding: 4px 0;
		line-height: 16px;
		height: 24px;
	}
</style>

