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
  padding: 20px;
  padding-bottom: 0;
  box-sizing: border-box;
  .table-top {
    display: flex;
    justify-content: space-between;
    padding: 20px;
  }
}
</style>

<style lang="scss">
.el-input--small,.el-range-editor--small .el-range-input{
    font-size: 12px!important;
  }
.el-table--small td, .el-table--small th{padding: 2px 0!important;}
.el-table{
  .el-table__row {
    .cell {
          white-space: nowrap;
          text-overflow: ellipsis;
          line-height: 20px;
    }
  }
}
.mini-table{
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

.vxe-table .vxe-footer--column.col--ellipsis,.vxe-table .vxe-footer--column{
  background-color: #f5f7fa;
  color: #606266;
  height: 32px;
  padding: 4px 0!important;
}
</style>