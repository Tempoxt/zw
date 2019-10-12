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
            <!-- <dateLap v-model="table_form.dateLap" @change="fetchTableData"/> -->
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
      <el-table-column type="index" :index="indexMethod" width="60" fixed/>
      <el-table-column prop="staff__socialSecurityMain" sortable label="社保主体" width="100" fixed/>
      <el-table-column prop="staff__employeeCode" sortable label="工号" fixed/>
      <el-table-column prop="staff__chineseName" label="姓名" fixed/>
    <each-table-column :table_field="table_field.filter(o=>!['staff__socialSecurityMain','staff__employeeCode','staff__chineseName'].includes(o.name))" :template="template"/>
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
const api_resource = api_common.resource("basicwage/applysheet");

export default {
  mixins: [table_mixin],
  props:['id'],
  data() {
    return {
      loading: true,
      api_resource,
      queryDialogFormVisible:true,
      template:{
        sheetType(column,row){//工薪单类型
          if(row.sheetType==0){
            return <span>初始化</span>
          }else if(row.sheetType==1){
            return <span>入职</span>
          }else{
            return <span>调薪</span>
          }
        },
        aWorkdayOtHours(column,row){//工作日加班工时
          if(row.aWorkdayOtHours=='aa'){
            return <span>按考勤</span>
          }else if(row.aWorkdayOtHours=='as'){
            return <span>周六</span>
          }else{
            return <span>{row.aWorkdayOtHours}</span>
          }
        },
        aWeekOtDay(column,row){//休息日加班天数
          if(row.aWeekOtDay=='aa'){
            return <span>按考勤</span>
          }else if(row.aWeekOtDay=='as'){
            return <span>周六</span>
          }else{
            return <span>{row.aWeekOtDay}</span>
          }
        },
        aWeekOtHours(column,row){//休息日加班工时
          if(row.aWeekOtHours=='aa'){
            return <span>按考勤</span>
          }else if(row.aWeekOtHours=='as'){
            return <span>周六</span>
          }else{
            return <span>{row.aWeekOtHours}</span>
          }
        },
        verify(column,row){
          if(row.verify==0){
            return <el-tag size="mini" type="danger">未审核</el-tag>
          }else if(row.verify==1){
            return <el-tag size="mini" type="success">已审核</el-tag>
          }
        }
      }
    };
  },
  watch:{
    id(){
      this.table_form.currentpage = 1
      this.fetchTableData()
    },
  },
  methods: {
    async fetchTableData() {
     if(!this.id){
       return
     }
     this.table_loading = true;
     this.table_form.org_id = this.id
     this.table_form.sheetType = 1
     const {rows , total }= await api_resource.get(this.table_form);
      this.table_data  = rows
       this.table_form.total = total
      setTimeout(() => {
        this.table_loading = false;
      }, 300);
    },
  },
  async created() {
    const { field, action,table } = await api_common.menuInit("applybasic");
    this.table_field = field;
    this.table_actions = action;
    this.table_config = table
    this.fetchTableData();
  }
};
</script>


