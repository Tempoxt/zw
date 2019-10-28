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
        >
        <el-table-column 
            type="selection" 
            width="60" 
            class-name="table-column-disabled"
            :selectable="table_disable_selected"
            >
        </el-table-column>
        <el-table-column type="index" :index="indexMethod" />
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
export default {
    mixins: [table_mixin],
    props:['url','id'],
    data() {
        return {
            loading: true,
            api_resource:api_common.resource(this.url),
            orgCategory:[],
            queryDialogFormVisible:true,
            table_topHeight:276,
            template:{
				shiftTime(column,row){
                    if(row.color!==undefined){ 
                        if(row.color==='red'){ 
                            return  <span style="color:red" title={row.shiftTime}>{row.shiftTime}</span>
                        }else if(row.color==='orange'){
                            return  <span style="color:orange" title={row.shiftTime}>{row.shiftTime}</span>
                        }else{
                            return  <span title={row.shiftTime}>{row.shiftTime}</span>
                        }
                    }else{
                        return  <span title={row.shiftTime}>{row.shiftTime}</span>
                    }
				}
			}
        };
    },
    watch:{
        id(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
        url(){
			this.table_form.query.query = []
            this.table_form.currentpage = 1
            this.api_resource = api_common.resource(this.url)
            this.fetchMenu()
        }
    },
    methods: {
        async fetchTableData() {
            if(!this.id){
                return
            }
            this.table_loading = true;
            this.table_form.org_id = this.id
            const {rows , total }= await this.api_resource.get(this.table_form);
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
            // setTimeout(()=>{  
                this.fetchTableData();
            // },300)
		},
    },
    async created() {
        this.fetchMenu()
    }
};
</script>


