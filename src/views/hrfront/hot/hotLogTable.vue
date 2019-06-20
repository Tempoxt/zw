  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  
  >

<el-dialog
      title="加入"
      :visible.sync="dialogForm3Visible"
      class="public-dialog"
      v-el-drag-dialog
      width="800px"
    >

    <el-form ref="form" :model="form" label-width="100px" :inline="true">
        <el-form-item label="有效起始日期">
          <el-date-picker
              v-model="form3.stayStart"
              type="date"
               value-format="yyyy-MM-dd"
              placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
         <el-form-item label="有效结束日期">
          <el-date-picker
              v-model="form3.stayEnd"
              type="date"
               value-format="yyyy-MM-dd"
              placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

    </el-form>

      <OrgSelect v-model="form3.ids" ref="OrgSelect" v-if="dialogForm3Visible"/>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm3Visible = false">取 消</el-button>
        <el-button type="primary" @click="handleForm3Submit">确 定</el-button>
      </div>
    </el-dialog>



  <el-dialog
      title="高温津贴设置"
      :visible.sync="dialogForm2Visible"
      class="public-dialog"
      v-el-drag-dialog
      width="500px"
    >
      <div style="width:400px;margin:0 auto">
        <el-form ref="form" :model="form2" label-width="100px">
          <el-row :gutter="20">
             <el-col :span="24">
              <form-render :type="`input`" :field="{name:'高温津贴'}" v-model="form2.hotAllowance" />
            </el-col>
          
             <el-col :span="24">

                <el-form-item label="津贴月份">
                    <div style="display:flex">
                         <el-select v-model="form2.startMonth" placeholder="请选择" >
                                <el-option
                                v-for="item in 12"
                                :key="item"
                                :label="item+'月'"
                                :value="item">
                                </el-option>
                            </el-select>    
                            <span style="padding:0 10px;">至</span>   
                            <el-select v-model="form2.endMonth" placeholder="请选择">
                                <el-option
                                v-for="item in 12"
                                :key="item"
                                :label="item+'月'"
                                :value="item">
                                </el-option>
                            </el-select>      
                    </div>  
                </el-form-item>
            </el-col>   
            
          </el-row>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm2Visible = false">取 消</el-button>
        <el-button type="primary" @click="handleForm2Submit">确 定</el-button>
      </div>
    </el-dialog>



  <el-dialog
      :title="dialogStatus==='insert'?'添加':'编辑'"
      :visible.sync="dialogFormVisible"
      class="public-dialog"
      v-el-drag-dialog
      width="500px"
    >
      <div style="width:400px;margin:0 auto">
        <el-form ref="form" :model="form" label-width="100px">
          <el-row :gutter="20">
             <el-col :span="24">
              <form-render :type="`input`" :field="{name:'员工姓名'}" v-model="form.chineseName" disabled/>
            </el-col>
             <el-col :span="24">
              <form-render :type="`input`" :field="{name:'有效起始日期'}" v-model="form.stayStart" disabled/>
            </el-col>
             <el-col :span="24">
              <form-render :type="`day`" :field="{name:'有效结束日期'}" v-model="form.stayEnd"/>
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
    >
          <div style="padding-left:10px">
            <dateLap v-model="table_form.dateLap" @change="fetchTableData"/>
          </div>
    </table-header>
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
        :table_config="table_config"
    />
  </ui-table>
</template>
<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
const api_resource = api_common.resource("hot/record");
import dateLap from '@/components/Table/DateLap'
import OrgSelect from '@/components/Org/OrgSelect'
const defaultForm = () => {
    return {
        estate:1,
        sort:1
    }
}
export default {
  mixins: [table_mixin],
  props:['id'],
  components:{
      dateLap,
      OrgSelect
  },
  data() {
    return {
      loading: true,
      form:{},
      api_resource,
      orgCategory:[],
      queryDialogFormVisible:true,
      table_height:window.innerHeight-236,
      adminList:[],
      defaultForm,
      roomAdminList:[],
      dormList:[],
      dialogForm2Visible:false,
      dialogForm3Visible:false,
      form2:{},
      form3:{}
    };
  },
  watch:{
    id(){
      this.fetchTableData()
    }
  },
  methods: {
   
    async set(){
        this.form2 = await this.$request.get('/hot/recordbasic')
        this.dialogForm2Visible = true
    },
    async handleForm2Submit(){
        await this.$request.put('/hot/recordbasic',this.form2)
        this.dialogForm2Visible = false
    },
    async handleForm3Submit(){
      this.form3.ids = this.$refs.OrgSelect.getIdsResult()
      await this.$request.post('/hot/record',this.form3)
      this.dialogForm3Visible = false
			this.fetchTableData()
    },
    add(){
        this.form3 = {}
        this.dialogForm3Visible = true
    },
    async edit(){
      let row = this.table_selectedRows[0]
      this.form = await api_resource.find(row.id)
      this.dialogFormVisible = true;
    },
    async fetchTableData() {
     if(!this.id){
       return
     }
     this.table_loading = true;
     this.table_form.org_id = this.id
     const {rows , total }= await api_resource.get(this.table_form);
      this.table_data  = rows
       this.table_form.total = total
      setTimeout(() => {
        this.table_loading = false;
      }, 300);
    },
    async handleFormSubmit(){
        let form = Object.assign({},this.form)
        form.org_id = this.id
        if(this.isInsert){
            await api_resource.create(form)
        }else{
            await api_resource.update(form.id,form)
        }
        this.dialogFormVisible = false
        this.fetchTableData()
    },
  },
  async created() {
    const { field, action,table } = await api_common.menuInit("hot/record");
    this.table_field = field;
    this.table_actions = action;
    this.table_config = table
    this.fetchTableData();
    this.table_form.dateLap = dayjs().format('YYYY-MM')
  }
};
</script>


