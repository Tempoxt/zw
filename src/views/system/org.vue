<template>
   <el-row class="h-full">
    <el-col :span="5" class="h-full">
      <div class="page-side h-full">
         <span class="page-title">
          <el-radio-group v-model="tabActive">
            <el-radio-button :label="item.position" v-for="item in tabs" :key="item.id">{{item.showname}}</el-radio-button>
          </el-radio-group>
        </span>
        <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
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
            :check-on-click-node="false"
            @node-click="handleChangeNode"
          >
            <span slot-scope="{ node, data }">
              <span v-if="node.isLeaf" class="icon iconfont icon-zuzhi2"></span>
              <span v-else class="icon iconfont icon-zuzhi1"></span>&nbsp;
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
         
        </div>
         </el-scrollbar>
      </div>

    </el-col>
    <el-col :span="19">
       <div v-if="tabActive===1">
          <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs">
            <el-tab-pane label="总部信息" name="a" lazy>
                <org-info :currentMenuid="currentMenuid"></org-info>
            </el-tab-pane>
            <el-tab-pane label="下级分部" name="b">
              <org-tree ref="tree"/>
            </el-tab-pane>
          </el-tabs>
       </div>
       <div v-else style="    overflow: hidden;">
         <org-tree ref="tree"/>
       </div>
    </el-col>
  </el-row>
</template>
<script>
import * as api_common from "@/api/common";
import userTable from './user/userTable'
import orgInfo from './org/orgInfo'
import orgTree from './org/orgTree'
export default {
    components:{
      orgInfo,
      userTable,
      orgTree
    },
    watch:{
      tabActive(val){
        if(val===2){
          this.$refs.tree.fetchData()
        }
      }
    },
    data(){
        return {
            filterText:'',
            data2:[],
            currentMenuid:0,
            tabs:[
              {
                showname:'组织架构管理',
                id:0,
                position:1
              },
              {
                showname:'组织架构图',
                id:0,
                position:2
              }
            ],
            tabActive:1,
            view_activeName:'a'
        }
    },
    methods:{
        handleChangeNode(val){
             this.currentMenuid = val.id
        },
        filterNode(){},

    },
    async created(){
        this.data2 = await api_common.getOrg();
        let defaultMenuid = this.data2[0].id
        this.$refs.tree2.setCurrentKey(defaultMenuid);
        this.currentMenuid = defaultMenuid;
    }
}
</script>
<style lang="scss" scoped>

.scroll {
  height: calc(100% - 30px);
  width: 100%;
 /deep/ .scrollbar-wrapper {
    overflow-x: hidden;
  }
}
</style>

