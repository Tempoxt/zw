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
      width="540px"
    >
      <div style="width:500px;margin:0 auto">
        <el-form ref="form" :model="form" label-width="100px">
             <el-tabs v-model="activeName" >
                <el-tab-pane label="物品资料" name="first">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <form-render :type="`input`" :field="{name:'物品名称'}" v-model="form.name"/>
                        </el-col>
                        <el-col :span="24">
                            <form-render :type="`input`" :field="{name:'物品价格'}" v-model="form.price"/>
                        </el-col>
                        <el-col :span="24">
                        <form-render
                            :type="`select`"
                            :field="{name:'物品分类',options:clothesSeasonData}"
                            v-model="form.type"
                        />
                        </el-col>
                        <el-col :span="24">
                        <form-render
                            :type="`select`"
                            :field="{name:'适用部门',options:clothesDepData}"
                            v-model="form.depart"
                            
                        />
                        </el-col>
                        <el-col :span="24">
                        <form-render
                            :type="`select`"
                            :field="{name:'适用职位',options:clothesJobData}"
                            v-model="form.job"
                            
                        />
                        </el-col>
                        <el-col :span="24">
                            <form-render
                                :type="`select`"
                                :field="{name:'物品款式',options:clothesSexData}"
                                v-model="form.gender"
                            />
                        </el-col>
                        <el-col :span="24">
                             <form-render
                                :type="`img`"
                                :field="{name:'图片',}"
                                :data="{'upload_msg':'workclothes_photo'}"
                                v-model="form.image"
                            />
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="SKU" name="second">
                     <el-row :gutter="20">
                        <el-col :span="24" v-for="item in clothesModelData" :key="item.label">
                            <form-render :type="`input`" :field="{name:item.label}" v-model="form[item.label]"/>
                        </el-col>
                        <!-- <el-col :span="24">
                            <form-render :type="`input`" :field="{name:'M'}" v-model="form.M"/>
                        </el-col>
                        <el-col :span="24">
                            <form-render :type="`input`" :field="{name:'L'}" v-model="form.L"/>
                        </el-col>
                        <el-col :span="24">
                            <form-render :type="`input`" :field="{name:'XL'}" v-model="form.XL"/>
                        </el-col>
                        <el-col :span="24">
                            <form-render :type="`input`" :field="{name:'XXL'}" v-model="form.XXL"/>
                        </el-col>
                         <el-col :span="24">
                            <form-render :type="`input`" :field="{name:'XXXL'}" v-model="form.XXXL"/>
                        </el-col> -->
                    </el-row>
                </el-tab-pane>

            </el-tabs>


          
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
       <dateLap v-model="table_form.dateLap" @change="fetchTableData" type="3" />
     </div>
    </table-header>
    <el-table
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
const api_resource = api_common.resource("workclothes/record");
import dateLap from '@/components/Table/DateLap'
import dayjs from 'dayjs'
const defaultForm = () => {
    return {
        estate:0,
 
    }
}
export default {
  mixins: [table_mixin],
  components:{
    dateLap
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
      roomList:[],
      activeName:'first',
      clothesSeasonData:[],
      clothesDepData:[],
      clothesSexData:[],
      clothesJobData:[],
      clothesModelData:[]
    };
  },

  methods: {
    async fetchTableData() {
    //  this.$side.getTree()
     this.table_loading = true;

     const {rows , total }= await api_resource.get(this.table_form);
      this.table_data  = rows
       this.table_form.total = total
      setTimeout(() => {
        this.table_loading = false;
      }, 300);
    },
    async initForm(){
        this.clothesSeasonData = await api_common.getTag('clothesSeason')
        this.clothesDepData = await api_common.getTag('clothesDep')
        this.clothesSexData = await api_common.getTag('clothesSex')
        this.clothesJobData = await api_common.getTag('clothesJob')
        this.clothesModelData = await api_common.getTag('clothesModel')

    },
    async add(){
        await this.initForm()
        this.form.room = this.id
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
      await this.initForm()
      let row = this.table_selectedRows[0]
      this.form = await api_resource.find(row.id)
      this.dialogFormVisible = true;
    }
  },
  async created() {
    const { field, action,table } = await api_common.menuInit("workclothes/record");
    this.table_field = field;
    this.table_actions = action;
    this.table_config = table
    this.table_form.dateLap = dayjs().format('YYYY')
    this.fetchTableData();
    
  }
};
</script>


