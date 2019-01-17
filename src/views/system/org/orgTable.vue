<template>
  <public-tree-table 
  resource="org" 
  @load="load" 
  @action="handleAction"
  ref="table">

    <el-dialog
      :title="dialogStatus==='insert'?'添加':'编辑'"
      :visible.sync="dialogFormVisible"
      class="public-dialog"
      v-el-drag-dialog
    >
      <div v-if="dialogFormVisible">
        <el-form ref="form" :model="form" label-width="90px" label-position="left">
          <el-row :gutter="20">
            <el-col :span="12">
              <form-render :type="`input`" :field="{name:'组织名称'}" v-model="form.name"/>
            </el-col>
            <el-col :span="12">
              <form-render :type="`leader`" :field="{name:'负责人',defaultName:form.org_manager_name}" v-model="form.org_manager"/>
            </el-col>
            <el-col :span="12">
              <form-render :type="`org`" :field="{name:'上级部门'}" v-model="form.parent_org"/>
            </el-col>
            <el-col :span="12">
              <form-render
                :type="`radio`"
                :field="{name:'状态',options:[{'label':'启用','value':1},{'label':'禁用','value':0}]}"
                v-model="form.estate"
              />
            </el-col>
            <el-col :span="12">
              <form-render :type="`select`" :field="{name:'组织分类',options:orgCategory}" v-model="form.org_type"/>
            </el-col>
            <el-col :span="12">
              <form-render :type="`number`" :field="{name:'排序'}" v-model="form.order"/>
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


  </public-tree-table>
</template>

<script>

import publicTableMixin from '@c/publicTable/publicTableMixin'
import * as api_common from "@/api/common";
const api_resource = api_common.resource("org");
const defaultForm = ()=>({order:1,estate:1})
export default {
  mixins:[publicTableMixin],
  data() {
    return {
      loading: true,
      form:{},
      api_resource,
      orgCategory:[],
      defaultForm,
      queryDialogFormVisible:true
    };
  },
  watch:{
      async 'form.parent_org'(id){
          let orgCategory =  await api_org.category(id)
          this.orgCategory = orgCategory.map(item=>{
              return {
                  value: item.id,
                  label: item.name
              }
          })         
      }
  },

  methods:{
    fetchTableData(){
      this.$refs.table.fetchTableData()
    },
    load(){
      this.$refs.table.table_tree_showAll()
    },
    add(){
      this.dialogFormVisible = true;
      const { id } = this.table_selectedRows[0]||{id:0}
      this.form.parent_org =id
    },
    async edit(){
      let row = this.table_selectedRows[0]
      this.form = await api_resource.find(row.id)
      this.dialogFormVisible = true;
    },
     async handleFormSubmit(){
      let form = Object.assign({},this.form)
      delete form.parent;
      delete form.subs;
      if(this.isInsert){
          await api_resource.create(form)
      }else{
          await api_resource.update(form.id,form)
      }
      this.dialogFormVisible = false
      this.fetchTableData()
    },

  },
  created(){

  }
}
</script>
