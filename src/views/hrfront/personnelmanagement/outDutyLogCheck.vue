  <template>
  <ui-table ref="table" 
    :table_column="table_field" 
    :table_query.sync="table_form.query"
    @query="querySubmit"
    >
     <el-dialog
      title="添加"
      :visible.sync="dialogFormVisible"
      class="public-dialog"
      v-el-drag-dialog
      width="800px"
      >

      <el-form ref="form" :model="form" label-width="100px" :inline="true" :rules="rules">

            <el-form-item label="离职日期" prop="quitdate">
                <el-date-picker
                    v-model="form.quitdate"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    placeholder="请选择"
                    >
                </el-date-picker>
            </el-form-item>
            
            <el-form-item label="离职原因" prop="reasonid">
                <el-select v-model="form.reasonid" placeholder="请选择">
                    <el-option
                        v-for="item in reasons"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

          <el-form-item label="离职类别" prop="quittype">
            <el-select v-model="form.quittype" placeholder="请选择">
              <el-option
              v-for="item in status"
              :key="item.id"
              :label="item.title"
              :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
      </el-form>

      <OrgSelect :result="result" v-model="form.staffid" ref="OrgSelect" v-if="dialogFormVisible"/>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"  @click="handleFormSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <table-header
        :table_actions="table_actions"
        :table_selectedRows="table_selectedRows"
        @action="handleAction"
        :table_form.sync="table_form"
        :table_column="table_field"
    >
        <!-- <div style="padding-left:10px">
            <dateLap v-model="table_form.dateLap" @change="fetchTableData"/>
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
        >
        <el-table-column 
            type="selection" 
            width="60" 
            class-name="table-column-disabled"
            :selectable="table_disable_selected"
            >
        </el-table-column>
        <el-table-column type="index" :index="indexMethod" />
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
import dayjs from 'dayjs'
import OrgSelect from '@/components/Org/OrgSelect'
const api_resource = api_common.resource("hrm/quit");
export default {
    mixins: [table_mixin],
    props:['flag'],
    components:{
      OrgSelect,
    },
    data() {
        return {
            loading: true,
            form:{},
            api_resource,
            orgCategory:[],
            queryDialogFormVisible:true,
            table_topHeight:296,
            dialogFormVisible:false,
            reasons:[],
            status:[],
             rules:{
                quitdate:[
                    { required: true, message: '请选择', trigger: 'blur' },
                ],
                reasonid:[
                    { required: true, message: '请选择', trigger: 'blur' },
                ],
                quittype:[
                    { required: true, message: '请选择', trigger: 'blur' },
                ],
            },
			result:[],
        };
    },
    watch:{
        flag(){
			this.table_form.query.query = []
			// this.table_form.keyword = ''
			this.table_form.currentpage = 1
            this.fetchMenu()
            this.fetchTableData()
        }
    },
    methods: {
        async handleFormSubmit(){
            await this.form_validate()
            let staffid = this.$refs.OrgSelect.getIdsResult()
            this.form.staffid = staffid
            let form = Object.assign({},this.form)
            await this.$request.post('/hrm/quit',form)
            this.dialogFormVisible = false
            this.fetchTableData()
        },
        async away(){
            let rows = this.table_selectedRows.map(row=>row.id)
            await this.$request.put('/hrm/quit/bluk',{
                action:'forbid',
                ids:rows.join(',')
            })
            this.fetchTableData()
        },
        add(){
			this.result = []
            this.form = {}
            this.dialogFormVisible = true
            this.getReasons()
            this.getStatus()
        },
        async getReasons(){
            this.reasons = await this.$request.get('/basicdata/dtl?main=1')
        },
        async getStatus(){
            this.status = await this.$request.get('/basicdata/dtl?main=2')
        },
        async fetchTableData() {
            this.table_loading = true;
            this.table_form.flag = this.flag
            const {rows , total }= await api_resource.get(this.table_form);
            this.table_data  = rows
            this.table_form.total = total
            setTimeout(() => {
                this.table_loading = false;
                this.$refs.elTable.doLayout()

            }, 300);
        },
        async fetchMenu(){
            const { field, action,table } = await api_common.menuInit("outDutyLog"+this.flag);
            this.table_field = field;
            this.table_actions = action;
            this.table_config = table
        }
    },
    
    async created() {
        this.fetchMenu()
        // this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM'))
        this.fetchTableData();
    }
};
</script>


