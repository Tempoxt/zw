<template>
    <!-- 员工考核方案设置 -->
    <el-row class="h-full public-table-container">
       <el-col :span="4" class="h-full">
            <div class=" h-full">
                <org v-model="orgid"  @change="changeOrg" getApi="org/tree"/>    
            </div>
        </el-col>
        <el-col :span="20" style="border-left:1px solid rgb(232, 232, 232)">
            <PerformanceSchemeTable :orgid="orgid" :id="id"/>
        </el-col>
    </el-row>
</template>
<script>
import org from '@/views/public/org'
import PerformanceSchemeTable from './PerformanceSchemeTable'
export default {
    components:{
        PerformanceSchemeTable,
        org
    },
    data(){
        return {
            orgid:'',
            filterText:'',
            id: ''
        }
    },
    methods:{
        changeOrg(orgid,id){
            this.orgid = orgid
            this.id = id
        },
        handleClick(val){
            
        },
    },
    async created() {
        
    }
}
</script>

<style lang="scss" scoped>
    .scroll {
        height: calc(100% - 0px);
        width: 100%;
        padding-bottom: 20px;
        /deep/ .scrollbar-wrapper {
            overflow-x: hidden;
        }
    }
</style>
