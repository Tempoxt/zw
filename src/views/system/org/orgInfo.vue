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
      :table_column="table_field.slice(1,table_field.length)"
      :table_form.sync="table_form"
    ></table-header>

     <el-table
    :data="[{a:'简称',b:'哈哈哈'},{a:'简称',b:'哈哈哈'}]"
     border
    :header-cell-style="headerCellStyle"> 
        <el-table-column
            prop="a"
            label="基本信息">
        </el-table-column>
        <el-table-column
            prop="b">
        </el-table-column>
    </el-table>
  </ui-table>
</template>
<script>
import * as api_common from "@/api/common";
import * as api_org from "@/api/org";
import table_mixin from "@c/Table/table_mixin";
const api_resource = api_common.resource("user");
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
      async currentMenuid(id){
         this.table_form.menuid = id 
         this.fetchTableData();
      }
  },
  methods: {
    filterNode(){},
    handleChangeNode(){},
    async fetchTableData() {
     this.table_loading = true;
     const {rows,total} =  await api_resource.get(this.table_form);
     this.table_data =rows
     this.table_form.total = total
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
        this.$bus.$emit('updateData')
    }
  },
  async created() {
    const { field, action } = await api_common.menuInit("user");
    this.table_field = field;
    this.table_actions = action;
    
  }
};
</script>
