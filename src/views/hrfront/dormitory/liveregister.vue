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
    <el-table-column type="index" :index="indexMethod" width="70"/>
    <each-table-column :table_field="table_field"/>
     <!-- <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
            <el-button @click="change({row:scope.row})" type="text" size="small" >审核</el-button>
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
const api_resource = api_common.resource("dormitory/liveregister");
import dateLap from '@/components/Table/DateLap'
import OrgSelect from '@/components/Org/OrgSelect'
import dayjs from 'dayjs'
const defaultForm = () => {
    return {
        estate:1,
        sort:1
    }
}
export default {
  mixins: [table_mixin],
 
  components:{
      dateLap,
      OrgSelect
  },
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
      roomAdminList:[],
      dormList:[],
      dialogForm2Visible:false,
      dialogForm3Visible:false,
      form2:{},
      form3:{}
    };
  },
  watch:{
   
  },
  methods: {
  
    async set(){
        this.form2 = await this.$request.get('/hot/recordbasic')
        this.dialogForm2Visible = true
    },
    async handleForm2Submit(){
        await this.$request.put('/hot/recordbasic',this.form2)
        this.dialogForm2Visible = false
    },

    add(){
        this.form3 = {}
        this.dialogForm3Visible = true
    },
    async change({row}){
        let ids
        if(row){
            ids = row.id
        }else{
            ids = this.table_selectedRows.map(o=>o.id).join(',')
        }
        await this.$request.put('dormitory/checkoutaudit',{
            ids:ids
        })
        this.fetchTableData()
    },

    async edit(){
      let row = this.table_selectedRows[0]
      this.form = await api_resource.find(row.id)
      this.dialogFormVisible = true;
    },
    async fetchTableData() {
   
     this.table_loading = true;
     const {rows , total }= await api_resource.get(this.table_form);
      this.table_data  = rows
       this.table_form.total = total
      setTimeout(() => {
        this.table_loading = false;
      }, 300);
    },
    async handleFormSubmit(){
        let form = Object.assign({},this.form)
        form.org_id = this.id
        if(this.isInsert){
            await api_resource.create(form)
        }else{
            await api_resource.update(form.id,form)
        }
        this.dialogFormVisible = false
        this.fetchTableData()
    },
   async confirm(){
      await this.$request.put('/dormitory/registeruploadstatus',{
        registerType:1,
        ids:this.table_selectedRows.map(o=>o.id).join(',')
      })
      this.fetchTableData()
    },
  },
  async created() {
    const { field, action,table } = await api_common.menuInit("dormitory/liveregister");
    this.table_field = field;
    this.table_actions = action;
    this.table_config = table
    this.fetchTableData();
    // this.table_form.dateLap = dayjs().format('YYYY-MM')
  }
};
</script>


