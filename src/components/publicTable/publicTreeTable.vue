  <template>
  <ui-table ref="table" 
    :table_column="table_field" 
    :table_query.sync="table_form.query"
    @query="querySubmit"
  >
  <slot />
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

    <el-table-column :label="table_field[0] && table_field[0].showname" :width="table_field[0]&&table_field[0].width||'auto'">
      <template slot-scope="scope">
        <span v-for="space in scope.row._level" :key="space" class="ms-tree-space"/>
        <span v-if="table_tree_iconShow(0,scope.row)" class="tree-ctrl" @click="table_tree_toggleExpanded(scope.$index)">
          <i
            :class="['el-icon-caret-right',{'sub-open':scope.row._expanded}]"
            style="color:#666;font-size:16px;margin-right: 6px;"
          ></i>
        </span>
        <i :class="scope.row.icon" v-if="table_tree_iconShow(0,scope.row)"></i>
        <i :class="scope.row.icon" v-else></i>
        <span v-html="scope.row.name"></span>
      </template>
    </el-table-column>

    <el-table-column
        :label="column.showname"
        v-for="(column) in  table_field.slice(1,table_field.length).filter(column=>!column.fed_isvisiable)"
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
    async initTable(){
      if(this._initTable){
         const { field, action } = await this._initTable(this.resource);
          this.table_field = field;
          this.table_actions = action;
      }else{
         const { field, action } = await api_common.menuInit(this.resource);
          this.table_field = field;
          this.table_actions = action;
      }
     
      this.fetchTableData();
    },
    async fetchTableData() {
    this.table_loading = true;
    if(this._fetchTableData){
     this.table_data = await this._fetchTableData(this.table_form)
    }else{
      this.table_data = await this.api_resource.get(this.table_form);
    }
    this.$emit('load')
      setTimeout(() => {
        this.table_loading = false;
      }, 300);
    }
  },
  async created() {
    if(this.initTable){
       this.initTable();
    }
  }
};
</script>

