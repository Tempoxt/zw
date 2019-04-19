<template>
   <el-row class="h-full">
    <el-col :span="5" class="h-full">
      <div class="page-side h-full">
        
        <span class="page-title">员工用餐记录</span>
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

            :expand-on-click-node="false"
          >
            <span slot-scope="{ node, data }">
              <span v-if="data.org_type === 1" class="icon iconfont icon-zonggongsi"></span>
              <span v-if="data.org_type === 2" class="icon iconfont icon-fengongsi"></span>
              <span v-if="data.org_type === 3" class="icon iconfont icon-fenbumen"></span>
            &nbsp;
              <span> {{ node.label }}</span>
            </span>
          </el-tree>
         
        </div>
         </el-scrollbar>
      </div>

    </el-col>
    <el-col :span="19">
        <consumedata :currentMenuid="currentMenuid"/>
    </el-col>
  </el-row>
</template>
<script>
import * as api_common from "@/api/common";
import consumedata from './restaurant/consumedata'
export default {
    data(){
        return {
            filterText:'',
            data2:[],
            currentMenuid:0
        }
    },
    components:{
        consumedata
    },
    methods:{
        handleChangeNode(val){
             this.currentMenuid = val.orgid
        },
        filterNode(){},

    },
    async created(){
        this.data2 = await api_common.getOrg();
        let defaultMenuid = this.data2[0].orgid
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

