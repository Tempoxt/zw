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
        <dateLap type="3" :disabled="true" v-model="table_form.dateLap" @change="fetchTableData"/>
      </div>
    </table-header>
    
    <p style="font-size:18px;text-align:center;font-weight:bold;padding-bottom:20px;">爱心基金汇总</p>
    <el-table
        ref="elTable"
      @selection-change="handleChangeSelection"
      :data="table_data"
      border
      :span-method="objectSpanMethod"
      style="width: 100%"
      v-loading="table_loading"
      :header-cell-style="headerCellStyle"
      :height="table_height"
      @header-dragend="table_dragend"
      @sort-change="table_sort_change"
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
const api_resource = api_common.resource("lovefoundation/inexpendsummary");
const defaultForm = () => {
    return {
        estate:1,
        roomAdmin:''
    }
}
export default {
  mixins: [table_mixin],
  props: ['id'],
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
      form_inItem:[],
      form_inMethod:[],
      itemlength:{},
    };
  },
  watch:{
   
  },
  methods: {
    async fetchTableData() {
      this.table_loading = true;
      this.table_form.orgid = this.id
      const tableData = await api_resource.get(this.table_form);
      this.table_data  = tableData
      const field = tableData.map((o,i) => o.projectField)
      const ss = field.reduce(function(all,item){
        if(item in all){
          all[item]++;
        }else{
          all[item] = 1;
        }
        return all
      },{})
      this.itemlength.one = ss[0];
      this.itemlength.two = ss[1];
      this.itemlength.three = ss[2];
      this.itemlength.four = ss[3];
      this.itemlength.five = ss[4];
      setTimeout(() => {
        this.table_loading = false;
      }, 300);
    },
    cellStyle({row, column, rowIndex, columnIndex}){
      if(rowIndex === 0 && columnIndex ===0){ //指定坐标
          return 'background:rgba(11,178,212,0.2)'
      }else if(rowIndex === this.itemlength.one && columnIndex ===0){ //指定坐标
          return 'background:rgba(244,122,36,0.2)'
      }else if(rowIndex === this.itemlength.one+this.itemlength.two && columnIndex ===0){ //指定坐标
          return 'background:rgba(242,53,60,0.2)'
      }else if(rowIndex === this.itemlength.one+this.itemlength.two+this.itemlength.three && columnIndex ===0){ //指定坐标
          return 'background:rgba(31,211,97,0.2)'
      }else if(rowIndex === this.itemlength.one+this.itemlength.two+this.itemlength.three+this.itemlength.four && columnIndex ===0){ //指定坐标
          return 'background:rgba(148,99,247,0.2)'
      }else if(rowIndex === this.itemlength.one+this.itemlength.two+this.itemlength.three+this.itemlength.four+this.itemlength.five && columnIndex ===0){ //指定坐标
          return 'background:rgba(0,8,255,0.2)'
      }else{
          return ''
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 ||columnIndex === 6) { //第一列
        if(rowIndex===0){
          return {
            rowspan: this.itemlength.one,
            colspan: 1
          };
        } else if(rowIndex=== this.itemlength.one){
          return {
            rowspan: this.itemlength.two,
            colspan: 1
          };
        }else if(rowIndex=== this.itemlength.one+this.itemlength.two){
          return {
            rowspan: this.itemlength.three,
            colspan: 1
          };
        }else if(rowIndex=== this.itemlength.one+this.itemlength.two+this.itemlength.three){
          return {
            rowspan: this.itemlength.four,
            colspan: 1
          };
        }else if(rowIndex=== this.itemlength.one+this.itemlength.two+this.itemlength.three+this.itemlength.four){
          return {
            rowspan: this.itemlength.five,
            colspan: 1
          };
        }else if(rowIndex=== this.itemlength.one+this.itemlength.two+this.itemlength.three+this.itemlength.four+this.itemlength.five){
          return {
            rowspan: 1,
            colspan: 1
          };
        }else{
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  },
  async created() {
    const { field, action,table } = await api_common.menuInit("lovefoundation/inexpendsummary");
    this.table_field = field;
    this.table_actions = action;
    this.table_config = table
    this.$set(this.table_form,'dateLap',dayjs().format('YYYY'))
    this.fetchTableData();
  }
};
</script>


