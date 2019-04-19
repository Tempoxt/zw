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
      <div>
        <el-form ref="form" :model="form" label-width="90px" label-position="left">
            <el-tabs v-model="activeName" >
                <el-tab-pane label="用户信息" name="first">
                    <el-row :gutter="20">
                        <el-col :span="12">
                        <form-render :type="`member`" :field="{name:'员工姓名 ',defaultName:form.real_name}" v-model="form.emID" />
                        </el-col>
                        <el-col :span="12">
                            <form-render :type="`input`" :field="{name:'登录密码',type:'password'}" v-model="form.password" :disabled="form.ldap_check===1"/>
                        </el-col>
                        <el-col :span="12">
                        <form-render :type="`roleGroup`" :field="{name:'所属角色',options:[]}" v-model="form.role"/>
                        </el-col>
                         <el-col :span="12">
                            <form-render :type="`day`" :field="{name:'过期时间',options:[]}" v-model="form.out_time"/>
                        </el-col>
                        <el-col :span="12">
                            <form-render
                                :type="`radio`"
                                :field="{name:'登陆方式',options:[{'label':'系统登陆','value':0},{'label':'域登录','value':1}]}"
                                v-model="form.ldap_check"
                            />
                        </el-col>
                         <el-col :span="12">
                            <form-render
                                :type="`radio`"
                                :field="{name:'状态',options:[{'label':'启用','value':1},{'label':'禁用','value':0}]}"
                                v-model="form.estate"
                            />
                        </el-col>
                        <!-- <el-col :span="12">
                            <form-render :type="`input`" :field="{name:'登录名'}" v-model="form.username" placeholder="默认员工号"/>
                        </el-col> -->
                        <el-col :span="24">
                            <form-render :type="`textarea`" :field="{name:'备注/说明'}" v-model="form.msg_txt" />
                        </el-col>
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
      :table_column="table_field.slice(1,table_field.length)"
      :table_form.sync="table_form"
    ></table-header>


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
    <el-table-column type="index" :index="indexMethod" />

    <el-table-column
      align="left">
      <template slot="header" slot-scope="scope">
        <div class="month-select">
            <span>{{table_form.month|monthFilter}} <span class="el-icon-caret-bottom" style="color:#c0c4cc"></span></span>
            <el-date-picker
                class="picker"
                style="opacity: 0;"
                v-model="table_form.month"
                type="month"
                value-format="yyyy-MM"
                placeholder="选择月份">
            </el-date-picker>
        </div>
      </template>
      <template slot-scope="scope">
          {{scope.row.month}}
      </template>
    </el-table-column>


    <each-table-column :table_field="table_field.filter(f=>f.name!=='month')"/>
    </el-table>
     <table-pagination 
        :total="table_form.total" 
        :pagesize.sync="table_form.pagesize"
        :currentpage.sync="table_form.currentpage"
        @change="fetchTableData"
        ref="table_pagination"
        />
  </ui-table>
</template>
<script>
import * as api_common from "@/api/common";
import * as api_org from "@/api/org";
import table_mixin from "@c/Table/table_mixin";
const api_resource = api_common.resource("restaurant/consumedata");
const defaultForm = ()=>({ldap_check:0,estate:1,role:[]})
import dayjs from 'dayjs'
export default {
    props:{
        currentMenuid:[String,Number]
    },
    mixins: [table_mixin],
  data() {
    return {
      loading: true,
      form:defaultForm(),
      api_resource,
      orgCategory:[],
      defaultForm,
      activeName:'first',
      activeName2:'first',
      checkedCities:[],
      radio:'',
      checkAll:[],
      isIndeterminate:'',
      table_form:{
        month:'',
        pagesize:100,
        currentpage:1,
        query:{
          type:1,
          query:[]
        }
      },
      data2:[
          {
              name:123,
              subs:[
                  {
                       name:123
                  }
              ]
          }
      ],
    //   table_form:defaultTableForm()
    };
  },
  filters:{
      monthFilter(month){
          return dayjs(month).format('YYYY年MM月')
      }
  },
  watch:{
      'table_form.month'(){
          this.fetchTableData()
      },
      async currentMenuid(id){
        //  this.table_form = defaultTableForm()
         this.table_form.orgid = id 
         this.$refs.table_pagination.reset()
         this.fetchTableData();
         
      }
  },
  methods: {
    add(){
     
      this.dialogFormVisible = true;
    },
    async edit(){
      let row = this.table_selectedRows[0]
      this.form = await api_resource.find(row.id);
      this.form.role = this.form.user_roleid
      // .map(item=>item.roleid)
    
      this.dialogFormVisible = true;
    },
    filterNode(){},
    handleChangeNode(){},
    async fetchTableData() {
     this.table_loading = true;
     const {rows,total} =  await api_resource.get(this.table_form);
     this.table_data =rows
     this.table_form.total = total
    //   this.$refs.treeTable.clearSelectedRows();
      setTimeout(() => {
        this.table_loading = false;
      }, 300);
    },
    async handleFormSubmit(){
      let form = Object.assign({},this.form)
      delete form.parent;
      delete form.subs;
      
      form.user_role = form.role 
      delete form.role;
        if(this.isInsert){
            await api_resource.create(form)
        }else{
            await api_resource.update(form.id,form)
        }
        this.dialogFormVisible = false
        this.fetchTableData()
    }
  },
  async created() {
    this.table_form.month = '2019-03'
    const { field, action } = await api_common.menuInit("restaurant/consumedata");
    this.table_field = field;
    this.table_actions = action;
  }
};
</script>
<style lang="scss" scoped>
.month-select {
    position:relative;
    .picker {
        position: absolute;
        left:0;
        top:0;

    }
}
</style>
