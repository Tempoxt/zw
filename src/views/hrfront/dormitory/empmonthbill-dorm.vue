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
   
    <el-table-column 
      type="selection" 
      width="60" 
      class-name="table-column-disabled"
      :selectable="table_disable_selected"
      >
      </el-table-column>
    <el-table-column type="index" :index="indexMethod" />
    <each-table-column :table_field="table_field" :template="template"/>

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
const api_resource = api_common.resource("dormitory/empmonthbill");
import dayjs from 'dayjs'
const defaultForm = () => {
    return {
       
    }
}
export default {
  mixins: [table_mixin],
  props:['id','data','orgid','choicetype','current_type'],
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
    },
    orgid(){
      this.fetchTableData()
    },
    choicetype(){
      this.fetchTableData()
    },
    current_type(){
      this.fetchTableData()
    }
  },
  methods: {
    log(data){
        console.log(data,'data')
    },
    async fetchTableData() {
     this.table_loading = true;
     if(this.current_type =='room'){
        this.table_form.room = this.id||6
        this.table_form.dormId = ''
     }else{
        this.table_form.dormId = this.id
        this.table_form.room = ''
     }
     if(this.orgid){
       this.table_form.room = ''
       this.table_form.dormId = ''
     }
    //  this.table_form.dormId = this.id
     this.table_form.orgid = this.orgid
     this.table_form.choicetype = this.choicetype
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
    
    filterMethod(query, item){
        return (item.employeeCode+'').indexOf(query) > -1|| (item.chineseName+'').indexOf(query) > -1;
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
     
    }
  },
  async created() {
    this.$set(this.table_form,'month', dayjs().subtract(1,'month').format('YYYY-MM'))
    const { field, action,table } = await api_common.menuInit("dormitory/empmonthbill");
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
