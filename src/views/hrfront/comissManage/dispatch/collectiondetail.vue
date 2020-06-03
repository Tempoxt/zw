  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  >

	<div>
		<Drawer title="本币含税核销金额详情" :closable="false" width="800" v-model="openDrawers" class="collection">
			<div class="container">
				<p class="title">记账凭证（收款）</p>
				<p class="flex">
					<span><span style="margin-right:48px">记</span>字 :{{collection_info.cPZNum}}</span>
					<span>制单日期：{{collection_info.markDate}}</span>
					<span>审核日期：{{collection_info.auditDate}}</span>
				</p>
				<table border cellpadding="10" class="default-table">
					<thead>
						<tr>
							<th style="width:15%">摘要</th>
							<th colspan="2" style="width:55%">科目名称</th>
							<th style="width:15%;text-align:right">借方金额</th>
							<th style="width:15%;text-align:right">贷方金额</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item,i) in collection_info.collection_detail" :key="i">
							<td >{{item.abstract}}</td>
							<td colspan="2">{{item.subjectName}}</td>
							<td style="text-align:right">{{item.lendMount}}</td>
							<td style="text-align:right">{{item.loanMount}}</td>
						</tr>
						<tr v-for="(item,i) in collectNum" :key="i+'xx'">
							<td> &nbsp;</td>
							<td colspan="2"> &nbsp;</td>
							<td >&nbsp; </td>
							<td >&nbsp; </td>
						</tr>
					</tbody>
					<tbody>
						<tr v-if="collection_info && collection_info.ticketDetail">
							<td rowspan="2" style="border-right:none">
								<div style="display:inline-block">
									<span>票号 {{collection_info.ticketDetail.ticketCode}}</span><br>
									<span>日期 {{collection_info.ticketDetail.ticketDate}}</span>
								</div>
							</td>
							<td rowspan="2">
								<div style="display:inline-block;margin-left:50px">
									<span>数量 {{collection_info.ticketDetail.number}}</span><br>
									<span>单价 {{collection_info.ticketDetail.price}}</span>
								</div>
							</td>
							<td style="text-align:center">合计</td>
							<td style="text-align:right">{{lendMount}}</td>
							<td style="text-align:right">{{loanMount}}</td>
						</tr>
						<tr>
							<td colspan="3">{{capital}}</td>
						</tr>
						<tr v-if="collection_info && collection_info.staffDetail">
							<td>备注</td>
							<td style="border-right:none">
								<div>
									<span>项&nbsp;目</span><br>
									<span>个&nbsp;人</span><br>
									<span>业务员  &nbsp;&nbsp;&nbsp;{{collection_info.staffDetail.chineseName}} </span>
								</div>
							</td>
							<td colspan="3">
								<div>
									<span>部&nbsp;门   &nbsp;&nbsp;&nbsp;{{collection_info.staffDetail.departName}}</span><br>
									<span>客&nbsp;户   &nbsp;&nbsp;&nbsp;{{collection_info.staffDetail.cusAbbName}}</span><br>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div class="container dot" v-if="cancel_info && cancel_info.cancel_detail">
				<p class="title">记账凭证（核销）</p>
				<p class="flex">
					<span><span style="margin-right:48px">记</span>字 :{{cancel_info.cPZNum}}</span>
					<span>制单日期：{{cancel_info.markDate}}</span>
					<span>审核日期：{{cancel_info.auditDate}}</span>
				</p>
				<table border cellpadding="10" class="default-table">
					<thead>
						<tr>
							<th style="width:15%">摘要</th>
							<th colspan="2" style="width:55%">科目名称</th>
							<th style="width:15%;text-align:right">借方金额</th>
							<th style="width:15%;text-align:right">贷方金额</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item,i) in cancel_info.cancel_detail" :key="i">
							<td >{{item.abstract}}</td>
							<td colspan="2">{{item.subjectName}}</td>
							<td style="text-align:right">{{item.lendMount}}</td>
							<td style="text-align:right">{{item.loanMount}}</td>
						</tr>
						<tr v-for="(item,i) in cancelNum" :key="i+'zz'">
							<td> &nbsp;</td>
							<td colspan="2"> &nbsp;</td>
							<td >&nbsp; </td>
							<td >&nbsp; </td>
						</tr>
					</tbody>
					<tbody>
						<tr v-if="cancel_info && cancel_info.ticketDetail">
							<td rowspan="2" style="border-right:none">
								<div style="display:inline-block">
									<span>票号 {{cancel_info.ticketDetail.ticketCode}}</span><br>
									<span>日期 {{cancel_info.ticketDetail.ticketDate}}</span>
								</div>
							</td>
							<td rowspan="2">
								<div style="display:inline-block;margin-left:50px">
									<span>数量 {{cancel_info.ticketDetail.number}}</span><br>
									<span>单价 {{cancel_info.ticketDetail.price}}</span>
								</div>
							</td>
							<td style="text-align:center">合计</td>
							<td style="text-align:right">{{lendMount1}}</td>
							<td style="text-align:right">{{loanMount1}}</td>
						</tr>
						<tr>
							<td colspan="3">{{capital1}}</td>
						</tr>
						<tr v-if="cancel_info && cancel_info.staffDetail">
							<td>备注</td>
							<td style="border-right:none">
								<div>
									<span>项&nbsp;目</span><br>
									<span>个&nbsp;人</span><br>
									<span>业务员  &nbsp;&nbsp;&nbsp;{{cancel_info.staffDetail.chineseName}} </span>
								</div>
							</td>
							<td colspan="3">
								<div>
									<span>部&nbsp;门   &nbsp;&nbsp;&nbsp;{{cancel_info.staffDetail.departName}}</span><br>
									<span>客&nbsp;户   &nbsp;&nbsp;&nbsp;{{cancel_info.staffDetail.cusAbbName}}</span><br>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
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
			收款日期：<dateLap v-model="table_form.dateLap" @change="fetch"/>
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
      	:cell-class-name="cellClassName"
		@cell-click="cellClickEvent"
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
const api_pagemanager = api_common.resource('pagemanager/field')
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
// const api_resource = api_common.resource("commission/customerlist");
import dayjs from 'dayjs'
export default {
	mixins: [table_mixin],
	props:['id','url','m'],
	data() {
		return {
			loading: true,
            vxeHeaderStyle:{background:'#F5FAFB',color:'#37474F'},
			api_resource: api_common.resource(this.url),
			queryDialogFormVisible: true,
			table_topHeight: 293,
			openDrawers: false,
			cancel_info: {},
			collection_info: {},
			lendMount: '',
			loanMount: '',
			capital: '',
			lendMount1: '',
			loanMount1: '',
			capital1: '',
			collectNum: '',
			cancelNum: '',
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
		}
	},
	methods: {
		
        chineseNumber(num) {
            if (isNaN(num) || num > Math.pow(10, 12))
                return "";
            var cn = "零壹贰叁肆伍陆柒捌玖"
            var unit = new Array("拾百千", "分角")
            var unit1 = new Array("万亿", "")
            var numArray = num.toString().split(".")
            var start = new Array(numArray[0].length - 1, 2)
        
            function toChinese(num, index) {
                var num = num.replace(/\d/g, function ($1) {
                    return cn.charAt($1) + unit[index].charAt(start-- % 4 ? start % 4 : -1)
                })
                return num
            }
        
            for (var i = 0; i < numArray.length; i++) {
                var tmp = ""
                for (var j = 0; j * 4 < numArray[i].length; j++) {
                    var strIndex = numArray[i].length - (j + 1) * 4
                    var str = numArray[i].substring(strIndex, strIndex + 4)
                    var start = i ? 2 : str.length - 1
                    var tmp1 = toChinese(str, i)
                    tmp1 = tmp1.replace(/(零.)+/g, "零").replace(/零+$/, "")
                    tmp1 = tmp1.replace(/^壹拾/, "拾")
                    tmp = (tmp1 + unit1[i].charAt(j - 1)) + tmp
                }
                numArray[i] = tmp
            }
        
            numArray[1] = numArray[1] ? numArray[1] : ""
            numArray[0] = numArray[0] ? numArray[0] + "元" : numArray[0], numArray[1] = numArray[1].replace(/^零+/, "")
            numArray[1] = numArray[1].match(/分/) ? numArray[1] : numArray[1] + "整"
            return numArray[0] + numArray[1]
        },
		async cellClickEvent({row,column,cell}){
			if(column.property=='collectionAmount'){
				this.openDrawers = true
				const {collection_info,cancel_info} = await this.$request.get('/commission/collectiondetail/'+row.id)
				this.collection_info = collection_info
				this.cancel_info = cancel_info
				this.collectNum = this.collection_info.collection_detail && this.collection_info.collection_detail.length ? 5-this.collection_info.collection_detail.length : 5
				this.cancelNum = this.cancel_info.cancel_detail && this.cancel_info.cancel_detail.length ? 5-this.cancel_info.cancel_detail.length : 5
				let arr1 = []
				let hasData1 = this.collection_info.collection_detail && this.collection_info.collection_detail.length ? 
				this.collection_info.collection_detail.filter(o=>o.lendMount!=''&&o.lendMount!=null) : []
				hasData1.forEach(o=>{
					arr1.push(o.lendMount)
				})
				this.lendMount = arr1.length>0 ? arr1.reduce((tem, item, index) => tem + item) : '' ;

				let arr2 = []
				let hasData2 = this.collection_info.collection_detail && this.collection_info.collection_detail.length ? 
				this.collection_info.collection_detail.filter(o=>o.loanMount!=''&&o.loanMount!=null) : []
				hasData2.forEach(o=>{
					arr2.push(o.loanMount)
				})
				this.loanMount = arr2.length>0 ? arr2.reduce((tem, item, index) => tem + item) : '' ;
				this.capital = this.chineseNumber(this.lendMount) || this.chineseNumber(this.loanMount)


				let arr3 = []
				let hasData3 = this.cancel_info.cancel_detail && this.cancel_info.cancel_detail.length ? 
				this.cancel_info.cancel_detail.filter(o=>o.lendMount!=''&&o.lendMount!=null) : []
				hasData3.forEach(o=>{
					arr3.push(o.lendMount)
				})
				this.lendMount1 = arr3.length>0 ? arr3.reduce((tem, item, index) => tem + item) : '' ;

				let arr4 = []
				let hasData4 = this.cancel_info.cancel_detail && this.cancel_info.cancel_detail.length ? 
				this.cancel_info.cancel_detail.filter(o=>o.loanMount!=''&&o.loanMount!=null) : []
				hasData4.forEach(o=>{
					arr4.push(o.loanMount)
				})
				this.loanMount1 = arr4.length>0 ? arr4.reduce((tem, item, index) => tem + item) : '' ;
				this.capital1 = this.chineseNumber(this.loanMount1) !=''?this.chineseNumber(this.loanMount1) : this.chineseNumber(this.lendMount1)
			}
		},
		cellClassName ({ row, rowIndex, column, columnIndex }) {
			if(column.property=='collectionAmount'){
				return 'col-blue'
			}
		},
		indexMethods(i){
            return (i+1)+(this.form.currentp-1)*this.form.page
		},
        headerStyle(row,rowIndex,column,columnIndex){
            return "background:rgba(245,250,251,1);box-shadow:0px 1px 0px rgba(228,234,236,1);"
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
			if(!this.id){
				return
			}
			this.table_loading = true;
			this.table_form.org_id = this.id
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
	.dispatch{
		.row{
			.el-col{
				margin-bottom: 15px;
			}
		}
	}
	.col-red{
		color: red;
	}
	.col-blue{
		color: #0BB2D4;
		cursor: pointer;
	}
	.collection{
		.ivu-drawer-header{
			background: #0BB2D4;
			font-size: 14px;
			.ivu-drawer-header-inner{
				color: #fff;
			}
		}
		.container{
			padding: 10px 5px;
			.title{
				font-size: 18px;
				color: #333;
				text-align: center;
			}
			.flex{
				margin: 10px 0 6px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #143040;
			}
			table.default-table{
				/* -moz-border-radius: 5px;
				-webkit-border-radius:5px;
				border-radius:5px; */
				width: 100%;
				border:solid #999; 
				border-width:1px 0px 0px 1px;
				border-collapse: collapse;
				border-spacing: 0;
			}
			table.default-table thead th{
				height: 40px;
				line-height: 40px;
				background: #F5F5F5;
			}
			table.default-table tbody tr{
				height: 32px;
				line-height: 20px;
			}
			table.default-table tbody tr.odd{
				background-color: #fff;
			}
			table.default-table tbody tr.even{
				background-color: #F5F5F5;
			}
			table.default-table tbody tr:hover{
				background-color: #eee;
			}
			table.default-table thead tr th,table.default-table tbody tr th,table.default-table tbody tr td{
				padding: 5px 7px;
				text-align: left;
				/* border: 1px solid #ddd; */
				border:solid #999; 
				border-width:0px 1px 1px 0px; 
			}
			table.default-table tbody tr th{
				font-weight: bold;
				text-align: center;
			}
			
			table.default-table tbody tr td.tac{
				text-align: center;
			}
			table.default-table tbody tr td a:hover{
				color:#0080c0;
			}
		}
	}
</style>


