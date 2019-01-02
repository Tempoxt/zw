<template>
  <el-table
    :data="formatData"
    :row-style="showRow"
    v-bind="$attrs"
    :header-cell-style="{background:'#F5FAFB',color:'#37474F',height:'50px'}"
    
  >
    <el-table-column width="50">
      <template slot="header" slot-scope="slot">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        />
      </template>
      <template slot-scope="scope">
        <el-checkbox-group
          v-model="checkedRows"
          @change="handleCheckedRowsChange"
        >
          <el-checkbox
            :label="scope.row.id"
            @change="handleCheckedItem(scope.row,...arguments)"
          >&nbsp;</el-checkbox>
        </el-checkbox-group>

<!--         
        <el-checkbox-group
          v-model="checkedRows"
          v-if="scope.row.estate"
          @change="handleCheckedRowsChange"
        >
          <el-checkbox
            :label="scope.row.id"
            @change="handleCheckedItem(scope.row,...arguments)"
          >&nbsp;</el-checkbox>
        </el-checkbox-group>
        <i class="icon iconfont icon-suoding" v-else></i> -->
      </template>
    </el-table-column>

    <el-table-column v-if="columns.length===0" :label="label">
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
        {{ scope.row.name }}
      </template>
    </el-table-column>
    <el-table-column
      v-for="(column, index) in columns"
      v-else
      :key="column.id"
      :label="column.showname"
      :width="column.width"
    >
      <template slot-scope="scope">
        <!-- Todo -->
        <!-- eslint-disable-next-line vue/no-confusing-v-for-v-if -->
        <span
          v-for="space in scope.row._level"
          v-if="index === 0"
          :key="space"
          class="ms-tree-space"
        />
        <span
          v-if="iconShow(index,scope.row)"
          class="tree-ctrl"
          @click="toggleExpanded(scope.$index)"
        >
          <i v-if="!scope.row._expanded" class="el-icon-plus"/>
          <i v-else class="el-icon-minus"/>
        </span>
        {{ scope.row[column.value] }}
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
    selectedRows: Array
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
      isIndeterminate: false,
      checkAll: [],
      checkedRows: this.selectedRows
    };
  },
  methods: {
    getSelectedRows() {
      return this.checkedRows;
    },
    clearSelectedRows() {
      this.checkedRows = [];
    },
    findRowById(id) {
      let rowInfo;
      (function f(data) {
        data.some(row => {
          if (row.id == id) {
            rowInfo = row;
            return true;
          }
          if (row.subs && row.subs.length) {
            f(row.subs);
          }
        });
      })(this.data);
      return rowInfo;
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
    handleCheckAllChange(val) {
      this.checkedRows = val ? this.data.map(item => item.id) : [];
      // this.isIndeterminate = false;
    },
    handleCheckedRowsChange(value) {
      let checkedCount = value.length;
      let dataLen = this.data.filter(row => row.estate).length;
      let checkedRowsLen = this.checkedRows.length;
      this.checkAll = checkedCount === dataLen;
      // this.isIndeterminate = checkedCount > 0 && checkedCount < dataLen;
    },
    insertChecked(rows) {
      rows.forEach(row => {
        this.checkedRows.push(row.id);
        if (row.subs) {
          this.insertChecked(row.subs);
        }
      });
    },
    removeChecked(rows) {
      rows.forEach(row => {
        this.checkedRows = this.checkedRows.filter(id => row.id !== id);
        if (row.subs) {
          this.removeChecked(row.subs);
        }
      });
    },
    handleCheckedItem(row, value, e) {
      // if (!row.subs) {
      //   return;
      // }
      // if (value) {
      //   this.insertChecked(row.subs);
      // } else {
      //   this.removeChecked(row.subs);
      // }
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
