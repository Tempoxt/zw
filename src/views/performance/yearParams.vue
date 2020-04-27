<template>
    <!-- 年度考核目标数据 -->
    <el-row class="h-full public-table-container">
       <el-col :span="4" class="h-full">
            <div class=" h-full">
                <org v-model="orgid" @change="changeOrg" getApi="org/tree"/>   
            </div>
        </el-col>
        <el-col :span="20" style="border-left:1px solid rgb(232, 232, 232)">
            <yearParamsTable :orgid="orgid" :id="id" :depart_name="depart_name"/>
        </el-col>
    </el-row>
</template>
<script>
import org from '@/views/public/org'
import yearParamsTable from './yearParamsTable'
export default {
    components:{
        yearParamsTable,
        org
    },
    data(){
        return {
            orgid:'',
            filterText:'',
            id: '',
            depart_name: ''
        }
    },
    methods:{
        changeOrg(orgid,id,name){
            this.orgid = orgid
            this.id = id
            this.depart_name = name
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
