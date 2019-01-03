<template>
  <div class="table-layout">
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
              <form-render :type="`menu`" :field="{name:'上级菜单'}" v-model="form.parentid"/>
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

    <el-row class="h-full">
      <el-col :span="24" class="h-full">
        <fullscreen v-model="table_modal">
          <div class="ui-table">
            <table-header
              :table_actions="table_actions"
              :table_selectedRows="table_selectedRows"
              @action="handleAction"
              :table_form.sync="table_form"
            ></table-header>
            <tree-table
              :data="table_data"
              v-loading="loading"
              ref="treeTable"
              :selectedRows.sync="table_selectedRows"
              :label="table_field[0] && table_field[0].showname"
            >
              <el-table-column
                :label="column.showname"
                v-for="(column,index) in table_field.slice(1,table_field.length).filter(field=>field.isvisiable)"
                :key="column.id"
              >
                <template slot-scope="scope">
                  <template v-if="column.name==='menutype'">
                    <el-tag v-if="scope.row['menutype']===1" size="mini">目录</el-tag>
                    <el-tag type="success" v-else size="mini">菜单</el-tag>
                  </template>
                  <template v-else-if="column.name==='estate'">{{scope.row['estate']===1?'启用':'禁用'}}</template>
                  <template v-else>{{scope.row[column.name]}}</template>
                </template>
              </el-table-column>
            </tree-table>
          </div>
        </fullscreen>
      </el-col>
    </el-row>
  </div>
</template>



<script>
import fullscreen from "@c/UI/fullscreen";
import treeTable from "@/components/TreeTable";
import FormRender from "@c/Form/render";
import tableHeader from "@c/Table/Header";
import * as api_menusheet from "@/api/menusheet";
import * as api_common from "@/api/common";
const defaultForm = function() {
  return {
    iconName: {},
    menutype: 2,
    parentid: 0,
    connect: "1",
    
  };
};
export default {
  components: {
    fullscreen,
    treeTable,
    FormRender,
    tableHeader
  },
  computed: {},
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
        await api_menusheet.create(form);
      } else {
        await api_menusheet.update(form.id, form);
      }
      this.$refs.treeTable.clearSelectedRows();
      this.dialogFormVisible = false;
      this.fetchTableData();
    },
    query() {},
    add() {
      this.form = defaultForm();
      this.dialogStatus = "insert";
      this.dialogFormVisible = true;
    },
    async edit() {
      let rows = this.$refs.treeTable.getSelectedRows();
      if (rows.length !== 1) {
        return;
      }
      let row = this.$refs.treeTable.findRowById(rows[0]);
      this.dialogStatus = "update";
      this.form = Object.assign({}, row);
      const { icon, name } = this.form;
      this.form.iconName = { icon, name };
      this.dialogFormVisible = true;
    },
    delete() {
      let rows = this.$refs.treeTable.getSelectedRows();
      if (!rows.length) {
        return;
      }
      this.$confirm("此操作将删除选中行, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return api_menusheet.remove(rows.join(","));
        })
        .then(() => {
          this.fetchTableData();
        });
    },
    handleAction(action) {
      if (this[action]) {
        this[action](action);
      } else {
        console.error(action);
      }
    },
    toggleModal() {
      this.table_modal = !this.table_modal;
    },
    async fetchTableData() {
      this.loading = true;
      const { field, action } = await api_common.menuInit(
        "menusheet",
        this.$route.query.position
      );
      this.table_field = field;
      this.table_actions = action;
      const { menu } = await api_menusheet.get(this.$route.query.position);
      this.table_data = menu;
      // this.table_data[1].estate = 0;
      setTimeout(() => {
        this.loading = false;
      }, 300);
    }
  },
  async created() {
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
      table_form:{}
    };
  }
};
</script>
<style lang="scss" scoped>
@import "./table.scss";
</style>
