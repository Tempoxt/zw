  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  >

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
		>
		<vxe-table-column 
			type="selection" 
			width="50" 
			class-name="table-column-disabled"
			:selectable="table_disable_selected"
			fixed="left"
		>
		</vxe-table-column>
		<vxe-table-column type="index" :index="indexMethod" align="center" fixed="left" width="60"/>
		<vxe-table-column v-for="field in table_field.filter(o=>!['paidAmount','unpaidAmount','matchAmount'].includes(o.name)).filter(column=>!column.fed_isvisiable).
			filter(column=>!column.isvisiable)" :key="field.name" :field="field.name" :title="field.showname" :sortable="field.issort" 
			:width="field.width=='auto'?'': parseInt(field.width)"/>
		<div v-if="this.m==1" >
			<vxe-table-column field="paidAmount" title="已收款金额" width="110" fixed="right">
				<template slot-scope="scope">
					<div :style="{color:scope.row.unpaidAmount!=0?'#F2353C':'#18CC72'}" v-html="scope.row.paidAmount"></div>
				</template>
			</vxe-table-column>	
			<vxe-table-column field="unpaidAmount" title="未收款金额" width="110" fixed="right">
				<template slot-scope="scope">
					<div :style="{color:scope.row.unpaidAmount!=0?'#F2353C':''}"  v-html="scope.row.unpaidAmount"></div>
				</template>
			</vxe-table-column>
		</div>
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
		return {
			loading: true,
            vxeHeaderStyle:{background:'#F5FAFB',color:'#37474F'},
			api_resource: api_common.resource(this.url),
			queryDialogFormVisible: true,
			table_topHeight: 293,
			selectRows: [],
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
								return sums[columnIndex].toFixed(6)
							}
						} else {
							return '';
						}  
					}
				})
			]
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


