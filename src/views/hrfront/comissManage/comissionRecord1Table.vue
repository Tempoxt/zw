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
				<el-table
        			ref="dispatchTable"
					class="dtable dispatchTable"
					:data="dispatchData"
					:header-cell-style="headerStyle"
					height="700px" border
					:summary-method="getSummaries1"
					show-summary
      				v-loading="dispatch_loading"
					>
					<el-table-column type="index" :index="indexMethods" fixed="left"/>
					<el-table-column prop="dateLap" label="月份" width="80px" fixed="left"></el-table-column>
					<el-table-column prop="employeeCode" label="工号" width="80px" fixed="left"></el-table-column>
					<el-table-column prop="chineseName" label="姓名" width="80px" fixed="left"></el-table-column>
					<el-table-column prop="cusCode" label="客户编码" width="90px" fixed="left">
						<template slot-scope="scope">
							<span :title="scope.row.cusCode" style="cursor:default">{{scope.row.cusCode}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="cusAbbName" label="客户名称" width="100px">
						<template slot-scope="scope">
							<span :title="scope.row.cusAbbName" style="cursor:default">{{scope.row.cusAbbName}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="cDLCode" label="发货单号" width="100px">
						<template slot-scope="scope">
							<span :title="scope.row.cDLCode" style="cursor:default">{{scope.row.cDLCode}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="invClassName" label="产品编码" width="90px">
						<template slot-scope="scope">
							<span :title="scope.row.invClassName" style="cursor:default">{{scope.row.invClassName}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="customerRankType" label="项目类型" width="90px"></el-table-column>
					<el-table-column prop="invName" label="产品名称" width="90px">
						<template slot-scope="scope">
							<span :title="scope.row.invName" style="cursor:default">{{scope.row.invName}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="cSTType" label="销售类型" width="80px"></el-table-column>
					<el-table-column prop="invClassName" label="产品分类" width="80px"></el-table-column>
					<el-table-column prop="dispatchDay" label="发货日期" width="90px"></el-table-column>
					<el-table-column prop="quantity" label="发货数量" width="90px"></el-table-column>
					<el-table-column prop="natUnitPrice" label="发货单价" width="100px" align="right"></el-table-column>
					<el-table-column prop="natDispatchMoney" label="本币无税金额" width="120px" align="right"></el-table-column>
					<el-table-column prop="openTicketAdjust" label="开票调整" width="110px" align="right"></el-table-column>
					<el-table-column prop="sellDiscount" label="销售折扣" width="100px" align="right"></el-table-column>
					<el-table-column prop="priceAdjust" label="价格调整" width="100px" align="right"></el-table-column>
					<el-table-column prop="qualityDeduct" label="质量扣款" width="100px" align="right"></el-table-column>
					<el-table-column prop="natMustPaidMoney" label="应收本币无税金额" width="120px" align="right"></el-table-column>
					<el-table-column prop="taxRate" label="税率" width="70px"></el-table-column>
					<el-table-column prop="mustPaidMoney" label="应收本币含税金额" width="120px" align="right"></el-table-column>
					<el-table-column prop="matchAmount" label="已收本币无税金额" width="120px" align="right"></el-table-column>
					<el-table-column prop="isIncrease" label="是否计增值率" width="100px"></el-table-column>
					<el-table-column prop="increaseValue" label="增值率计算金额" width="120px" align="right"></el-table-column>
					<el-table-column prop="standMaterialAmount" label="本单成本" width="120px" align="right"></el-table-column>
					<el-table-column prop="increaseRatio" label="增值率系数" width="90px"></el-table-column>
					<el-table-column prop="baseCommissionRatio" label="业务提成系数" width="95px"></el-table-column>
					<el-table-column prop="cusFirstDay" label="客户首次发货日期" width="80px"></el-table-column>
					<el-table-column prop="cusMonths" label="客户交易期限(月)" width="80px"></el-table-column>
					<el-table-column prop="cusRatio" label="客户交易提成系数%" width="90px"></el-table-column>
					<el-table-column prop="prodFirstDay" label="客户产品首次发货日期" width="90px"></el-table-column>
					<el-table-column prop="cusProductMonths" label="客户产品交易期限(月)" width="90px"></el-table-column>
					<el-table-column prop="cusProductRatio" label="客户产品提成系数%" width="90px"></el-table-column>
					<el-table-column  title="发货单提成计算金额" align="center">
						<el-table-column field="commissionAmount" label="非手机产品" width="90"></el-table-column>
						<el-table-column field="mCommissionAmount" label="手机产品" width="90"></el-table-column>
						<el-table-column field="modelCommissionAmount" title="非手机模具" width="90"></el-table-column>
					</el-table-column>
					<el-table-column prop="oldCommissionAmount" label="原方案出货单提成金额" width="100px" align="right"></el-table-column>
				</el-table>
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
		getSummaries1({ columns, data }) {
			const sums = [];
			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = '合计';
					return;
				}
				let columnProper = ['natUnitPrice','natDispatchMoney','openTicketAdjust','sellDiscount',
				'priceAdjust','qualityDeduct','natMustPaidMoney','mustPaidMoney','matchAmount','increaseValue',
				'standMaterialAmount','commissionAmount','mCommissionAmount','oldCommissionAmount']
				if(columnProper.includes(column.property)){
					const values = data.map(item => Number(item[column.property]));
					if (!values.every(value => isNaN(value))) {
						sums[index] = values.reduce((prev, curr) => {
						const value = Number(curr);
						if (!isNaN(value)) {
							return prev + curr;
						} else {
							return prev;
						}
						}, 0);
						sums[index] = sums[index].toFixed(6);
					} else {
						sums[index] = '';
					}
				}
			});
			return sums;
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
</style>

