<template>
  <el-row class="h-full">
    <el-dialog title="添加功能" :visible.sync="dialogFormVisible" class="public-dialog">
      <div>
        <el-form ref="form" :model="categoryForm" label-width="80px" label-position="left">
          <el-row :gutter="20">
            <el-col :span="12">
              <form-render :type="`input`" :field="{name:'分类名称'}" v-model="categoryForm.groupname"/>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="categoryFormSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加角色" :visible.sync="roleFormVisible" class="public-dialog" v-el-drag-dialog>
      <div>
        <el-form ref="form" :model="roleForm" label-width="80px" label-position="left">
          <el-row :gutter="20">
            <el-col :span="12">
              <form-render
                :type="`select`"
                :field="{name:'所在分类',options:data2.map(item=>({label:item.groupname,value:item.id}))}"
                v-model="roleForm.groupid"
              />
            </el-col>
            <el-col :span="12">
              <form-render :type="`input`" :field="{name:'角色名称'}" v-model="roleForm.name"/>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="roleFormSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-col :span="5" class="h-full">
      <div class="page-side h-full">
        <span class="page-title">就餐员工设置</span>
        <div>
          <div class="side-header">
            <el-input placeholder="快速查找" v-model="filterText" class="input">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <div>
              <el-dropdown>
                <span class="el-dropdown-link">
                  <el-button icon="el-icon-plus"></el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="addCategory">添加分类</el-dropdown-item>
                  <el-dropdown-item @click.native="addRole">添加角色</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <el-tree
            class="tree"
            :data="data2"
            :props="{children: 'mealevel', label: 'groupname' }"
            default-expand-all
            node-key="roleid"
            :filter-node-method="filterNode"
            ref="tree2"
            :highlight-current="true"
            :check-on-click-node="true"
            @node-click="handleChangeNode"
            :expand-on-click-node="false"
          >
            <span slot-scope="{ node, data }" class="node-actions">
              <div>
                <!-- <span
                  :class="`icon iconfont ${(node.isLeaf&&data.name)?'icon-zuzhi2':'icon-wenjian'}`"
                ></span>&nbsp; -->
                <span>{{node.leaf}}{{ data.restaurantname||data.levelname }}</span>
              </div>
              <!-- <div class="actions">
                <span
                  class="icon iconfont icon-lajitong"
                  @click="(node.isLeaf&&data.name)?deleteRole(node,data,...arguments):deleteCategory(node,data,...arguments)"
                ></span>
                <span
                  class="icon iconfont icon-bianji"
                  @click="(node.isLeaf&&data.name)?updateRole(node,data,...arguments):updateCategory(node,data,...arguments)"
                ></span>
              </div> -->
            </span>
          </el-tree>
        </div>
      </div>
    </el-col>
    <el-col :span="19" style="height:calc(100% - 40px)">
        <restaurantmember :currentMenuid="currentMenuid"/>
    </el-col>
  </el-row>
</template>


<script>
import * as api_common from "@/api/common";

const api_resource = api_common.resource("restaurant/restaurantlevel");
const api_role = api_common.resource("roles");
import restaurantmember from './restaurant/restaurantmember'
export default {
  watch: {
    filterText(val) {
      console.log(val,'val')
      this.$refs.tree2.filter(val);
    }
  },
  components: {
      restaurantmember
  },
  computed: {
    isInsert() {
      return this.dialogStatus === "insert";
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      
      return (data.groupname?data.groupname:data.name)['indexOf'](value) !== -1;
    },
    handleChangeNode(data) {
      if (data.id) {
        this.currentMenuid = data.id;
      }
    },
    addCategory() {
      this.categoryForm = {};
      this.dialogStatus = "insert";
      this.dialogFormVisible = true;
    },
    addRole() {
      this.roleForm = {};
      this.dialogStatus = "insert";
      this.roleFormVisible = true;
    },
    handleFormSubmit() {},
    async categoryFormSubmit() {
      let form = Object.assign({}, this.categoryForm);
      if (this.isInsert) {
        await api_resource.create(form);
      } else {
        await api_resource.update(form.id, form);
      }
      this.dialogFormVisible = false;
      this.fetchCategory();
    },
    async deleteCategory(node, data, e) {
      e.stopPropagation();
      await this.$confirm(
        "正在删除" + data.groupname + "分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      );
      await api_resource.remove(data.id);
      this.fetchCategory();
    },
    async deleteRole(node, data, e) {
      e.stopPropagation();
      await this.$confirm("正在删除" + data.name + "角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      await api_role.remove(data.roleid);
      this.fetchCategory();
    },
    async updateCategory(node, data, e) {
      e.stopPropagation();
      this.categoryForm = Object.assign({}, data);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
    },
    async updateRole(node, data, e) {
      e.stopPropagation();
      this.roleForm = Object.assign({}, data);
      this.dialogStatus = "update";
      this.roleFormVisible = true;
    },
    async fetchCategory() {
      let { restlevelmenu } = await api_resource.get();
      this.data2 = restlevelmenu
    //   .map(item => {
    //     item.group_role.forEach(sub => {
    //       sub.groupid = item.id;
    //     });
    //     return item;
    //   });
      return;
    },
    async roleFormSubmit() {
      let form = Object.assign({}, this.roleForm);
      if (this.isInsert) {
        await api_role.create(form);
      } else {
        await api_role.update(form.roleid, form);
      }
      this.roleFormVisible = false;
      this.fetchCategory();
    }
  },
  data() {
    return {
      activeName: "first",
      filterText: "",
      data2: [],
      currentMenuid: 0,
      dialogFormVisible: false,
      form: {},
      categoryForm: {},
      roleFormVisible: false,
      roleForm: {}
    };
  },
  async created() {
    const { postion } = this.$route.query;
    await this.fetchCategory();
    let defaultMenuid;
    (function f(data) {
      data.some(item => {
        if (item.roleid!==undefined) {
          defaultMenuid = item.roleid;
          return true;
        }else{
           if (item.group_role && item.group_role.length) {
              f(item.group_role);
            }
        }
       
      });
    })(this.data2);
    this.$refs.tree2.setCurrentKey(defaultMenuid);
    this.currentMenuid = defaultMenuid;
  }
};
</script>

<style lang="scss" scoped>
.node-actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
  &:hover {
    .actions {
      display: block;
    }
  }

  .actions {
    display: none;
    span {
      margin-right: 20px;
      color: #999;
    }
  }
}
.table-tabs {
  height: 100%;
  /deep/ .el-tabs__content {
    height: 100%;
  }
}
</style>
