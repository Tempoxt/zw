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
    ></table-header>
    
    <div>
      <p style="font-size:18px;text-align:center;font-weight:bold;padding:13px 0;line-height:30px;background:#EBF6F8;color:#0BB2D4">爱心基金收支平衡表</p>
      <!--<span>输出日期：2019年01月05日</span>-->
    </div>

    <el-table
      @selection-change="handleChangeSelection"
      :data="totalData"
      border
      style="width: 100%"
      :show-header="false"
      :span-method="objectSpanMethod"
    >
        <each-table-column :table_field="table_field"/>
    </el-table>
    <el-table
      @selection-change="handleChangeSelection"
      :data="donateInComeTotal"
      border
      style="width: 100%"
      v-loading="table_loading"
      :header-cell-style="headerCellStyle"
      @header-dragend="table_dragend"
      @sort-change="table_sort_change"
    >
        <each-table-column :table_field="table_field"/>
    </el-table>
    <el-table
      @selection-change="handleChangeSelection"
      :data="donate"
      border
      style="width: 100%"
      :show-header="false"
    >
        <each-table-column :table_field="table_field"/>
    </el-table>

    <el-table
      :data="otherInComeTotal"
      border
      :show-header="false"
      style="width: 100%"
      v-loading="table_loading"
      :header-cell-style="headerCellStyle"
      @header-dragend="table_dragend"
    >
        <each-table-column :table_field="table_field"/>
    </el-table>

     <el-table
      :data="welfareExpendTotal"
      border
      :show-header="false"
      style="width: 100%"
      v-loading="table_loading"
      :header-cell-style="headerCellStyle"
      @header-dragend="table_dragend"
    >
        <each-table-column :table_field="table_field"/>
    </el-table>

     <el-table
      :data="welfareExpend"
      border
      :show-header="false"
      style="width: 100%"
      v-loading="table_loading"
    >
        <each-table-column :table_field="table_field"/>
    </el-table>

    <el-table
      :data="otherExpendTotal"
      border
      :show-header="false"
      style="width: 100%"
      v-loading="table_loading"
      :header-cell-style="headerCellStyle"
      @header-dragend="table_dragend"
    >
        <each-table-column :table_field="table_field"/>
    </el-table>
  </ui-table>
</template>
<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
const api_resource = api_common.resource("lovefoundation/inexpendshow");
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
      table_height:window.innerHeight-236,
      adminList:[],
      defaultForm,
      itemData:[],
      totalData:[],//账载资金
      donate:[],//捐赠收入
      donateInComeTotal:[],//捐赠收入合计
      otherExpendTotal:[],//其他支出合计
      otherInComeTotal:[],//其他收入合计
      total:[],//总计
      welfareExpend:[],//福利支出
      welfareExpendTotal:[]//福利支出总计
    };
  },
  watch:{
   
  },
  methods: {
    async fetchTableData() {
     this.table_loading = true;
     this.table_form.orgid = this.id
     const tableData = await api_resource.get(this.table_form);
     this.welfareExpend = tableData.welfareExpend//福利支出
     this.donate = tableData.donateInCome;//捐赠收入
     this.otherInComeTotal = Array(tableData.otherInComeTotal);//其他收入合计
     this.otherExpendTotal = Array(tableData.otherExpendTotal);//其他支出合计
     this.donateInComeTotal = Array(tableData.donateInComeTotal);//捐赠收入合计
     this.welfareExpendTotal = Array(tableData.welfareExpendTotal);//福利支出合计
     this.totalData = Array(tableData.total);//账载资金
     console.log(tableData)
    //  const {rows , total }= await api_resource.get(this.table_form);
      // this.table_data  = rows
      // this.table_form.total = total
      setTimeout(() => {
        this.table_loading = false;
      }, 300);
    },
    async initForm(){
        const {inItem,inMethod} = await this.$request.get('/lovefoundation/inexpendshow')
        console.log(inItem,'inItem lallalalalalalalalaal............')
        // this.form_inItem = inItem.map(o=>({label:o.text,value:o.value}))
        // this.form_inMethod = inMethod.map(o=>({label:o.text,value:o.value}))
    },
     objectSpanMethod({ row, column, rowIndex, columnIndex }) {
     console.log(rowIndex,columnIndex)
      if (columnIndex === 1) { //第一列
        if(rowIndex===0){
          return {
            rowspan: 1,
            colspan: 2
          };
        } else{
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  },
  async created() {
    const { field, action,table } = await api_common.menuInit("lovefoundation/inexpendshow");
    this.table_field = field;
    this.table_actions = action;
    this.table_config = table
    this.fetchTableData();
  }
};
</script>
<style>
  .el-table_16_column_50 ,.el-table_16_column_51,.el-table_17_column_53,.el-table_19_column_59,.el-table_22_column_68,.el-table_20_column_62 {font-weight:bold}
  .el-table_16_column_51  {
    color:#F2353C;
  }
</style>

