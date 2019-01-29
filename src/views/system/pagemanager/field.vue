<template>
  <ui-table ref="table"   
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit">
    <el-dialog
      :title="dialogStatus==='insert'?'添加':'编辑'"
      :visible.sync="dialogFormVisible"
      class="public-dialog"
      v-el-drag-dialog
    >
      <div>
        <el-form ref="form" :model="form" label-width="90px" label-position="left">
          <el-row :gutter="20">
            <!-- <el-col :span="12" v-for="field in ccc" :key="field.name">
              <form-render :type="`${field.type}`" :field="field" v-model="form[field.model]"/>
            </el-col> -->
            <el-col :span="12">
              <form-render :type="`input`" :field="{name:'字段名称'}" v-model="form.name"/>
            </el-col>
            <el-col :span="12">
              <form-render
                :type="`radio`"
                :field="{name:'是否必填',options:[{'label':'是','value':true},{'label':'否','value':false}]}"
                v-model="form.isblank"
              />
            </el-col>
            <el-col :span="12">
              <form-render :type="`input`" :field="{name:'字段显示名'}" v-model="form.showname"/>
            </el-col>
            <el-col :span="12">
              <form-render :type="`input`" :field="{name:'字段列宽'}" v-model="form.width"/>
            </el-col>
            <el-col :span="12">
              <form-render
                :type="`radio`"
                :field="{name:'是否隐藏',options:[{'label':'是','value':true},{'label':'否','value':false}]}"
                v-model="form.isvisiable"
              />
            </el-col>
            <el-col :span="12">
              <form-render
                :type="`radio`"
                :field="{name:'快速查询',options:[{'label':'是','value':true},{'label':'否','value':false}]}"
                v-model="form.isquicksearch"
              />
            </el-col>
            <el-col :span="12">
              <form-render
                :type="`radio`"
                :field="{name:'允许排序',options:[{'label':'是','value':true},{'label':'否','value':false}]}"
                v-model="form.issort"
              />
            </el-col>
            <el-col :span="12">
              <form-render
                :type="`radio`"
                :field="{name:'高级查询',options:[{'label':'是','value':true},{'label':'否','value':false}]}"
                v-model="form.issearch"
              />
            </el-col>
            <el-col :span="12">
              <form-render
                :type="`select`"
                :field="{name:'字段类型',options:[{
                  value: 'number',
                  label: '数字'
                },{
                  value: 'auto_select',
                  label: '非固定选项'
                },{
                  value: 'date',
                  label: '日期'
                },{
                  value: 'select',
                  label: '固定选项'
                },{
                  value: 'text',
                  label: '文本'
                },{
                  value: 'choice',
                  label: '单选'
                }]}"
                v-model="form.fieldtype"
              />
            </el-col>
             <el-col :span="12">
              <form-render
                :type="`select`"
                :field="{name:'查询分类',options:[{
                  value: 'number',
                  label: '数字'
                },{
                  value: 'auto_select',
                  label: '非固定选项'
                },{
                  value: 'date',
                  label: '日期'
                },{
                  value: 'select',
                  label: '固定选项'
                },{
                  value: 'text',
                  label: '文本'
                }]}"
                :disabled="!form.issearch"
                v-model="form.fieldtype"
              />
            </el-col>
            <el-col :span="12">
              <form-render :type="`number`" :field="{name:'显示排序'}" v-model="form.sort"/>
            </el-col>
            <el-col :span="12">
              <form-render
                :type="`radio`"
                :field="{name:'允许修改',options:[{'label':'是','value':true},{'label':'否','value':false}]}"
                v-model="form.iseditable"
              />
            </el-col>
            <el-col :span="24">
              <form-render :type="`textarea`" :field="{name:'备注/说明'}" v-model="form.remark"/>
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
      :data="table_data"
      border
      style="width: 100%"
      v-loading="table_loading"
      :height="table_height"
      :header-cell-style="headerCellStyle"
      @header-dragend="table_dragend"
      @sort-change="table_sort_change"
    >
      <el-table-column type="selection" width="55"></el-table-column>
       <el-table-column type="index" :index="indexMethod" />
      <each-table-column :table_field="table_field"/>
    </el-table>
  </ui-table>
</template>
<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
const api_resource = api_common.resource("pagemanager/field");
let defaultForm = function() {
  return {
    issearch:true,
    isblank: true,
    isvisiable: false,
    iseditable: false,
    issort:true,
    isquicksearch:false,
    fieldtype:'text'
  };
};
export default {
  mixins: [table_mixin],
  props: {
    currentMenuid: Number
  },
  watch: {
    currentMenuid:{
      handler(){
        this.fetchTableData();
      },
      immediate:true
    }
  },
  methods: {
    async add() {
      this.form = defaultForm();
      this.dialogFormVisible = true;
      this.dialog_loading = true;
    },
    async edit() {
      this.form = await api_resource.find(this.table_selectedRowsInfo[0].id)
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
    },
    async handleFormSubmit() {
      let form = Object.assign({ menuid: this.currentMenuid }, this.form);
      if (this.isInsert) {
        await api_resource.create(form);
      } else {
        await api_resource.update(form.id, form);
      }
      this.dialogFormVisible = false;
      this.fetchTableData();
    },
    async fetchTableData(menuid) {
      this.table_loading = true;
      this.table_form.menuid = this.currentMenuid
      const { rows }  = await api_resource.get(this.table_form);
      this.table_data = rows
      setTimeout(() => {
        this.table_loading = false;
      }, 300);
    }
  },
  computed:{
    ccc(){
      const types = {
        'text':'input',
        'number':'number',
        'textarea':'textarea',
        'choice':'radio'
      }
      return this.table_field.filter(field=>field.iseditable).map((field)=>{
        return {
          name:field.showname,
          type:types[field.fieldtype],
          model:field.name,
          options:[]
        }
      })
    }
  },
  data() {
    return {
      actionsList: [],
      actionsModel: [],
      dialog_loading: true,
      form: defaultForm(),
      dialogStatus: "insert",
      api_resource
    };
  },
  async created() {
    const { postion } = this.$route.query;
    const { field, action } = await api_common.menuInit(
      "pagemanager/field"
    );
    this.table_field = field;
    this.table_actions = action;



    const types = {
      'text':'input',
      'number':'number',
      'textarea':'textarea'
    }
    this.table_field.forEach(field=>{
      field._field = {
        name:field.showname,
        type:types[field.fieldtype],
        model:field.name,
        options:[]
      }
    })
    setTimeout(()=>{
      console.log(this.table_field,'table_field')
      console.log(this.ccc,'cccccccccccc')
    },2000)
  }
};
</script>
