  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  
  >

    <el-dialog
      title='薪资基础编辑'
      :visible.sync="dialogFormVisible"
      class="public-dialog"
      v-el-drag-dialog
      width="500px"
      >
      <div style="width:400px;margin:0 auto">
        <el-form ref="form" :model="form" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="24">
              <form-render :type="`input`" :field="{name:'姓名'}" v-model="form.staff__chineseName" disabled/>
            </el-col>
            <el-col :span="24">
              <form-render :type="`input`" :field="{name:'工号'}" v-model="form.staff__employeeCode" disabled/>
            </el-col>
            
            <el-col :span="24">
              <form-render :type="`select`" :field="{name:'社保主体',options:social}" v-model="form.staff__socialSecurityMain"/>
            </el-col>
            <el-col :span="24">
              <form-render :type="`select`" :field="{name:'银行',options:banks}" v-model="form.bank"/>
            </el-col>
            <el-col :span="24">
              <form-render :type="`input`" :field="{name:'银行卡号'}" v-model="form.bankaccount"/>
            </el-col>
            <el-col :span="24">
              <form-render :type="`input`" :field="{name:'等别'}" v-model="form.jobLevel"/>
            </el-col>
             <el-col :span="24">
              <form-render :type="`input`" :field="{name:'级别'}" v-model="form.wageLevel"/>
            </el-col>
             <el-col :span="24">
              <form-render :type="`select`" :field="{name:'类别',options:sheetType}" v-model="form.sheetType"/>
            </el-col>   
            
          </el-row>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
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
            <dateLap v-model="table_form.dateLap" itemsD="1" @change="fetch"/>
          </div>
    </table-header>
    <vxe-table
      class="public-vxe-table"  
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
		  :seq-config="{seqMethod: VxeIndexMethod}"
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
      <vxe-table-column type="index" :index="indexMethod" width="80" fixed/>
      <vxe-table-column field="staff__employeeCode" sortable title="工号" width="80" fixed/>
      <vxe-table-column field="staff__chineseName" title="姓名" width="120" fixed/>
      <vxe-table-column v-for="field in table_field.filter(o=>!['staff__employeeCode','staff__employeeCode'].includes(o.name)).filter(column=>!column.fed_isvisiable).
        filter(column=>!column.isvisiable)" :key="field.name" :field="field.name" :title="field.showname" :sortable="field.issort" 
        :width="field.width=='auto'?'': parseInt(field.width)"/>
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
const api_pagemanager = api_common.resource('pagemanager/field')
import table_mixin from "@c/Table/table_mixin";
const api_resource = api_common.resource("basicwage");
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
      social:[],
      banks:[],
      sheetType:[],
			table_topHeight:233,
    };
  },
  watch:{
    id(){
      this.table_form.currentpage = 1
      this.fetchTableData()
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
    add(){
        this.form3 = {}
        this.dialogForm3Visible = true
    },
    async edit(){
      console.log(this.social)
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
  },
  async created() {
    const { field, action,table } = await api_common.menuInit("basicwage");
    this.table_field = field;
    this.table_field.find(o=> o.name=='bank').width = 70
    var socialSecurityMain = this.table_field.filter(o=>['staff__socialSecurityMain'].includes(o.name))[0].sourcefrom.choice
    var social = socialSecurityMain.map(item=>item)
    this.social = social.map(o=>{return {label:o[0],value:o[1]}})

    
    var banks = this.table_field.filter(o=>['bank'].includes(o.name))[0].sourcefrom.choice
    var bank = banks.map(item=>item)
    this.banks = bank.map(o=>{return {label:o[0],value:o[1]}})

    var sheetType = this.table_field.filter(o=>['sheetType'].includes(o.name))[0].sourcefrom.choice
    var sheet = sheetType.map(item=>item)
    this.sheetType = sheet.map(o=>{return {label:o[1],value:o[0]}})

    this.table_actions = action;
    this.table_config = table
    this.fetchTableData();
    this.table_form.dateLap = dayjs().format('YYYY-MM')
  }
};
</script>


