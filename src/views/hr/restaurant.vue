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
      <div style="width:500px;margin:0 auto">
        <el-form ref="form" :model="form" label-width="110px" :rules="rules">
          <el-row :gutter="20">
           
            <el-col :span="24">
              <form-render :type="`input`" :field="{name:'餐厅名称'}" v-model="form.restaurantname" prop="restaurantname"/>
            </el-col>
            <el-col :span="24">
              <form-render :type="`input`" :field="{name:'实际座位数'}" v-model="form.seatnumber"  prop="seatnumber"/>
            </el-col>
            <el-col :span="24">
              <form-render
                :type="`select`"
                :field="{name:'餐厅类型',options:[{
                  value: 0,
                  label: '内部'
                },{
                  value: 1,
                  label: '外包'
                },{
                  value: 2,
                  label: '临时'
                }]}"
                v-model="form.restauranttype"
              />
            </el-col>
            <el-col :span="24">
              <form-render :type="`input`" :field="{name:'最大就餐人数'}" v-model="form.maxnumber" prop="maxnumber"/>
            </el-col>
            <el-col :span="24">
              <form-render
                :type="`select`"
                :field="{name:'所属厂区',options:officeaddress}"
                v-model="form.officeaddressid"
              />
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
              <form-render :type="`textarea`" :field="{name:'备注/说明'}" v-model="form.remark" placeholder="请输入"/>
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
const api_resource = api_common.resource("restaurant");
const defaultForm = function() {
  return {
    restauranttype: 0,
    estate:1,
    maxnumber:100
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
      table_height:window.innerHeight-236,
      defaultForm,
      officeaddress:[],
      rules:{
        restaurantname: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        seatnumber: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        maxnumber: [
          { required: true, message: '请输入', trigger: 'blur' },
        ]
      }
    };
  },
  watch:{

  },
  methods: {
    async handleFormSubmit(){
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
        await this.formInitData()
        this.form.officeaddressid = this.officeaddress[0].value
        this.dialogFormVisible = true
    },
    async formInitData(){
        this.officeaddress = (await api_common.resource("officeaddress").get()).map(item=>{
            return {
                value:item.id,
                label:item.officeaddressname
            }
        })
    },
   async edit(){
      let row = this.table_selectedRows[0]
      this.form = await api_resource.find(row.id)
      this.dialogFormVisible = true;
      this.formInitData()
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
    const { field, action,table } = await api_common.menuInit("restaurant");
    this.table_field = field;
    this.table_actions = action;
    this.table_config = table
    this.fetchTableData();
  }
};
</script>


