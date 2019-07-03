  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  
  >

<el-dialog
      title="调整"
      :visible.sync="dialogForm3Visible"
      class="public-dialog"
      v-el-drag-dialog
      width="800px"
    >

    <el-form ref="form" :model="form" label-width="100px" >
        <form-render :type="`member`" :field="{name:'员工'}" v-model="form3.staff" />
        <form-render :type="`day`" :field="{name:'变动日期'}" v-model="form3.changedate" />
        <form-render :type="`input`" :field="{name:'调薪原因'}" v-model="form3.remark" />
        <el-row :gutter="20">
                <el-col :span="4">
                   <span> &nbsp;</span>
                </el-col>
                <el-col :span="10">
                    调整前
                </el-col>
                <el-col :span="10">
                    调整后
                </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom:10px"> <el-col :span="4">基本工资</el-col><el-col :span="10"> <el-input v-model="formData.basicWage" disabled></el-input></el-col><el-col :span="10"><el-input v-model="form3.basicWage"></el-input> </el-col></el-row>
        <el-row :gutter="20" style="margin-bottom:10px"> <el-col :span="4">加班津贴</el-col><el-col :span="10"> <el-input v-model="formData.overtime" disabled></el-input></el-col><el-col :span="10"><el-input v-model="form3.overtime"></el-input> </el-col></el-row>
        <el-row :gutter="20" style="margin-bottom:10px"> <el-col :span="4">休息日加班</el-col><el-col :span="10"> <el-input v-model="formData.weekendWelfare" disabled></el-input></el-col><el-col :span="10"><el-input v-model="form3.weekendWelfare"></el-input> </el-col></el-row>
        <el-row :gutter="20" style="margin-bottom:10px"> <el-col :span="4">福利/津贴</el-col><el-col :span="10"> <el-input v-model="formData.welfare" disabled></el-input></el-col><el-col :span="10"><el-input v-model="form3.welfare"></el-input> </el-col></el-row>
        <el-row :gutter="20" style="margin-bottom:10px"> <el-col :span="4">全勤奖</el-col><el-col :span="10"> <el-input v-model="formData.fullAtt" disabled></el-input></el-col><el-col :span="10"><el-input v-model="form3.fullAtt"></el-input> </el-col></el-row>
        <el-row :gutter="20" style="margin-bottom:10px"> <el-col :span="4">保底绩效</el-col><el-col :span="10"> <el-input v-model="formData.minPerformance" disabled></el-input></el-col><el-col :span="10"><el-input v-model="form3.minPerformance"></el-input> </el-col></el-row>
        <el-row :gutter="20" style="margin-bottom:10px"> <el-col :span="4">考核绩效</el-col><el-col :span="10"> <el-input v-model="formData.performance" disabled></el-input></el-col><el-col :span="10"><el-input v-model="form3.performance"></el-input> </el-col></el-row>
        <el-row :gutter="20" style="margin-bottom:10px"> <el-col :span="4">小计</el-col><el-col :span="10"> <el-input v-model="count1" disabled></el-input></el-col><el-col :span="10"><el-input v-model="count2" disabled></el-input> </el-col></el-row>
    </el-form>


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
const api_resource = api_common.resource("attendance/countlist");
import dateLap from '@/components/Table/DateLap'
import OrgSelect from '@/components/Org/OrgSelect'
import dayjs from 'dayjs'
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
  computed:{
    count1(){
      return ['basicWage','overtime','weekendWelfare','welfare','fullAtt','minPerformance','performance'].map(o=>+this.formData[o]).reduce((total,num)=>(
        total+=num
      ))||0
    },
    count2(){
      return ['basicWage','overtime','weekendWelfare','welfare','fullAtt','minPerformance','performance'].map(o=>+this.form3[o]).reduce((total,num)=>(
        total+=num
      ))||0
    },
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
      form3:{},
      formData:[],
      importUploadUrl:"/attendance/count"
    };
  },
  watch:{
    id(){
      this.fetchTableData()
    },
    async 'form3.staff'(staff){
        const result = await this.$request.get('/basicwage',{params:{staff}})
        this.formData = result[0]
        this.form3 = Object.assign({},this.formData)
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

    
      await this.$request.post('basicwage/applysheet',this.form3,{
        params:{
          sheetType:1
        }
      })
    
      this.dialogForm3Visible = false
    },
    add(){
        this.form3 = {}
        this.formData = {}
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
     this.table_form.sheetType = 2
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
    const { field, action,table } = await api_common.menuInit("attendance/countlist");
    this.table_field = field;
    this.table_actions = action;
    this.table_config = table
    this.table_form.dateLap = dayjs().format('YYYY-MM')
    this.fetchTableData();
  }
};
</script>


