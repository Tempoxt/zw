  <template>



<div>
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

  <el-dialog
      :title="dialogStatus==='insert'?'添加':'编辑'"
      :visible.sync="dialogFormVisible"
      class="public-dialog"
      v-el-drag-dialog
    >
      <div v-if="dialogFormVisible">
        <el-form ref="form" :model="form" label-width="90px"  :rules="rules">
           <el-tabs v-model="activeName" class="tabs">
              <el-tab-pane label="基本信息" name="first">
                  <el-row :gutter="20" style="width:500px;margin:0 auto;padding-top:20px;">
                      <el-col :span="24">
                        <form-render :type="`input`" :field="{name:'分部名称'}" v-model="form.name" prop="name"/>
                      </el-col>
                        <el-col :span="24">
                        <form-render :type="`input`" :field="{name:'分部简称'}" v-model="form.subCompanyAbbreviation"/>
                      </el-col>
                      <el-col :span="24" v-if="org_type!==1">
                        <form-render :type="`org`" :field="{name:'上级分部'}" v-model="form.parent_org" :disabled="true"/>
                      </el-col>
                      <el-col :span="24">
                        <form-render :type="`input`" :field="{name:'分部⽹站'}" v-model="form.web"/>
                      </el-col>
                      <el-col :span="24">
                        <form-render type="img"  :data="{'upload_msg':'organization_logos'}" :field="{name:'logo'}" v-model="form.subCompanyLogo" />
                      </el-col>
                      <el-col :span="24">
                        <form-render :type="`number`" :field="{name:'显示排序'}" v-model="form.sort"/>
                      </el-col>
                       <el-col :span="24">
                        <form-render
                          :type="`radio`"
                          :field="{name:'状态',options:[{'label':'启用','value':1},{'label':'禁用','value':0}]}"
                          v-model="form.estate"
                        />
                      </el-col>
                    </el-row>
                </el-tab-pane>
              <el-tab-pane label="注册信息" name="second">
                  <el-row :gutter="20" style="width:500px;margin:0 auto;padding-top:20px;">
                    <el-col :span="24">
                      <form-render :type="`input`" :field="{name:'法定代表⼈'}" v-model="form.representative"/>
                    </el-col>
                    <el-col :span="24">
                      <form-render :type="`input`" :field="{name:'注册资本'}" v-model="form.registerCapital"/>
                    </el-col>
                      <el-col :span="24">
                      <form-render :type="`input`" :field="{name:'地址'}" v-model="form.subCompanyAddress"/>
                    </el-col>
                     <el-col :span="24">
                      <form-render :type="`day`" :field="{name:'注册时间'}" v-model="form.registerTime"/>
                    </el-col>
                  </el-row>
              </el-tab-pane>
              <el-tab-pane label="发票信息" name="third">
                <el-row :gutter="20" style="width:500px;margin:0 auto;padding-top:20px;">
                    <el-col :span="24">
                      <form-render :type="`input`" :field="{name:'公司名'}" v-model="form.subCompanyRegisterName"/>
                    </el-col>
                    <el-col :span="24">
                      <form-render :type="`input`" :field="{name:'纳税识别号'}" v-model="form.taxpayerNumber"/>
                    </el-col>
                    <el-col :span="24">
                      <form-render :type="`input`" :field="{name:'地址'}" v-model="form.subCompanyRegisterAddress"/>
                    </el-col>
                      <el-col :span="24">
                      <form-render :type="`input`" :field="{name:'电话'}" v-model="form.subCompanyTelephone"/>
                    </el-col>
                    <el-col :span="24">
                      <form-render :type="`input`" :field="{name:'开户⾏'}" v-model="form.bank"/>
                    </el-col>
                     <el-col :span="24">
                      <form-render :type="`input`" :field="{name:'账号'}" v-model="form.account"/>
                    </el-col>
                  </el-row>
              </el-tab-pane>
            </el-tabs>

        
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
      </div>
    </el-dialog>
</div>
</template>
<script>
import * as api_common from "@/api/common";
import * as api_org from "@/api/org";
import table_mixin from "@c/Table/table_mixin";
const api_resource = api_common.resource("org/company/subcompany");
const defaultForm = ()=>({ldap_check:0,estate:1,role:[]})


export default {
    props:{
        currentMenuid:Number,
        url:'',
        org_type:{},
        orgid:{}
    },
    mixins: [table_mixin],
  data() {
    return {
      loading: true,
      form:defaultForm(),
      api_resource:api_common.resource(this.url),
      orgCategory:[],
      defaultForm,
      activeName:'first',
      rules:{
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
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
    },
   'url'(){
     this.fetchTableData()
   }
    
  },
  methods: {
    async fetchTableData(config = {}) {
     const { target } = config
      if(target==='delete'){
        this.$bus.$emit('updateData')
      }
     this.table_loading = true;
    //  const {rows,total} =  await api_common.resource(this.url).find(this.currentMenuid,this.table_form);
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
    async handleFormSubmit(){
      let form = Object.assign({},this.form)
        if(this.isInsert){
            await api_common.resource(this.url).create(form)
        }else{
            await api_common.resource(this.url).update(form.id,form)
        }
        this.dialogFormVisible = false
        this.fetchTableData()
        this.$bus.$emit('updateData')
    },
    add(){
      this.dialogFormVisible = true
      this.form_math_sort()
      this.form.parent_org = this.orgid
      
    },
    async edit(){
      let row = this.table_selectedRows[0]
      this.form = await this.api_resource.find(row.id)
  
      // this.form = Object.assign({},row)
      
       this.dialogFormVisible = true
    }
  },
  async created() {
    const { field, action,config } = await api_common.menuInit(this.url);
    this.table_field = field;
    this.table_actions = action;
    // this.table_config = config
  }
};
</script>
<style lang="scss" scoped>
.tabs {
  /deep/ .el-tabs__nav-wrap  {
     &:after{
        background-color: #e4e7ed;
     }
  }
}
</style>
