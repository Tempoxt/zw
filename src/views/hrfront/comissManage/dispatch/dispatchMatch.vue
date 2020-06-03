  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  class="dispatchMatch"
  >
    <table-header
		:table_actions="table_actions"
		:table_selectedRows="table_selectedRows"
		@action="handleAction"
		:table_form.sync="table_form"
		:table_column="table_field"
		>
		<div style="padding-left:10px;display:flex;align-items:center">
			收款月份：<dateLap v-model="table_form.dateLap" @change="fetch"/>
		</div>
    </table-header>
	<vxe-table
		class="public-vxe-table"
		ref="xTable"
		resizable
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
		<vxe-table-column field="cusCode" label="客户编码" width="90px" fixed="left"></vxe-table-column>
		<vxe-table-column field="cusAbbName" label="客户名称" width="100px"></vxe-table-column>
		<vxe-table-column field="cDLCode" label="发货单号" width="100px"></vxe-table-column>
		<vxe-table-column field="invClassName" label="产品编码" width="90px"></vxe-table-column>
		<vxe-table-column field="customerRankType" label="项目类型" width="90px"></vxe-table-column>
		<vxe-table-column field="invName" label="产品名称" width="90px"></vxe-table-column>
		<vxe-table-column field="cSTType" label="销售类型" width="80px"></vxe-table-column>
		<vxe-table-column field="invClassName" label="产品分类" width="80px"></vxe-table-column>
		<vxe-table-column field="dispatchDay" label="发货日期" width="90px"></vxe-table-column>
		<vxe-table-column field="quantity" label="发货数量" width="90px"></vxe-table-column>
		<vxe-table-column field="natUnitPrice" label="发货单价" width="100px"></vxe-table-column>
		<vxe-table-column field="natDispatchMoney" label="本币无税金额" width="120px"></vxe-table-column>
		<vxe-table-column field="openTicketAdjust" label="开票调整" width="110px"></vxe-table-column>
		<vxe-table-column field="sellDiscount" label="销售折扣" width="100px" ></vxe-table-column>
		<vxe-table-column field="priceAdjust" label="价格调整" width="100px" ></vxe-table-column>
		<vxe-table-column field="qualityDeduct" label="质量扣款" width="100px"  ></vxe-table-column>
		<vxe-table-column field="natMustPaidMoney" label="应收本币无税金额" width="120px" ></vxe-table-column>
		<vxe-table-column field="taxRate" label="税率" width="70px"></vxe-table-column>
		<vxe-table-column field="mustPaidMoney" label="应收本币含税金额" width="120px"></vxe-table-column>
		<vxe-table-column field="matchAmount" label="已收本币无税金额" width="120px"></vxe-table-column>
		<vxe-table-column field="isIncrease" label="是否计增值率" width="100px"></vxe-table-column>
		<vxe-table-column field="increaseValue" label="增值率计算金额" width="120px"></vxe-table-column>
		<vxe-table-column field="standMaterialAmount" label="本单成本" width="120px"></vxe-table-column>
		<vxe-table-column field="increaseRatio" label="增值率系数" width="90px"></vxe-table-column>
		<vxe-table-column field="baseCommissionRatio" label="业务提成系数" width="95"></vxe-table-column>
		<vxe-table-column field="cusFirstDay" label="客户首次发货日期" width="120"></vxe-table-column>
		<vxe-table-column field="cusMonths" label="客户交易期限(月)" width="100"></vxe-table-column>
		<vxe-table-column field="cusRatio" label="客户交易提成系数%" width="120"></vxe-table-column>
		<vxe-table-column field="prodFirstDay" type="html" label="客户产品首次发货日期" width="130"></vxe-table-column>
		<vxe-table-column field="cusProductMonths"  type="html" label="客户产品交易期限(月)" width="130"></vxe-table-column>
		<vxe-table-column field="cusProductRatio"  type="html" label="客户产品提成系数%" width="130"></vxe-table-column>
		<vxe-table-column  title="发货单提成计算金额" align="center">
			<vxe-table-column field="commissionAmount" label="非手机产品" width="90"></vxe-table-column>
			<vxe-table-column field="mCommissionAmount" label="手机产品" width="90"></vxe-table-column>
			<vxe-table-column field="modelCommissionAmount" title="非手机模具" width="90"></vxe-table-column>
		</vxe-table-column>
		<vxe-table-column field="oldCommissionAmount" label="原方案出货单提成金额" width="130"></vxe-table-column>
		
		<!-- <vxe-table-column field="cusCode" title="客户编号" width="95" fixed="left"></vxe-table-column>
		<vxe-table-column field="cusAbbName" title="客户名称" width="95" fixed="left"></vxe-table-column> -->
		<!-- <vxe-table-column v-for="field in table_field.filter(o=>!['dateLap','employeeCode','chineseName','cusCode','cusAbbName'].includes(o.name)).filter(column=>!column.fed_isvisiable).
			filter(column=>!column.isvisiable)" :key="field.name" :field="field.name" :title="field.showname" :sortable="field.issort" 
			:width="field.width=='auto'?'': parseInt(field.width)"/> -->
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
.dispatchMatch{
	.vxe-table .vxe-body--column, .vxe-table .vxe-footer--column, .vxe-table .vxe-header--column,.vxe-header--column .col--center .col--group .col--ellipsis {
		padding: 4px 0;
		line-height: 16px;
		height: 22px;
	}
	// .public-vxe-table.vxe-table .vxe-body--column.col--ellipsis, .public-vxe-table .vxe-table.vxe-editable .vxe-body--column, .public-vxe-table .vxe-table .vxe-footer--column.col--ellipsis, .public-vxe-table .vxe-table .vxe-header--column.col--ellipsis {
	// 	height: 22px;
	// }
	.vxe-table .vxe-cell {
		padding: 0px 4px;
		text-align: center;
		cursor: default;
	}
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
}
	
</style>


