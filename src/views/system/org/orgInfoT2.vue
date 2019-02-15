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
    :data="table_data.filter(data=>['subCompanyAbbreviation','name','subCompanyLogo','web','number'].includes(data.name))"
     border
    :header-cell-style="headerCellStyle"> 
        <el-table-column
            prop="showname"
            label="基本信息">
        </el-table-column>
        
        <el-table-column
            prop="b">
            <template slot-scope="scope">
              <span v-if="scope.row.name === 'subCompanyLogo'"><img :src="scope.row.b" width="50"/></span>
              <span v-else>{{scope.row.b}}</span>
        </template>
        </el-table-column>
    </el-table>

    <el-table
    :data="table_data.filter(data=>['representative','registerCapital','registerTime','subCompanyAddress'].includes(data.name))"
     border
    :header-cell-style="headerCellStyle"> 
        <el-table-column
            prop="showname"
            label="注册信息">
        </el-table-column>
        <el-table-column
            prop="b">
        </el-table-column>
    </el-table>

    <el-table
    :data="table_data.filter(data=>['subCompanyRegisterName','taxpayerNumber','subCompanyRegisterAddress','subCompanyTelephone','bank'].includes(data.name))"
     border
    :header-cell-style="headerCellStyle"> 
        <el-table-column
            prop="showname"
            label="发票信息">
        </el-table-column>
        <el-table-column
            prop="b">
        </el-table-column>
    </el-table>


<el-dialog
      :title="'编辑'"
      :visible.sync="dialogFormVisible"
      class="public-dialog"
      v-el-drag-dialog
    >
      <div v-if="dialogFormVisible">
        <el-form ref="form" :model="form" label-width="90px" label-position="left">
           <el-tabs v-model="activeName" class="tabs">
              <el-tab-pane label="基本信息" name="first">
                  <el-row :gutter="20" style="width:500px;margin:0 auto;padding-top:20px;">
                      <el-col :span="24">
                        <form-render :type="`input`" :field="{name:'分部名称'}" v-model="form.name"/>
                      </el-col>
                       <el-col :span="24">
                        <form-render :type="`input`" :field="{name:'分部简称'}" v-model="form.subCompanyAbbreviation"/>
                      </el-col>
                      <el-col :span="24">
                        <form-render :type="`org`" :field="{name:'上级分部'}" v-model="form.parent_org"/>
                      </el-col>
                      <el-col :span="24">
                        <form-render :type="`input`" :field="{name:'分部⽹站'}" v-model="form.web"/>
                      </el-col>
                      <el-col :span="24">
                        <form-render type="img" :data="{'upload_msg':'organization_logos'}" :field="{name:'logo'}" v-model="form.subCompanyLogo" />
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



    <!-- <el-dialog
      :title="'编辑'"
      :visible.sync="dialogFormVisible"
      class="public-dialog"
      v-el-drag-dialog
    >
      <div>
        <el-form ref="form" :model="form" label-width="100px" label-position="left">
          <el-row :gutter="20">
              <el-col :span="12">
                <form-render :type="`input`" :field="{name:'开户行及账号'}" v-model="form.companyAbbreviation"/>
              </el-col>
              <el-col :span="12">
                <form-render :type="`input`" :field="{name:'全称'}" v-model="form.name"/>
              </el-col>
              <el-col :span="12">
                <form-render :type="`input`" :field="{name:'注册资本'}" v-model="form.web"/>
              </el-col>
              <el-col :span="12">
                <form-render :type="`day`" :field="{name:'注册时间'}" v-model="form.web"/>
              </el-col>
              <el-col :span="12">
                <form-render :type="`input`" :field="{name:'法人代表'}" v-model="form.web"/>
              </el-col>
              <el-col :span="12">
                <form-render :type="`input`" :field="{name:'简称'}" v-model="form.web"/>
              </el-col>
              <el-col :span="12">
                <form-render :type="`input`" :field="{name:'地址'}" v-model="form.web"/>
              </el-col>
              <el-col :span="12">
                <form-render :type="`input`" :field="{name:'公司名'}" v-model="form.web"/>
              </el-col>
              <el-col :span="12">
                <form-render :type="`input`" :field="{name:'电话'}" v-model="form.web"/>
              </el-col>
              <el-col :span="12">
                <form-render :type="`input`" :field="{name:'纳税识别号'}" v-model="form.web"/>
              </el-col>
              <el-col :span="12">
                <form-render :type="`input`" :field="{name:'公司网站'}" v-model="form.web"/>
              </el-col>
            </el-row>

        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
      </div>
    </el-dialog> -->


  </ui-table>
</template>
<script>
import * as api_common from "@/api/common";
import * as api_org from "@/api/org";
import table_mixin from "@c/Table/table_mixin";
const api_resource = api_common.resource("org/subcompany");
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
      activeName:'first',
    };
  },
  watch:{
     currentMenuid:{
      handler(id){
        // this.table_form.menuid = id 
        this.fetchTableData();
      },
      immediate:true
    },

  },
  methods: {
    log(scope){
      console.log(scope,'scope')
    },
    filterNode(){},
    handleChangeNode(){},
    async fetchTableData() {
     this.table_loading = true;
     const data =  await this.api_resource.find(this.currentMenuid);
     this._table_data = data
     if(!this.table_data.length){
       await this.initTable()
     }
      this.table_data.forEach(item=>{
          this.$set(item,'b',data[item.name])
      })
    
    },
    customEdit(){
      this.dialogFormVisible = true
      this.form = Object.assign({},this._table_data)
     
     
    },
    async handleFormSubmit(){
      let form = Object.assign({},this.form)
      delete form.parent;
      delete form.subs;
      await api_resource.update(form.id,form)
      this.dialogFormVisible = false
      this.fetchTableData()
      this.$bus.$emit('updateData')
    },
    async initTable(){
      const { field, action } = await api_common.menuInit("org/subcompany");
      this.table_data = field
      this.table_actions = action;
      if(this.table_actions.find(a=>a.code === 'edit')){
        this.table_actions.find(a=>a.code === 'edit').code = 'customEdit'
      }

    }
  }
};
</script>
