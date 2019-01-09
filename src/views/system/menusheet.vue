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
    >
      <div>
        <el-form ref="form" :model="form" label-width="80px" label-position="left">
          <el-row :gutter="20">
            <el-col :span="12">
              <form-render :type="`icon`" :field="{name:'图标/名称'}" v-model="form.iconName"/>
            </el-col>
            <el-col :span="12">
              <form-render :type="`input`" :field="{name:'请求地址'}" v-model="form.urlname"/>
            </el-col>
            <el-col :span="12">
              <form-render :type="`menu`" :field="{name:'上级菜单',position:this.$route.query.position}" v-model="form.parentid"/>
            </el-col>
            <el-col :span="12">
              <form-render :type="`input`" :field="{name:'授权标识'}" v-model="form.code"/>
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
                }]}"
                v-model="form.menutype"
              />
            </el-col>
            <el-col :span="12">
              <form-render
                :type="`select`"
                :field="{name:'链接目标',options:[{
                  value: '1',
                  label: '当前创窗口'
                },{
                  value: '2',
                  label: '新窗口/新标签'
                },{
                  value: '3',
                  label: '弹出窗口'
                },{
                  value: '4',
                  label: '弹出浏览器窗口'
                }]}"
                v-model="form.connect"
              />
            </el-col>
            <el-col :span="12">
              <form-render :type="`number`" :field="{name:'显示排序'}" v-model="form.sort"/>
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
      :table_column="table_field.slice(1,table_field.length)"
      @action="handleAction"
      :table_form.sync="table_form"
      :header-cell-style="headerCellStyle"
    ></table-header>


    <tree-table
      :data="table_data"
      v-loading="loading"
      ref="treeTable"
      :selectedRows.sync="table_selectedRows"
      :label="table_field[0] && table_field[0].showname"
      :table_actions="table_actions"
    >
      <el-table-column
        :label="column.showname"
        v-for="(column) in table_field.slice(1,table_field.length).filter(column=>!column.fed_isvisiable)"
        :key="column.id"
      >
        <template slot-scope="scope">
          <template v-if="column.name==='menutype'">
            <el-tag v-if="scope.row['menutype']===1" size="mini">目录</el-tag>
            <el-tag type="success" v-else size="mini">菜单</el-tag>
          </template>
          <template v-else-if="column.name==='estate'">
            <span v-if="scope.row['estate']===1">启用</span>
            <span v-else class="text-danger">禁用</span>
          </template>
          <template v-else>{{scope.row[column.name]}}</template>
        </template>
      </el-table-column>
    </tree-table>
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
    connect: "1",
  };
};
export default {
  mixins: [table_mixin],
  methods: {
    async handleFormSubmit() {
      let form = Object.assign(
        { position: this.$route.query.position },
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
      this.form = Object.assign({}, row);
      const { icon, name } = this.form;
      this.form.iconName = { icon, name };
      this.dialogFormVisible = true;
    },
    async fetchTableData() {
      this.loading = true;
      const { menu } = await api_resource.get({position:this.$route.query.position,...this.table_form});
      this.table_data = menu;
      setTimeout(() => {
        this.loading = false;
      }, 300);
    }
  },
  async created() {

    const { field, action } = await api_common.menuInit(
      "menusheet",
      this.$route.query.position
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
      api_resource
    };
  }
};
</script>
