<template>
   <el-row class="h-full">
    <el-col :span="4" class="h-full" style="border-right:1px solid #e8e8e8">
      <div class=" h-full">
        <!-- <span class="page-title">员工用餐记录</span>
         <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
        <div>
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

 -->

          <org @change="changeOrg" />
      </div>

    </el-col>
    <el-col :span="20">
        <consumedata :currentMenuid="currentMenuid"/>
    </el-col>
  </el-row>
</template>
<script>
import * as api_common from "@/api/common";
import consumedata from './restaurant/consumedata'
import org from '@/views/public/org'
export default {
    data(){
        return {
            filterText:'',
            data2:[],
            currentMenuid:0
        }
    },
    components:{
        consumedata,
        org
    },
    methods:{
        handleChangeNode(val){
             this.currentMenuid = val.orgid
        },
        filterNode(){},
        changeOrg(id){
            this.currentMenuid = id
       
        }

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

