<template>
  
    <el-row class="h-full public-table-container">
        <el-col :span="4" class="h-full" style="border-right:1px solid #e8e8e8">
            <org @change="changeOrg" v-model="orgid"/>
        </el-col>
        <el-col :span="20">
            <staffPlanTable :id="orgid"/>
        </el-col>
    </el-row>
</template>
<script>
import staffPlanTable from './staffPlanTable'
import org from '@/views/public/org'
export default {
    components:{
        staffPlanTable,
        org
    },
    watch:{
        filterText(val) {
            this.$refs.tree2.filter(val);
        }
    },
    data(){
        return {
            view_activeName:'',
            menu:[],
            activeName:'first',
            orgid:'',
            filterText:'',
        }
    },
    methods: {
        handleClick(val){
            
        },
         changeOrg(orgid){
            this.orgid = orgid
        }
    },
    async created() {
    
    }
}
</script>
