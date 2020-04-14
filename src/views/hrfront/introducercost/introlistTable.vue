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
      <div style="padding-left:10px">
        <dateLap v-model="table_form.dateLap" itemsD="1" @change="fetch"/>
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
    >
    <el-table-column 
      type="selection" 
      width="60" 
      class-name="table-column-disabled"
      :selectable="table_disable_selected"
      >
      </el-table-column>
    <el-table-column type="index" :index="indexMethod" width="70"/>
    <each-table-column :table_field="table_field" :template="template"/>
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
// const api_resource = api_common.resource("introducercost/allrecordbystatus");
import dayjs from 'dayjs'

export default {
	mixins: [table_mixin],
	props:['flowStatus','url'],
	data() {
		return {
			loading: true,
			api_resource: api_common.resource("introducercost/allrecordbystatus"),
			queryDialogFormVisible:true,
			table_topHeight:293,
			template:{
				tollPayStatusDisPlay(column,row){
					switch(row.tollPayStatus){
						case 1:
						case 3:
							return <el-tag size="mini" type="danger">{row.tollPayStatusDisPlay}</el-tag> 
							break;
						case 2:
						case 4:
							return <el-tag size="mini" type="success">{row.tollPayStatusDisPlay}</el-tag> 
							break;
						case 5:
							return <el-tag size="mini" type="warning">{row.tollPayStatusDisPlay}</el-tag> 
							break;
						default:
							return <el-tag size="mini" type="info">{row.tollPayStatusDisPlay}</el-tag> 
					}
				},
				introducerPayStatusDisPlay(column,row){
					switch(row.introducerPayStatus){
						case 1:
						case 3:
							return <el-tag size="mini" type="danger">{row.introducerPayStatusDisPlay}</el-tag> 
							break;
						case 2:
						case 4:
							return <el-tag size="mini" type="success">{row.introducerPayStatusDisPlay}</el-tag> 
							break;
						case 5:
							return <el-tag size="mini" type="warning">{row.introducerPayStatusDisPlay}</el-tag> 
							break;
						default:
							return <el-tag size="mini" type="info">{row.introducerPayStatusDisPlay}</el-tag> 
					}
				},
				flowStatusDisPlay(column,row){
					if(row.flowStatus==1){
						return <el-tag size="mini" type="info">{row.flowStatusDisPlay}</el-tag> 
					}else if(row.flowStatus==2){
						return <el-tag size="mini" type="warning">{row.flowStatusDisPlay}</el-tag> 
					}else{
						return <el-tag size="mini" type="success">{row.flowStatusDisPlay}</el-tag> 
					}
				},
			}
		};
	},
	watch:{
		flowStatus(){
			console.log(this.flowStatus,'this.flowStatus')
			if(this.flowStatus==5){
				this.api_resource = api_common.resource("introducercost/ungeneraterecord");
				delete this.table_form.flowStatus
			}else{
				this.api_resource = api_common.resource("introducercost/allrecordbystatus")
			}
			this.table_form.query.query = []
			this.table_form.currentpage = 1
			this.fetchMenu()
		},
	},
	methods: {
		async apply(){
			let rows = this.table_selectedRows.map(row=>row.id)
			try{
				let mes = await this.$request.post('introducercost/waitdealapply',{recordIds:rows.join(',')})
				this.$message({
					message: mes,
					type: 'success'
				});
			    this.fetchTableData()
			}catch(err){
				console.log(err)
			}
		},
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		async fetchTableData() {
			this.table_loading = true;
			this.table_form.flowStatus = this.flowStatus
			const {rows , total }= await this.api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
		async fetchMenu(){
			if(this.flowStatus==5){
				const { field, action,table } = await api_common.menuInit("introducercost/ungeneraterecord");
				this.table_field = field;
				this.table_actions = action;
				this.table_config = table
			}else{
				const { field, action,table } = await api_common.menuInit("Introducercost"+this.flowStatus);
				this.table_field = field;
				this.table_actions = action;
				this.table_config = table
			}
			//setTimeout(()=>{
				this.fetchTableData();
			//},500)
		},
	},
	async created() {
		this.table_form.dateLap = dayjs().format('YYYY-MM')
		this.fetchMenu()
	}
};
</script>


