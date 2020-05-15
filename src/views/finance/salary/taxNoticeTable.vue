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
import dayjs from 'dayjs'
let baseUrl = process.env.VUE_APP_STATIC
// const api_resource = api_common.resource("deduction");
export default {
	mixins: [table_mixin],
	props:['id','url','murl'],
	data() {
		return {
			loading: true,
			api_resource: api_common.resource(this.url),
			orgCategory:[],
			queryDialogFormVisible:true,
			dialogForm2Visible:false,
			table_topHeight:293,
			template:{
				signature(row,column){
					if(column.signature!=''&&column.signature!=undefined){
                        return <img src={baseUrl+column.signature} width="30" height="30"></img>
                    }
				},
			},
		};
	},
	watch:{
		id(){
            this.table_form.currentpage = 1
			this.fetchTableData()
		},
        murl(){
            this.fetchMenu()
		},
        url(){
			this.api_resource = api_common.resource(this.url)
			delete this.table_form.sortname
			this.table_form.query.query = []
			this.table_form.currentpage = 1
            this.fetchMenu()
            this.fetchTableData()
		},
	},
	methods: {
		async delete(){
            let rows = this.table_selectedRows.map(row=>row.id)
			await this.$request.delete('hrm/v3/getpersonalincometaxe?ids='+rows.join(','))
			this.$message.success({message:mes});
            this.fetchTableData();
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
			this.table_form.orgid = this.id
			const {rows , total }= await this.api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
		async fetchMenu(){
            const { field, action,table } = await api_common.menuInit(this.murl);
            this.table_field = field;
            this.table_actions = action;
            this.table_config = table
        }
	},
	async created() {
        this.fetchMenu()
		this.fetchTableData();
	}
};
</script>