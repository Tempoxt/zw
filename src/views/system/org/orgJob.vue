  <template>
  <ui-table ref="table"
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  >


    <table-header
    :table_actions="table_actions"
    :table_selectedRows="table_selectedRows"
    :table_form.sync="table_form"
    :table_column="table_field"
    @action="handleAction"
    ></table-header>
    <el-table 
        ref="elTable"
        @selection-change="handleChangeSelection"
        :data="table_data"
        border 
        style="width: 100%"
        :row-class-name="table_state_className"
        :header-cell-style="headerCellStyle"
        :height="table_height"
        @header-dragend="table_dragend"
        @sort-change="table_sort_change"
        v-loading="table_loading">
        <el-table-column 
        type="selection" 
        width="60" 
        class-name="table-column-disabled"
        :selectable="table_disable_selected"
        ></el-table-column>
        <el-table-column type="index" :index="indexMethod" />
        <each-table-column :table_field="table_field"/>
    </el-table>
    <!-- <table-pagination 
    :total="table_form.total" 
    :pagesize.sync="table_form.pagesize"
    :currentpage.sync="table_form.currentpage"
    @change="fetchTableData"
    :table_config="table_config"
    /> -->



  </ui-table>
</template>
<script>
import * as api_common from "@/api/common";
import * as api_org from "@/api/org";
import table_mixin from "@c/Table/table_mixin";
const api_resource = api_common.resource("org/company/subcompany");
const defaultForm = ()=>({ldap_check:0,estate:1,role:[]})


export default {
    props:{
        currentMenuid:Number
    },
    mixins: [table_mixin],
  data() {
    return {
      loading: true,
      form:defaultForm(),
      api_resource,
      orgCategory:[],
      defaultForm,
      activeName:''
    };
  },
  watch:{
      currentMenuid:{
      handler(id){
        this.fetchTableData();
      },
      immediate:true
    }
  },
  methods: {
    async fetchTableData() {
     this.table_loading = true;
    //  const {rows,total} =  await api_resource.find(this.currentMenuid,this.table_form);
    //  this.table_data =rows
    //  this.table_form.total = total
    this.table_data =  await api_resource.find(this.currentMenuid,this.table_form);
   
     setTimeout(() => {
        this.table_loading = false;
      }, 300);
    },
    async handleFormSubmit(){
      let form = Object.assign({},this.form)
      delete form.parent;
      delete form.subs;
      
      form.user_role = form.role 
      delete form.role;
        if(this.isInsert){
            await api_resource.create(form)
        }else{
            await api_resource.update(form.id,form)
        }
        this.dialogFormVisible = false
        this.fetchTableData()
    }
  },
  async created() {
    const { field, action,config } = await api_common.menuInit("org/company/subcompany");
    this.table_field = field;
    this.table_actions = action;
    // this.table_config = config
  }
};
</script>
