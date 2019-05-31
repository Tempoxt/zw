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
    <el-table
      @selection-change="handleChangeSelection"
      :data="table_data"
      border
      show-summary
      :summary-method="getSummaries"
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
const api_resource = api_common.resource("lovefoundation/inexpendsummary");
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
      form_inItem:[],
      form_inMethod:[],
      itemlength:{},
      tableData:[]
    };
  },
  watch:{
   
  },
  methods: {
    async fetchTableData() {
   
     this.table_loading = true;
     this.table_form.orgid = this.id
    //  const {rows , total }= await api_resource.get(this.table_form);
     
      let arrhuobi = []
      const tableData = await api_resource.get(this.table_form);
      this.tableData = tableData
      // console.log('tableData summary dese',tableData)
      const iye = tableData.map((o,i) => o.projectName)
      console.log(iye)
      const kit = iye.map((k,i) => {
        console.log(k,i)
        if(k==='货币资金'){
          arrhuobi.push(k)
        }
      });
      
      console.log(arrhuobi)
      this.itemlength.one = arrhuobi.length
      console.log(this.itemlength.one)
  
      // this.table_data  = rows
      // this.table_form.total = total
      setTimeout(() => {
        this.table_loading = false;
      }, 300);
    },
    async initForm(){
      console.log(this.tableData,'this is in initform table datat')
        // const tableData = await this.$request.get('/lovefoundation/inexpendsummary')
        // this.form_inItem = inItem.map(o=>({label:o.text,value:o.value}))
        // this.form_inMethod = inMethod.map(o=>({label:o.text,value:o.value}))
    },
    async add(){
        this.initForm()
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
      this.initForm()
      let row = this.table_selectedRows[0]
      this.form = await api_resource.find(row.id)
      this.dialogFormVisible = true;
    },
    getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          // if (index === 2) {
          //   sums[index] = '基金余款';
          //   return;
          // }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += '';
          } else {
            sums[index] = '';
          }
        });
        return sums;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log('rowIndex='+rowIndex, 'columnIndex='+columnIndex, 'rowIndex % 2='+rowIndex % 2)
      if (columnIndex === 0) { //第一列
        if (rowIndex % 3 === 0) { //第几行 向下合并多少？ % ？
          return {
            rowspan: 3,
            colspan: 1
          };
        } else {
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
    this.fetchTableData();
  }
};
</script>


