  <template>
  <ui-table ref="table"
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  >
      <el-dialog
      :title="dialogStatus==='insert'?'添加':'编辑'"
      :visible.sync="dialogFormVisible"
      class="public-dialog"
      v-el-drag-dialog
    >
      <div>
            <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
            </el-input>
            <!-- <el-tree
            class="filter-tree"
            :data="data2"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            ref="tree2">
            </el-tree> -->

      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
      </div>
    </el-dialog>


    <table-header
      :table_actions="table_actions"
      :table_selectedRows="table_selectedRows"
      @action="handleAction"
      :table_column="table_field.slice(1,table_field.length)"
      :table_form.sync="table_form"
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
        ref="table_pagination"
        />
  </ui-table>
</template>
<script>
import * as api_common from "@/api/common";
import * as api_org from "@/api/org";
import table_mixin from "@c/Table/table_mixin";
const api_resource = api_common.resource("restaurant/restaurantmember");
const defaultForm = ()=>({ldap_check:0,estate:1,role:[]})

const cityOptions = ['上海', '北京', '广州', '深圳'];

export default {
    props:{
        currentMenuid:{},
        restaurantid_id:{},
        parent_nodeid:{}
    },
    mixins: [table_mixin],
  data() {
    return {
        filterText:'',
      loading: true,
      form:defaultForm(),
      api_resource,
      orgCategory:[],
      defaultForm,
      activeName:'first',
      activeName2:'first',
      checkedCities:[],
      cities: cityOptions,
      radio:'',
      checkAll:[],
      isIndeterminate:'',
      data2:[
          {
              name:123,
              subs:[
                  {
                       name:123
                  }
              ]
          }
      ],
    //   table_form:defaultTableForm()
    };
  },
  watch:{
      async currentMenuid(id){
        //  this.table_form = defaultTableForm()
        if(id){
          delete this.table_form.restaurantid_id
           this.table_form.meallevelid = this.currentMenuid
           this.table_form.restaurantid_id = this.parent_nodeid
            this.$refs.table_pagination.reset()
            this.fetchTableData();
        }
        
       
      },
     restaurantid_id(id){
        if(id){
            delete this.table_form.meallevelid
            this.table_form.restaurantid_id = id==='all'?0:id
            this.$refs.table_pagination.reset()
            this.fetchTableData();
        }
      },
      parent_nodeid(id){
         if(id){
          delete this.table_form.restaurantid_id
           this.table_form.meallevelid = this.currentMenuid
           this.table_form.restaurantid_id = this.parent_nodeid
            this.$refs.table_pagination.reset()
            this.fetchTableData();
        }
      }
  },
  methods: {
    add(){
     
      this.dialogFormVisible = true;
    },
    async edit(){
      let row = this.table_selectedRows[0]
      this.form = await api_resource.find(row.id);
      this.form.role = this.form.user_roleid
      // .map(item=>item.roleid)
    
      this.dialogFormVisible = true;
    },
    filterNode(){},
    handleChangeNode(){},
    async fetchTableData() {
     this.table_loading = true;
     const {rows,total} =  await api_resource.get(this.table_form);
     this.table_data =rows
     this.table_form.total = total
    //   this.$refs.treeTable.clearSelectedRows();
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
    const { field, action } = await api_common.menuInit("restaurant/restaurantmember");
    this.table_field = field;
    this.table_actions = action;
  }
};
</script>
