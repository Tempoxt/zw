<template>
  <fullscreen v-model="table_modal">
    <div class="ui-table">
      <query 
      :table_queryFormVisible.sync="table_queryFormVisible" 
      :table_column="table_column" 
      :table_query="table_query"
      @query="querySubmit"
      />
      <slot/>
    </div>
  </fullscreen>
</template>
<script>
import fullscreen from "@c/UI/fullscreen";
import Query from './Query'
export default {
  components: {
    fullscreen,
    Query
  },
  props:{
    table_column: Array,
    table_query: Object
  },
  data() {
    return {
      table_modal: false,
      table_queryFormVisible:false
    };
  },
  methods: {
    toggleModal() {
      this.table_modal = !this.table_modal;
    },
    querySubmit(query){
      this.$emit('query',query)
    }
  }
};
</script>
<style lang="scss" scoped>
.ui-table {
  width: 100%;
  height: 100%;
  padding-top: 20px;
  .table-top {
    display: flex;
    justify-content: space-between;
    padding: 20px;
  }
}
</style>

<style lang="scss">
.theme-0BB2D4 .el-input--small,.theme-0BB2D4 .el-range-editor--small .el-range-input{
    font-size: 12px;
  }
.theme-0BB2D4 .el-table--small td, .theme-0BB2D4 .el-table--small th{padding: 4px 0;}
.el-table--small td, .el-table--small th{padding: 4px 0;}
.mini-table .attendanceTable{
  .el-table__row {
    >td {
        padding: 0px 0;
        font-size: 12px;
    }
    .cell {
          white-space: nowrap;
          text-overflow: ellipsis;
          line-height: 20px;
    }
  }
}
</style>