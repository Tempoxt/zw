  <template>
  <ui-table ref="table" 
    :table_column="table_field" 
    :table_query.sync="table_form.query"
    @query="querySubmit"
  class="mini-table"
    >

    <table-header
      :table_actions="table_actions"
      :table_selectedRows="table_selectedRows"
      @action="handleAction"
      :table_form.sync="table_form"
      :table_column="table_field"
    >
      <div style="padding-left:10px">
        <dateLap v-model="table_form.dateLap" type="3" :disabled="true" @change="fetch"/>
      </div>
    </table-header>
    <vxe-table
      class="public-vxe-table"  
      ref="elTable"
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
      
    >
    <vxe-table-column 
      type="selection" 
      width="60" 
      class-name="table-column-disabled"
      :selectable="table_disable_selected"
      >
      </vxe-table-column>
      <vxe-table-column type="index" :index="indexMethod" width="70" fixed/>
      <vxe-table-column v-for="field in table_field.filter(o=>!['signState','signImage'].includes(o.name)).filter(column=>!column.fed_isvisiable).filter(column=>!column.isvisiable)" :key="field.name" 
        :field="field.name" :title="field.showname" :width="field.width=='auto'?'': parseInt(field.width)"/>
      <vxe-table-column prop="signState" label="签收状态">
        <template slot-scope="scope">
          <el-tag size="mini" type="danger" v-if="scope.row.signState==1">未签收</el-tag>
          <el-tag size="mini" type="success" v-if="scope.row.signState==2">已签收</el-tag>
          <el-tag size="mini" type="success" v-if="scope.row.signState==3">默认签收</el-tag>
        </template>
    </vxe-table-column>
    <vxe-table-column prop="signImage" label="签名" width="100">
        <template v-slot="{ row }">
          <img v-if="row.signImage!=undefined&&row.signImage!=''" :src="baseUrl+row.signImage" width="70" height="30"/>
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
import dayjs from 'dayjs'
let baseUrl = process.env.VUE_APP_STATIC
const api_resource = api_common.resource("salary/bonus");
export default {
  mixins: [table_mixin],
  props:['id'],
  data() {
    return {
      baseUrl,
      vxeHeaderStyle:{background:'#F5FAFB',color:'#37474F'},
      loading: true,
      api_resource,
    };
  },
  watch:{
    id(){
      this.table_form.currentpage = 1
      this.fetchTableData()
    },
  },
  methods: {
    handleChangeSelection({selection:val}){ // 单选
        this.table_selectedRowsInfo = val
        this.table_selectedRows = val
        this.$emit("update:table_selectedRows",val)
    },
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
    fetch(){
        this.table_form.currentpage = 1
        this.fetchTableData()
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
  },
  async created() {
    const { field, action,table } = await api_common.menuInit("salary/bonus");
    this.table_field = field;
    this.table_actions = action;
    this.table_config = table
    this.$set(this.table_form,'dateLap',dayjs().subtract(1,'year').format('YYYY'))
    this.fetchTableData();
  }
};
</script>


