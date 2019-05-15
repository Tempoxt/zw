<template>
   <el-row class="h-full">
    <el-col :span="5" class="h-full">
      <div class=" h-full">
          <org @change="changeOrg" />
      </div>

    </el-col>
    <el-col :span="19">
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
