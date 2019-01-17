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
    <el-table
      :data="table_tree_formatData"
      :row-style="table_tree_showRow"
      :row-class-name="table_state_className"
      @selection-change="handleChangeSelection"
      border
      style="width: 100%"
      v-loading="table_loading"
      :header-cell-style="headerCellStyle"
      :height="table_height"
      @header-dragend="table_dragend"
    >
    <el-table-column 
      type="selection" 
      width="60" 
      class-name="table-column-disabled"
      :selectable="table_disable_selected"
      >
      </el-table-column>

    <el-table-column
        :label="column.showname"
        v-for="(column) in  table_field.filter(column=>!column.fed_isvisiable)"
        :key="column.id"
        :width="column.width||'auto'"
      >
      <template slot-scope="scope">
        <slot name="column" :row="scope.row" :column="scope.column" :$index="scope.$index" v-if="$slots.column"/>
        <table-column :row="scope.row" :elColumn="scope.column" :column="column"/>
      </template> 
    </el-table-column>
  </el-table>
  </ui-table>
</template>
<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";

export default {
  mixins: [table_mixin],
  data() {
    return {
      api_resource:api_common.resource(this.resource),
      queryDialogFormVisible:true
    };
  },
  methods: {
    async fetchTableData() {
        this.table_loading = true
        const {rows,total}  =  await this.api_resource.get(this.table_form);
        this.table_data = rows
        
        this.table_form.total = total
        setTimeout(()=>{
            this.table_loading = false
        },300)
    }
  },
  async created() {
    const { field, action } = await api_common.menuInit(this.resource);
    this.table_field = field;
    this.table_actions = action;
    this.fetchTableData();
  }
};
</script>

