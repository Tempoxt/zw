<template>

 <el-row class="h-full public-table-container">
    <el-col :span="4" class="h-full"  style="border-right:1px solid #e8e8e8">
      <div class="h-full">
           <org v-model="orgid" @change="changeOrg"/>
      </div>

    </el-col>
    <el-col :span="20">
        <salaryslipTable :id="orgid" />
    </el-col>
  </el-row>
</template>
<script>
import org from '@/views/public/org'
import salaryslipTable from './salaryslipTable'
export default {
    components:{
        salaryslipTable,
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

