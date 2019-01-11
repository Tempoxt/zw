  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  
  >


    <table-header
      :table_actions="table_actions"
      :table_selectedRows="table_selectedRows"
      :table_column="table_field.slice(1,table_field.length)"
      @action="handleAction"
      :table_form.sync="table_form"
    ></table-header>
    <tree-table
      :data="table_data"
      v-loading="loading"
      ref="treeTable"
      :selectedRows.sync="table_selectedRows"
      :label="table_field[0] && table_field[0].showname"
      :table_actions="table_actions"
      
    >
      <el-table-column
        :label="column.showname"
        v-for="(column) in table_field.slice(1,table_field.length).filter(column=>!column.fed_isvisiable)"
        :key="column.id"
      >
        <template slot-scope="scope">
          <template v-if="column.name==='menutype'">
            <el-tag v-if="scope.row['menutype']===1" size="mini">目录</el-tag>
            <el-tag type="success" v-else size="mini">菜单</el-tag>
          </template>
          <template v-else-if="column.name==='estate'">
            <span v-if="scope.row['estate']===1">启用</span>
            <span v-else class="text-danger">禁用</span>
          </template>
          <template v-else>{{scope.row[column.name]}}</template>
        </template>
      </el-table-column>
    </tree-table>
     <table-pagination 
        :total="table_form.total" 
        :pagesize.sync="table_form.pagesize"
        :currentpage.sync="table_form.currentpage"
        @change="fetchTableData"
    />
  </ui-table>
</template>
<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
const api_resource = api_common.resource("log/opratelog");
export default {
  mixins: [table_mixin],
  data() {
    return {
      loading: true,
      form:{},
      api_resource,
      orgCategory:[],
      queryDialogFormVisible:true
    };
  },
  watch:{

  },
  methods: {
    async fetchTableData() {
     this.loading = true;
     const {rows , total }= await api_resource.get(this.table_form);
      this.table_data  = rows
       this.table_form.total = total
      setTimeout(() => {
        this.loading = false;
      }, 300);
    },
  },
  async created() {
    const { field, action } = await api_common.menuInit("log/opratelog");
    this.table_field = field;
    this.table_actions = action;
    this.fetchTableData();
  }
};
</script>


