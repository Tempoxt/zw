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


<el-dialog
      :title="dialogStatus==='insert'?'添加':'编辑'"
      :visible.sync="dialogFormVisible"
      class="public-dialog"
      v-el-drag-dialog
    >
      <div v-if="dialogFormVisible">
        <el-form ref="form" :model="form" label-width="90px"  :rules="rules">
              <el-row :gutter="20" style="width:500px;margin:0 auto;padding-top:20px;">
                <el-col :span="24">
                  <form-render :type="`input`" placeholder="自动" :field="{name:'部⻔编号'}" v-model="form.deptcode" prop="deptcode" :disabled="true" />
                </el-col>
                <el-col :span="24">
                  <form-render :type="`input`" :field="{name:'部⻔名称'}" v-model="form.name"  prop="name"/>
                </el-col>
                <el-col :span="24" v-if="url!=='org/departments'">
                  <form-render :type="`org`" :field="{name:'上级部门'}" v-model="form.parent_org" :disabled="true"/>
                </el-col>
                <el-col :span="24">
                  <form-render :type="`subdepart`" :field="{name:'部门分管',defaultName:form.departmentLeaderName}" v-model="form.departmentLeader"/>
                </el-col>
                <el-col :span="24">
                  <form-render :type="`subdepart`" :field="{name:'部门负责人',defaultName:form.orgManagerName}" v-model="form.orgManager"/>
                </el-col>
                <el-col :span="24">
                  <form-render :type="`subdepart`" :field="{name:'部门主管',defaultName:form.departmentDirectorName}" v-model="form.departmentDirector"/>
                </el-col>
                
                <el-col :span="24">
                  <form-render :type="`subdepart`" :field="{name:'部门专员',defaultName:form.departmentCommissionerName}" v-model="form.departmentCommissioner"/>
                </el-col>
                
                <el-col :span="24">
                  <form-render :type="`number`" :field="{name:'显示排序'}" v-model="form.sort" placeholder=""/>
                </el-col>
                <el-col :span="24">
                  <form-render
                    :type="`radio`"
                    :field="{name:'状态',options:[{'label':'启用','value':1},{'label':'禁用','value':0}]}"
                    v-model="form.estate"
                  />
                </el-col>
                <el-col :span="24">
                  <form-render :type="`textarea`" autosize :row="1" :field="{name:'备注/说明'}" v-model="form.remark" placeholder="请输入"/>
                </el-col>
              </el-row>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
      </div>
    </el-dialog>



  </ui-table>
</template>
<script>
import * as api_common from "@/api/common";
import * as api_org from "@/api/org";
import table_mixin from "@c/Table/table_mixin";
const api_resource = api_common.resource("org/departments");
const defaultForm = ()=>({ldap_check:0,estate:1,role:[]})
export default {
    props:{
        currentMenuid:Number,
        url:{
          default:'org/departments'
        },
        orgid:{}
    },
    mixins: [table_mixin],
  data() {
    return {
      loading: true,
      form:defaultForm(),
      api_resource,
      orgCategory:[],
      defaultForm,
      activeName:'',
      rules:{
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
      }
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
    async fetchTableData(config = {}) {
      const { target } = config
      if(target==='delete'){
        this.$bus.$emit('updateData')
      }
     this.table_loading = true;
    //  const {rows,total} =  await api_resource.find(this.currentMenuid,this.table_form);
    //  this.table_data =rows
    //  this.table_form.total = total
    this.table_data =  await api_common.resource(this.url).get({
      id:this.currentMenuid,
      ...this.table_form
    });
   
     setTimeout(() => {
        this.table_loading = false;
      }, 300);
    },
    add(){
      this.form.parent_org = this.orgid
      this.form_math_sort()
      
      this.dialogFormVisible = true
      
    },
    async edit(){
      let row = this.table_selectedRows[0]
      this.form = await api_common.resource(this.url).find(row.id)
      this.dialogFormVisible = true
    },
    async handleFormSubmit(){
      let form = Object.assign({},this.form)
      delete form.parent;
      delete form.subs;
      
      form.user_role = form.role 
      delete form.role;
        if(this.isInsert){
            await api_common.resource(this.url).create(form)
        }else{
            await api_common.resource(this.url).update(form.id,form)
        }
        this.dialogFormVisible = false
        this.fetchTableData()
        this.$bus.$emit('updateData')
    }
  },
  async created() {
    const { field, action,config } = await api_common.menuInit("org/departments");
    this.table_field = field;
    this.table_actions = action;
    // this.table_config = config
  }
};
</script>
