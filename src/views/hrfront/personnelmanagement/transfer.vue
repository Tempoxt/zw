<template>
  <ui-table ref="table" 
    :table_column="table_field" 
    :table_query.sync="table_form.query"
    @query="querySubmit"
    
    >

    <el-dialog
      title="员工调动"
      :visible.sync="dialogForm3Visible"
      class="public-dialog"
      v-el-drag-dialog
      width="800px"
      >

      <el-form ref="form3" :model="form3" label-width="100px" :inline="true">

          <el-form-item label="调动日期">
            <el-date-picker
                v-model="form3.transferDate"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="选择日期"
                >
            </el-date-picker>
          </el-form-item>
          
          <el-form-item label="调动区域">
            <el-select v-model="form3.workGroup" placeholder="请选择">
              <el-option
              v-for="item in areaDa"
              :key="item.id"
              :label="item.officeaddressname"
              :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="调至小组">
            <el-select v-model="form3.team" placeholder="请选择">
              <el-option
              v-for="item in optionsDa"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

      </el-form>

      <OrgSelect v-model="form3.ids" ref="OrgSelect" v-if="dialogForm3Visible"/>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm3Visible = false">取 消</el-button>
        <el-button type="primary"  @click="handleForm3Submit">确 定</el-button>
      </div>
    </el-dialog>


    <table-header
      :table_actions="table_actions"
      :table_selectedRows="table_selectedRows"
      @action="handleAction"
      :table_form.sync="table_form"
      :table_column="table_field"
    >
      <div style="padding-left:10px">
        <dateLap v-model="table_form.dateLap" @change="fetchTableData"/>
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
const api_resource = api_common.resource("transfer/record");
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
  props:['id'],
  props:{
        value:{},
    },
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
      dialogForm3Visible:false,
      form3:{
        transferDate:'',
        team:'',
        workGroup:'',
        ids:''
      },
      optionsDa:[],
      areaDa:[],
      date:'',
      isDisabled:true,
      isdisabledFn:true
      //changeDisable:true,
    };
  },
  // computed:{
  //   isdisabledFn(){
  //     console.log(this.form3,'dhddddddd')
  //     if(this.today!=''&&this.form3.team!= undefined){
  //       //return this.isDisable = false;
  //     }else{
  //      // return this.isDisable = true;
  //     }
  //   },
  // },
  watch:{
    data(val){
      console.log(val,'----------------')
    }
  },
  methods: {
    async handleForm3Submit(){
      this.form3.ids = this.$refs.OrgSelect.getIdsResult()
      let form = Object.assign({},this.form3)
      console.log(this.form3,'mmmmmmmm')
      await this.$request.post('/transfer/record',form)
      this.dialogForm3Visible = false
      this.fetchTableData()
    },
    add(){
      this.form3 = {}
      this.$set(this.form3,'transferDate',dayjs().format('YYYY-MM-DD'))
      console.log(this.form3)
      this.dialogForm3Visible = true
      this.getOptions();
      this.getAreas()
    },
    async fetchTableData() {
      this.table_loading = true;
      this.table_form.org_id = this.id
      const {rows , total }= await api_resource.get(this.table_form);
      this.table_data  = rows
      this.table_form.total = total
      setTimeout(() => {
        this.table_loading = false;
      }, 300);
    },
    async getOptions(){//获取调至小组的下拉选项
      this.optionsDa = await this.$request.get('/org/teamselect')
    },
    async getAreas(){//获取调至区域的下拉选项
      this.areaDa = await this.$request.get('/officeaddress')
    },
  },

  async created() {
    const { field, action,table } = await api_common.menuInit("transfer/record");
    this.table_field = field;
    this.table_actions = action;
    this.table_config = table
    this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM'))
    this.fetchTableData();
  }
};
</script>


