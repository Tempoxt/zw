<template>
  <div class="pagination">
    <el-pagination
      background
      :page-sizes="[50, 100, 200, 500,1000]"
      :page-size="pagesize"
      layout="total, sizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>

    <el-pagination
      background
      :page-sizes="[50, 100, 200, 500,1000]"
      :page-size="pagesize"
      layout="prev, pager, next"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    total: Number,
    pagesize: Number,
    currentpage: Number
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
  padding: 20px;
}
</style>
