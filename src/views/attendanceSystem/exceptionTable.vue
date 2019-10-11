  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  class="mini-table"
  >

    <table-header
		:table_actions="table_actions"
		:table_selectedRows="table_selectedRows"
		@action="handleAction"
		:table_form.sync="table_form"
		:table_column="table_field"
		>
		<div style="padding-left:10px">
			<el-select v-model="status" placeholder="请选择" @change="changeStatus" style="width:140px">
				<el-option
					v-for="item in optionDatas"
					:key="item.type"
					:label="item.label"
					:value="item.value">
				</el-option>
			</el-select>
		</div>
		<div style="padding-left:10px">
			<dateLap v-model="table_form.dateLap" @change="fetch"/>
		</div>
    </table-header>
    <el-table
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
const api_resource = api_common.resource("holidaymanager/leavemanager");
import dayjs from 'dayjs'
export default {
	mixins: [table_mixin],
	props:['id','url','m'],
	data() {
		return {
			loading: true,
			api_resource,
			table_topHeight:276,
			queryDialogFormVisible:true,
			optionDatas: [],
			status:'全部',
			// table_form:{
			// 	leaveType: '全部'
			// }
		};
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
			this.fetchMenu()
			// if(this.url=='commission/monthDetail'){
			// 	this.api_resource = api_common.resource("commission/valueIncrease");
			// }else if(this.url=='commission/quarterstat'){
			// 	this.api_resource = api_common.resource("commission/seasonValueIncrease");
			// }
		}
	},
	methods: {
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		changeStatus(val){
			this.status = val
			this.fetchTableData()
		},
		async reset(){
			const mes = await this.$request.post('holidaymanager/leavemanager/reset',{dateLap:this.table_form.dateLap})
			this.$message.success(mes)
			this.fetchTableData();
		},
		async fetchTableData() {
			if(!this.id){
				return
			}
			this.table_loading = true;
			this.table_form.org_id = this.id
			this.table_form.leaveType = this.status
			const {rows , total }= await api_resource.get(this.table_form);
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
			if(this.m==2){
				this.optionDatas = (await api_common.resource('holidaymanager/leavetypelist').get()).map(o=>{return {label:o.selectname,value:o.selectname}});
				this.optionDatas.unshift({value:'全部',label:'全部'})
				this.fetchTableData();
			}
		}
	},
	async created() {
		this.table_form.dateLap = dayjs().format('YYYY-MM')
		await this.fetchMenu()
	}
};
</script>


