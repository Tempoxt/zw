  <template>
  <ui-table
  ref="table"
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
		<div style="padding-left:10px">
			<dateLap type="3" :disabled="true" v-model="table_form.dateLap" @change="fetch"/>
		</div>
		<!-- <div style="padding-left:10px" v-show="this.a==2"> v-show="this.a==1"
			<dateLap :disabled="true" v-model="dateLap" @change="fetch"/>
		</div> -->
    </table-header>
	<vxe-table
		class="public-vxe-table total_budget"
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
		>
		</vxe-table-column>
		<vxe-table-column type="index" :index="indexMethod" align="center" width="60"/>
		<vxe-table-column v-for="field in table_field.filter(column=>!column.fed_isvisiable).
			filter(column=>!column.isvisiable)" :key="field.name" :field="field.name" :title="field.showname" :sortable="field.issort" 
			:width="field.width=='auto'?'': parseInt(field.width)"/>
		<!-- <vxe-table-column field="total_budget" title="预算合计" width="120" fixed="right"></vxe-table-column> .filter(o=>!['total_budget'].includes(o.name))-->
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
import { MessageBox } from 'element-ui';
const api_pagemanager = api_common.resource('pagemanager/field')
import importForm from '../financialSheet/importForm'
export default {
	mixins: [table_mixin],
	props:['id','a','url'],
	data() {
		return {
			loading: true,
            vxeHeaderStyle:{background:'#F5FAFB',color:'#37474F'},
			api_resource: api_common.resource(this.url),
			queryDialogFormVisible:true,
			visible:false,
			importUploadUrl:'/budgetcontrol/budgetload',
			table_topHeight: 293,
			dateLap: '',
			dateLap1: '',
			table_fix: [],
			downloadUrl:'budgetcontrol/budgetdown',
		};
	},
	watch:{
		id(){
			this.fetch()
		},
		url(){
            this.api_resource = api_common.resource(this.url)
			delete this.table_form.keyword
			delete this.table_form.sortname
			delete this.table_form.quicksearch
			this.table_form.currentpage = 1
			this.table_form.query.query= []
			this.fetchMenu()
			this.fetchTableData()
		}
	},
	methods: {
		import(){
			MessageBox.alert(
				<importForm importUploadUrl={this.importUploadUrl} downloadUrl={this.downloadUrl} resourJudge='1' isYear="1"
				on={{fetchData:()=>{this.fetch()}}}/>
				, '选择文件导入', {
				showConfirmButton:false,
				center:true
			});
		},
		// footerMethod ({ columns, data }) {
		// 	let means = []
		// 	let sums = []
		// 	data = this.table_fix
		// 	columns.forEach((column, columnIndex) => {
		// 		if (columnIndex === 0 ||columnIndex === 1) {
		// 			means.push('')
		// 			sums.push('')
		// 		} else {
		// 			let meanCell = null
		// 			let sumCell = null
		// 			data.forEach((o,i)=>{
		// 				if(i==0){
		// 					meanCell = o[column.property]
		// 				}else{
		// 					sumCell = o[column.property]
		// 				}
		// 			})
		// 			means.push(meanCell)
        //           	sums.push(sumCell)
		// 		}
		// 	})
		// 	// 返回一个二维数组的表尾合计
		// 	return [ means, sums ]
        // },
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
			if(!this.id || !this.table_form.dateLap){
				return
			}
			this.table_loading = true;
			this.table_form.orgid = this.id
			// if(this.a==1){
			// 	this.table_form.dateLap = this.dateLap1
			// }else{
			// 	this.table_form.dateLap = this.dateLap
			// }
			const {rows , total,fixed }= await this.api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			this.table_fix = fixed
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
		async fetchMenu(){
			const { field, action,table } = await api_common.menuInit(this.url);
			this.table_field = field;
			this.table_actions = action;
			this.table_config = table
		}
	},
	async created() {
		await this.fetchMenu()
		this.dateLap = dayjs().format('YYYY-MM')
		this.table_form.dateLap = dayjs().format('YYYY')
		// setTimeout(async ()=>{
			await this.fetchTableData();
		// },500)
	}
};
</script>
<style lang="scss">
.total_budget{
	// .vxe-table--footer{
	// 	.vxe-footer--column{
	// 		background: #fff;
	// 		.vxe-cell{
	// 			font-weight: bold;
	// 		}
	// 	}
	// 	tr:first-child{
	// 		.vxe-footer--column{
	// 			.vxe-cell{
	// 				color: #FF8000;
	// 			}
	// 		}
	// 	}
	// 	tr:last-child{
	// 		.vxe-footer--column{
	// 			.vxe-cell{
	// 				color: #0BB2D4;
	// 			}
	// 		}
	// 	}
	// }
}
</style>

