<template>
  <ui-table ref="table"   
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit">
    <el-dialog
      :title="dialogStatus==='insert'?'添加':'编辑'"
      :visible.sync="dialogFormVisible"
      class="public-dialog"
    >
      <div>
        <el-form ref="form" :model="form" label-width="90px" label-position="left">
          <el-row :gutter="20">
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
              <form-render
                :type="`radio`"
                :field="{name:'是否隐藏',options:[{'label':'是','value':true},{'label':'否','value':false}]}"
                v-model="form.isvisiable"
              />
            </el-col>
            <el-col :span="12">
              <form-render :type="`number`" :field="{name:'显示排序'}" v-model="form.sort"/>
            </el-col>
            <el-col :span="12">
              <form-render
                :type="`radio`"
                :field="{name:'用户可设置',options:[{'label':'是','value':true},{'label':'否','value':false}]}"
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
      :header-cell-style="headerCellStyle"
      @header-dragend="table_dragend"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        :prop="column.name"
        :label="column.showname"
        v-for="column in table_field.filter(column=>!column.fed_isvisiable)"
        :key="column.id"
        :width="column.width||'auto'"
      >
        <template slot-scope="scope">
          <template v-if="column.name==='icon'">
            <i :class="scope.row[column.name]"></i>
          </template>
          <template v-else>{{ scope.row[column.name] }}</template>
        </template>
      </el-table-column>
    </el-table>
  </ui-table>
</template>
<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
const api_resource = api_common.resource("pagemanager/field");
let defaultForm = function() {
  return {
    isblank: true,
    isvisiable: false,
    iseditable: false
  };
};
export default {
  mixins: [table_mixin],
  props: {
    currentMenuid: Number
  },
  watch: {
    currentMenuid() {
      this.fetchTableData();
    }
  },
  methods: {
    async add() {
      this.form = defaultForm();
      this.dialogFormVisible = true;
      this.dialog_loading = true;
    },
    async edit() {
      this.form = Object.assign({}, this.table_selectedRowsInfo[0]);
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
      this.table_data = await api_resource.get({
        menuid: this.currentMenuid
      });
      setTimeout(() => {
        this.table_loading = false;
      }, 300);
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
      "pagemanager",
      postion,
      "field"
    );
    this.table_field = field;
    this.table_actions = action;
  }
};
</script>
