<template>
  <div>
    <div class="logo">
      <router-link to="/" style="color:#fff">
        <span class="icon iconfont icon-logo" style="font-size: 18px;"></span>
      </router-link>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper" class="scrollbar">
      <el-menu
        :show-timeout="200"
        :default-active="this.$route.fullPath"
        :collapse="isCollapse"
        mode="vertical"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        :router="true"
        :unique-opened="true"
      >
        <span>人事</span>
        <div>
          {{$route['matched'][0].path}}
        </div>

         <transition-group name="el-fade-in">
            <template v-if="isShow">
                <sidebar-item
                  v-for="route in sideBarMenu"
                  :key="route.url"
                  :item="route"
                  :base-path="$route['matched'][0].path"
                  :parentRoute="!!$route"
                />
              </template>
              
            </transition-group>


        
        <!-- :index="$route['matched'][0].path+'/'+route.url" -->
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import SidebarItem from "./SidebarItem";

export default {
  components: { SidebarItem },
  watch:{
    sideBarMenu:{
      deep:true,
      handler(){
        this.isShow = false
     
        setTimeout(()=>{
          this.isShow = true
        },200)
      }
    }
  },
  computed: {
    ...mapGetters(["sidebar", "sideBarMenu"]),
    isCollapse() {
      return !this.sidebar.opened;
    },
    ...mapState({})
  },
  created() {
    console.log(this.$route, "router");
  },
  data() {
    return {
      isShow:true
    };
  }
};
</script>
<style lang="scss" scoped>
.logo {
  width: 100%;
  height: 59px;
  // background: $primary-color;
  @include themify($themes) {
    background: themed("primary");
  }
  font-size: 24px;
  text-align: center;
  line-height: 60px;
  color: #fff;
}
.scrollbar {
  height: calc(100% - 60px);
}
</style>
