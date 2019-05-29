<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <template
      v-if="hasOneShowingChild(item.subs,item) && (item.tabs||!onlyOneChild.subs||onlyOneChild.noShowingChildren)&&!item.alwaysShow"
    >
      <el-menu-item :index="resolvePath(item.url)+(item.isTabs?`?menuid=${item.id}`:'')" :class="{'submenu-title-noDropdown':!isNest}">
        <i :class="onlyOneChild.icon" style="margin-right:10px" :title="resolvePath(item.url)"></i>
        <span slot="title">{{onlyOneChild.name}}</span>
        <!-- <item v-if="onlyOneChild" :icon="onlyOneChild.icon||item.icon" :title="onlyOneChild.name"/> -->
      </el-menu-item>
    </template>

    <el-submenu v-else ref="submenu" :index="resolvePath(item.url)">
      <template slot="title">
        <item v-if="item" :icon="item.icon" :title="item.name"/>
      </template>

      <template v-for="child in item.subs" v-if="!child.hidden&&item.subs">
        <!-- <sidebar-item
          v-if="child.subs&&child.subs.length>0"
          :is-nest="true"
          :item="child"
          :key="child.url"
          :base-path="resolvePath(child.url)"
          class="nest-menu"
        /> -->
        <sidebar-item
          v-if="child.subs&&child.subs.length>0"
          :is-nest="true"
          :item="child"
          :key="child.url"
          :base-path="$route['matched'][0].path"
          class="nest-menu"
          :parentRoute="!!$route"
        />
        <app-link v-else :to="resolvePath(child.url)" :key="child.name">
          <el-menu-item :index="resolvePath(child.url)">
            <item v-if="child" :icon="child.icon" :title="child.name"/>
          </el-menu-item>
        </app-link>
      </template>
    </el-submenu>
  </div>
</template>

<script>
import path from "path";
import { isExternal } from "@/utils";
import Item from "./Item";
import AppLink from "./Link";
import FixiOSBug from "./FixiOSBug";

export default {
  name: "SidebarItem",
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ""
    },
    parentRoute:{}
  },
  data() {
    return {
      onlyOneChild: null
    };
  },
  created() {
    
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      if(parent.subs.some(item=>item.menutype===3)){
        this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        parent.isTabs = true
        return true
      }
      const showingChildren = children.filter(item => {

        if (item.hidden) {
          return false;
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item;
          return true;
        }
      });
      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true;
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        return true;
      }

      return false;
    },
    resolvePath(routePath) {
      if (!routePath) {
        routePath = "/";
      }
      if (this.isExternalLink(routePath)) {
        return routePath;
      }
      console.log(this.basePath,this.parentRoute,routePath,'this.basePath')
      return this.parentRoute?path.resolve(this.basePath || "/", routePath):this.basePath
    },
    isExternalLink(routePath) {
      return isExternal(routePath);
    }
  }
};
</script>
