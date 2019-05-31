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
const api_resource = api_common.resource("lovefoundation/inexpendshow");
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
      table_height:window.innerHeight-236,
      adminList:[],
      defaultForm,
      itemData:[],
      totalData:[]
    };
  },
  watch:{
   
  },
  methods: {
    async fetchTableData() {
     this.table_loading = true;
     this.table_form.orgid = this.id
     const tableData = await api_resource.get(this.table_form);
     this.itemData = tableData.item;
     this.totalData = tableData.total;
     console.log(tableData,'tableData snndsjassosskdsd')
    //  const {rows , total }= await api_resource.get(this.table_form);
      // this.table_data  = rows
      // this.table_form.total = total
      // console.log( rows,' this.table_data  kxkcxjkcxjcxjcxkj')
      setTimeout(() => {
        this.table_loading = false;
      }, 300);
    },
    async initForm(){
        const {inItem,inMethod} = await this.$request.get('/lovefoundation/inexpendshow')
        console.log(inItem,'inItem lallalalalalalalalaal............')
        // this.form_inItem = inItem.map(o=>({label:o.text,value:o.value}))
        // this.form_inMethod = inMethod.map(o=>({label:o.text,value:o.value}))
    },
    // async add(){
    //     this.initForm()
    //     this.dialogFormVisible = true
    // },
    // async handleFormSubmit(){
    //     let form = Object.assign({},this.form)
    //     if(this.isInsert){
    //         await api_resource.create(form)
    //     }else{
    //         await api_resource.update(form.id,form)
    //     }
    //     this.dialogFormVisible = false
    //     this.fetchTableData()
    // },
    // async edit(){
    //   this.initForm()
    //   let row = this.table_selectedRows[0]
    //   this.form = await api_resource.find(row.id)
    //   this.dialogFormVisible = true;
    // },
  },
  async created() {
    const { field, action,table } = await api_common.menuInit("lovefoundation/inexpendshow");
    this.table_field = field;
    this.table_actions = action;
    this.table_config = table
    this.fetchTableData();
  }
};
</script>


