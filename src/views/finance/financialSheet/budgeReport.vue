<template>
<!-- 部门预算明细 -->
 <el-row class="h-full">
    <el-col :span="4" class="h-full" style="border-right:1px solid #e8e8e8">
        <div class=" h-full">
            <org v-model="orgid" @change="changeOrg" />   
        </div>
    </el-col>

    <el-col :span="20">
        <budgeTable :id="orgid" />
    </el-col>
  </el-row>
</template>
<script>
import org from '@/views/public/org'
import budgeTable from './budgeTable'
export default {
    components:{
        budgeTable,
        org
    },
    watch:{
       filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    data(){
        return {
            activeName:'first',
            orgid:'',
            data2:[],
            filterText:'',
        }
    },
    methods:{
        changeOrg(orgid){
            this.orgid = orgid
        },
    },
}
</script>