  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  class="dispatchRecord"
  >
	<el-dialog
		:title="dialogStatus==='insert'?'添加':'编辑'"
		:visible.sync="dialogForm1Visible"
		class="public-dialog"
		v-el-drag-dialog
		width="800px"
		>
		<div>
			<el-form ref="form1" :model="form1" label-width="110px" :rules="rules1">
					<el-row :gutter="20">
						<el-col :span="12">
							<form-render :type="`month`" :field="{name:'月份'}" :disabled="true" v-model="form1.dateLap"/>
						</el-col>
						<el-col :span="12">
							<form-render :type="`day`" :field="{name:'发货日期'}" :disabled="true" v-model="form1.dispatchDay"/>
						</el-col>
						<el-col :span="12">
							<form-render :type="`input`" :field="{name:'客户编号'}" :disabled="true" v-model="form1.cusCode"/>
						</el-col>
						<el-col :span="12">
							<form-render :type="`input`" :field="{name:'产品名称'}" :disabled="true" v-model="form1.invName"/>
						</el-col>
						<el-col :span="12">
							<form-render :type="`input`" :field="{name:'客户名称'}" :disabled="true" v-model="form1.cusAbbName"/>
						</el-col>
						<el-col :span="12">
							<form-render :type="`input`" :field="{name:'本币无税金额'}" :disabled="true" v-model="form1.natDispatchMoney"/>
						</el-col>
					</el-row>
					<div style="border-top: 1px solid #E4E4E4;padding-top: 30px;">
						<el-row v-for="(suk,i) in form1.sku_info" :key="i" :gutter="10">
							<el-col :span="8">
								<el-form-item label-width="90px"
									:prop="'sku_info.' + i + '.invCode'"
									label="产品编码"
									:rules="{ required: true, message: '请选择', trigger: ['change','blur'] }"
									>
									<el-select v-model="suk.invCode" placeholder="请选择">
										<el-option
											v-for="item in invCodeData"
											:key="item.value"
											:label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="7">
								<el-form-item :disabled="true" label-width="70px"
									:prop="'sku_info.' + i + '.cusAbbName'"
									label="产品名称"
									>
									<el-input v-model="suk.cusAbbName" :disabled="true"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="7">
								<el-form-item v-if="form1&&form1.invName&&form1.invName=='开票调整'"
									:prop="'sku_info.' + i + '.openTicketAdjust'" label-width="70px"
									label="调整金额"
									:rules="[
										{ required: true, validator: checkNumber1, trigger: 'blur' }
									]"
									>
									<el-input v-model="suk.openTicketAdjust" @input="priceInput" @blur="priceBlur(suk)"></el-input>
								</el-form-item>
								<el-form-item v-if="form1&&form1.invName&&form1.invName=='销售折扣'"
									:prop="'sku_info.' + i + '.sellDiscount'" label-width="70px"
									label="调整金额"
									:rules="[
										{ required: true, validator: checkNumber1, trigger: 'blur' }
									]"
									>
									<el-input v-model="suk.sellDiscount" @input="priceInput" @blur="priceBlur(suk)"></el-input>
								</el-form-item>
								<el-form-item v-if="form1&&form1.invName&&form1.invName=='价格调整'"
									:prop="'sku_info.' + i + '.priceAdjust'" label-width="70px"
									label="调整金额"
									:rules="[
										{ required: true, validator: checkNumber1, trigger: 'blur' }
									]"
									>
									<el-input v-model="suk.priceAdjust" @input="priceInput" @blur="priceBlur(suk)"></el-input>
								</el-form-item>
								<el-form-item v-if="form1&&form1.invName&&form1.invName=='质量扣款'"
									:prop="'sku_info.' + i + '.qualityDeduct'" label-width="70px"
									label="调整金额"
									:rules="[
										{ required: true, validator: checkNumber1, trigger: 'blur' }
									]"
									>
									<el-input v-model="suk.qualityDeduct" @input="priceInput" @blur="priceBlur(suk)"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="1">
								<el-button icon="el-icon-plus" circle @click="addSku" v-if="i==0"></el-button>
								<el-button icon="el-icon-minus" circle @click="deleteSku(suk)" v-else></el-button>
							</el-col>
						</el-row>
					</div>
			</el-form>
		</div>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm1Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm1Submit">确 定</el-button>
		</div>
	</el-dialog>

	<div>
		<Drawer title="调整详情" :closable="false" width="860" v-model="openDrawers" class="dispatch">
			<div style="padding:5px">
				<el-row :gutter="20" class="row">
					<el-col :span="12">
						<p>月份: {{info.dateLap}}</p>
					</el-col>
					<el-col :span="12">
						<p>发货日期: {{info.dispatchDay}}</p>
					</el-col>
					<el-col :span="12">
						<p>客户编码: {{info.cusCode}}</p>
					</el-col>
					<el-col :span="12">
						<p>产品名称: {{info.invName}}</p>
					</el-col>
					<el-col :span="12">
						<p>客户名称: {{info.cusAbbName}}</p>
					</el-col>
					<el-col :span="12">
						<p>本币无税金额: {{info.natDispatchMoney}}</p>
					</el-col>
				</el-row>
				<el-table
					class="dtable"
					:data="dispatchData"
					:header-cell-style="headerStyle"
					style="margin-top:20px"
					>
					<el-table-column type="index" :index="indexMethods"/>
					<el-table-column prop="flowDate" label="发货日期"></el-table-column>
					<el-table-column prop="flowDate" label="存货分类"></el-table-column>
					<el-table-column prop="flowDate" label="存货编码"></el-table-column>
					<el-table-column prop="flowDate" label="存货名称"></el-table-column>
					<el-table-column prop="flowDate" label="出货数量"></el-table-column>
					<el-table-column prop="flowDate" label="出货单价"></el-table-column>
					<el-table-column prop="flowDate" label="本币价税合计金额"></el-table-column>
					<el-table-column prop="flowDate" label="本币无税出货金额"></el-table-column>
					<el-table-column prop="flowDate" label="销售折扣"></el-table-column>
					<el-table-column prop="flowDate" label="开票调整"></el-table-column>
					<el-table-column prop="flowDate" label="质量折扣"></el-table-column>
					<el-table-column prop="flowDate" label="应收金额"></el-table-column>
				</el-table>
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
		<div style="padding-left:10px;display:flex;align-items:center">
			{{this.m==1 || this.m==4?'出货日期':'收款日期'}}：<dateLap v-model="table_form.dateLap" @change="fetch"/>
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
		<vxe-table-column v-for="field in table_field.filter(o=>!['matchAmount'].includes(o.name)).filter(column=>!column.fed_isvisiable).
			filter(column=>!column.isvisiable)" :key="field.name" :field="field.name" :title="field.showname" :sortable="field.issort" 
			:width="field.width=='auto'?'': parseInt(field.width)"/>
		<vxe-table-column field="matchAmount" title="分配金额" width="110" v-if="this.m==3">
			<template slot-scope="scope">
				<div :style="{color:scope.row.dispatch__natSumMoney-scope.row.matchAmount!=0?'#F2353C':'#18CC72'}"  v-html="scope.row.matchAmount">
					{{scope.row.matchAmount}}
				</div>
			</template>
		</vxe-table-column>
	</vxe-table>
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
        var checkNumber = (rule, value, callback)=>{
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
            vxeHeaderStyle:{background:'#F5FAFB',color:'#37474F'},
			api_resource: api_common.resource(this.url),
			queryDialogFormVisible: true,
			table_topHeight: 293,
			selectRows: [],
			dialogFormVisible: false,
			form: {},
			openDrawers: false,
			dialogForm1Visible: false,
			form1: {},
			dispatchData: [],
			rules1:{},
			importUploadUrl: 'commission/documentary',
			downloadUrl: 'commission/documentary',
			sku_info: [],
			info:{},
			invCodeData: [],
			invType: ''
		};
	},
	watch:{
		url(){
			this.api_resource = api_common.resource(this.url),
			delete this.table_form.keyword
			this.table_form.currentpage = 1
			this.table_form.query.query= []
			this.fetchMenu()
		}
	},
	methods: {
		cellClassName ({ row, rowIndex, column, columnIndex }) {
			if(this.m==4 && column.property=='natDispatchMoney'){
				return 'col-red'
			}
		},
		indexMethods(i){
            return (i+1)+(this.form.currentp-1)*this.form.page
		},
        headerStyle(row,rowIndex,column,columnIndex){
            return "background:rgba(245,250,251,1);box-shadow:0px 1px 0px rgba(228,234,236,1);"
		},
		async cellClickEvent({row,column,cell}){
			if(this.m==4 && column.property=='natDispatchMoney'){
				this.openDrawers = true
				this.info = await this.api_resource.find(row.id)
				const {rows,total} = await this.$request.get('commission/documentary/ajust?cusCode='+this.info.cusCode+'&dateLap='+this.info.dateLap+'&cDLCode='+this.info.cDLCode)
				this.dispatchData = rows
			}
		},
		priceInput(val){
			// console.log(val)
		},
		priceBlur(item){
			// console.log(item)
			// console.log(this.form1.sku_info)
			this.form1.sku_info.forEach(o=>{
				if(o.invCode==item.invCode && o.priceAdjust==item.priceAdjust){
					// console.log(o,'oo')
				}
			})
		},
        checkNumber(rule, value, callback){
			if (value==='') {
				return callback(new Error('请输入'));
			}else if (!(/^\d+(\.\d{1,2})?$/.test(value))) {
				callback(new Error('请输入精度为2位小数以内的正数'));
			}else{
				callback();
			}
		},
		checkNumber1(rule, value, callback){
			let money = this.form1.natDispatchMoney
			if(+money < 0){
				if(+value >= 0 || isNaN(+value)){
					callback(new Error('请输入小于0的数字'));
				}
			}else if(+money > 0){
				if(isNaN(+value) || +value <= 0){
					callback(new Error('请输入大于0的数字'));
				}
			}
		},
		async edit(){
				let row = this.table_selectedRows[0];
				this.form1 = await this.api_resource.find(row.id)
				const {rows,total} = await this.$request.get('commission/documentary/list?cusCode='+this.form1.cusCode+'&dateLap='+this.form1.dateLap)
				if(rows.length==0){
					if(this.form1.invName=='开票调整'){
						var item = [{
							invCode: '',
							cusAbbName: '',
							openTicketAdjust: this.form1.natDispatchMoney
						}]
					}else if(this.form1.invName=='销售折扣'){
						var item = [{
							invCode: '',
							cusAbbName: '',
							sellDiscount: this.form1.natDispatchMoney
						}]
					}else if(this.form1.invName=='价格调整'){
						var item = [{
							invCode: '',
							cusAbbName: '',
							priceAdjust: this.form1.natDispatchMoney
						}]
					}else if(this.form1.invName=='质量扣款'){
						var item = [{
							invCode: '',
							cusAbbName: '',
							qualityDeduct: this.form1.natDispatchMoney
						}]
					}
					this.$set(this.form1,'sku_info',item)
				}else{
					this.$set(this.form1,'sku_info',rows)
				}
				this.dialogForm1Visible = true
				this.invCodeData = await this.$request.get('commission/documentary/invcode?cusCod='+this.form1.cusCode+'&dateLap='+this.form1.dateLap)
		},
        addSku(){
			if(this.form1.invName=='开票调整'){
				this.form1.sku_info.push({
					invCode: '',
					cusAbbName: '',
					openTicketAdjust: ''
				});
			}else if(this.form1.invName=='销售折扣'){
				this.form1.sku_info.push({
					invCode: '',
					cusAbbName: '',
					sellDiscount: ''
				});
			}else if(this.form1.invName=='价格调整'){
				this.form1.sku_info.push({
					invCode: '',
					cusAbbName: '',
					priceAdjust: ''
				});
			}else if(this.form1.invName=='质量扣款'){
				this.form1.sku_info.push({
					invCode: '',
					cusAbbName: '',
					qualityDeduct: ''
				});
			}
        },
        deleteSku(item) {
			var index = this.form1.sku_info.indexOf(item)
			if (index !== -1) {
				this.form1.sku_info.splice(index, 1)
			}
        },
		handleFormSubmit(){

		},
		handleForm1Submit(){

		},
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
        fetch(){
            this.table_form.currentpage = 1
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
		this.table_form.dateLap = dayjs().subtract(1,'month').format('YYYY-MM') 
		await this.fetchMenu()
	}
};
</script>
<style lang="scss">
.dispatchRecord{
	.dispatch{
		.row{
			.el-col{
				margin-bottom: 15px;
			}
		}
	}
	.col-red{
		color: red;
		text-decoration: underline;
		cursor: pointer;
	}
}
</style>


