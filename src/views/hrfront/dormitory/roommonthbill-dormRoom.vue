  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  
  >


 <el-dialog
      title="添加月单费"
      :visible.sync="dialogFormVisible"
      class="public-dialog"
      v-el-drag-dialog
      width="500px"
    >
     <el-form ref="form" :model="form" label-width="100px">
          <el-row :gutter="20">
             <el-col :span="24">
               <el-form-item label="房间">
                 {{this.data.roomName}}
              </el-form-item>
            </el-col>
             <el-col :span="24">
               <el-form-item label="日期">
                 <el-date-picker
                  v-model="form.month"
                  type="month"
                  format="yyyy年MM月"
                  value-format="yyyy-MM"
                  @change="changeFormMonth"
                  placeholder="选择月">
                </el-date-picker>
              </el-form-item>
            </el-col>


            <el-col :span="24">
               <form-render
                :type="`input`" :field="{name:'本月水表读数'}"
                v-model="form.currentWater"
                />
            </el-col>
            <el-col :span="24">
               <form-render
                :type="`input`" :field="{name:'水费-单价'}"
                v-model="form.waterPrice"
                />
            </el-col>
             <el-col :span="24">
               <form-render
                :type="`input`" :field="{name:'本月电表读数'}"
                v-model="form.currentElectric"
                />
            </el-col>
            <el-col :span="24">
               <form-render
                :type="`input`" :field="{name:'电费单价'}"
                v-model="form.electricPrice"
                />
            </el-col>
<!--            
            <el-col :span="24">
              <form-render
              :type="`member`" :field="{name:'入住员工'}"
                v-model="distribution_form.empId"
              />
            </el-col> -->
            
          </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
    </div>
</el-dialog>


