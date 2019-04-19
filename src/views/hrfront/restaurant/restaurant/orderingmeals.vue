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
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="订餐日期">
            <el-date-picker
              v-model="form.datelist"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-DD"
              :picker-options="pickerOptions2">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="记录状态">
             <el-checkbox-group v-model="form.mealist">
                <el-checkbox :label="item.id" v-for="item in meal" :key="item.id">{{item.mealname}}</el-checkbox>
              </el-checkbox-group>
          </el-form-item>
           <el-form-item label="选择员工">
               <el-select v-model="form.employeelist"  multiple placeholder="请选择" filterable style="width:100%">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    <span style="float: left">{{ item.name }} - {{ item.employeeCode }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px"></span>

                  </el-option>
                </el-select>


          </el-form-item>
       </el-form>
            <!-- <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
            </el-input> -->
            <!-- <el-tree
            class="filter-tree"
            :data="data2"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            ref="tree2">
            </el-tree> -->

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
    <each-table-column :table_field="table_field"/>
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
const api_resource = api_common.resource("restaurant/bookmeal");
const defaultForm = ()=>({ datelist:[], employeelist:[],mealist:[3,4]})
export default {
    props:{
        currentMenuid:[Number,String]
    },
    mixins: [table_mixin],
  data() {
    return {
      value7:'',
      filterText:'',
      loading: true,
      form:{
        employeelist:[],
        mealist:[1,2,3]
      },
      api_resource,
      orgCategory:[],
      defaultForm,
      activeName:'first',
      activeName2:'first',
      checkedCities:[],
      radio:'',
      checkAll:[],
      isIndeterminate:'',
      checkList:[],
      meal:[],
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
      options: [],
      pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
    //   table_form:defaultTableForm()
    };
  },
  watch:{
      async currentMenuid(id){
        //  this.table_form = defaultTableForm()

        this.table_form.orgid = this.currentMenuid
         this.$refs.table_pagination.reset()
         this.fetchTableData();
         
      }
  },
  methods: {
    filterMethod(val){
      return this.options.filter(o=>{
        return o.name.indexOf(val)!==-1 || (o.employeeCode+'').indexOf(val)!==-1
      })
     
    },
    async add(){
       this.options = await api_common.resource('user/partuser').get({org_id:this.currentMenuid})
        console.log(this.options,'this.options')
      this.meal = await api_common.resource('restaurant/meal').get()
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
      console.log(this.form,'form')
      let form = Object.assign({},this.form)
      form.orgid = this.currentMenuid
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
    const { field, action } = await api_common.menuInit("restaurant/bookmeal");
    this.table_field = field;
    this.table_actions = action;

    
  }
};
</script>
