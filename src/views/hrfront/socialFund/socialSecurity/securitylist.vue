<template>
   <el-row class="h-full">
    <el-col :span="5" class="h-full">
      <div class=" h-full">
          <org @change="changeOrg"  getApi="org/socialselect"/>
      </div>

    </el-col>
    <el-col :span="19">
        <securityTable :id="currentMenuid"/>
    </el-col>
  </el-row>
</template>
<script>
import * as api_common from "@/api/common";
import org from '@/views/public/org.vue'
import securityTable from './securityTable'
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
        securityTable
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
