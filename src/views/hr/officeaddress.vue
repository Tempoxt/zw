  <template>
  <ui-table 
  class="public-table-container"
  ref="table" 
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
      <div style="width:500px;margin:0 auto">
        <el-form ref="form" :model="form" label-width="100px">
          <el-row :gutter="20">
           
            <el-col :span="24">
              <form-render :type="`input`" :field="{name:'办公地点名称'}" v-model="form.officeaddressname"/>
            </el-col>
             <el-col :span="24">
              <form-render :type="`map`" :field="{name:'坐标'}" v-model="form.coordinated" @amapSubmit="amapSubmit"/>
            </el-col>
             <el-col :span="24">
              <form-render :type="`input`" :field="{name:'所属城市'}" v-model="form.city"/>
            </el-col>
             <el-col :span="24">
              <form-render  :type="`select`"  :field="{name:'银行卡地点',options:bankList}" v-model="form.bank"/>
            </el-col>

             <el-col :span="24">
              <form-render :type="`input`" :field="{name:'详细地址'}" v-model="form.officeaddressdetail"/>
            </el-col>
            
            <el-col :span="24">
              <form-render
                :type="`radio`"
                :field="{name:'记录状态',options:[{
                  value: 1,
                  label: '启用'
                },{
                  value: 0,
                  label: '禁用'
                }]}"
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



    <table-header
      :table_actions="table_actions"
      :table_selectedRows="table_selectedRows"
      @action="handleAction"
      :table_form.sync="table_form"
      :table_column="table_field"
    ></table-header>
    <el-table
        ref="elTable"
      @selection-change="handleChangeSelection"
      :row-class-name="table_state_className"
      :data="table_data"
      border
      style="width: 100%"
      v-loading="table_loading"
      :header-cell-style="headerCellStyle"
      :height="table_height"
      @header-dragend="table_dragend"
      @sort-change="table_sort_change"
    >
    <el-table-column  type="selection" width="60" class-name="table-column-disabled" :selectable="table_disable_selected">
    </el-table-column>
    <el-table-column type="index" :index="indexMethod" />
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
const api_resource = api_common.resource("officeaddress");
const defaultForm = function() {
  return {
    officeaddressdetail:'',
    city:'',
    estate:1,

  };
};
export default {
  mixins: [table_mixin],
  data() {
    return {
      loading: true,
      form:{},
      api_resource,
      orgCategory:[],
      queryDialogFormVisible:true,
      defaultForm,
      officeaddress:[],
      bankList:[]
    };
  },
  watch:{

  },
  methods: {
    amapSubmit(result){
        this.$nextTick(()=>{
             this.form.city = result.addressComponent.city
           this.form.officeaddressdetail = result.formattedAddress
        })
    },
    async handleFormSubmit(){
        await this.form_validate()
        let form = Object.assign({},this.form)
        if(this.isInsert){
            await api_resource.create(form)
        }else{
            await api_resource.update(form.id,form)
        }
        this.dialogFormVisible = false
        this.fetchTableData()
   },
    async add(){
      this.initForm()
        this.dialogFormVisible = true
    },
   async initForm(){
    this.bankList = await api_common.getTag('AddBankCard')
    console.log(this.bankList,'this.bankList')
   },
   async edit(){
     this.initForm()
      let row = this.table_selectedRows[0]
      this.form = await api_resource.find(row.id)
      this.dialogFormVisible = true;

    },
    async fetchTableData() {
     this.table_loading = true;
     const {rows , total }= await api_resource.get(this.table_form);
      this.table_data  = rows
      this.table_form.total = total
      setTimeout(() => {
        this.table_loading = false;
      }, 300);
    },
  },
  async created() {
    const { field, action,table } = await api_common.menuInit("officeaddress");
    this.table_field = field;
    this.table_actions = action;
    this.table_config = table
    this.fetchTableData();
  }
};
</script>


