<template>
     <el-form-item :label="field.name">
        <el-popover ref="popover" placement="bottom" width="300" trigger="click" v-model="visible" transition="el-zoom-in-top">
        <el-tree
            class="filter-tree"
            :props="defaultProps"
            :expand-on-click-node="true"
            ref="tree2"
            :load="loadNode1"
            lazy
            @node-click="nodeSelect"
        >
            <span slot-scope="{ node, data }">
            <span :class="data.icon"></span>&nbsp;
            <span>{{ node.label }}</span>
            </span>
        </el-tree>
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
<script>
import * as api_common from "@/api/common";
import * as api_org from "@/api/org";
export default {
  name: "form-leader",
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
      if(data.leaf){
          this.visible = false;
          this.data = data.id;
         this.input5 = data.name
      }
    },
    async loadNode1(node, resolve){
        let id = ''
        if(node.data){
            id = node.data.id
        }
        let data = await api_org.getOrgUser(id);
        data.forEach(item=>{
            item.leaf = item.subs === 0 ? true : false
        })
        resolve(data)
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
    //   this.input5 = ''
    //   this.findDataName();
      if(this.field.defaultName){
          this.input5 = this.field.defaultName
      }
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
      data2: [],
      defaultProps: {
        label: "name",
        isLeaf: 'leaf'
      }
    };
  },
//   async created() {
//     this.data2 = await api_common.api_org();
//     this.findDataName();
//   }
};
</script>

<style lang="scss" scoped>
.input-with-select {
  width: 100%;
  /deep/ .el-select-dropdown {
    display: none;
  }
}
</style>