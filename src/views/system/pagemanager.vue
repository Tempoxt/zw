<template>
  <el-row class="h-full">
    <el-col :span="5" class="h-full">
      <div class="page-side h-full">
        <span class="page-title">{{$route.query.postion==1?'前台':'后台'}}</span>
        <div>
          <div class="side-header">
            <el-input placeholder="快速查找" v-model="filterText" class="input">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <el-tree
            class="tree"
            :data="data2"
            :props="{children: 'subs', label: 'name' }"
            default-expand-all
            node-key="id"
            :filter-node-method="filterNode"
            ref="tree2"
            :highlight-current="true"
            :check-on-click-node="true"
            @node-click="handleChangeNode"
          >
            <span slot-scope="{ node, data }">
              <span :class="data.icon"></span>&nbsp;
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </div>
    </el-col>
    <el-col :span="19">
      <el-tabs v-model="activeName" class="table-tabs">
        <el-tab-pane label="功能设置" name="first">
          <pagemanager-action :currentMenuid="currentMenuid"/>
        </el-tab-pane>
        <el-tab-pane label="字段设置" name="second">
          <pagemanager-field :currentMenuid="currentMenuid"/>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>


<script>
import * as api_common from "@/api/common";
import pagemanagerAction from "./pagemanager/action";
import pagemanagerField from "./pagemanager/field";
export default {
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },
  components: {
    pagemanagerAction,
    pagemanagerField
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleChangeNode(data) {
      if (data.menutype === 2) {
        this.currentMenuid = data.id;
      }
    }
  },
  data() {
    return {
      activeName: "first",
      filterText: "",
      data2: [],
      currentMenuid: 0
    };
  },
  async created() {
    const { postion } = this.$route.query;
    const { menu } = await api_common.getMenu(postion);
    this.data2 = menu;
    const { field, action } = await api_common.menuInit(
      "pagemanager",
      postion,
      "action"
    );
    this.table_field = field;
    this.table_actions = action;

    let defaultMenuid;
    (function f(data) {
      data.some(item => {
        if (item.menutype === 2) {
          defaultMenuid = item.id;
          return true;
        }
        if (item.subs && item.subs.length) {
          f(item.subs);
        }
      });
    })(this.data2);
    this.$refs.tree2.setCurrentKey(defaultMenuid);
    this.currentMenuid = defaultMenuid;
  }
};
</script>

