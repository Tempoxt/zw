<template>
   <el-row class="h-full">
    <el-col :span="5" class="h-full">
      <div class=" h-full">
          <org @change="changeOrg" />
      </div>

    </el-col>
    <el-col :span="19">
        <el-tabs v-model="activeName">
            <el-tab-pane label="社保记录" name="first">
               <securityandfundTable :id="currentMenuid"/>
            </el-tab-pane>
            <el-tab-pane label="公积金记录" name="second" lazy>
               <fundlistTable  :id="currentMenuid"/>
            </el-tab-pane>
        </el-tabs>
    </el-col>
  </el-row>
</template>
<script>
import * as api_common from "@/api/common";
import org from '@/views/public/org.vue'
import securityandfundTable from './securityandfundTable'
import fundlistTable from './fundlistTable'
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
        securityandfundTable,
        fundlistTable
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
