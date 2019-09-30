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
        <dateLap itemsD='1' v-model="table_form.dateLap" @change="fetchTableData"/>
      </div>
    </table-header>
    
    <div class="blance">
      <p>爱心基金收支平衡表</p>
      <!--<span>输出日期：2019年01月05日</span>-->
    </div>
    <el-table
      @selection-change="handleChangeSelection"
      :data="table_data"
      border
      style="width: 100%"
      :show-header="false"
      v-loading="table_loading"
      :height="table_height"
      :header-cell-style="headerCellStyle"
      @header-dragend="table_dragend"
      @sort-change="table_sort_change"
      :span-method="objectSpanMethod"
      :cell-style="cellStyle"
    >
        <each-table-column :table_field="table_field"/>
    </el-table>
  </ui-table>
</template>
<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
import dayjs from 'dayjs'
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
			table_topHeight:326,
      api_resource,
      orgCategory:[],
      queryDialogFormVisible:true,
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
      welfareExpendTotal:[],//福利支出总计
      options:[{
        value:'3',
        label:'年'
      }],
      allData:[],
      title:{},
      itemLength:{}
    };
  },
  watch:{
   
  },
  methods: {
    async fetchTableData() {
      this.table_loading = true;
      this.table_form.orgid = this.id
      const tableData = await api_resource.get(this.table_form);
      this.table_data.push(tableData.total) 
      this.title.itemName = this.table_field[0].showname
      this.title.inCome = this.table_field[1].showname
      this.title.expend = this.table_field[2].showname
      this.table_data.push(this.title);
      this.table_data.push(tableData.donateInComeTotal)
      this.itemLength.donate = tableData.donateInCome.length;
      this.itemLength.expend = tableData.welfareExpend.length;
      for(var i in tableData.donateInCome){
          this.table_data.push(tableData.donateInCome[i])
      }
      this.table_data.push(tableData.otherInComeTotal)
      this.table_data.push(tableData.welfareExpendTotal) 
      for(var i in tableData.welfareExpend){
          this.table_data.push(tableData.welfareExpend[i])
      }
      this.table_data.push(tableData.otherExpendTotal)
      setTimeout(() => {
        this.table_loading = false;
      }, 300);
    },
    async initForm(){
        const {inItem,inMethod} = await this.$request.get('/lovefoundation/inexpendshow')
    },
    cellStyle({row, column, rowIndex, columnIndex}){
      if(rowIndex === 0 && columnIndex ===1||(rowIndex === 2 && columnIndex ===1)|| (rowIndex === (4+Number(this.itemLength.donate)) && columnIndex ===2) || 
      (rowIndex === (3+Number(this.itemLength.donate)) && columnIndex ===1) || (rowIndex === (5+Number(this.itemLength.donate)+Number(this.itemLength.expend)) && columnIndex ===2)){ //指定坐标
          return 'color:#F2353C;font-weight:bold'
      }else if(rowIndex === 1 && (columnIndex ===0 || columnIndex ===1 ||columnIndex ===2)){ //指定坐标
          return 'color:#0BB2D4'
      }else if(rowIndex === 0 && columnIndex ===0 ||(rowIndex === 2 && columnIndex ===0) || (rowIndex === (3+Number(this.itemLength.donate)) && columnIndex ===0 ) || 
      (rowIndex === (4+Number(this.itemLength.donate)) && columnIndex ===0)|| (rowIndex === (4+Number(this.itemLength.donate)+Number(this.itemLength.expend)+1) && columnIndex ===0)){ //指定坐标
          return 'font-weight:bold;'
      }else{
          return ''
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if(rowIndex===0 &&columnIndex === 1){
        return {
          rowspan: 1,
          colspan: 2
        };
      }
    }
  },
  async created() {
    const { field, action,table } = await api_common.menuInit("lovefoundation/inexpendshow");
    this.table_field = field;
    this.table_actions = action;
    this.table_config = table
    this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM'))
    this.fetchTableData();
  }
};
</script>
<style>
  .blance{
    font-size:18px;text-align:center;font-weight:bold;padding:13px 0;line-height:30px;background:#EBF6F8;color:#0BB2D4
  }
</style>

