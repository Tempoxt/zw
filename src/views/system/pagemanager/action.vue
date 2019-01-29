<template>
    <ui-table 
    ref="table"
    :table_column="table_field" 
    :table_query.sync="table_form.query"
    @query="querySubmit"
    >
         <el-dialog
            title="添加功能"
            :visible.sync="dialogFormVisible"
            class="public-dialog"
            v-el-drag-dialog
            >
            <div  v-loading="dialog_loading">
            <el-checkbox-group v-model="actionsModel">
              <el-row :gutter="10">
              <el-col :md="4" v-for="action in actionsList" :key="action.id">
                   <el-checkbox :label="action.id" >
                    <i :class="action.icon"></i>
                    {{action.name}}</el-checkbox>
              </el-col>
            </el-row>
                </el-checkbox-group>
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
const api_resource = api_common.resource('pagemanager/menuaction')
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
      this.dialog_loading = true
      this.actionsModel = []
      this.actionsList = await api_actionsheet.get()
      this.actionsModel = this.table_data.map(item=>(+item.action__id))
      setTimeout(()=>{
        this.dialog_loading = false
      },300)
    },

    async handleFormSubmit(){
      await api_resource.create({
        action:this.actionsModel,
        catolog:'action',
        menu:this.currentMenuid
      })
      this.dialogFormVisible = false
      this.fetchTableData()
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
      api_resource
    };
  },
  async created() {
    const { postion } = this.$route.query;
    const { field, action } = await api_common.menuInit(
      "pagemanager/menuaction"
    );
    this.table_field = field;
    this.table_actions = action;
  }
};
</script>