<el-dialog
      title="退宿"
      :visible.sync="dialogFormVisible3"
      class="public-dialog"
      v-el-drag-dialog
      width="500px"
    >
     <el-form ref="form" :model="checkinout_form" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="退宿员工">
                <span v-for="(item,i) in checkinoutRows" :key="i">{{item.chineseName}} </span>
            </el-form-item>
            </el-col>
            
            <el-col :span="24">
              <form-render
              :type="`day`" :field="{name:'申请退宿时间'}"
                v-model="checkinout_form.checkoutApplyDate"
              />
            </el-col>
            <el-col :span="12">
              <form-render
                :type="`select`"
                :field="{name:'退宿原因',options:[{label:'离职',value:0},{label:'其他',value:1}]}"
                v-model="checkinout_form.checkoutReason"
              />
            </el-col>
          </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="handleFormSubmit3">确 定</el-button>
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
        <el-date-picker
          v-model="table_form.month"
          type="month"
          size="medium"
          @change="fetchTableData"
          format="yyyy年MM月"
          value-format="yyyy-MM"
          placeholder="选择月份">
        </el-date-picker>
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
    <el-table-column type="index" :index="indexMethod" />
    <each-table-column :table_field="table_field" :template="template"/>
     <!-- <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
            <el-button @click="distribution(scope.row)" type="text" size="small" v-if="scope.row.checkState===3">分配</el-button>
            <el-button @click="checkinout(scope.row)" type="text" size="small" v-if="scope.row.checkState===1">退宿</el-button>
      
        </template>
    </el-table-column>
    <el-table-column
        fixed="right"
        label="入住记录"
        width="100">
        <template slot-scope="scope">
            <el-button  type="text" size="small">查看</el-button>
        </template>
    </el-table-column> -->

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
const api_resource = api_common.resource("dormitory/roommonthbill");
import dayjs from 'dayjs'
const defaultForm = () => {
    return {
       
    }
}
export default {
  mixins: [table_mixin],
  props:['id','data'],
  data() {
      const generateData = _ => {
        const data = [];
        for (let i = 1; i <= 15; i++) {
          data.push({
            key: i,
            label: `备选项 ${ i }`,
            disabled: i ===1||i===4
          });
        }
        return data;
      };
    return {
      distributionData: [],
      loading: true,
      month:'',
      form:{
       
      },
      checked: [],
      api_resource,
      orgCategory:[],
      queryDialogFormVisible:true,
      table_height:window.innerHeight-236,
      adminList:[],
      defaultForm,
      roomAdminList:[],
      roomList:[],
      dialogFormVisible2:false,
      dialogFormVisible3:false,
      checkinout_form:{},
      checkinoutRows:[],

      distributionRow:{},
      distribution_form:{},
      template:{
          checkState(column,row){
              console.log(row,'row')
              return <div>{['待入住','已入住','待搬离','已搬离'][row.checkState]}</div>
          },

      }
    };
  },
  watch:{
    id(){
      this.fetchTableData()
    }
  },
  methods: {
    log(data){
        console.log(data,'data')
    },
    async fetchTableData() {
     this.table_loading = true;
     this.table_form.room = this.id||6
     const {rows , total }= await api_resource.get(this.table_form);
      this.table_data  = rows
       this.table_form.total = total
      setTimeout(() => {
        this.table_loading = false;
      }, 300);
    },
    distribution(row){
        this.distribution_form = {}
        this.distributionRow = row
        this.dialogFormVisible2 = true
    },
    checkinout(row){
        this.checkinout_form = {}
        this.checkinoutRows = [row]
        this.dialogFormVisible3 = true
    },
    async handleFormSubmit2(){
        this.distribution_form.bed = this.distributionRow.bed
        await this.$request.post('dormitory/checkinout',this.distribution_form)
        this.dialogFormVisible2 = false
        // console.log(,'distribution_form')
    },
    handleFormSubmit3(){
     
      this.$request.patch('/dormitory/checkinout/apply_out',this.checkinout_form,{
         params:{ids:this.checkinoutRows.map(o=>o.id).join(',')},
      })
      this.dialogFormVisible3 = false
      this.fetchTableData()
      // this.$request.p
    },
    filterMethod(query, item){
        return (item.employeeCode+'').indexOf(query) > -1|| (item.chineseName+'').indexOf(query) > -1;
    },
    async add(){
        console.log(this.table_data,'123')
        this.dialogFormVisible = true
    },
    async changeFormMonth(){
      const { rows } = this.$request.get('/dormitory/roommonthbill',{
        params:{
          room:this.id,
          room__dorm_id:this.data.id,
          month:this.form.month
        }
      })
      this.form.currentElectric = rows.electricPrice
      this.form.currentWater = rows.waterPrice
     
    },
    async handleFormSubmit(){
        // this.form.month = this.month
        this.form.room = this.id
        await this.$request.post('dormitory/roommonthbill',this.form)
        this.dialogFormVisible = false
        this.fetchTableData()
    },

    async edit(){
      this.roomList = (await api_common.resource('dormitory/room').find(this.id)).rows.map(o=>{
            return {
                label:o.dormName,
                value:o.id
            }
      })
      let row = this.table_selectedRows[0]
      this.form = await api_resource.find(row.id)
      this.dialogFormVisible = true;
    }
  },
  async created() {
    this.$set(this.table_form,'month', dayjs().format('YYYY-MM'))
    const { field, action,table } = await api_common.menuInit("dormitory/roommonthbill");
    this.table_field = field;
    this.table_actions = action;
    this.table_config = table
    this.fetchTableData();
  }
};
</script>


<style lang="scss" scoped>
.transfer-footer {
    display: flex;
    height: 100%;
    align-items: center;
    span {
        padding-left: 6px;
    }
}
.public-dialog {
    /deep/ .el-transfer-panel {
        width: 300px;
    }
    /deep/ .el-transfer-panel__body {
        height: 370px;
    }
    /deep/ .el-transfer-panel__list.is-filterable {
        height: 320px !important;
    }
}
</style>
