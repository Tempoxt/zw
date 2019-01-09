<template>
  <el-form-item :label="field.name">
    <el-popover ref="popover" placement="bottom" width="200" trigger="click" v-model="visible" transition="el-zoom-in-top">
      <el-scrollbar
      ref="scrollContainer"
      class="scroll-container"
     >
     <el-tree
        class="filter-tree"
        :data="data2"
        :props="defaultProps"
        default-expand-all
        :expand-on-click-node="false"
        ref="tree2"
        @node-click="nodeSelect"
      >
        <span slot-scope="{ node, data }">
          <span :class="data.icon"></span>&nbsp;
          <span>{{ node.label }}</span>
        </span>
      </el-tree>
    </el-scrollbar>
      
    </el-popover>
    <el-select
      v-model="input5"
      placeholder="请选择"
      v-popover:popover
      no-data-text
      @focus="aaa"
      v-bind="$parent.$attrs"
      v-on="$parent.$listeners"
      class="input-with-select"
      :popper-append-to-body="false"
    ></el-select>
  </el-form-item>
</template>
<style lang="scss" scoped>
.input-with-select {
  width: 100%;
  /deep/ .el-select-dropdown {
    display: none;
  }
}
.scroll-container {
  height: 300px;
  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>

<script>
import * as api_common from "@/api/common";
export default {
  name: "form-menu",
  props: {
    field: Object,
    value: {}
  },
  methods: {
    aaa(e) {
      e.stopPropagation();
      return false;
    },
    aa(data) {
      console.log(data);
    },
    nodeSelect(data) {
      // this.input5 = data.name;
      this.data = data.id;
      this.visible = false;
    },
    findDataName() {
      if (this.data === undefined) {
        return;
      }
      let id = this.data;
      let info = {};
      (function f(data) {
        data.some(row => {
          if (row.id == id) {
            info = row;
            return true;
          }
          if (row.subs && row.subs.length) {
            f(row.subs);
          }
        });
      })(this.data2);
      this.input5 = info.name;
    }
  },
  watch: {
    data(val) {
      this.findDataName();
      this.$parent.$emit("input", this.data);
    },
    value: {
      immediate: true,
      handler(val) {
        this.data = this.value;
      }
    }
  },
  data() {
    return {
      visible: false,
      filterText: "",
      input5: "",
      data: "",
      data2: [
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        }
      ],
      defaultProps: {
        children: "subs",
        label: "name"
      }
    };
  },
  async created() {
    const { menu } = await api_common.getMenu(this.field.position);
    this.data2 = [
      {
        id: 0,
        icon: "icon iconfont icon-renshiguanli",
        name: "顶级菜单"
      }
    ].concat(menu);
    this.findDataName();
  }
};
</script>
