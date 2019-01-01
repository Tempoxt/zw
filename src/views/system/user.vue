<template>
   <el-row class="h-full">
    <el-col :span="5" class="h-full">
      <div class="page-side h-full">
        <span class="page-title">用户管理</span>
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
              <span v-else class="icon iconfont icon-gongneng"></span>&nbsp;
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </div>
    </el-col>
    <el-col :span="19">
        <user-table :currentMenuid="currentMenuid"/>
    </el-col>
  </el-row>
</template>
<script>
import * as api_common from "@/api/common";
import userTable from './user/userTable'
export default {
    data(){
        return {
            filterText:'',
            data2:[],
            currentMenuid:0
        }
    },
    components:{
        userTable
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
