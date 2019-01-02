<template>
  <fullscreen v-model="table_modal">
    <div class="ui-table">
      <query :table_queryFormVisible.sync="table_queryFormVisible"/>
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
  data() {
    return {
      table_modal: false,
      table_queryFormVisible:true
    };
  },
  methods: {
    toggleModal() {
      this.table_modal = !this.table_modal;
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

