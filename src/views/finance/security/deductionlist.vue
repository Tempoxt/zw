<template>
   <el-row class="h-full public-table-container">
    <el-col :span="4" class="h-full" style="border-right:1px solid #e8e8e8">
      <div class=" h-full">
          <org @change="changeOrg" />
      </div>

    </el-col>
    <el-col :span="20">
         <deductionlistTable :id="currentMenuid"/>
    </el-col>
  </el-row>
</template>
<script>
import * as api_common from "@/api/common";
import org from '@/views/public/org.vue'
import deductionlistTable from './deductionlistTable'
export default {
    data(){
        return {
            filterText:'',
            currentMenuid:0,
             activeName:'first'
        }
    },
    components:{
        org,
        deductionlistTable
    },
    methods:{
        changeOrg(id){
            this.currentMenuid = id
        }
    },
    async created(){
    
    }
}
</script>
