<template>
   <el-row class="h-full">
    <el-col :span="4" class="h-full" style="border-right:1px solid #e8e8e8">
      <div class=" h-full">
          <org @change="changeOrg" />
      </div>

    </el-col>
    <el-col :span="20">
        <el-tabs v-model="activeName" class="table-tabs">
                <el-tab-pane label="会员管理" name="first">
                    <memberTable :id="currentMenuid"/>
                </el-tab-pane>
                <el-tab-pane label="会员缴费" name="second">
                    <feecollectingTable :id="currentMenuid"/>
                </el-tab-pane>
        </el-tabs>
    </el-col>
  </el-row>
</template>
<script>
import * as api_common from "@/api/common";
import memberTable from './memberTable'
import feecollectingTable from './feecollectingTable'
import org from '@/views/public/org.vue'
export default {
    data(){
        return {
            filterText:'',
            data2:[],
            currentMenuid:0,
            activeName:'first'
        }
    },
    components:{
        memberTable,
        feecollectingTable,
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

