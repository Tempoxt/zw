  <template>
  <ui-table 
  ref="table" 
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
            v-model="table_form.dateLap"
            type="month"
            size="medium"
            @change="fetch"
            format="yyyy年MM月"
            value-format="yyyy-MM"
            placeholder="选择月份">
          </el-date-picker>
    </div>
      <!-- <div style="padding-left:10px">
          <dateLap v-model="table_form.dateLap" @change="fetch"/>
        </div> -->
    </table-header>
    <el-table
      ref="elTable"
      @selection-change="handleChangeSelection"
      :data="table_data"
      border
      style="width: 100%"
      v-loading="table_loading"
      :header-cell-style="headerCellStyle"
      :height="table_height"
      @header-dragend="table_dragend"
      @sort-change="table_sort_change"
      :show-summary="table_config.isShowFooter"
      :summary-method="getSummaries"
    >
    <el-table-column 
      type="selection" 
      width="60" 
      class-name="table-column-disabled"
      :selectable="table_disable_selected"
      >
      </el-table-column>
    <el-table-column type="index" :index="indexMethod" width="70"/>
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
import dayjs from 'dayjs'
const api_resource = api_common.resource("staffinsure/accidentinsrecord");
export default {
	mixins: [table_mixin],
  props:['id'],
	data() {
		return {
      loading: true,
      api_resource,
      orgCategory:[],
      queryDialogFormVisible:true,
      table_topHeight:235,
      current:'',
      template:{
				auditStatus_display(column,row){
          if(row.auditStatus==1){
            return  <el-tag size="mini" type="info">未审核</el-tag>
          }else if(row.auditStatus==2){
            return  <el-tag size="mini">已审核</el-tag>
          }else if(row.auditStatus==3){
            return  <el-tag size="mini" type="danger">未结付</el-tag>
          }else{
            return  <el-tag size="mini" type="success">已结付</el-tag>
          }
        },
        is_staff(column,row){
          if(row.is_staff==0){
            return <span>在职</span>
          }else{
            return <span>离职</span>
          }
        }
      }
		};
	},
	watch:{
		id(){
      this.table_form.currentpage = 1
			this.fetchTableData()
		}
  },
	methods: {
     fetch(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
    table_disable_selected(row){
      if(row.auditStatus!=1||(this.current==this.table_form.dateLap&&row.is_staff==0)){
        return false
      }else{
        return true
      }
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
    async audit(){
      let rows = this.table_selectedRows.map(row=>row.id)
      await this.$request.put('staffinsure/accidentinsureaudit',{
				ids: rows.join(','),
			})
			this.fetchTableData();
    },
		async fetchMenu(){
			const { field, action,table } = await api_common.menuInit("accidentInsRecord");
			this.table_field = field;
			this.table_actions = action;
			this.table_config = table
		}
	},
	async created() {
		this.fetchMenu()
    this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM'))
    this.current = dayjs().format('YYYY-MM')
		this.fetchTableData();
	}
};
</script>


