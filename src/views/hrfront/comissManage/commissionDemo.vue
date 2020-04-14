  <template>
	<ui-table 
		class="public-table-container"
		ref="table" 
		:table_column="table_field" 
		:table_query.sync="table_form.query"
		@query="querySubmit"
	>
	
	<div class="setParams">
		<el-form ref="form" :model="form" :rules="rules">
			<p class="paramTitle">基础参数</p>
			<el-row class="basicParams" :gutter="30">
				<el-col :span="7" class="comList">
					<el-row class="comTitle">产品交易年限系数</el-row>
					<el-row>
						<el-col class="comParam" :span="8">起始年限</el-col>
						<el-col class="comParam" :span="8">结束年限（含）</el-col>
						<el-col class="comParam" :span="8">年限系数</el-col>
					</el-row>
					<el-row v-for="(item) in ProductYearsRatio" :key="item.id">
						<el-col :span="8">
							<form-render :type="`input`" :field="{name:''}" :disabled="item.disabled&&item.productStart==0" @blur="productStartBlur(item)" v-model="item.productStart" />
						</el-col>
						<el-col :span="8">
							<form-render :type="`input`" :field="{name:''}" @blur="productEndBlur(item)" v-model="item.productEnd" />
						</el-col>
						<el-col :span="8">
							<form-render :type="`input`" :field="{name:''}" @blur="productRatioBlur(item)" v-model="item.productRatio" />
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="8">
							<div class="lineHeight">&nbsp;</div>
						</el-col>
						<el-col :span="8">
							<div class="lineHeight">&nbsp;</div>
						</el-col>
						<el-col :span="8">
							<div class="lineHeight">&nbsp;</div>
						</el-col>
					</el-row>
				</el-col>

				<el-col :span="7" class="comList">
					<el-row class="comTitle">提成金额阶梯系数</el-row>
					<el-row>
						<el-col class="comParam" :span="8">起始金额</el-col>
						<el-col class="comParam" :span="8">结束金额（含）</el-col>
						<el-col class="comParam" :span="8">系数</el-col>
					</el-row>
					<el-row v-for="(item,i) in CommissionStepRatio" :key="i">
						<el-col :span="8">
							<form-render :type="`input`" :field="{name:''}" :disabled="item.disabled&&item.commissionStart==0" @blur="commissionStartBlur(item)" v-model="item.commissionStart"/>
						</el-col>
						<el-col :span="8">
							<form-render :type="`input`" :field="{name:''}" v-model="item.commissionEnd" @blur="commissionEndBlur(item)"/>
						</el-col>
						<el-col :span="8">
							<form-render :type="`input`" :field="{name:''}" v-model="item.commissionStepRatio" @blur="commissionRatioBlur(item)"/>
						</el-col>
					</el-row>
				</el-col>

				<el-col :span="10" class="comList">
					<el-row class="comTitle">产品出货阶梯金额</el-row>
					<el-row>
						<el-col class="comParam" :span="4">起始金额</el-col>
						<el-col class="comParam" :span="5">结束金额（含）</el-col>
						<el-col class="comParam" :span="6">产品出货阶梯金额</el-col>
						<el-col class="comParam" :span="4">产品阶梯系数</el-col>
						<el-col class="comParam" :span="5">产品出货计提金额</el-col>
					</el-row>
					<el-row v-for="(item,i) in DispatchRatio" :key="i">
						<el-col :span="4">
							<form-render :type="`input`" :field="{name:''}" :disabled="item.disabled&&item.dispatchStart==0" @blur="dispatchStartBlur(item)" v-model="item.dispatchStart"/>
						</el-col>
						<el-col :span="5">
							<form-render :type="`input`" :field="{name:''}" v-model="item.dispatchEnd" @blur="dispatchEndBlur(item)"/>
						</el-col>
						<el-col :span="6">
							<div class="dispatch">{{item.id!=6?item.dispatchStep:''}}</div>
						</el-col>
						<el-col :span="4">
							<form-render :type="`input`" :field="{name:''}" v-model="item.dispatchRatio" @blur="dispatchRatioBlur(item)"/>
						</el-col>
						<el-col :span="5">
							<div class="dispatch">{{item.id!=6?(item.dispatchStep * item.dispatchRatio).toFixed(4):''}}</div>
						</el-col>
					</el-row>
				</el-col>
			</el-row>
		</el-form>
	</div>
	<p class="paramTitle">计算结果</p>
    <table-header
		:table_actions="table_actions"
		:table_selectedRows="table_selectedRows"
		@action="handleAction"
		:table_form.sync="table_form"
		:table_column="table_field"
		>
		<div style="padding-left:10px">
			<dateLap v-model="dateLap" @change="fetchDateLap"/>
		</div>
		<div style="padding-left:10px;" class="setRate">
			业务员考核系数：<el-input v-model="AssessmentRatio.assessmentRatio" style="width:40%" @blur="assessRatioBlur"></el-input>
		</div>
		<div>
			标准增值率设定：<el-input v-model="appreRate" style="width:40%" @blur="appreRateBlur">
				<i slot="suffix" class="el-input__icon">%</i></el-input> 
		</div>
		<div>
			<el-select v-model="table_form.keyword" placeholder="请选择业务员" filterable @change="fetch">
				<el-option
					v-for="item in salesMan"
					:key="item.employeeCode"
					:label="item.chineseName"
					:value="item.employeeCode">
				</el-option>
			</el-select>
		</div>
    </table-header>
	<vxe-table
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
		:seq-config="{seqMethod: VxeIndexMethod}"
        :show-footer="table_config.isShowFooter"
        :footer-method="footerMethod"
		>
		<vxe-table-column 
			type="selection" 
			width="55" 
			class-name="table-column-disabled"
			:selectable="table_disable_selected"
		>
		</vxe-table-column>
		<vxe-table-column type="index" :index="indexMethod" align="center" width="45"/>
		<vxe-table-column v-for="field in table_field.filter(column=>!column.fed_isvisiable).
			filter(column=>!column.isvisiable)" :key="field.name" :field="field.name" :title="field.showname" :sortable="field.issort" 
			:width="field.width=='auto'?'': parseInt(field.width)"/>	
	</vxe-table>
    <div class="amountDemo"><span style="color:#37474F">合计提成：</span>
		<span style="color:#F2353C">{{commissionTotalAmount}}元</span>
		<span style="white-space:pre;font-size:12px;font-weight:nomal" v-if="this.process!=''"> = {{process}}</span>
	</div>
    <table-pagination 
        :total="table_form.total" 
        :pagesize.sync="table_form.pagesize"
        :currentpage.sync="table_form.currentpage"
        @change="fetchTableData"
        :table_config="table_config"
    />

	<p class="paramTitle">计算公式</p>
	<div class="caculation">
		<el-form>
			<el-row>
				<el-col :span="12">
					<el-form-item label="单一产品提成金额 =">
						<el-radio-group v-model="caculation" @change="changeCaculat">
							<el-radio label="1" style="margin-bottom:8px">单一产品实收款*业务提成系数*产品增值率系数*产品交易年限系数</el-radio><br>
							<el-radio label="2">单一产品实收款阶梯出货计提金额*业务提成系数*产品增值率系数*产品交易年限系数</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-row  style="margin:0 0 8px 24px">
						合计提成金额 = &nbsp;&nbsp;产品提成金额合计*提成金额阶梯系数*考核系数
					</el-row>
					<el-row  style="margin:0 0 15px 12px">
						产品增值率系数 = 产品实际增值率/标准增值率 
					</el-row>
				</el-col>
			</el-row>
		</el-form>
		
	</div>
  </ui-table>
