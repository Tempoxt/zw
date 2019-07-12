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
    ></table-header>
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
    <el-table-column type="index" :index="indexMethod" />
      <el-table-column
        :label="column.showname"
        v-for="(column) in table_field.filter(column=>!column.fed_isvisiable)"
        :key="column.id"
        :width="column.width||'auto'"
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
          <template v-else>
            <div v-html="scope.row[column.name]"></div>
          </template>
        </template>
      </el-table-column>
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
const api_resource = api_common.resource("log/operatelog");
export default {
  mixins: [table_mixin],
  data() {
    return {
      loading: true,
      form:{},
      api_resource,
      orgCategory:[],
      queryDialogFormVisible:true,
      table_topHeight:236,
    };
  },
  watch:{

  },
  methods: {
    async fetchTableData() {
     this.table_loading = true;
     const {rows , total }= await api_resource.get(this.table_form);
      this.table_data  = rows
       this.table_form.total = total
      setTimeout(() => {
        this.table_loading = false;
      }, 300);
    },
  },
  async created() {
    const { field, action,table } = await api_common.menuInit("log/operatelog");
    this.table_field = field;
    this.table_actions = action;
    this.table_config = table
    this.fetchTableData();
  }
};
</script>


