<template>
   <el-row class="h-full public-table-container">
    <el-col :span="4" class="h-full" style="border-right:1px solid #e8e8e8">
        <org @change="changeOrg" v-model="orgid"/>
    </el-col>
    <el-col :span="20">
        <interviewTable :orgid="orgid"/>
    </el-col>
  </el-row>
</template>
<script>
import org from '@/views/public/org.vue'
import interviewTable from './interviewTable'
export default {
    components:{
        org,
        interviewTable
    },
    data(){
        return {
            view_activeName:'',
            menu:[],
            orgid:'',
        }
    },
    methods:{
        handleClick(val){
            
        },
        changeOrg(orgid){
            this.orgid = orgid
        }
    },
    async created(){
    }
}
</script>

