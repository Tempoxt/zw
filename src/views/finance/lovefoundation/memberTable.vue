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
        <el-form ref="form" :model="form" label-width="100px">
          <el-row :gutter="20">
           <el-col :span="24">
              <form-render :type="`select`" :field="{name:'宿舍',options:dormList}" v-model="form.dorm"/>
            </el-col>
           
             <el-col :span="24">
              <form-render :type="`input`" :field="{name:'房屋编码'}" v-model="form.houseNumber" />
            </el-col>
             <el-col :span="24">
              <form-render :type="`input`" :field="{name:'房屋编号'}" v-model="form.roomName"/>
            </el-col>
             <el-col :span="24">
              <form-render :type="`input`" :field="{name:'床位数'}" v-model="form.totalBeds"/>
            </el-col>

         
             <el-col :span="24">
              <form-render :type="`select`" :field="{name:'室长',options:roomAdminList}" v-model="form.roomAdmin"/>
            </el-col> 
          <el-col :span="24">
              <form-render :type="`input`" :field="{name:'房租'}" v-model="form.rent"/>
            </el-col>
           <el-col :span="24">
              <form-render :type="`input`" :field="{name:'电表初始读数'}" v-model="form.initalElectric"/>
            </el-col>
            <el-col :span="24">
              <form-render :type="`input`" :field="{name:'水表初始读数'}" v-model="form.initalWater"/>
            </el-col>
            <el-col :span="24">
              <form-render
                :type="`radio`"
                :field="{name:'类别',options:[{
                  value: 1,
                  label: '男生宿舍'
                },{
                  value: 0,
                  label: '女生宿舍'
                }]}"
                v-model="form.dormType"
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
    <el-table-column type="index" :index="indexMethod" width="70" label="序号"/>
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
const api_resource = api_common.resource("lovefoundation/member");
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
      table_topHeight:276,
      adminList:[],
      defaultForm,
      roomAdminList:[],
      dormList:[]
    };
  },
  watch:{
    id(){
      this.fetchTableData()
    }
  },
  methods: {
    async fetchTableData() {
     if(!this.id){
       return
     }
     if(this.table_form.keyword!=undefined&&this.table_form.keyword!=''){
       this.table_form.isMember = 0;
     }else if(this.table_form.query.query.length!=0){
       this.table_form.isMember = 0;
     }else{
        this.table_form.isMember = 1;
     }
     
     this.table_loading = true;
     this.table_form.orgid = this.id
     const {rows , total }= await api_resource.get(this.table_form);
      this.table_data  = rows
       this.table_form.total = total
      setTimeout(() => {
        this.table_loading = false;
      }, 300);
    },
    async add(){
        this.dormList = (await api_common.resource('dormitory/dorm').get()).rows.map(o=>{
            return {
                label:o.dormName,
                value:o.id
            }
        })
        this.roomAdminList = (await api_common.resource('dormitory/dorm/dormadmin').get({roomId:this.id})).rows.map(o=>{
            return {
                label:o.chineseName,
                value:o.id
            }
        })
        this.form.dorm = this.id
        this.dialogFormVisible = true
    },
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
    async edit(){
        this.dormList = (await api_common.resource('dormitory/dorm').get()).rows.map(o=>{
            return {
                label:o.dormName,
                value:o.id
            }
        })
         this.roomAdminList = (await api_common.resource('dormitory/dorm/dormadmin').get({roomId:this.id})).rows.map(o=>{
            return {
                label:o.chineseName,
                value:o.employeeID
            }
        })
      let row = this.table_selectedRows[0]
      this.form = await api_resource.find(row.id)
      this.dialogFormVisible = true;
    },
  },
  async created() {
    const { field, action,table } = await api_common.menuInit("lovefoundation/member");
    this.table_field = field;
    this.table_actions = action;
    this.table_config = table
    this.table_form.isMember = 1;
    this.fetchTableData();
  }
};
</script>


