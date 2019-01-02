  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_query"
  @query="querySubmit"
  >
    <el-dialog
      :title="dialogStatus==='insert'?'添加':'编辑'"
      :visible.sync="dialogFormVisible"
      class="public-dialog"
    >
      <div>
        <el-form ref="form" :model="form" label-width="90px" label-position="left">
          <el-row :gutter="20">
            <el-col :span="12">
              <form-render :type="`input`" :field="{name:'组织名称'}" v-model="form.name"/>
            </el-col>
            <el-col :span="12">
              <form-render :type="`leader`" :field="{name:'负责人',defaultName:form.org_manager_name}" v-model="form.org_manager"/>
            </el-col>
            <el-col :span="12">
              <form-render :type="`org`" :field="{name:'上级部门'}" v-model="form.parent_org"/>
            </el-col>
            <el-col :span="12">
              <form-render
                :type="`radio`"
                :field="{name:'状态',options:[{'label':'启用','value':1},{'label':'禁用','value':0}]}"
                v-model="form.mark_status"
              />
            </el-col>
            <el-col :span="12">
              <form-render :type="`select`" :field="{name:'组织分类',options:orgCategory}" v-model="form.org_type"/>
            </el-col>
            <el-col :span="12">
              <form-render :type="`number`" :field="{name:'排序'}" v-model="form.order"/>
            </el-col>
            <el-col :span="24">
              <form-render :type="`textarea`" :field="{name:'备注/说明'}" v-model="form.remark"/>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
      </div>
    </el-dialog>


    <table-header
      :table_actions="table_actions"
      :table_selectedRows="table_selectedRows"
      :table_column="table_field.slice(1,table_field.length)"
      @action="handleAction"
    ></table-header>
    <tree-table
      :data="table_data"
      v-loading="loading"
      ref="treeTable"
      :selectedRows.sync="table_selectedRows"
      :label="table_field[0] && table_field[0].showname"
    >
      <el-table-column
        :label="column.showname"
        v-for="(column,index) in table_field.slice(1,table_field.length)"
        :key="column.id"
        v-if="!column.isvisiable"
      >
        <template slot-scope="scope">
          <template v-if="column.name==='menutype'">
            <el-tag v-if="scope.row['menutype']===1" size="mini">目录</el-tag>
            <el-tag type="success" v-else size="mini">菜单</el-tag>
          </template>
          <template v-else-if="column.name==='mark_status'">{{scope.row['mark_status']===1?'启用':'禁用'}}</template>
          <template v-else>{{scope.row[column.name]}}</template>
        </template>
      </el-table-column>
    </tree-table>
  </ui-table>
</template>
<script>
import * as api_common from "@/api/common";
import * as api_org from "@/api/org";
import table_mixin from "@c/Table/table_mixin";
const api_resource = api_common.resource("org");
const defaultForm = ()=>({order:1,mark_status:1})
export default {
  mixins: [table_mixin],
  data() {
    return {
      loading: true,
      form:{},
      api_resource,
      orgCategory:[],
      defaultForm,
      queryDialogFormVisible:true
    };
  },
  watch:{
      async 'form.parent_org'(id){
          let orgCategory =  await api_org.category(id)
          this.orgCategory = orgCategory.map(item=>{
              return {
                  value: item.id,
                  label: item.name
              }
          })
        //   this.form.org_type = orgCategory[0].id
         
      }
  },
  methods: {
    add(){
      this.dialogFormVisible = true;
    },
    edit(){
      let rows = this.$refs.treeTable.getSelectedRows();
      if (rows.length !== 1) {
        return;
      }
      let row = this.$refs.treeTable.findRowById(rows[0]);
      this.form = Object.assign({}, row);
      console.log(this.form,'aaa')
      this.dialogFormVisible = true;
    },
    async fetchTableData() {
     this.loading = true;
      this.table_data = await api_resource.get(this.table_query);
      this.$refs.treeTable.clearSelectedRows();
      setTimeout(()=>{
        this.$refs.treeTable.showAll()
      },0)
      setTimeout(() => {
        this.loading = false;
      }, 300);
    },
    async handleFormSubmit(){
      let form = Object.assign({},this.form)
      delete form.parent;
      delete form.subs;
      
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
    const { field, action } = await api_common.menuInit("org");
    this.table_field = field;
    this.table_actions = action;
    this.fetchTableData();
    console.log(field,'field')
  }
};
</script>


