  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  
  >
    <Drawer title="工薪单明细"  :closable="false" v-model="drawer" width="680" class="applybasicTableDrawer">
      <div v-loading="drawer_loading">
        <!--  -->
        <div class="user" style="background:#F8F8F8;" >
         <el-row :gutter="20">
          <el-col :span="3">
            &nbsp;
            <!-- <img src="http://cdn.admui.com/demo/pjax/2.0.0/images/avatar.svg" alt="" style="margin-left:10px;"> -->
          </el-col>
          <el-col :span="6" class="user-info-box">
            <p>姓名：{{applysheetDetail[0].staff__chineseName}}</p>
            <p>工号：{{applysheetDetail[0].staff__employeeCode}}</p>
          </el-col>
          <el-col :span="6" class="user-info-box">
            <p>部门：{{applysheetDetail[0].department__name}}</p>
            <p>职位：{{applysheetDetail[0].principalship__name}}</p>
          </el-col>
          <el-col :span="6" class="user-info-box">
            <p> &nbsp;</p>
            <p>入职日期：{{applysheetDetail[0].staff__OnDutyTime}}</p>
          </el-col>
        </el-row>
       </div>

       <div class="info-box" v-for="(Detail,i) in applysheetDetail" :key="i">
          <div class="tag">
            <img :src="Detail.verify===1?require('@/assets/examine2.png'):require('@/assets/examine1.png')" alt="" width="96" height="79">
          </div>
          <div class="title">
            <span>{{['初始化','入职工薪单','调薪单'][Detail.sheetType]}}  {{Detail.changeDate}}</span>
            <span v-if="Detail.rate">{{Detail.rate}}</span>
          </div>
          <div>
            <el-row >
              <el-col :span="12">
                <div>
                  <el-row class="text-row"><el-col :span="14" class="text-right "><span class="text-label">薪酬类型：</span></el-col><el-col :span="10"><span class="text-value">{{Detail.xzType}}</span></el-col></el-row>
                  <el-row class="text-row"><el-col :span="14" class="text-right "><span class="text-label">标准工资：</span></el-col><el-col :span="10"><span class="text-value">{{Detail.aBasicWage}}</span></el-col></el-row>
                  <el-row class="text-row"><el-col :span="14" class="text-right "><span class="text-label">工作日加班工资：</span></el-col><el-col :span="10"><span :class="`text-value ${Detail.aWorkdayOtHours!=0?'text-warn':''}`">{{Detail.aOvertime}}</span></el-col></el-row>
                  <el-row class="text-row"><el-col :span="14" class="text-right "><span class="text-label">休息日加班工资：</span></el-col><el-col :span="10"><span :class="`text-value ${Detail.aWeekOtDay!=0?'text-warn':''}`">{{Detail.aWeekendWelfare}}</span></el-col></el-row>
                  <el-row class="text-row"><el-col :span="14" class="text-right "><span class="text-label">全勤奖：</span></el-col><el-col :span="10"><span class="text-value">{{Detail.aFullAtt}}</span></el-col></el-row>
                  <el-row class="text-row"><el-col :span="14" class="text-right "><span class="text-label">绩效1：</span></el-col><el-col :span="10"><span class="text-value">{{Detail.aMinPerformance}}</span></el-col></el-row>
                  <el-row class="text-row"><el-col :span="14" class="text-right "><span class="text-label">(考核基准)绩效2：</span></el-col><el-col :span="10"><span class="text-value  text-warn">{{Detail.aPerformance}}</span></el-col></el-row>
                  <el-row class="text-row"><el-col :span="14" class="text-right "><span class="text-label">工资总额：</span></el-col><el-col :span="10"><span class="text-value  text-warn">{{Detail.aTotle}}</span></el-col></el-row>
                </div>
              </el-col>
            <el-col :span="12">
                <el-row class="text-row"><el-col :span="10" class="text-right "><span class="text-label">职位/等级：</span></el-col><el-col :span="14"><span class="text-value">{{Detail.principalship__name}}/{{Detail.wageLevel}}</span></el-col></el-row>
                <el-row class="text-row"><el-col :span="10" class="text-right "><span class="text-label">社保缴费基数：</span></el-col><el-col :span="14"><span class="text-value"></span></el-col></el-row>
                <el-row class="text-row"><el-col :span="10" class="text-right "><span class="text-label">工作日加班：</span></el-col><el-col :span="14"><span :class="`text-value ${Detail.aWorkdayOtHours!=0?'text-warn':''}`">{{Detail.workOtTitle}}</span></el-col></el-row>
                <el-row class="text-row"><el-col :span="10" class="text-right "><span class="text-label">休息日加班：</span></el-col><el-col :span="14"><span :class="`text-value ${Detail.aWeekOtDay!=0?'text-warn':''}`">{{Detail.weekdayTitle|weekDay}}</span></el-col></el-row>
                <el-row class="text-row"><el-col :span="10" class="text-right "><span class="text-label">备注：</span></el-col><el-col :span="14"><span class="text-value">{{Detail.remark}}</span></el-col></el-row>
                <el-row class="text-row"><el-col :span="10" class="text-right "><span class="text-label">&nbsp;</span></el-col><el-col :span="14"><span class="text-value">&nbsp;</span></el-col></el-row>
                <el-row class="text-row"><el-col :span="10" class="text-right "><span class="text-label">&nbsp;</span></el-col><el-col :span="14"><span class="text-value">&nbsp;</span></el-col></el-row>
                <el-row class="text-row"><el-col :span="10" class="text-right "><span class="text-label">签名：</span></el-col><el-col :span="14" style="margin-top:-8px"><span><img :src="Static_Url+Detail.signImage" alt="" style="width:200x;height:100px"></span></el-col></el-row>
            </el-col>
           
          </el-row>
          </div>
        <div class="divider" v-if="i<applysheetDetail.length"></div>
       </div>

       
      </div>
       
      
    </Drawer>



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
    <vxe-table
      class="public-vxe-table applyBasic"
      ref="xTable"
      resizable
      show-overflow
      highlight-hover-row
      @select-all="handleChangeSelection"
      @select-change="handleChangeSelection"
      :data="table_data"
      border
      style="width: 100%"
      v-loading="table_loading"
      :header-cell-style="vxeHeaderStyle"
      :height="table_height"
      @resizable-change="table_dragend"
      @sort-change="table_sort_change"
      :seq-config="{seqMethod: VxeIndexMethod}"
      :show-footer="table_config.isShowFooter"
      :footer-method="footerMethod"
      >
      <vxe-table-column 
        type="selection" 
        width="45" 
        class-name="table-column-disabled"
        :selectable="table_disable_selected"
        fixed="left"
      >
      </vxe-table-column>
      <vxe-table-column type="index" :index="indexMethod" align="center" fixed="left" width="60"/>
      <vxe-table-column field="staff__socialSecurityMain" title="社保主体" width="90" fixed="left">
        <template v-slot="{ row }">
          <div v-html="row.staff__socialSecurityMain"></div>
        </template>
      </vxe-table-column>
      <vxe-table-column field="staff__employeeCode" title="工号" width="70" fixed="left">
        <template v-slot="{ row }">
          <div v-html="row.staff__employeeCode"></div>
        </template>
      </vxe-table-column>
      <vxe-table-column field="staff__chineseName" title="姓名" width="70" fixed="left">
        <template v-slot="{ row }">
          <div v-html="row.staff__chineseName"></div>
        </template>
      </vxe-table-column>

      <vxe-table-column field="verify" title="状态" width="70">
        <template v-slot="{ row }">
          <el-tag size="mini" type="danger" v-if="row.verify==0">未审核</el-tag>
          <el-tag size="mini" type="success" v-if="row.verify==1">已审核</el-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="sheetType" title="工薪单类型" width="70">
        <template v-slot="{ row }">
          <el-button type="text" @click="handleTypeClick(row.staff__employeeCode)" v-if="row.sheetType==0">初始化</el-button>
          <el-button type="text" @click="handleTypeClick(row.staff__employeeCode)" v-if="row.sheetType==1">入职</el-button>
          <el-button type="text" @click="handleTypeClick(row.staff__employeeCode)" v-if="row.sheetType==2">调薪</el-button>
        </template>
      </vxe-table-column>
      <vxe-table-column v-for="field in table_field.filter(o=>!['staff__socialSecurityMain','staff__employeeCode','staff__chineseName','verify','sheetType',
        'aWorkdayOtHours','aWeekOtDay','aWeekOtHours','oaId','signState'].includes(o.name)).filter(column=>!column.fed_isvisiable).
        filter(column=>!column.isvisiable)" :key="field.name" :field="field.name" :title="field.showname" :sortable="field.issort" 
        :width="field.width=='auto'?'': parseInt(field.width)"/>
      <vxe-table-column  field="aWorkdayOtHours" title="工作日加班工时" width="80">
        <template v-slot="{ row }">
          <span v-if="row.aWorkdayOtHours == 'aa'">按考勤</span>
          <span v-if="row.aWorkdayOtHours == 'as'">周六</span>
          <span v-if="row.aWorkdayOtHours != 'as' && row.aWorkdayOtHours != 'aa'">{{row.aWorkdayOtHours}}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column  field="aWeekOtDay" title="休息日加班天数" width="80">
        <template v-slot="{ row }">
          <span v-if="row.aWeekOtDay == 'aa'">按考勤</span>
          <span v-if="row.aWeekOtDay == 'as'">周六</span>
          <span v-if="row.aWeekOtDay != 'as' && row.aWeekOtDay != 'aa'">{{row.aWeekOtDay}}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column  field="aWeekOtHours" title="休息日加班工时" width="80">
        <template v-slot="{ row }">
          <span v-if="row.aWeekOtHours == 'aa'">按考勤</span>
          <span v-if="row.aWeekOtHours == 'as'">周六</span>
          <span v-if="row.aWeekOtHours != 'as' && row.aWeekOtHours != 'aa'">{{row.aWeekOtHours}}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column  field="oaId" title="OA编号" width="70">
        <template v-slot="{ row }">
          <span>{{row.oaId}}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column  field="signState" title="签名确认" width="70">
        <template v-slot="{ row }">
          <span>{{row.signState}}</span>
        </template>
      </vxe-table-column>
    </vxe-table>
  
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
let Static_Url = process.env.VUE_APP_STATIC;
export default {
  mixins: [table_mixin],
  props:['id'],
  filters:{
    weekDay(v){
      if(v==1){
        return '已审核'
      }
       if(v==0){
        return '未审核'
      }
      return v
    }
  },
  data() {
    let vm = this
    return {
      Static_Url,
      applysheetDetail:[{},{}],
      drawer_loading:true,
      drawer:false,
      loading: true,
      api_resource,
      queryDialogFormVisible:true,
      vxeHeaderStyle:{background:'#F5FAFB',color:'#37474F'},
			table_topHeight:233,
    };
  },
  watch:{
    id(){
      this.table_form.currentpage = 1
      this.fetchTableData()
    },
  },
  methods: {
    table_dragend({$rowIndex, column, columnIndex, $columnIndex, fixed, isHidden}){
      let row = this.table_field.find(field=>field.showname===column.title)
      var isEnd = false
      this.table_field.forEach((item,i)=>{
          if(item==row&&i==this.table_field.length-2){
            isEnd = true
          }
      })
      var newWidth = column.resizeWidth
      row.width = newWidth
      row.menuid = row.menuid_id
      api_pagemanager.update(row.id,{
          width:newWidth,
          menuid:row.menuid_id
      },{alert:false})
    },
		handleChangeSelection({selection:val}){ // 单选
      this.table_selectedRowsInfo = val
      this.table_selectedRows = val
			this.$emit("update:table_selectedRows",val)
			let xTable = this.$refs.xTable
      xTable.updateFooter()
    },
    async handleTypeClick(staff__employeeCode){
      this.drawer = true
      this.drawer_loading = true
      const { rows } = await this.$request.get('basicwage/applysheet/detail',{
        params:{
          staff__employeeCode
        }
      })
      this.applysheetDetail = rows.reverse()
      this.drawer_loading = false
    },
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


<style lang="scss">
.applybasicTableDrawer .ivu-drawer-body {
  padding:0;
}
.applybasicTableDrawer .ivu-drawer-header{
  background: rgba(245,250,251,1)
}
.applyBasic.vxe-table.t--border .vxe-table--fixed-left-wrapper .vxe-body--column{
  height: 32px;
}
</style>
<style lang="scss" scoped>
.user {
  overflow: hidden;
}
.user-info-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 70px;
  line-height: 26px;
}
.info-box {
  padding:0 16px 0 16px;
  margin-top: 20px;
  position: relative;
  .title{
    display: flex;
    justify-content: space-between;
    color: #0BB2D4;
    font-size:16px;
    font-weight:bold;
    margin:10px 0;
  }
}
.text-right {
  text-align: right;
}
.text-row {
  margin-bottom: 12px;
  font-size:14px;
}
.text-label {
  color: #4C5D66
}
.text-value {
  color: #A3AFB7;
}
.text-warn {
  color:#FF652C;
}
.divider {
  width: 100%;
  border-bottom: 1px dotted #A3AFB7;
  height:1px;
  margin-top: 20px;
}
.tag {
  position: absolute;
  left: 48%;
  top: 50%;
  transform: translate(-50%,-50%)
}
</style>