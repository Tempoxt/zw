<template>

 <el-row class="h-full">
    <el-col :span="4" class="h-full"  style="border-right:1px solid #e8e8e8">
      <div class="h-full">
           <org v-model="orgid" @change="changeOrg"/>
      </div>

    </el-col>
    <el-col :span="20">
        <staffSalaryTable :id="orgid" />
    </el-col>
  </el-row>
</template>
<script>
import org from '@/views/public/org'
import staffSalaryTable from './staffSalaryTable'
export default {
    components:{
        staffSalaryTable,
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

