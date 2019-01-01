<template>
  <div id="app">
    <!-- <el-radio-group v-model="theme" style="  position: absolute;right:0;bottom:0;z-index:999">
      <el-radio label="0BB2D4">备选项</el-radio>
      <el-radio label="F2353C">红色</el-radio>
      <el-radio label="DC5D03">橙色</el-radio>
    </el-radio-group>-->
    <router-view/>
  </div>
</template>


<script>
import { toggleClass } from "@/utils";
import { mapState } from "vuex";
export default {
  // data() {
  //   return {
  //     theme: "0BB2D4"
  //   };
  // },
  watch: {
    theme: {
      handler() {
        document.body.className = "";
        toggleClass(document.body, `theme-${this.theme}`);
      },
      immediate: true
    }
  },
  computed: {
    ...mapState({
      theme: state => state.app.theme
    }),
    themeClass() {
      return `theme-${this.theme}`;
    }
  }
};
</script>


<style lang="scss">
#app {
  height: 100%;
}
</style>
