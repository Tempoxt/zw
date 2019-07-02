


<template>
     <el-form-item :label="field.name"  v-bind="$parent.$attrs"
        v-on="$parent.$listeners">
        <el-popover ref="popover" placement="bottom" width="300" trigger="click" v-model="visible" transition="el-zoom-in-top">
        <el-input
          placeholder="搜索部门"
          class="input"
          v-model="filterText">
        </el-input>
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
            :filter-node-method="filterNode"
        >
            <span slot-scope="{ node, data }">
              <span :class="`icon iconfont ${(node.isLeaf&&data.name)?'icon-zuzhi2':'icon-wenjian'}`"></span>&nbsp;
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
<script>
import * as api_common from "@/api/common";
export default {
  name: "form-demand",
  props: {
    field: Object,
    value: {},
    field_key:{
      default:'orgid'
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    aaa(e) {
      e.stopPropagation();
      return false;
    },
    aa(data) {
      console.log(data);
    },
    nodeSelect(data) {
      console.log(data,'data')
      this.data = data[this.field.field_key || 'id'];
      this.visible = false;
			this.input5 = data.name
			this.field.defaultName = this.input5
    },
    findDataName() {
      if (this.data === undefined) {
        return;
      }
      let orgid = this.data;
      let info = {};
      let that = this;
      (function f(data) {
        data.some(row => {
          if (row[that.field.field_key || 'id'] == orgid) {
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
      console.log(this.field.defaultName,'dddddd')
      if(this.field.defaultName){
				this.input5 = this.field.defaultName
      }
      console.log(this.input5)
      this.findDataName();
      console.log(this.data,'ddaaaa')
      this.$parent.$emit("input", this.data);
    },
    value: {
      immediate: true,
      handler(val) {
        if(!val){
					this.input5 = this.field.real_name
				}
				this.data = this.value;
      }
    },
    filterText(val) {
      this.$refs.tree2.filter(val);
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
        children: "subs",
        label: "name"
      }
    };
  },
  async created() {
   
    this.data2 = await api_common.getOrg();
    this.data2 = [
      {
        id: 0,
        name: "顶级"
      }
    ].concat(this.data2)
    this.findDataName();
  }
};
</script>

<style lang="scss" scoped>
.input-with-select {
  width: 100%;
  /deep/ .el-select-dropdown {
    display: none;
  }
}
.input {
  margin-bottom: 10px;
  /deep/ .el-input__inner {
    border-radius: 14px;
  }
   
}
.scroll-container {
  height: 300px;
  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>