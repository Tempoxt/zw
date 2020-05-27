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


<el-dialog
      :title="dialogStatus==='insert'?'添加':'编辑'"
      :visible.sync="dialogFormVisible"
      class="public-dialog"
      v-el-drag-dialog
    >
      <div v-if="dialogFormVisible">
        <el-form ref="form" :model="form" label-width="90px"  :rules="rules">
              <el-row :gutter="20" style="width:500px;margin:0 auto;padding-top:20px;">
                <!-- <el-col :span="24" v-if="url!=='org/departments'">
                  <form-render :type="`org`" :field="{name:'上级部门'}" v-model="form.parent_org"/>
                </el-col> -->
                <el-col :span="24">
                  <form-render :type="`select`" :field="{name:'小组',options:teamData}" v-model="form.teamID"  prop="teamID"/>
                </el-col>
                <el-col :span="24">
                  <form-render :type="`branchteam`" :field="{name:'上级小组',id:this.currentMenuid}" v-model="form.parentid"  prop="parentid"/>
                </el-col>
                <el-col :span="24">
                  <form-render :type="`select`" :field="{name:'区域',options:workGroupData}" v-model="form.workGroup"  prop="workGroup"/>
                </el-col>
                <el-col :span="24">
                  <form-render :type="`member`" :field="{name:'区域负责人',defaultName:form.teamManager__chineseName}" prop="teamManager"  v-model="form.teamManager"/>
                </el-col>
                <el-col :span="24">
                  <form-render :type="`member`" :field="{name:'主管',defaultName:form.teamCharger__chineseName}" prop=""  v-model="form.teamCharger"/>
                </el-col>
                <el-col :span="24">
                  <form-render :type="`member`" :field="{name:'小组组长',defaultName:form.teamMonitor__chineseName}" v-model="form.teamMonitor"/>
                </el-col>
                <el-col :span="24">
                  <form-render :type="`member`" :field="{name:'小组文员',defaultName:form.teamClerk__chineseName}" prop="teamClerk"  v-model="form.teamClerk"/>
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
const api_resource = api_common.resource("org/teams");
const defaultForm = ()=>({ldap_check:0,estate:1,role:[]})


export default {
    props:{
        currentMenuid:Number,
        url:{
          // default:'org/teams'
          default:'attendance/team/matrix'
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
        teamID: [
          { required: true, message: '请选择', trigger: 'blur' },
        ],
        teamMonitor: [
          { required: true, message: '请选择', trigger: 'blur' },
        ],
        teamClerk: [
          { required: true, message: '请选择', trigger: 'blur' },
        ],
        workGroup: [
          { required: true, message: '请选择', trigger: 'blur' },
        ],
        teamManager: [
          { required: true, message: '请选择', trigger: 'blur' },
        ],
      },
      teamData: [],
      workGroupData:[],
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
    async delete(){
      let rows = this.table_selectedRows.map(row=>row.id)
      let mes = await this.$request.delete('attendance/team/matrix/bluk?ids='+rows.join(','))
      this.$message.success(mes)
      this.fetchTableData()
      this.$bus.$emit('updateData')
    },
    async fetchTableData(config = {}) {
      const { target } = config
      if(target==='delete'){
        this.$bus.$emit('updateData')
      }
     this.table_loading = true;
    //  const {rows,total} =  await api_resource.find(this.currentMenuid,this.table_form);
    //  this.table_data =rows
    //  this.table_form.total = total
    this.table_data =  (await api_common.resource(this.url).get({
      id:this.currentMenuid,
      ...this.table_form
    })).rows;
   
     setTimeout(() => {
        this.table_loading = false;
      }, 300);
    },
    async add(){
      // this.form.parent_org = this.orgid
      this.form_math_sort()
      this.teamData = (await this.$request.get('org/teams?id='+this.currentMenuid)).map(o=> {return {label:o.name,value:o.id}})
      this.workGroupData = (await api_common.resource('officeaddress').get()).map(o=>{return {label:o.officeaddressname,value:o.id}})
      this.dialogFormVisible = true
      
    },
    async edit(){
      let row = this.table_selectedRows[0]
      this.form = await api_common.resource(this.url).find(row.id)
      this.dialogFormVisible = true
    },
    async handleFormSubmit(){
      await this.form_validate()
      let form = Object.assign({},this.form)
      delete form.parent;
      delete form.subs;
      form.user_role = form.role 
      delete form.role;
        if(this.isInsert){
            await this.throwFormError(await api_common.resource(this.url).create(form))
        }else{
            await this.throwFormError(await api_common.resource(this.url).update(form.id,form))
        }
        this.dialogFormVisible = false
        this.fetchTableData()
        this.$bus.$emit('updateData')
    }
  },
  async created() {
    const { field, action,table } = await api_common.menuInit("TeamMatrix");
    this.table_field = field;
    this.table_actions = action;
    this.table_config = table
  }
};
</script>
