  <template>
  <ui-table 
  ref="table"
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
                          <form-render :type="`member`" :field="{name:'员工姓名 ',defaultName:form.real_name}" v-model="form.emID"/>
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
                <!-- <el-tab-pane label="权限设置" name="second">
                    <el-row type="flex" class="row-bg">
                    <el-col :span="8">
                          <el-tree
                            class="tree"
                            :data="data2"
                            :props="{children: 'subs', label: 'name' }"
                            default-expand-all
                            node-key="id"
                            show-checkbox
                            :filter-node-method="filterNode"
                            ref="tree2"
                            :highlight-current="true"
                            :check-on-click-node="false"
                            @node-click="handleChangeNode"
                        >
                            <span slot-scope="{ node, data }">
                            <span v-if="node.isLeaf" class="icon iconfont icon-zuzhi2"></span>
                            <span v-else class="icon iconfont icon-gongneng"></span>&nbsp;
                            <span>{{ node.label }}</span>
                            </span>
                        </el-tree>
                    </el-col>
                    <el-col :span="15">
                         <el-tabs v-model="activeName2">
                            <el-tab-pane label="功能权限" name="first">
                                     <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" >全选</el-checkbox>
                                  <el-checkbox-group v-model="checkedCities">
                                        <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                                    </el-checkbox-group>
                            </el-tab-pane>
                            <el-tab-pane label="字段权限" name="second">
                                <el-row :gutter="20">
                                    <el-col :span="9">
                                        <span>姓名</span>
                                    </el-col>
                                    <el-col :span="5">
                                         <el-radio v-model="radio" label="1">读写</el-radio>
                                    </el-col>
                                    <el-col :span="5">
                                        <el-radio v-model="radio" label="1">只读</el-radio>
                                    </el-col>
                                    <el-col :span="5">
                                        <el-radio v-model="radio" label="1">不可见</el-radio>
                                    </el-col>
                                </el-row>
                                <br />
                                <el-row :gutter="20">
                                    <el-col :span="9">
                                        <span>姓名</span>
                                    </el-col>
                                    <el-col :span="5">
                                         <el-radio v-model="radio" label="1">读写</el-radio>
                                    </el-col>
                                    <el-col :span="5">
                                        <el-radio v-model="radio" label="1">只读</el-radio>
                                    </el-col>
                                    <el-col :span="5">
                                        <el-radio v-model="radio" label="1">不可见</el-radio>
                                    </el-col>
                                </el-row>
                                <br />
                                <el-row :gutter="20">
                                    <el-col :span="9">
                                        <span>姓名</span>
                                    </el-col>
                                    <el-col :span="5">
                                         <el-radio v-model="radio" label="1">读写</el-radio>
                                    </el-col>
                                    <el-col :span="5">
                                        <el-radio v-model="radio" label="1">只读</el-radio>
                                    </el-col>
                                    <el-col :span="5">
                                        <el-radio v-model="radio" label="1">不可见</el-radio>
                                    </el-col>
                                </el-row>

                            </el-tab-pane>
                      
                        </el-tabs>
                    </el-col>
   
                    </el-row>
                </el-tab-pane> -->
            </el-tabs>


        </el-form>
      </div>
      

      <div slot="footer" class="dialog-footer  dialog-multiple-footer">
        <div>
          <el-switch
              v-if="isInsert"
              v-model="form_multiple"
              active-text="连续添加"
              inactive-text="">
          </el-switch>
        </div>
        <div>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
        </div>
       
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


    <!-- <tree-table
      :data="table_data"
      v-loading="loading"
      ref="treeTable"
      :table_actions="table_actions"
      :selectedRows.sync="table_selectedRows"
      :label="table_field[0] && table_field[0].showname"
    >
      <el-table-column
        :label="column.showname"
        v-for="(column,index) in table_field.slice(1,table_field.length).filter(column=>!column.fed_isvisiable)"
        :key="column.id"
      >
        <template slot-scope="scope">
          <template v-if="column.name==='department'">
           {{scope.row[column.name].name}}
          </template>
          <template v-else-if="column.name==='user_role'">
              <span v-for="item in scope.row[column.name]" :key="item.roleid">{{item.rolemodels_name}}</span>
          </template>
          <template v-else-if="column.name==='estate'">{{scope.row['estate']===1?'启用':'禁用'}}</template>
          <template v-else>{{scope.row[column.name]}}</template>
        </template>
      </el-table-column>
    </tree-table> -->



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
const api_resource = api_common.resource("user");
const defaultForm = ()=>({ldap_check:1,estate:1,role:[]})

const cityOptions = ['上海', '北京', '广州', '深圳'];

export default {
    props:{
        currentMenuid:Number
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
      cities: cityOptions,
      radio:'',
      checkAll:[],
      isIndeterminate:'',
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
  watch:{
      async currentMenuid(id){
        //  this.table_form = defaultTableForm()
         this.table_form.orgid = id 
         this.$refs.table_pagination.reset()
         this.fetchTableData();
         
      }
  },
  methods: {
    add(){
      this.form = defaultForm()
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
        if(this.form_multiple){
            this.form.emID = ''
            this.fetchTableData()
        }else{
            this.dialogFormVisible = false
            this.fetchTableData()
        }
    }
  },
  async created() {
    const { field, action } = await api_common.menuInit("user");
    this.table_field = field;
    this.table_actions = action;
  }
};
</script>
