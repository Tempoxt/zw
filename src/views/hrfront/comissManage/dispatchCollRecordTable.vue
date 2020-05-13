  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  class="dispatchRecord"
  >
	<el-dialog
		:title="dialogStatus==='insert'?'添加':'编辑'"
		:visible.sync="dialogFormVisible"
		class="public-dialog"
		v-el-drag-dialog
		width="800px"
		>
		<div>
			<el-form ref="form" :model="form" label-width="110px" :rules="rules">
					<el-row :gutter="20">
						<el-col :span="12">
							<form-render :type="`month`" :field="{name:'月份'}" :disabled="true" v-model="form.dateLap"/>
						</el-col>
						<el-col :span="12">
							<form-render :type="`day`" :field="{name:'发货日期'}" :disabled="true" v-model="form.dispatchDay"/>
						</el-col>
						<el-col :span="12">
							<form-render :type="`input`" :field="{name:'客户编号'}" :disabled="true" v-model="form.cusCode"/>
						</el-col>
						<el-col :span="12">
							<form-render :type="`input`" :field="{name:'产品名称'}" :disabled="true" v-model="form.invName"/>
						</el-col>
						<el-col :span="12">
							<form-render :type="`input`" :field="{name:'客户名称'}" :disabled="true" v-model="form.cusAbbName"/>
						</el-col>
						<el-col :span="12">
							<form-render :type="`input`" :field="{name:'本币无税金额'}" :disabled="true" v-model="form.natDispatchMoney"/>
						</el-col>
					</el-row>
					<div style="border-top: 1px solid #E4E4E4;padding-top: 30px;">
						<el-row v-for="(suk,i) in form.sku_info" :key="i" :gutter="10">
							<el-col :span="8">
								<el-form-item label-width="90px"
									:prop="'sku_info.' + i + '.invCode'"
									label="产品编码"
									:rules="{ required: true, message: '请选择', trigger: ['change','blur'] }"
									>
									<el-select v-model="suk.invCode" placeholder="请选择" @change="changeInvCode(suk)" filterable>
										<el-option
											v-for="item in invCodeData"
											:key="item.invCode"
											:label="item.invCode"
											:value="item.invCode">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="7">
								<el-form-item label-width="70px"
									:prop="'sku_info.' + i + '.invName'"
									label="产品名称"
									>
									<el-input v-model="suk.invName" :disabled="true"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="7">
								<el-form-item v-if="form&&form.invName&&form.invName=='开票调整'"
									:prop="'sku_info.' + i + '.openTicketAdjust'" label-width="70px"
									label="调整金额"
									:rules="[
										{ required: true,  message: '请输入',trigger: 'blur' },
									]"
									>
									<el-input v-model="suk.openTicketAdjust" @input="priceInput" @blur="priceBlur(suk)" :disabled="i==0"></el-input>
								</el-form-item>
								<el-form-item v-if="form&&form.invName&&form.invName=='销售折扣'"
									:prop="'sku_info.' + i + '.sellDiscount'" label-width="70px"
									label="调整金额"
									:rules="[
										{ required: true,  message: '请输入',trigger: 'blur' },
									]"
									>
									<el-input v-model="suk.sellDiscount" @input="priceInput" @blur="priceBlur(suk)" :disabled="i==0"></el-input>
								</el-form-item>
								<el-form-item v-if="form&&form.invName&&form.invName=='价格调整'"
									:prop="'sku_info.' + i + '.priceAdjust'" label-width="70px"
									label="调整金额"
									:rules="[
										{ required: true,  message: '请输入',trigger: 'blur' },
									]"
									>
									<el-input v-model="suk.priceAdjust" @blur="priceBlur(suk)" :disabled="i==0"></el-input>
								</el-form-item>
								<el-form-item v-if="form&&form.invName&&form.invName=='质量扣款'"
									:prop="'sku_info.' + i + '.qualityDeduct'" label-width="70px"
									label="调整金额"
									:rules="[
										{ required: true,  message: '请输入',trigger: 'blur' },
									]"
									>
									<el-input v-model="suk.qualityDeduct" @input="priceInput" @blur="priceBlur(suk)" :disabled="i==0"></el-input>
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
			<el-button @click="dialogFormVisible = false">取 消</el-button>
			<el-button type="primary" @click="handleFormSubmit">确 定</el-button>
		</div>
	</el-dialog>

	<div>
		<Drawer title="调整详情" :closable="false" width="860" v-model="openDrawers" class="dispatch">
			<div style="padding:5px">
				<el-row :gutter="20" class="row">
					<el-col :span="12">
						<span style="display:inline-block;text-align:right;width:100px">月份：</span> {{info.dateLap}}
					</el-col>
					<el-col :span="12">
						<span  style="display:inline-block;text-align:right;width:100px">发货日期： </span>{{info.dispatchDay}}
					</el-col>
					<el-col :span="12">
						<span style="display:inline-block;text-align:right;width:100px">客户编码：</span> {{info.cusCode}}
					</el-col>
					<el-col :span="12">
						<span style="display:inline-block;text-align:right;width:100px">产品名称：</span> {{info.invName}}
					</el-col>
					<el-col :span="12">
						<span style="display:inline-block;text-align:right;width:100px">客户名称： </span>{{info.cusAbbName}}
					</el-col>
					<el-col :span="12">
						<span style="display:inline-block;text-align:right;width:100px">本币无税金额：</span>{{info.natDispatchMoney}}
					</el-col>
				</el-row>
				<el-table
        			ref="dispatchTable"
					class="dtable dispatchTable"
					:data="dispatchData"
					:header-cell-style="headerStyle"
					style="margin-top:20px"
					height="700px" border
					:summary-method="getSummaries1"
					show-summary
      				v-loading="dispatch_loading"
					>
					<el-table-column type="index" :index="indexMethods" fixed="left"/>
					<el-table-column prop="dispatchDay" label="发货日期" width="90px" fixed="left"></el-table-column>
					<el-table-column prop="invCode" label="存货编码" width="110px" fixed="left">
						<template slot-scope="scope">
							<span :title="scope.row.invCode" style="cursor:default">{{scope.row.invCode}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="invClassName" label="存货名称" width="90px">
						<template slot-scope="scope">
							<span :title="scope.row.invClassName" style="cursor:default">{{scope.row.invClassName}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="invName" label="存货分类" width="120px">
						<template slot-scope="scope">
							<span :title="scope.row.invName" style="cursor:default">{{scope.row.invName}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="quantity" label="出货数量" width="90px"></el-table-column>
					<el-table-column prop="natUnitPrice" label="发货单价" width="90px" align="right"></el-table-column>
					<el-table-column prop="natSumMoney" label="本币含税金额" width="120px" align="right"></el-table-column>
					<el-table-column prop="natDispatchMoney" label="本币无税金额" width="120px" align="right"></el-table-column>
					<el-table-column prop="openTicketAdjust" label="开票调整" width="120px" align="right"></el-table-column>
					<el-table-column prop="sellDiscount" label="销售折扣" width="120px" align="right"></el-table-column>
					<el-table-column prop="priceAdjust" label="价格调整" width="120px" align="right"></el-table-column>
					<el-table-column prop="qualityDeduct" label="质量折扣" width="120px" align="right"></el-table-column>
					<el-table-column prop="realMoney" label="应收本币无税金额" width="130px" align="right"></el-table-column>
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
			:selectable="table_disable_selected" fixed="left"
		>
		</vxe-table-column>
		<vxe-table-column type="index" :index="indexMethod" align="center" width="60" fixed="left"/>
		<vxe-table-column field="status" title="状态" width="80" fixed="left">
			<template slot-scope="scope">
				<el-tag type="success" size="mini" v-if="scope.row.status==1">已调整</el-tag>
				<el-tag type="danger" size="mini" v-if="scope.row.status==2">未调整</el-tag>
			</template>
		</vxe-table-column>
		<vxe-table-column field="salesCode" title="业务工号" width="80" fixed="left"></vxe-table-column>
		<vxe-table-column field="salesName" title="业务姓名" width="80" fixed="left"></vxe-table-column>
		<vxe-table-column v-for="field in table_field.filter(o=>!['status','salesCode','salesName','matchAmount'].includes(o.name)).filter(column=>!column.fed_isvisiable).
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
const api_pagemanager = api_common.resource('pagemanager/field')
import { MessageBox } from 'element-ui';

const download = require('downloadjs')
export default {
	mixins: [table_mixin],
	props:['url','m'],
	data() {
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
			rules:{},
			importUploadUrl: 'commission/documentary',
			downloadUrl: 'commission/documentary',
			sku_info: [],
			info:{},
			invCodeData: [],
			curr:1,
			page:'',
			invType: '',
			dispatch_loading: false,
			message: ''
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
		async handleImportChange(ev){
			const files = ev.target.files;
			this.importForm.the_file = files[0]
			if (!files) return;
			const { importForm } = this
			var form = new FormData();
			Object.keys(importForm).forEach(key=>{
				form.append(key,importForm[key])  
			})
			this.importLoading = true
			MessageBox.close()
			MessageBox.alert(
				<div v-loading={true}><br /></div>, '导入中', {
				showConfirmButton:false,
				center:true
			});
			try {
				let mes = await this.$request.post(this.importUploadUrl,form,{alert:false})
				this.fetchTableData()
				this.$message({
					message: mes,
					type: 'success'
				});
				MessageBox.close()
			} catch (error) {
				MessageBox.close()
				MessageBox.alert(error.response.data, '提示', {
					confirmButtonText: '确定',
				});
			}finally{
				this.importLoading = false
				this.$nextTick(()=>{
					// this.$refs.importInput.value = null
					// ev.target.value = null
					this.fetchTableData()
				})
			}
		},
		async handleDownloadChange(){
			try {
				const  { data,name,contentType } = await this.$request.get(this.downloadUrl,{
					responseType:'arraybuffer'
				})
				download(data,name||this.$route.meta.title,contentType)
				this.$message({
					message: '下载成功',
					type: 'success'
				});
			} catch (error) {
				
			}finally{
				MessageBox.close()
			}
		},
		import(){
			let {
				handleImportChange,
			} = this
			MessageBox.alert(
			<el-button-group class="table-import-upload" ref="import">
				<el-button type="primary" onClick={()=>{}}>选择文件</el-button>
				<input type="file" ref="input" class="input" on-change={handleImportChange} ref="importInput"></input>
				<el-button type="" style="margin-left:20px" onClick={()=>{this.handleDownloadChange()}}>下载模板</el-button>
			</el-button-group>
			, '选择文件导入', {
			showConfirmButton:false,
			center:true
			});
		},
		getSummaries1({ columns, data }) {
			const sums = [];
			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = '合计';
					return;
				}
				let columnProper = ['natSumMoney','natDispatchMoney','sellDiscount','openTicketAdjust','priceAdjust','qualityDeduct','realMoney']
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
		cellClassName ({ row, rowIndex, column, columnIndex }) {
			if(this.m==4 && column.property=='natDispatchMoney'){
				// if(row.status==2){
				// 	return 'col-red'
				// }else{
					return 'col-blue'
				// }
			}
			if(this.m==4 && column.property=='natSumMoney'){
				return 'text-right'
			}
		},
		indexMethods(i){
			return (i+1)+(this.curr-1)*this.page
		},
        headerStyle(row,rowIndex,column,columnIndex){
            return "background:rgba(245,250,251,1);box-shadow:0px 1px 0px rgba(228,234,236,1);"
		},
		async cellClickEvent({row,column,cell}){
			if(this.m==4 && column.property=='natDispatchMoney'){
				this.dispatch_loading = true
				this.openDrawers = true
				this.info = await this.api_resource.find(row.id)
				const {rows,total} = await this.$request.get('commission/documentary/ajust?cusCode='+this.info.cusCode+'&dateLap='+this.info.dateLap+'&cDLCode='+this.info.cDLCode)
				this.dispatchData = rows
				this.$nextTick(()=>{
					this.dispatch_loading = false
					this.$refs.dispatchTable && this.$refs.dispatchTable.doLayout && this.$refs.dispatchTable.doLayout()
					this.$refs.dispatchTable && this.$refs.dispatchTable.recalculate && this.$refs.dispatchTable.recalculate()
					this.$refs.dispatchTable && this.$refs.dispatchTable.refreshColumn && this.$refs.dispatchTable.refreshColumn()
				})
			}
		},
		priceInput(val){
		},
		priceBlur(item){
			if(this.form.invName=='开票调整'){
				let money = this.form.natDispatchMoney
				if(+money < 0){
					if(+item.openTicketAdjust >= 0 || isNaN(+item.openTicketAdjust)){
						this.$message.error('请输入小于0的数字')
						item.openTicketAdjust = ''
					}
				}else if(+money > 0){
					if(isNaN(+item.openTicketAdjust) || +item.openTicketAdjust <= 0){
						this.$message.error('请输入大于0的数字')
						item.openTicketAdjust = ''
					}
				}
				let arr = []
				let statistics = this.form.sku_info.filter((o,i)=>i!=0).filter(o=>o.openTicketAdjust)
				statistics.forEach(o=>{
					arr.push(+o.openTicketAdjust)
				})
				let more = arr.length!=0 ? arr.reduce((tem, item, index) => tem + item) : 0
				this.form.sku_info[0].openTicketAdjust = this.form.natDispatchMoney - more
				if((this.form.sku_info[0].openTicketAdjust<=0 && +money > 0) || (this.form.sku_info[0].openTicketAdjust>=0 && +money < 0 )){
					this.$message.error('调整金额不允许超过本币无税金额')
					item.openTicketAdjust = ''
				}
			}else if(this.form.invName=='销售折扣'){
				let money = this.form.natDispatchMoney
				if(+money < 0){
					if(+item.sellDiscount >= 0 || isNaN(+item.sellDiscount)){
						this.$message.error('请输入小于0的数字')
						item.sellDiscount = ''
					}
				}else if(+money > 0){
					if(isNaN(+item.sellDiscount) || +item.sellDiscount <= 0){
						this.$message.error('请输入大于0的数字')
						item.sellDiscount = ''
					}
				}
				let arr = []
				let statistics = this.form.sku_info.filter((o,i)=>i!=0).filter(o=>o.sellDiscount)
				statistics.forEach(o=>{
					arr.push(+o.sellDiscount)
				})
				let more = arr.length!=0 ? arr.reduce((tem, item, index) => tem + item) : 0
				this.form.sku_info[0].sellDiscount = this.form.natDispatchMoney - more
				if((this.form.sku_info[0].sellDiscount<=0 && +money > 0) || (this.form.sku_info[0].sellDiscount>=0 && +money < 0 )){
					this.$message.error('调整金额不允许超过本币无税金额')
					item.sellDiscount = ''
				}
			}else if(this.form.invName=='价格调整'){
				let money = this.form.natDispatchMoney
				if(+money < 0){
					if(+item.priceAdjust >= 0 || isNaN(+item.priceAdjust)){
						this.$message.error('请输入小于0的数字')
						item.priceAdjust = ''
					}
				}else if(+money > 0){
					if(isNaN(+item.priceAdjust) || +item.priceAdjust <= 0){
						this.$message.error('请输入大于0的数字')
						item.priceAdjust = ''
					}
				}
				let arr = []
				let statistics = this.form.sku_info.filter((o,i)=>i!=0).filter(o=>o.priceAdjust)
				statistics.forEach(o=>{
					arr.push(+o.priceAdjust)
				})
				let more = arr.length!=0 ? arr.reduce((tem, item, index) => tem + item) : 0
				this.form.sku_info[0].priceAdjust = this.form.natDispatchMoney - more
				if((this.form.sku_info[0].priceAdjust<=0 && +money > 0) || (this.form.sku_info[0].priceAdjust>=0 && +money < 0 )){
					this.$message.error('调整金额不允许超过本币无税金额')
					item.priceAdjust = ''
				}
			}else if(this.form.invName=='质量扣款'){
				let money = this.form.natDispatchMoney
				if(+money < 0){
					if(+item.qualityDeduct >= 0 || isNaN(+item.qualityDeduct)){
						this.$message.error('请输入小于0的数字')
						item.qualityDeduct = ''
					}
				}else if(+money > 0){
					if(isNaN(+item.qualityDeduct) || +item.qualityDeduct <= 0){
						this.$message.error('请输入大于0的数字')
						item.qualityDeduct = ''
					}
				}
				let arr = []
				let statistics = this.form.sku_info.filter((o,i)=>i!=0).filter(o=>o.qualityDeduct)
				statistics.forEach(o=>{
					arr.push(+o.qualityDeduct)
				})
				let more = arr.length!=0 ? arr.reduce((tem, item, index) => tem + item) : 0
				this.form.sku_info[0].qualityDeduct = this.form.natDispatchMoney - more
				if((this.form.sku_info[0].qualityDeduct<=0 && +money > 0) || (this.form.sku_info[0].qualityDeduct>=0 && +money < 0 )){
					this.$message.error('调整金额不允许超过本币无税金额')
					item.qualityDeduct = ''
				}
			}
		},
		checkNumber1(rule, value, callback){
			let money = this.form.natDispatchMoney
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
		changeInvCode(item){
			let curr = this.invCodeData.filter(o=>o.invCode==item.invCode)
			item.invName = curr[0].invName
		},
		async edit(){
			let row = this.table_selectedRows[0];
			this.form = await this.api_resource.find(row.id)
			const {rows,total} = await this.$request.get('commission/documentary/list?cusCode='+this.form.cusCode+'&dateLap='+this.form.dateLap+'&cDLCode='+this.form.cDLCode)
			if(rows.length==0){
				if(this.form.invName=='开票调整'){
					var item = [{
						invCode: '',
						invName: '',
						cusAbbName: this.form.cusAbbName,
						cDLCode: this.form.cDLCode,
						cusCode: this.form.cusCode,
						id: null,
						inputDay: this.form.dateLap,
						openTicketAdjust: this.form.natDispatchMoney
					}]
				}else if(this.form.invName=='销售折扣'){
					var item = [{
						invCode: '',
						invName: '',
						cusAbbName:this.form.cusAbbName,
						cDLCode: this.form.cDLCode,
						cusCode: this.form.cusCode,
						id: null,
						inputDay: this.form.dateLap,
						sellDiscount: this.form.natDispatchMoney
					}]
				}else if(this.form.invName=='价格调整'){
					var item = [{
						invCode: '',
						invName: '',
						cusAbbName: this.form.cusAbbName,
						cDLCode: this.form.cDLCode,
						cusCode: this.form.cusCode,
						id: null,
						inputDay: this.form.dateLap,
						priceAdjust: this.form.natDispatchMoney
					}]
				}else if(this.form.invName=='质量扣款'){
					var item = [{
						invCode: '',
						invName: '',
						cusAbbName: this.form.cusAbbName,
						cDLCode: this.form.cDLCode,
						cusCode: this.form.cusCode,
						id: null,
						inputDay: this.form.dateLap,
						qualityDeduct: this.form.natDispatchMoney
					}]
				}
				this.$set(this.form,'sku_info',item)
			}else{
				this.$set(this.form,'sku_info',rows)
			}
			this.dialogFormVisible = true
			this.invCodeData = (await this.$request.get('commission/documentary/invcode?cusCode='+this.form.cusCode+'&dateLap='+this.form.dateLap+'&cDLCode='+this.form.cDLCode)).rows
		},
        addSku(){
			if(this.form.invName=='开票调整'){
				this.form.sku_info.push({
					invCode: '',
					invName: '',
					cDLCode: this.form.cDLCode,
					cusAbbName: this.form.cusAbbName,
					cusCode: this.form.cusCode,
					id: null,
					inputDay: this.form.dateLap,
					openTicketAdjust: ''
				});
			}else if(this.form.invName=='销售折扣'){
				this.form.sku_info.push({
					invCode: '',
					invName: '',
					cDLCode: this.form.cDLCode,
					cusAbbName: this.form.cusAbbName,
					cusCode: this.form.cusCode,
					id: null,
					inputDay: this.form.dateLap,
					sellDiscount: ''
				});
			}else if(this.form.invName=='价格调整'){
				this.form.sku_info.push({
					invCode: '',
					invName: '',
					cDLCode: this.form.cDLCode,
					cusAbbName: this.form.cusAbbName,
					cusCode: this.form.cusCode,
					id: null,
					inputDay: this.form.dateLap,
					priceAdjust: ''
				});
			}else if(this.form.invName=='质量扣款'){
				this.form.sku_info.push({
					invCode: '',
					invName: '',
					cDLCode: this.form.cDLCode,
					cusAbbName: this.form.cusAbbName,
					cusCode: this.form.cusCode,
					id: null,
					inputDay: this.form.dateLap,
					qualityDeduct: '',
				});
			}
        },
        deleteSku(item) {
			var index = this.form.sku_info.indexOf(item)
			if (index !== -1) {
				this.form.sku_info.splice(index, 1)
			}
			this.priceBlur(item)
        },
		async handleFormSubmit(){
			await this.form_validate()
			let info = this.form.sku_info
			await this.$request.put('/commission/documentary', {data:JSON.stringify(info)})
			this.dialogFormVisible = false
			this.fetch()
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
				span{
					width: 100px;
					text-align: right;
					display: inline-block;
				}	
			}
		}
		
        .ivu-drawer-header{
            background: rgba(245,250,251,1)
        }
	}
	.col-red{
		color: red;
		text-align: right;
	}
	.col-blue{
		color: #0BB2D4;
		text-decoration: underline;
		cursor: pointer;
		text-align: right;
	}
	.text-right{
		text-align: right;
	}
}
.dispatchTable{
	.el-table__row{
		.cell{
			line-height: 21px;
		}
	}
}
</style>


