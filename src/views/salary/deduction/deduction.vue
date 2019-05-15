<template>
   <el-row class="h-full">
    <el-col :span="5" class="h-full">
      <div class=" h-full">
          <org @change="changeOrg" />
      </div>

    </el-col>
    <el-col :span="19">
        <deductionTable :id="currentMenuid"/>
    </el-col>
  </el-row>
</template>
<script>
import * as api_common from "@/api/common";
import deductionTable from './deductionTable'
import org from '@/views/public/org.vue'
export default {
    data(){
        return {
            filterText:'',
            data2:[],
            currentMenuid:0
        }
    },
    components:{
        deductionTable,
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

