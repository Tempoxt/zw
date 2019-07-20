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
        <el-date-picker
          v-model="table_form.month"
          type="month"
          size="medium"
          @change="fetchTableData"
          format="yyyy年MM月"
          value-format="yyyy-MM"
          placeholder="选择月份">
        </el-date-picker>
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
const api_resource = api_common.resource("security/fundlist");
import dayjs from 'dayjs'
const defaultForm = () => {
    return {
        estate:1,
        roomAdmin:''
    }
}
export default {
  mixins: [table_mixin],
  props:['id'],
  data() {
    return {
      loading: true,
      form:{},
      api_resource,
      orgCategory:[],
      queryDialogFormVisible:true,
      table_topHeight:236,
      adminList:[],
      defaultForm,
      roomAdminList:[],
      dormList:[],
      importUploadUrl:"/security/fund"
    };
  },
  watch:{
    id(){
      this.fetchTableData()
    }
  },
  methods: {
    async fetchTableData() {
     if(!this.id){
       return
     }
     this.table_loading = true;
     this.table_form.orgid = this.id
     
     const {rows , total }= await api_resource.get(this.table_form);
      this.table_data  = rows
       this.table_form.total = total
      setTimeout(() => {
        this.table_loading = false;
      }, 300);
    },
  },
  async created() {
    const { field, action,table } = await api_common.menuInit("security/fundlist");
    this.table_field = field;
    this.table_actions = action;
    this.table_config = table
    this.$set(this.table_form,'month',dayjs().format('YYYY-MM'))

    this.fetchTableData();
  }
};
</script>


