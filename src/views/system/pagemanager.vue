<template>
  <el-row class="h-full">
    <el-col :span="4" class="h-full">
      <div class="page-side h-full">

       
        <span class="page-title">
          <!-- {{$route.query.postion==1?'前台':'后台'}} -->
          <el-radio-group v-model="position">
            <el-radio-button :label="item.position" v-for="item in positionField" :key="item.id">{{item.showname}}</el-radio-button>
          </el-radio-group>

        </span>
        <div>
          <div class="side-header">
            <el-input placeholder="快速查找" v-model="filterText" class="input">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <el-tree
            class="tree"
            :data="data2"
            :props="{children: 'subs', label: 'name' }"
            default-expand-all
            node-key="id"
            :filter-node-method="filterNode"
            ref="tree2"
            :highlight-current="true"
            :check-on-click-node="true"
            @node-click="handleChangeNode"
          >
            <span slot-scope="{ node, data }">
              <span :class="data.icon"></span>&nbsp;
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </div>
    </el-col>
    <el-col :span="20">

      <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs">
      
      <el-tab-pane :label="getViewData('fields').name" :name="getViewData('fields').url" v-if="getViewData('fields')" lazy>
         <pagemanager-field :currentMenuid="currentMenuid"/>
      </el-tab-pane>
      <el-tab-pane :label="getViewData('menuaction').name" :name="getViewData('menuaction').url" v-if="getViewData('menuaction')" lazy>
        <pagemanager-action :currentMenuid="currentMenuid"/>
      </el-tab-pane>
    </el-tabs>


      <!-- <el-tabs v-model="activeName" class="table-tabs">
        <el-tab-pane label="功能设置" name="first">
          <pagemanager-action :currentMenuid="currentMenuid"/>
        </el-tab-pane>
        <el-tab-pane label="字段设置" name="second">
          <pagemanager-field :currentMenuid="currentMenuid"/>
        </el-tab-pane>
      </el-tabs> -->
    </el-col>
  </el-row>
</template>


<script>
import * as api_common from "@/api/common";
import pagemanagerAction from "./pagemanager/action";
import pagemanagerField from "./pagemanager/field";
import view_init from '@/mixins/view_init'
export default {
  mixins:[view_init],
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    },
    position:{
      handler(){
        this.initPage()
      },
      immediate:true
    }
  },
  components: {
    pagemanagerAction,
    pagemanagerField
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleChangeNode(data) {
      if (data.menutype === 2 || data.menutype === 3) {
        this.currentMenuid = data.id;
      }
    },
    async initPage(){
      const { menu } = await api_common.getMenu(this.position);
      this.data2 = menu;
      let defaultMenuid;
      (function f(data) {
        data.some(item => {
          if (item.menutype === 2) {
            defaultMenuid = item.id;
            return true;
          }else{
            if (item.subs && item.subs.length) {
                f(item.subs);
              }
          }
        
        });
      })(this.data2);
      

      
      const { field:positionField } = await api_common.menuInit("pagemanager")
      this.positionField = positionField
      this.positionField[0].position = 1
      this.positionField[1].position = 2
      await this.initTabs()
      this.currentMenuid = defaultMenuid;
      this.$refs.tree2.setCurrentKey(defaultMenuid);
    }
  },
  data() {
    return {
      activeName: "first",
      filterText: "",
      data2: [],
      currentMenuid: 0,
      position:1,
      positionField:[]
    };
  },
  async created() {
    
  }
};
</script>

