<template>
  <el-table
    :data="formatData"
    :row-style="showRow"
    v-bind="$attrs"
    border
    :header-cell-style="{background:'#F5FAFB',color:'#37474F',height:'50px'}"
     :row-class-name="table_state_className"
     @selection-change="handleSelectionChange"
     :max-height="table_height"
     @header-dragend="table_dragend"
  >
  <el-table-column 
    type="selection" 
    width="60" 
    class-name="table-column-disabled"
    :selectable="table_disable_selected"
    >
    </el-table-column>

    <el-table-column :label="label">
      <template slot-scope="scope">
        <span v-for="space in scope.row._level" :key="space" class="ms-tree-space"/>
        <span v-if="iconShow(0,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
          <i
            :class="['el-icon-caret-right',{'sub-open':scope.row._expanded}]"
            style="color:#666;font-size:16px;margin-right: 6px;"
          ></i>
        </span>
        <i :class="scope.row.icon" v-if="iconShow(0,scope.row)"></i>
        <i :class="scope.row.icon" v-else></i>
        <span v-html="scope.row.name"></span>
      </template>
    </el-table-column>

    <slot/>
  </el-table>
</template>

<script>
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-13:59
*/
import treeToArray from "./eval";
export default {
  name: "TreeTable",
  props: {
    /* eslint-disable */
    data: {
      type: [Array, Object],
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    label: String,
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false
    },
    selectedRows: Array,
    table_actions:Array
  },
  watch: {
    checkedRows: {
      handler() {
        this.$emit("update:selectedRows", this.checkedRows);
      },
      deep: true
    }
  },
  computed: {
    // 格式化数据源
    formatData: function() {
      let tmp;
      if (!Array.isArray(this.data)) {
        tmp = [this.data];
      } else {
        tmp = this.data;
      }
      const func = this.evalFunc || treeToArray;
      const args = this.evalArgs
        ? Array.concat([tmp, this.expandAll], this.evalArgs)
        : [tmp, this.expandAll];
      return func.apply(null, args);
    }
  },
  data() {
    return {
      checkedRows: this.selectedRows,
      table_topHeight:223,
    };
  },
  methods: {
    table_disable_selected(row){
      return !(row.lockstate&&!this.table_actions.find(action=>action.code==='unlock'))
    },
    table_state_className({row, column, rowIndex, columnIndex}){
      return row.lockstate?'row-state-class':''
    },
    clearSelectedRows() {
      this.checkedRows = [];
    },

    showRow: function(row) {
      const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent._show
        : true;
      row.row._show = show;
      return show
        ? "animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;"
        : "display:none;";
    },
    showAll(){
  
       (function f(data) {
          data.forEach((row,i) => {
            if (row.subs && row.subs.length) {
              row._expanded = true
              f(row.subs);
            }
          });
        })(this.data);
       
    },
    // 切换下级是否展开
    toggleExpanded: function(trIndex) {
      const record = this.formatData[trIndex];
      record._expanded = !record._expanded;
    },
    // 图标显示
    iconShow(index, record) {
      return index === 0 && record.subs && record.subs.length > 0;
    },
    handleSelectionChange(val){
      this.checkedRows = val
    },
  }
};
</script>
<style rel="stylesheet/css">
@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
$color-blue: #2196f3;
$space-width: 18px;
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: $space-width;
  height: 14px;
  &::before {
    content: "";
  }
}
.processContainer {
  width: 100%;
  height: 100%;
}
table td {
  line-height: 26px;
}

.tree-ctrl {
  position: relative;
  cursor: pointer;
  color: $color-blue;
  // margin-left: -$space-width;
  margin-left: -22px;
}

.sub-open {
  transform: rotate(45deg);
}
</style>