</template>
<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
import dayjs from 'dayjs'
const api_resource = api_common.resource("commission/demo");
export default {
	mixins: [table_mixin],
	data() {
		return {
			form:{},
            vxeHeaderStyle:{background:'#F5FAFB',color:'#37474F'},
			loading: false,
			api_resource,
			orgCategory:[],
			queryDialogFormVisible:true,
			table_topHeight: 710,
			dialogFormVisible:false,
			kaohe: '',
			rules:{},
			ProductYearsRatio: {},
			DispatchRatio: {},
			CommissionStepRatio: {},
			AssessmentRatio: {
				assessmentRatio: ''
			},
			CommissionDetailData: {},
			caculation: '1',
			commissionTotalAmount: '',
			dateLap: '',
			productRation: '',
			allAmount: [],
			isProductErr: false,
			isComissionErr: false,
			isDispatchErr: false,
			appreRate: '45', //标准增值率系数暂定为45%
			process: '',
			salesMan: [],
		}
	},
	computed:{
		table_list(){
			return this.table_data
		}
	},
	methods: {
		table_dragend({$rowIndex, column, columnIndex, $columnIndex, fixed, isHidden}){
            let row = this.table_field.find(field=>field.showname===column.title)
            var isEnd = false
            this.table_field.forEach((item,i)=>{
                if(item==row&&i==this.table_field.length-2){
                	isEnd = true
                }
            })
            var newWidth = column.resizeWidth
            row.width = newWidth
            row.menuid = row.menuid_id
            api_pagemanager.update(row.id,{
                width:newWidth,
                menuid:row.menuid_id
            },{alert:false})
        },
		handleChangeSelection({selection:val}){ // 单选
            this.table_selectedRowsInfo = val
            this.table_selectedRows = val
			this.selectRows = val
			this.$emit("update:table_selectedRows",val)
			let xTable = this.$refs.xTable
            xTable.updateFooter()
        },
		async fetchDateLap(){
			this.table_form.quicksearch = 'employeeCode'
			this.table_form.currentpage = 1
			this.salesMan = await this.$request.get('commission/demo/sales?dateLap='+this.dateLap)
			this.fetchTableData()
        },
		async fetch(){
			this.table_form.quicksearch = 'employeeCode'
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
		footerMethod ({ columns, data }) {
			const sums = [];
			data = this.table_selectedRows.length == 0 ? data : this.table_selectedRows
			return [
				columns.map((column, columnIndex) => {
					if (columnIndex === 0) {
						return '合计'
					}
					
					let columnProper = []
					let statistics = this.table_field.filter(o=>o.isstatistics)
					statistics.forEach(o=>{
						columnProper.push(o.name)
					})
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
								return sums[columnIndex].toFixed(4)
							}
						} else {
							return '';
						}  
					}
				})
			]
		},
		changeCaculat(){//切换计算公式
			this.allAmount = []
			if(this.table_data.length==0){
				return 
			}
			this.table_data.forEach(o=>{
				if(this.caculation==1){
					this.ProductYearsRatio.forEach(r=>{
						let productYears = o.productYears
						if(productYears==0){
							productYears = 0.1
						}
						if((r.productStart < productYears) && (productYears <= r.productEnd)){
							let amount = o.collectionAmount * (o.commissionRatio).split('%')[0] / 100 * o.increaseRatio * r.productRatio
							this.$set(o,'productRatio',r.productRatio)
							this.$set(o,'commissionAmount',amount.toFixed(4))
							this.allAmount.push(amount)
						}
					})
				}else{
					let totalAmount = this.getDispatchSum(o) // 单一产品实收款的产品出货阶梯金额
					let commiss = totalAmount * (o.commissionRatio).split('%')[0] / 100 * o.increaseRatio * o.productRatio
					this.$set(o,'commissionAmount',commiss.toFixed(4))
				}
			})
			this.caculatSum()
		},

		checkNumberInt(value,type){ //判断参数起始数据和结束数据 是否为整数
			if (value==='') {
				this.$message.error('请输入');
				return 
			}else if (!(/^[0-9]\d*$/.test(value))) {
				this.$message.error('请输入正整数');
				return
			}else{
				if(type=='product'){
					this.judgeFaultProduct() //判断产品交易年限系数是否存在断层
				}else if(type=='commission'){
					this.judgeFaultCommission() //判断产品出货阶梯金额是否存在断层
				}else if(type=='dispatch'){
					this.judgeFaultDispatch() //判断提成金额阶梯系数是否存在断层
				}
			}
		},

		checkNumberFloat(value,type){ //判断系数是否为两个小数点以内的小数
			if (value==='') {
				this.$message.error('请输入');
				return 
			}else if (!(/^\d+(\.\d{1,2})?$/.test(value))) {
				this.$message.error('请输入精度为两位小数以内的正数');
				return
			}else{
				if(type=='product'){
					this.judgeFaultProduct() //判断产品交易年限系数是否存在断层
				}else if(type=='commission'){
					this.judgeFaultCommission() //判断产品出货阶梯金额是否存在断层
				}else if(type=='dispatch'){
					this.judgeFaultDispatch() //判断提成金额阶梯系数是否存在断层
				}
			}
		},

		judgeFaultProduct(item){ //判断产品交易年限系数是否存在断层
			var arr = [];
			this.ProductYearsRatio.forEach(o=>{
				arr.push([Number(o.productStart),Number(o.productEnd)])
			})
			for (var i= 0; i< arr.length; i++) {
				if(i== arr.length-1){
					if(arr[i][0] >= arr[i][1] || arr[i][0] > arr[i-1][1]){
						let line = Number(i) + 1
						this.isProductErr = true
						this.$message.error('产品交易年限系数表第'+line+'行存在数据重叠或断层');
						return 
					}
				}else if(arr[i][0] >= arr[i][1] || arr[i][1] != arr[i+1][0]){
					let line = Number(i) + 1
					this.isProductErr = true
					this.$message.error('产品交易年限系数表第'+line+'行存在数据重叠或断层');
					return
				}
			}
			this.isProductErr = false
		},

		judgeFaultCommission(item){ //判断提成金额阶梯系数是否存在断层
			var arr = [];
			this.CommissionStepRatio.forEach(o=>{
				arr.push([Number(o.commissionStart),Number(o.commissionEnd)])
			})
			for (var i= 0; i< arr.length; i++) {
				if(i== arr.length-1){
					if(arr[i][0] >= arr[i][1] || arr[i][0] > arr[i-1][1]){
						let line = Number(i) + 1
						this.isCommissionErr = true
						this.$message.error('提成金额阶梯系数表第'+line+'行存在数据重叠或断层');
						return 
					}
				}else if(arr[i][0] >= arr[i][1] || arr[i][1] != arr[i+1][0]){
					let line = Number(i) + 1
					this.isCommissionErr = true
					this.$message.error('提成金额阶梯系数表第'+line+'行存在数据重叠或断层');
					return
				}
			}
			this.isCommissionErr = false
		},

		judgeFaultDispatch(item){ //判断产品出货阶梯金额是否存在断层
			var arr = [];
			this.DispatchRatio.forEach(o=>{
				arr.push([Number(o.dispatchStart),Number(o.dispatchEnd)])
			})
			for (var i= 0; i< arr.length; i++) {
				if(i== arr.length-1){
					if(arr[i][0] >= arr[i][1] || arr[i][0] > arr[i-1][1]){
						let line = Number(i) + 1
						this.isDispatchErr = true
						this.$message.error('产品出货阶梯金额表第'+line+'行存在数据重叠或断层');
						return 
					}
				}else if(arr[i][0] >= arr[i][1] || arr[i][1] != arr[i+1][0]){
					let line = Number(i) + 1
					this.isDispatchErr = true
					this.$message.error('产品出货阶梯金额表第'+line+'行存在数据重叠或断层');
					return
				}
			}
			this.isDispatchErr = false
		},

		assessRatioBlur(){ //考核系数校验
			let ratio = this.AssessmentRatio.assessmentRatio
			if (ratio==='') {
				this.$message.error('考核系数不能为空');
			}else if (ratio<1 || ratio>1.2) {
				this.$message.error('考核系数的范围为1.0-1.2之间');
			}else if (!(/^\d+(\.\d{1})?$/.test(ratio))) {
				this.$message.error('考核系数精度为一位小数');
			}else{
				this.updateAssess()
				this.caculatSum()
			}
		},

		appreRateBlur(){ //编辑标准增值率系数
			let appreRate = this.appreRate
			if (appreRate==='') {
				this.$message.error('标准增值率不能为空');
			}else if (appreRate == 0) {
				this.$message.error('标准增值率不能为0');
			}else if (!(/^\d+(\.\d{1,2})?$/.test(appreRate))) {
				this.$message.error('标准增值率精度为两位小数');
			}else{
				this.updateAppreRate()
			}
		},

		updateAppreRate(){ //更新标准增值率和 增值率系数
			this.table_data.forEach(o => {
				if(String(o.commissionRatio).indexOf('%')==-1){
					this.$set(o,'commissionRatio',o.commissionRatio + '%')
				}
				if(String(o.increaseRate).indexOf('%')==-1){
					this.$set(o,'increaseRate',(o.increaseRate*100).toFixed(2) + '%')
				}
				this.$set(o,'stdIncreaseRate',this.appreRate + '%') //设定标准增值率
				//计算出增值率系数 产品增值率系数=产品实际增值率/标准增值率increaseRate
				let increaseRatio = (o.increaseRate).split('%')[0] / this.appreRate
				this.$set(o,'increaseRatio',Number(increaseRatio).toFixed(4)) //设定标准增值率
			})
			this.changeCaculat()
		},

		async updateAssess(){ //更新考核系数
			await this.$request.put('commission/assessmentratio/'+this.AssessmentRatio.id,{
				assessmentRatio: this.AssessmentRatio.assessmentRatio
			},{alert:false})
			this.table_data.forEach(o => {
				this.$set(o,'assessmentRatio',this.AssessmentRatio.assessmentRatio)
			})
		},

		//产品交易年限系数
		async productStartBlur(item){
			this.checkNumberInt(item.productStart,'product')
			//验证基本参数不存在断层  才更新计算数据
			if(this.isProductErr == false){
				await this.upDateProduct(item.id,item)
			}
		},
		async productEndBlur(item){
			this.checkNumberInt(item.productEnd,'product')
			if(this.isProductErr == false){
				await this.upDateProduct(item.id,item)
			}
		},
		async productRatioBlur(item){
			this.checkNumberFloat(item.productRatio,'product')
			if(this.isProductErr == false){
				await this.upDateProduct(item.id,item)
			}
		},
		async upDateProduct(id,item){ //更新产品交易年限系数
			this.allAmount = []
			try{
				this.updateProTableList(item)
			}catch(err){
				console.log(err)
				this.$message.error(err.response.data);
			}
		},

		//提成金额阶梯系数
		async commissionStartBlur(item){
			this.checkNumberInt(item.commissionStart,'commission')
			if(this.isComissionErr == false){
				await this.upDateCommission(item.id,item)
			}
		},
		async commissionEndBlur(item){
			this.checkNumberInt(item.commissionEnd,'commission')
			if(this.isComissionErr == false){
				await this.upDateCommission(item.id,item)
			}
		},
		async commissionRatioBlur(item){
			this.checkNumberFloat(item.commissionStepRatio,'commission')
			if(this.isComissionErr == false){
				await this.upDateCommission(item.id,item)
			}
		},
		async upDateCommission(id,item){ //更新提成金额阶梯系数
			this.allAmount = []
			try{
				this.caculatSum()
			}catch(err){
				console.log(err)
				this.$message.error(err.response.data);
			}
		},

		//产品出货阶梯金额
		async dispatchStartBlur(item){ 
			this.checkNumberInt(item.dispatchStart,'dispatch')
			if(this.isDispatchErr == false){
				await this.upDatedispatch(item.id,item)
			}
		},
		async dispatchEndBlur(item){
			this.checkNumberInt(item.dispatchEnd,'dispatch')
			if(this.isDispatchErr == false){
				await this.upDatedispatch(item.id,item)
			}
		},
		async dispatchRatioBlur(item){
			this.checkNumberFloat(item.dispatchRatio,'dispatch')
			if(this.isDispatchErr == false){
				await this.upDatedispatch(item.id,item)
			}
		},
		async upDatedispatch(id,item){//更新产品出货阶梯金额
			this.allAmount = []
			try{
				if(this.caculation==2){
					this.updateDisTableList()
				}else{
					this.$message.error('直接按实收款金额计算，不采用收款阶梯金额');
				}
			}catch(err){
				console.log(err)
				this.$message.error(err.response.data);
			}
		},

		updateProTableList(item){ //根据公式一计算更新列表
			if(this.table_data.length==0){
				return 
			}
			this.table_data.forEach(o=>{
				//判断产品年限在哪个范围
				let productYears = o.productYears
				if(productYears==0){
					productYears = 0.1
				}
				if((item.productStart < productYears) && (productYears <= item.productEnd)){
					//单一产品实收款 * 业务提成系数 * 产品增值率系数 * 产品交易年限系数
					let caculatAmount = this.caculation == 1 ? o.collectionAmount : this.getDispatchSum(o)
					let amount = caculatAmount * (o.commissionRatio).split('%')[0] / 100 * o.increaseRatio * item.productRatio
					this.$set(o,'productRatio',item.productRatio)
					this.$set(o,'commissionAmount',amount.toFixed(4))
					this.allAmount.push(amount)
				}
			})
			this.caculatSum()
		},

		updateDisTableList(){ // 根据公式二计算更新列表
			this.allAmount = []
			if(this.table_data.length==0){
				return 
			}
			this.table_data.forEach(o => {
				let totalAmount = this.getDispatchSum(o) // 单一产品实收款的产品出货阶梯金额
				let commiss = totalAmount * (o.commissionRatio).split('%')[0] / 100 * o.increaseRatio * o.productRatio
				this.$set(o,'commissionAmount',commiss.toFixed(4))
			})
			this.caculatSum()
		},

		getDispatchSum(o){ //计算产品出货阶梯金额
			this.allAmount = []
			let filterData = this.DispatchRatio.filter(r => (r.dispatchStart<=o.collectionAmount))
			filterData.forEach(r => {
				var dispaEnd = r.dispatchEnd
				if(r.dispatchEnd > o.collectionAmount){
					dispaEnd = o.collectionAmount
				}
				let amount = (dispaEnd - r.dispatchStart) * r.dispatchRatio
				this.allAmount.push(amount)
			})
			if(this.allAmount.length > 0) {
				return this.allAmount.reduce((tem, item, index) => tem + item)
			}else{
				return 0
			}
		},

		getCommissionSum(sum){ //计算提成金额阶梯系数
			this.process = ''
			this.allAmount = []
			let filterData = this.CommissionStepRatio.filter(r => (r.commissionStart<=sum))
			let addSymbol = ''
			filterData.forEach((r,i) => {
				var commissEnd = r.commissionEnd
				if(r.commissionEnd > sum){
					commissEnd = sum
				}
				let amount = (commissEnd - r.commissionStart) * r.commissionStepRatio
				this.allAmount.push(amount)
				addSymbol = this.process==''?'':'+'
				this.process +=  ''+addSymbol+ Number((commissEnd -  r.commissionStart)).toFixed(4) +'*'+ r.commissionStepRatio
			})
			this.process ='('+this.process + ')*' +this.AssessmentRatio.assessmentRatio
			if(this.allAmount.length > 0) {
				return this.allAmount.reduce((tem, item, index) => tem + item)
			}else{
				return 0
			}
		},

		caculatSum(){ //计算合计提成金额
			this.allAmount = []
			var allAmounts = []
			this.table_data.forEach(o => {
				allAmounts.push(Number(o.commissionAmount))
			})
			let sumAmount = allAmounts.reduce((tem, item, index) => Number(tem) + Number(item))
			let sum  = this.getCommissionSum(sumAmount)
			console.log(sum)
			this.commissionTotalAmount = (sum * (this.AssessmentRatio.assessmentRatio)).toFixed(4)
		},

		async updateBasicData(){ //统一更新基础参数表
			if(this.isProductErr == true || this.isCommissionErr == true ||this.isDispatchErr == true){
				this.$message.error('基础参数数据有误');
				return
			}
			this.ProductYearsRatio.forEach( async o=>{
				await this.$request.put('commission/productyearsview/'+o.id,o,{alert:false})
			})
			this.DispatchRatio.forEach( async o=>{o
				await this.$request.put('commission/shippingratio/'+o.id,o,{alert:false})
			})
			this.CommissionStepRatio.forEach( async o=>{
				o.productYearsType = o.productYearsType=='一年以内'?1:2
				await this.$request.put('commission/stepcommission/'+o.id,o,{alert:false})
			})
		},

		async fetchTableData() {
			if(this.dateLap==null ||this.dateLap==''){
				this.$message.error('月份不能为空');
				return
			}
			if(this.table_form.keyword==undefined || this.table_form.keyword == ''){
				this.$message.error('工号不能为空');
				return 
			}
			this.table_loading = true
			await this.updateBasicData()
			this.table_form.dateLap = this.dateLap
			try{
				const { AssessmentRatio,CommissionDetailData }= await api_resource.get(this.table_form);
				this.table_data  = CommissionDetailData.rows
				this.table_form.total = CommissionDetailData.total
				this.AssessmentRatio = AssessmentRatio
				if(this.table_data.length==0){
					delete this.table_form.keyword
				}
			}catch(err){
				this.commissionTotalAmount = ''
				this.table_data = []
				this.AssessmentRatio = ''
				this.table_form.total = 0
				this.process = ''
			}
			setTimeout(() => {
				this.table_loading = false;
				this.$refs.elTable.doLayout()
			}, 300);

			this.updateAppreRate() //页面初始化 更新标准增值率 计算增值率系数
		},
		
		async getProduct(){ //获取产品年限系数
			this.ProductYearsRatio = await this.$request.get('commission/productyearsview')
			this.ProductYearsRatio.forEach(o=>{
				if(o.productStart==0){
					this.$set(o,'disabled',true)
				}else{
					this.$set(o,'disabled',false)
				}
			})
		},
		async getDispatch(){ //获取提成金额阶梯系数
			this.DispatchRatio = await this.$request.get('commission/shippingratio')
			this.DispatchRatio.forEach(o=>{
				if(o.dispatchStart==0){
					this.$set(o,'disabled',true)
				}else{
					this.$set(o,'disabled',false)
				}
			})
		},
		async getCommissionStep(){ //获取产品出货阶梯金额
			this.CommissionStepRatio = await this.$request.get('commission/stepcommission')
			this.CommissionStepRatio.forEach(o=>{
				if(o.commissionStart==0){
					this.$set(o,'disabled',true)
				}else{
					this.$set(o,'disabled',false)
				}
			})
		}
	},
	async created() {
		this.getProduct()
		this.getDispatch()
		this.getCommissionStep()
		const { field, action,table } = await api_common.menuInit("commission/demo");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.dateLap = dayjs().subtract(1,'month').format('YYYY-MM')
		this.salesMan = await this.$request.get('commission/demo/sales?dateLap='+this.dateLap)
		this.table_loading = false;
		setTimeout(() => {
			this.$refs.elTable.doLayout()
		}, 300);
	}
};
</script>
<style lang="scss">
	.paramTitle{
		font-size: 18px;
		font-weight: bold;
		color: #4C5D66;
		margin-bottom: 10px;
	}
	.setParams{
		padding-bottom: 20px;
		.basicParams{
			.el-form-item{
				margin:0 auto;
				width: 80%;
			}
			.el-input__inner{
				height: 26px;
				line-height: 26px;
				border-radius: 4px;
			}
			.el-col{
				box-sizing: border-box;
			}
			.el-row{
				border-right: 1px solid #A3AFB7;
				background: #F5F5F5;
			}
			.el-col-12,.el-col-8,.el-col-4,.el-col-6,.el-col-5{
				border-left: 1px solid #A3AFB7;
				border-top: 1px solid #A3AFB7;
			}
			
			.comList{
				border: 0;
				.el-row:last-child{
					border-bottom: 1px solid #A3AFB7;
				}
				.comTitle{
					border-right: 0;
					border: 1px solid #A3AFB7;
					border-bottom: 0;
					font-size: 14px;
					font-weight: bold;
					padding: 6px 0;
					text-align: center;
					color: #143040;
					background: #F5F5F5;
				}
				.comParam{
					font-size: 12px;
					font-weight: bold;
					text-align: center;
					padding: 4px 0;
					color: #0BB2D4;
				}
				.lineHeight{
					line-height: 34px;
				}
			}
			
			.dispatch{
				line-height: 33px;
				text-align: center;
				height: 33px;
			}
		}
		
	}
	.amountDemo{
		padding: 8px 0 0 7px;
		font-size: 16px;
		font-weight: bold;
	}
	.setRate .el-input{
		width: 20%;
	}
	.caculation{
		padding: 15px 0 0 20px;
		border: 0;
		border: 1px dotted #B9C2C8;
		.el-form-item__label{
			line-height: 19px;
		}
	}
	.mt20{
		margin-top: 20px;
	}
</style>