<template>

<ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  
  >
    <el-dialog
      :title="dialogStatus==='insert'?'添加菜单':'编辑菜单'"
      :visible.sync="dialogFormVisible"
      class="public-dialog"
      v-el-drag-dialog
    >
      <div>
        <el-form ref="form" :model="form" label-width="80px" label-position="left">
          <el-row :gutter="60">
            <div class="line-box">
              <el-col :span="12">
              <form-render :type="`icon`" :field="{name:'图标/名称'}" v-model="form.iconName"/>
            </el-col>
            <el-col :span="12">
              <form-render :type="`menu`" :field="{name:'上级菜单',position:position}" v-model="form.parentid"/>
            </el-col>

            <el-col :span="12">
              <form-render :type="`input`" :field="{name:'请求地址'}" v-model="form.urlname" placeholder="请输入"/>
            </el-col>

             <el-col :span="12">
              <form-render
                :type="`select`"
                :field="{name:'菜单类型',options:[{
                  value: 1,
                  label: '目录'
                },{
                  value: 2,
                  label: '菜单'
                },{
                  value: 3,
                  label: '页签'
                }]}"
                v-model="form.menutype"
              />
            </el-col>

             <el-col :span="12">
              <form-render :type="`input`" :field="{name:'请求参数'}" v-model="form.paramter" placeholder="请输入"/>
            </el-col>
            <el-col :span="12">
              <form-render
                :type="`select`"
                :field="{name:'链接目标',options:[{
                  value: 1,
                  label: '当前创窗口'
                },{
                  value: 2,
                  label: '新窗口/新标签'
                },{
                  value: 3,
                  label: '弹出窗口'
                },{
                  value: 4,
                  label: '弹出浏览器窗口'
                }]}"
                v-model="form.connect"
              />
            </el-col>

            <el-col :span="12">
              <form-render
                :type="`radio`"
                :field="{name:'状态',options:[{'label':'启用','value':1},{'label':'禁用','value':0}]}"
                v-model="form.estate"
              />
            </el-col>
            <el-col :span="12">
              <form-render :type="`number`" :field="{name:'显示排序'}" v-model="form.sort"/>
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
      :table_column="table_field"
      @action="handleAction"
      :table_form.sync="table_form"
    ></table-header>
    <el-table
      :data="table_tree_formatData"
      :row-style="table_tree_showRow"
      :row-class-name="table_state_className"
      @selection-change="handleChangeSelection"
      border
      style="width: 100%"
      v-loading="table_loading"
      :header-cell-style="headerCellStyle"
      :height="table_height"
      @header-dragend="table_dragend"
      ref="elTable"
      @sort-change="table_sort_change"
    >
    <el-table-column 
      type="selection" 
      width="60" 
      class-name="table-column-disabled"
      :selectable="table_disable_selected"
      >
      </el-table-column>

    <el-table-column 
      :label="table_field[0] && table_field[0].showname" 
      :width="table_field[0]&&table_field[0].width||'auto'"
      >
      <template slot-scope="scope">
        <span v-for="space in scope.row._level" :key="space" class="ms-tree-space"/>
        <span v-if="table_tree_iconShow(0,scope.row)" class="tree-ctrl" @click="table_tree_toggleExpanded(scope.$index)">
          <i
            :class="['el-icon-caret-right',{'sub-open':scope.row._expanded}]"
            style="color:#666;font-size:16px;margin-right: 6px;"
          ></i>
        </span>
        <table-column :row="scope.row" :elColumn="table_field[0]" :column="table_field[0]" :template="template"/>
        <!-- <i :class="scope.row.icon" v-if="table_tree_iconShow(0,scope.row)"></i>
        <i :class="scope.row.icon" v-else></i> -->
        <!-- <span v-html="scope.row.name"></span> -->
        
      </template>
    </el-table-column>
    <each-table-column :table_field="table_field.slice(1,table_field.length)" :template="template"/>
  </el-table>

  </ui-table>

</template>



<script>


import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
const api_resource = api_common.resource("menusheet");
const defaultForm = function() {
  return {
    iconName: {},
    menutype: 2,
    parentid: 0,
    connect: 1,
    estate:1,
    sort:1

  };
};
export default {
  props:['position'],
  mixins: [table_mixin],
  methods: {
    
    async handleFormSubmit() {
      let form = Object.assign(
        { position: this.position },
        this.form
      );
      delete form.parent;
      delete form.subs;
      form.name = form.iconName.name;
      form.icon = form.iconName.icon;
      if (this.dialogStatus === "insert") {
        await api_resource.create(form);
      } else {
        await api_resource.update(form.id, form);
      }
      this.dialogFormVisible = false;
      this.fetchTableData();
    },
    add() {
      this.form = defaultForm();
      this.dialogStatus = "insert";
      this.dialogFormVisible = true;
    },
    async edit() {
      let row = this.table_selectedRows[0]
      // this.form = Object.assign({}, row);
      this.form = await api_resource.find(row.id)
      const { icon, name } = this.form;
      this.form.iconName = { icon, name };
      this.dialogFormVisible = true;
    },
    async fetchTableData() {
      this.table_loading = true;
      const position = this.position
      const { menu } = await api_resource.get({position,...this.table_form});
      this.table_data = menu;
      setTimeout(() => {
        this.table_loading = false;
        
      }, 300);
    }
  },
  async created() {
    if(this.view_hasPageTab){

    }
    const { field, action } = await api_common.menuInit(
      "menusheet",
    this.position
    );
    this.table_field = field;
    this.table_actions = action;
    this.fetchTableData();
  },
  data() {
    return {
      table_field: [],
      table_actions: [],
      table_data: [],
      table_actions_morelen: 4,
      table_selectedRows: [],
      table_modal: false,

      dialogStatus: "insert",
      dialogFormVisible: false,
      form: defaultForm(),
      loading: true,
      table_form:{},
      api_resource,
      template:{
        connect(column,row){
          return <span>{['当前创窗口','新窗口/新标签','弹出窗口','弹出浏览器窗口'][row.connect-1]}</span>
        },
        name(column,row){
            return <span><i class={row.icon} ></i> {row.name}</span>
        }
      },
    };
  }
};
</script>
<style lang="scss" scoped>

</style>
