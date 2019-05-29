<template>

 <el-row class="h-full">
    <el-col :span="5" class="h-full">
      <div class=" h-full">
           <org v-model="orgid" @change="changeOrg"/>
      </div>

    </el-col>
    <el-col :span="19">
        <applybasicTable :id="orgid" />
    </el-col>
  </el-row>
</template>
<script>
import org from '@/views/public/org'
import applybasicTable from './applybasicTable'
export default {
    components:{
        applybasicTable,
        org
    },
    data(){
        return {
            activeName:'first',
            orgid:''
        }
    },
    methods:{
        changeOrg(orgid){
            this.orgid = orgid
        }
    },
}
</script>

