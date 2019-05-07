<template>
    <div>
         <el-tabs v-model="view_activeName"  class="tabs" ref="tabs" @tab-click="tabClick">
            <el-tab-pane :label="item.levelname" :name="item.levelname" lazy v-for="item in table_tabs_options" :key="item.levelname">
            </el-tab-pane>
          </el-tabs>

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
      <div >
        <el-form ref="form" :model="form" label-width="110px" :rules="rules">
          <el-row :gutter="20">
           <div class="line-box">
            <el-col :span="12">
              <form-render :type="`select`" :disabled="dialogFormStatus==='update'" :field="{name:'餐次名称',options:mealname}" v-model="form.mealid" @change="changeMealname"  prop="mealid"/>
            </el-col>
             <el-col :span="12">
              <form-render :type="`input`" :field="{name:'默认费用'}" v-model="form.mealprice" prop="mealprice" />
            </el-col>
             <el-col :span="12">
              <form-render :type="`number`" :field="{name:'餐次顺序'}" v-model="form.mealqueue"  prop="mealqueue" />
            </el-col>
            <el-col :span="12">
              <form-render :type="`input`" :field="{name:'默认个人支付'}" v-model="form.mealpay" prop="mealpay"/>
            </el-col>
             <el-col :span="12">
              <form-render :type="`time`" :field="{name:'开始时间'}" v-model="form.mealstart" prop="mealstart" />
            </el-col>
           <el-col :span="12">
              <form-render :type="`input`" :field="{name:'默认公司支付'}" v-model="form.mealsubsidy"/>
            </el-col>
             <el-col :span="12">
              <form-render :type="`time`" :field="{name:'结束时间'}" v-model="form.mealend" prop="mealend"/>
            </el-col>
            <el-col :span="12">
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
            </div>
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

    <table-header
      :table_actions="table_actions"
      :table_selectedRows="table_selectedRows"
      @action="handleAction"
      :table_form.sync="table_form"
      :table_column="table_field"
    ></table-header>
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
    <el-table-column  type="selection" width="60" class-name="table-column-disabled" :selectable="table_disable_selected">
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


    </div>
</template>
<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
const api_resource = api_common.resource("restaurant/restaurantmeal");
const defaultForm = function() {
  return {

    estate:1,

  };
};
export default {
  mixins: [table_mixin],
  props:['id'],
  data() {
    return {
      loading: true,
      form:{},
      dialogFormStatus:'',
      api_resource,
      orgCategory:[],
      queryDialogFormVisible:true,
      table_height:window.innerHeight-310,
      defaultForm,
      officeaddress:[],
      table_tabs_options:[],
      table_tabs_key:'',
      view_activeName:'',
      mealname:[],
      rules:{
        mealid: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        mealprice: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
         mealqueue: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        mealpay: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        mealstart: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        mealend: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
      }
    };
  },
  watch:{

      id(val){
          this.table_form.param = this.table_form.param||{}
          this.table_form.param.restaurantid = val
          this.fetchTableData()
      }
  },
  methods: {
      changeMealname(val){
         var Form = Object.assign({},this.mealname_val.find(o=>o.id===val))
         Form.mealid = val
         this.form = Form
      },
      tabClick(){
        const id = this.table_tabs_options.find(o=>o.levelname===this.view_activeName).id
        this.table_form.param[this.table_tabs_key] = id
        this.fetchTableData()
      },
    async handleFormSubmit(){
        await this.form_validate()
        let form = Object.assign({},this.form)
        form.restaurantid = this.id
        form.meallevelid = this.table_form.param[this.table_tabs_key]
        if(this.isInsert){
            await api_resource.create(form)
        }else{
            await api_resource.update(form.id,form)
        }
        this.dialogFormVisible = false
        this.fetchTableData()
   },
    async add(){
       this.dialogFormStatus = 'insert'
        this.mealname_val = await api_common.resource("restaurant/meal/enable").get({
          restaurantid:this.id,
          meallevelid:this.table_form.param[this.table_tabs_key]
        })
        this.mealname = this.mealname_val.map(item=>{
            return {
                label:item.mealname,
                value:item.id
            }
        })
        this.dialogFormVisible = true
    },

   async edit(){
     this.dialogFormStatus = 'update'
      let row = this.table_selectedRows[0]
      this.mealname_val = await api_common.resource("restaurant/meal").get({
        restaurantid:this.id,
        meallevelid:this.table_form.param[this.table_tabs_key]
      })
      this.mealname = this.mealname_val.map(item=>{
          return {
              label:item.mealname,
              value:item.id
          }
      })
      this.form = await api_resource.find(row.id)
      this.dialogFormVisible = true;

    },
    async fetchTableData() {
    this.table_form.param.restaurantid = this.id
     this.table_loading = true;
     const { rows , total }= await api_resource.get(this.table_form);
      this.table_data  = rows
       this.table_form.total = total
      setTimeout(() => {
        this.table_loading = false;
      }, 300);
    },
  },
  async created() {
    const { field, action,table } = await api_common.menuInit("restaurant/restaurantmeal");
    const select = (await api_resource.getSelect())[0]
    this.table_tabs_options = select.option
    this.table_tabs_key = select.filtertarget
    this.table_form.param = this.table_form.param || {}

    this.table_form.param[this.table_tabs_key] = this.table_tabs_options[0].id
    this.view_activeName = this.table_tabs_options[0].levelname
    
    this.table_field = field;
    this.table_actions = action;
    this.table_config = table
    this.fetchTableData();
  }
};
</script>


<style lang="scss" scoped>
.tabs {
    padding:0 20px;
    padding-top: 20px;
}
</style>
