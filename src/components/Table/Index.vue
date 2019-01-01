<template>
  <fullscreen v-model="table_modal">
    <div class="ui-table">
      <slot/>
    </div>
  </fullscreen>
</template>
<script>
import fullscreen from "@c/UI/fullscreen";
export default {
  components: {
    fullscreen
  },
  data() {
    return {
      table_modal: false
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

