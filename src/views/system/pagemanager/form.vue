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
            <div v-loading="dialog_loading">
                 <div>
                    <el-form ref="form" :model="form" label-width="90px" label-position="left">
                      <el-row :gutter="60">
                        <div class="line-box">
                        <el-col :span="12">
                          <form-render :type="`input`" :field="{name:'字段名称'}" v-model="form.name" placeholder="请输入内容"/>
                        </el-col>
    
                        <el-col :span="12">
                          <form-render :type="`input`" :field="{name:'字段显示名'}" v-model="form.showname" placeholder="请输入内容"/>
                        </el-col>


                      <el-col :span="12">
                          <form-render
                            :type="`select`"
                            :field="{name:'类型',options:[{
                              value: 'text',
                              label: '单行文本'
                            },{
                              value: 'textarea',
                              label: '多行文本'
                            },{
                              value: 'password',
                              label: '密码框'
                            },{
                              value: 'select',
                              label: '选择项'
                            },{
                              value: 'checkbox',
                              label: '多选项'
                            },{
                              value: 'radio',
                              label: '单选项'
                            },{
                              value: 'image',
                              label: '图片'
                            },{
                              value: 'file',
                              label: '文件'
                            }]}"
                            v-model="form.fieldtype"
                          />
                        </el-col>

                        <el-col :span="12">
                          <form-render
                            :type="`select`"
                            multiple
                            :field="{name:'验证方式',options:[{
                              value: 'required',
                              label: '必填'
                            }]}"
                            v-model="form.validation"
                          />
                        </el-col>

                        <el-col :span="12">
                          <form-render :type="`input`" :field="{name:'数据源'}" v-model="form.sourcefrom" placeholder="请输入内容"/>
                        </el-col>

                        



                        <el-col :span="12">
                          <form-render
                            :type="`radio`"
                            :field="{name:'允许修改',options:[{'label':'是','value':true},{'label':'否','value':false}]}"
                            v-model="form.iseditable"
                          />
                        </el-col>


                          <el-col :span="12">
                          <form-render :type="`number`" :field="{name:'显示排序'}" v-model="form.sort"/>
                        </el-col>
                        
                      
                      
                        </div>
                        <el-col :span="24">
                          <form-render :type="`textarea`" autosize :row="1" :field="{name:'备注/说明'}" v-model="form.remark" placeholder="请输入内容"/>
                        </el-col>
                      </el-row>
                    </el-form>
                  </div>

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
              ref="elTable"
                @selection-change="handleChangeSelection"
                :data="table_data"
                border 
                style="width: 100%"
                :header-cell-style="headerCellStyle"
                @header-dragend="table_dragend"
                :height="table_height"
                @sort-change="table_sort_change"
                v-loading="table_loading">
                <el-table-column type="selection" width="55"></el-table-column>
                 <el-table-column type="index" :index="indexMethod" />
               <each-table-column :table_field="table_field"/>
            </el-table>
           
    </ui-table>
</template>
<script>
import * as api_common from "@/api/common";
import * as api_actionsheet from "@/api/actionsheet";
import table_mixin from "@c/Table/table_mixin";
const api_resource = api_common.resource('pagemanager/form')
export default {
  mixins: [table_mixin],
  props:{
      currentMenuid:Number
  },
  watch:{
     currentMenuid:{
      handler(){
        this.fetchTableData();
      },
      immediate:true
    }

  },
  methods: {
    async add(){
      this.dialogFormVisible = true
      this.dialog_loading = false
      
    
    },
    async edit() {
      this.form = await api_resource.find(this.table_selectedRowsInfo[0].id)
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.dialog_loading = false
    },
    async handleFormSubmit(){
      let form = Object.assign({ menuid: this.currentMenuid }, this.form);
      if (this.isInsert) {
        await api_resource.create(form);
      } else {
        await api_resource.update(form.id, form,{alert:false});
      }
      this.dialogFormVisible = false;
      this.fetchTableData();
    },
    async fetchTableData(menuid) {
      this.table_loading = true
      this.table_form.menuid = this.currentMenuid
      const { rows }  = await api_resource.get(this.table_form);
      this.table_data = rows
      
      // this.table_data  = await api_resource.get(this.table_form);
      setTimeout(()=>{
        this.table_loading = false
      },300)
    }
  },

  data() {
    return {
      table_loading:true,
      actionsList:[],
      actionsModel:[],
      dialog_loading:true,
      api_resource,
      form:{}
    };
  },
  async created() {
    const { postion } = this.$route.query;
    const { field, action } = await api_common.menuInit(
      "pagemanager/form"
    );
    this.table_field = field;
    this.table_actions = action;
  }
};
</script>

