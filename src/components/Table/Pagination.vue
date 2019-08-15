<template>
  <div class="pagination">
    <el-pagination
      background
      :page-sizes="rowList"
      :page-size.sync="pagesize"
      layout="total, sizes"
      :total="total"
      :current-page.sync="currentpage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>

    <el-pagination
      background
      :page-sizes="rowList"
      :page-size.sync="pagesize"
      layout="prev, pager, next"
      :total="total"
      :current-page.sync="currentpage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>
<script>
import { setTimeout } from 'timers';
export default {
  props: {
    total: Number,
    pagesize: Number,
    currentpage: Number,
    table_config:Object
  },
  computed:{
    rowList(){
      let p = ((this.table_config && this.table_config.rowList) ?this.table_config.rowList.split(',').map(Number).filter(o=>!isNaN(o)):[50,100,300,500,1000])

       return (this.total&&this.total>0)?p.concat(this.total):p
    }
  },
  methods: {
    reset(){
      this.$emit("update:pagesize", 100);
      this.$emit("update:currentpage", 1);
    },
    handleSizeChange(val) {
      this.$emit("update:pagesize", val);
      this.$emit("update:currentpage", 1);
      this.$emit("change");
    },
    handleCurrentChange(val) {
      this.$emit("update:currentpage", val);
      this.$emit("change");
    }
  }
};
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  padding: 8px;
}
</style>
