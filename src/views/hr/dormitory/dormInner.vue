  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  
  >


  
  <el-dialog
      :title="dialogStatus==='insert'?'添加':'编辑'"
      :visible.sync="dialogFormVisible"
      class="public-dialog"
      v-el-drag-dialog
    >
      <div style="width:500px;margin:0 auto">
        <el-form ref="form" :model="form" label-width="120px">
          <el-row :gutter="20">
           
            <!-- <el-col :span="24">
              <form-render :type="`input`" :field="{name:'宿舍编号'}" v-model="form.dormCode"/>
            </el-col> -->
             <el-col :span="24">
              <form-render :type="`input`" :field="{name:'宿舍名称*'}" v-model="form.dormName" />
            </el-col>
             <el-col :span="24">
              <form-render :type="`input`" :field="{name:'电费价格*'}" v-model="form.electricPrice"/>
            </el-col>
             <el-col :span="24">
              <form-render :type="`input`" :field="{name:'水费价格*'}" v-model="form.waterPrice"/>
            </el-col>
            <el-col :span="24">
              <form-render :type="`input`" :field="{name:'水表初始读数'}" v-model="form.initalWater" />
            </el-col>
             <el-col :span="24">
              <form-render :type="`input`" :field="{name:'电表初始读数'}" v-model="form.initalElectric"/>
            </el-col>

            <el-col :span="24">
              <form-render :type="`input`" :field="{name:'宿舍地址*'}" v-model="form.dormAddress"/>
            </el-col>
            <el-col :span="24">
              <form-render :type="`map`" :field="{name:'宿舍坐标*'}" v-model="form.dormLocation"/>
            </el-col>
            <el-col :span="24">
              <form-render :type="`select`" :field="{name:'管理员*',options:adminList}" v-model="form.admin"/>
            </el-col>
            
             <el-col :span="24">
              <form-render
                :type="`radio`"
                :field="{name:'是否只有总表',options:[{
                  value: 1,
                  label: '是'
                },{
                  value: 0,
                  label: '否'
                }]}"
                v-model="form.isTotalMeter"
              />
            </el-col>

            
            <el-col :span="24">
              <form-render
                :type="`radio`"
                :field="{name:'记录状态',options:[{
                  value: 1,
                  label: '启用'
                },{
                  value: 0,
                  label: '禁用'
                }]}"
                v-model="form.estate"
              />
            </el-col>
            <el-col :span="24">
              <form-render :type="`textarea`" :field="{name:'备注/说明'}" v-model="form.remark" placeholder="请输入"/>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
      </div>
    </el-dialog>

<el-dialog
      title="地址"
      :visible.sync="dialogMapsVisible"
      class="public-dialog"
      v-el-drag-dialog
    >
      <el-amap class="amap-box" :vid="'amap-vue'" :center="position" style="height:500px">
               
                <el-amap-marker 
                vid="component-marker" 
                :position="position" 
        
                >
                </el-amap-marker>
      </el-amap>
    </el-dialog>



    <table-header
      :table_actions="table_actions"
      :table_selectedRows="table_selectedRows"
      @action="handleAction"
      :table_form.sync="table_form"
      :table_column="table_field"
    ></table-header>
    <el-table
        ref="elTable"
      @selection-change="handleChangeSelection"
      :row-class-name="table_state_className"
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
const api_resource = api_common.resource("dormitory/dorm");
import { MessageBox } from 'element-ui';
const defaultForm = () => {
    return {
        estate:1
    }
}
export default {
  mixins: [table_mixin],
  inject: ['$side'],
  data() {
    let vm = this
    return {
      downloadUrl: '/dormitory/import/room',
      importUploadUrl: '/dormitory/import/room',
      loading: true,
      form:{},
      api_resource,
      orgCategory:[],
      queryDialogFormVisible:true,
      adminList:[],
      defaultForm,
      position:[],
      dialogMapsVisible:false,
       template:{
          dormLocation(column,row){
              const { showMaps } = vm
              return <el-button type="text" onClick={()=>{showMaps(row.dormLocation)}}>{row.dormLocation}</el-button>

          },

      }
    };
  },
  watch:{

  },
  methods: {
    showMaps(pos){
      this.position = pos.split(',').map(Number)
      this.dialogMapsVisible = true
    },
    async fetchTableData() {
     this.$side.getTree()
     this.table_loading = true;
     const {rows , total }= await api_resource.get(this.table_form);
      this.table_data  = rows
       this.table_form.total = total
      setTimeout(() => {
        this.table_loading = false;
      }, 300);
    },
    async add(){
        this.adminList = (await api_common.resource('dormitory/dorm/dormadmin').get()).rows.map(o=>{
            return {
                label:o.chineseName,
                value:o.employeeCode
            }
        })
        this.dialogFormVisible = true
    },
    import(){
     
      let {
        handleImportChange,
      } = this
        MessageBox.alert(
          <el-button-group class="table-import-upload" ref="import">
            <el-button type="primary" onClick={()=>{}}>选择文件</el-button>
            <input type="file" ref="input" class="input" on-change={handleImportChange} ref="importInput"></input>
            <el-button type="" v-show={this.downloadUrl!=''&&this.downloadUrl!=undefined} style="margin-left:20px" onClick={()=>{this.handleDownloadChange()}}>下载模板</el-button>
          </el-button-group>
          , '选择文件导入', {
          showConfirmButton:false,
          center:true
        });
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
        this.adminList = (await api_common.resource('dormitory/dorm/dormadmin').get()).rows.map(o=>{
            return {
                label:o.chineseName,
                value:o.id
            }
        })
      let row = this.table_selectedRows[0]
      this.form = await api_resource.find(row.id)
      this.dialogFormVisible = true;
    }
  },
  async created() {
    const { field, action,table } = await api_common.menuInit("dormitory/dorm");
    this.table_field = field;
    this.table_actions = action;
    this.table_config = table
    this.fetchTableData();
  }
};
</script>


