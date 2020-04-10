  <template>
  <ui-table ref="table" 
    :table_column="table_field" 
    :table_query.sync="table_form.query"
    @query="querySubmit"
    >

    <el-dialog
        title="调整"
        :visible.sync="dialogForm3Visible"
        class="public-dialog"
        v-el-drag-dialog
        width="800px"
        >

        <el-form ref="form" :model="form" label-width="100px" >
            <el-tabs @tab-click="tabClick">
                <el-tab-pane label="工作资料">
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">姓名</el-col><el-col :span="10"><el-input v-model="form3.basicWage"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">工号</el-col><el-col :span="10"><el-input v-model="form3.overtime"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">部门</el-col><el-col :span="10"><el-input v-model="form3.weekendWelfare"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">职位</el-col><el-col :span="10"><el-input v-model="form3.welfare"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">标准工资</el-col><el-col :span="10"><el-input v-model="form3.fullAtt"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">工作天数</el-col><el-col :span="10"><el-input v-model="form3.minPerformance"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">平时加班</el-col><el-col :span="10"><el-input v-model="form3.performance"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">休息加班</el-col><el-col :span="10"><el-input v-model="form3.performance"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">假日加班</el-col><el-col :span="10"><el-input v-model="form3.performance"></el-input> </el-col></el-row>
                </el-tab-pane>
                <el-tab-pane label="津贴奖金">
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">加班津贴</el-col><el-col :span="10"><el-input v-model="form3.basicWage"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">生活补助</el-col><el-col :span="10"><el-input v-model="form3.overtime"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">高温津贴</el-col><el-col :span="10"><el-input v-model="form3.weekendWelfare"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">夜班津贴</el-col><el-col :span="10"><el-input v-model="form3.welfare"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">工龄奖</el-col><el-col :span="10"><el-input v-model="form3.fullAtt"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">岗位基础奖金</el-col><el-col :span="10"><el-input v-model="form3.minPerformance"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">岗位基础考核奖金</el-col><el-col :span="10"><el-input v-model="form3.performance"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">绩效奖金</el-col><el-col :span="10"><el-input v-model="form3.performance"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">其他奖金</el-col><el-col :span="10"><el-input v-model="form3.performance"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">补其他</el-col><el-col :span="10"><el-input v-model="form3.performance"></el-input> </el-col></el-row>
                </el-tab-pane>
                <el-tab-pane label="扣除项目">
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">无薪假</el-col><el-col :span="10"><el-input v-model="form3.basicWage"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">请假工时</el-col><el-col :span="10"><el-input v-model="form3.overtime"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">请假金额</el-col><el-col :span="10"><el-input v-model="form3.weekendWelfare"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">迟到早退工时</el-col><el-col :span="10"><el-input v-model="form3.welfare"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">迟到早退金额</el-col><el-col :span="10"><el-input v-model="form3.fullAtt"></el-input> </el-col></el-row>
                </el-tab-pane>
                <el-tab-pane label="薪酬纳税">
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">全勤奖</el-col><el-col :span="10"><el-input v-model="form3.basicWage"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">应付合计</el-col><el-col :span="10"><el-input v-model="form3.overtime"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">社保</el-col><el-col :span="10"><el-input v-model="form3.weekendWelfare"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">公积金</el-col><el-col :span="10"><el-input v-model="form3.welfare"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">个税</el-col><el-col :span="10"><el-input v-model="form3.fullAtt"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">伙食费</el-col><el-col :span="10"><el-input v-model="form3.minPerformance"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">住宿费</el-col><el-col :span="10"><el-input v-model="form3.performance"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">借款</el-col><el-col :span="10"><el-input v-model="form3.performance"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">纳税调整项</el-col><el-col :span="10"><el-input v-model="form3.performance"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">应纳税所得额</el-col><el-col :span="10"><el-input v-model="form3.performance"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">税后实发</el-col><el-col :span="10"><el-input v-model="form3.performance"></el-input> </el-col></el-row>
                </el-tab-pane>
            </el-tabs>
        </el-form>


        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogForm3Visible = false">取 消</el-button>
            <el-button type="primary" @click="handleForm3Submit">确 定</el-button>
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
            <dateLap v-model="table_form.dateLap" @change="fetch"/>
          </div>
    </table-header>
    <vxe-table
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
      :show-footer="table_config.isShowFooter"
      :footer-method="footerMethod"
    >
    <vxe-table-column 
      type="selection" 
      width="60" 
      class-name="table-column-disabled"
      :selectable="table_disable_selected"
      >
      </vxe-table-column>
      <vxe-table-column type="index" :index="indexMethod" width="70" fixed/>
      <vxe-table-column prop="month" label="月份" fixed/>
      <vxe-table-column prop="signState" label="签收状态" fixed>
          <template slot-scope="scope">
            <el-tag size="mini" type="danger" v-if="scope.row.signState==1">未签收</el-tag>
            <el-tag size="mini" type="success" v-if="scope.row.signState==2">已签收</el-tag>
            <el-tag size="mini" type="success" v-if="scope.row.signState==3">默认签收</el-tag>
          </template>
      </vxe-table-column>
      <vxe-table-column prop="chineseName" label="姓名" fixed>
          <template slot-scope="scope">
              <div v-html="scope.row.staff__chineseName"></div>
          </template>
      </vxe-table-column>
      <vxe-table-column prop="staff__employeeCode" label="工号" fixed>
          <template slot-scope="scope">
              <div v-html="scope.row.staff__employeeCode"></div>
          </template>
      </vxe-table-column>
      <vxe-table-column v-for="field in table_field.filter(o=>!['month','signState','staff__chineseName','staff__employeeCode'].includes(o.name)).
        filter(column=>!column.fed_isvisiable).filter(column=>!column.isvisiable)" :key="field.name" :field="field.name" 
        :title="field.showname" :width="field.width=='auto'?'': parseInt(field.width)" :sortable="field.issort" />
      <!-- <each-table-column :table_field="table_field.filter(o=>!['month','signState','staff__chineseName','staff__employeeCode'].includes(o.name))"/> -->
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
const api_resource = api_common.resource("salary/f");
const defaultForm = () => {
    return {
        estate:1,
        sort:1
    }
}
export default {
  mixins: [table_mixin],
  props:['id'],
  computed:{
    count1(){
      return ['basicWage','overtime','weekendWelfare','welfare','fullAtt','minPerformance','performance'].map(o=>+this.formData[o]).reduce((total,num)=>(
        total+=num
      ))||0
    },
    count2(){
      return ['basicWage','overtime','weekendWelfare','welfare','fullAtt','minPerformance','performance'].map(o=>+this.form3[o]).reduce((total,num)=>(
        total+=num
      ))||0
    },
  },
  data() {
    return {
      vxeHeaderStyle:{background:'#F5FAFB',color:'#37474F'},
      loading: true,
      form:{},
      api_resource,
      orgCategory:[],
      queryDialogFormVisible:true,

      adminList:[],
      defaultForm,
      roomAdminList:[],
      dormList:[],
      dialogForm2Visible:false,
      dialogForm3Visible:false,
      form2:{},
      form3:{
        otWeekday:2
      },
      formData:[],
    };
  },
  watch:{
    id(){
      this.table_form.currentpage = 1
      this.fetchTableData()
    },
    async 'form3.staff'(staff){
        const result = await this.$request.get('/basicwage',{params:{staff}})
        this.formData = result[0]
        this.form3 = Object.assign({},this.formData,this.form3)
    },
    async 'form3.total'(val){
      if(val>2000){
         const res = await this.$request.get('basicwage/cal',{
            params:{
              wage:val,
              otWeekday:this.form3.otWeekday
            }
          })
         this.form3 =  Object.assign(this.form3,res)
         console.log(this.form3)
      }
     
    }
  },
  methods: {
    handleChangeSelection({selection:val}){ // 单选
        this.table_selectedRowsInfo = val
        this.table_selectedRows = val
        this.$emit("update:table_selectedRows",val)
			  let xTable = this.$refs.xTable
        xTable.updateFooter()
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
    async set(){
        this.form2 = await this.$request.get('/hot/recordbasic')
        this.dialogForm2Visible = true
    },
    async handleForm2Submit(){
        await this.$request.put('/hot/recordbasic',this.form2)
        this.dialogForm2Visible = false
    },
    async handleForm3Submit(){

    
      await this.$request.post('basicwage/applysheet',this.form3,{
        params:{
          sheetType:2
        }
      })
    
      this.dialogForm3Visible = false
    },
    add(){
        this.form3 = {
          otWeekday:2
        }
        this.formData = {}
        this.dialogForm3Visible = true
    },
    async edit(){
      let row = this.table_selectedRows[0]
      this.form = await api_resource.find(row.id)
      this.dialogFormVisible = true;
    },
    async fetchTableData() {
     if(!this.id){
       return
     }
     this.table_loading = true;
     this.table_form.org_id = this.id
     this.table_form.sheetType = 2
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
     async tabClick(v){
        console.log(v.label,'v.label')
        this.tab_label  = v.label
    },
  },
  async created() {
    const { field, action,table } = await api_common.menuInit("staffSalary");
    this.table_field = field;
    this.table_actions = action;
    this.table_config = table
    this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM'))
    this.fetchTableData();
  }
};
</script>
<style>
    .alignRight{
        text-align: right;
        margin-top: 8px;
    }
    .mb10{
        margin-bottom: 15px;
    }
</style>


