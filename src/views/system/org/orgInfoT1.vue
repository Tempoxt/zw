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
      :table_column="table_field"
      :table_form.sync="table_form"
      :showColumnfilter="false"
    ></table-header>

     <el-table
        ref="elTable"
    :data="table_data"
     border
    :header-cell-style="headerCellStyle"> 
        <el-table-column
            prop="showname"
            label="基本信息">
        </el-table-column>
        <el-table-column
            prop="_name">
        </el-table-column>
    </el-table>


     <el-dialog
      :title="'编辑'"
      :visible.sync="dialogFormVisible"
      class="public-dialog"
      v-el-drag-dialog
    >
      <div>
        <el-form ref="form" :model="form" label-width="90px" >
          <el-row :gutter="20">
              <el-col :span="12">
                <form-render :type="`input`" :field="{name:'简称'}" v-model="form.companyAbbreviation"/>
              </el-col>
              <el-col :span="12">
                <form-render :type="`input`" :field="{name:'全称'}" v-model="form.name"/>
              </el-col>
              <el-col :span="12">
                <form-render :type="`input`" :field="{name:'公司网站'}" v-model="form.web"/>
              </el-col>
              <!-- <el-col :span="12" v-for="field in table_data.filter(item=>item.iseditable)" :key="field.id">
                <form-render :type="`input`" :field="{name:field.showname}" v-model="form[field.name]"/>
              </el-col> -->
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
const api_resource = api_common.resource("org/company");
const defaultForm = ()=>({ldap_check:0,estate:1,role:[]})


export default {
    props:{
        currentMenuid:Number,
        url:{
          default:'org/company'
        },
        initurl:{
          default:'org/company'
        }
    },
    mixins: [table_mixin],
  data() {
    return {
      loading: true,
      form:defaultForm(),
      api_resource:api_common.resource(this.url),
      orgCategory:[],
      defaultForm,
      activeName:''
    };
  },
  watch:{
     currentMenuid:{
      handler(id){
        // this.table_form.menuid = id 
        this.fetchTableData();
      },
      immediate:true
    }
  },
  methods: {
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
          this.$set(item,'_name',data[item.name])
      })
      console.log(this.table_data,'this.table_data')
    },
    customEdit(){
      this.dialogFormVisible = true
      this.form = Object.assign({},this._table_data)
    },
    async handleFormSubmit(){
      let form = Object.assign({},this.form)
     
      await this.api_resource.update(this.currentMenuid,form)
      this.dialogFormVisible = false
      this.fetchTableData()
      this.$bus.$emit('updateData')
    },
    async initTable(){
      const { field, action } = await api_common.menuInit(this.initurl);
      this.table_data = field
      this.table_actions = action;
      this.table_field = field
      this._export_kv = true
      if(this.table_actions.find(a=>a.code === 'edit')){
        this.table_actions.find(a=>a.code === 'edit').code = 'customEdit'
      }
      
    }
  }
};
</script>
