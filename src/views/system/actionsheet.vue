<template>
    <ui-table 
    ref="table" 
    :table_query.sync="table_form.query"
     :table_column="table_field" 
    @query="querySubmit"
    
    >
    <el-dialog
      :title="dialogStatus==='insert'?'添加':'编辑'"
      :visible.sync="dialogFormVisible"
      class="public-dialog"
      v-el-drag-dialog
    >
      <div>
        <el-form ref="form" :model="form" label-width="80px" label-position="left">
          <el-row :gutter="20">
            <el-col :span="12">
              <form-render :type="`icon`" :field="{name:'图标/名称'}" v-model="form.iconName"/>
            </el-col>
            <el-col :span="12">
              <form-render
                :type="`select`"
                :field="{name:'选取记录',options:[{
                  value: 0,
                  label: '否'
                },{
                  value: 1,
                  label: '单选'
                },{
                  value: 2,
                  label: '多选'
                }]}"
                v-model="form.selectable"
              />
            </el-col>
            <el-col :span="12">
              <form-render :type="`input`" :field="{name:'功能代码'}" v-model="form.code"/>
            </el-col>
            <el-col :span="12">
              <form-render :type="`input`" :field="{name:'功能描述'}" v-model="form.remark"/>
            </el-col>
            <el-col :span="12">
              <form-render :type="`number`" :field="{name:'显示排序'}" v-model="form.sort"/>
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
            :table_form.sync="table_form"
            :table_column="table_field"
            @action="handleAction"
            
            ></table-header>
            <el-table
                ref="elTable"  
                @selection-change="handleChangeSelection"
                :data="table_data"
                border 
                style="width: 100%"
                :row-class-name="table_state_className"
                :header-cell-style="headerCellStyle"
                :height="table_height"
                @header-dragend="table_dragend"
                @sort-change="table_sort_change"
                v-loading="table_loading">
                <el-table-column 
                type="selection" 
                width="60" 
                class-name="table-column-disabled"
                :selectable="table_disable_selected"
                ></el-table-column>
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
const api_resource = api_common.resource('actionsheet')
import table_mixin from "@c/Table/table_mixin";
const defaultForm = function(){
    return {
        selectable:0,
        iconName:{}
    }
}
export default {
    mixins: [table_mixin],
    methods:{
        add(){
            this.dialogFormVisible = true
        },
        async edit(){
            this.form = await api_resource.find(this.table_selectedRowsInfo[0].id)
            const {name,icon} = this.form
            this.form.iconName = {
                name,
                icon
            }
            this.dialogFormVisible = true
        },
        async fetchTableData() {
            this.table_loading = true
            const {rows,total}  =  await api_resource.get(this.table_form);
            this.table_data = rows
           
            this.table_form.total = total
            setTimeout(()=>{
                this.table_loading = false
            },300)
        },
        async handleFormSubmit(){
           let form = Object.assign({},this.form)
           const {icon,name} = form.iconName
           form.name = name
           form.icon = icon
            if(this.isInsert){
                await api_resource.create(form)
            }else{
                await api_resource.update(form.id,form)
            }
            this.dialogFormVisible = false
            this.fetchTableData()
        }
    },
    data(){
        return {
           
            form:defaultForm(),
            defaultForm,
            api_resource
        }
    },
    async created() {
        const { field, action,table } = await api_common.menuInit(
            "actionsheet",
        );
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table

        this.fetchTableData()
    }
}
</script>
<style lang="scss">

</style>
