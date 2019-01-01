<template>
  <div class="pagination">
    <el-pagination
      background
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>

    <el-pagination
      background
      :page-sizes="[10, 20, 30, 40]"
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
    handleSizeChange(val) {
      this.$emit("update:pagesize", val);
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
