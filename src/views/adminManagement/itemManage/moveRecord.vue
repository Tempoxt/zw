<template>
    <el-row class="h-full public-table-container">
        <el-col :span="4" class="h-full">
            <div class=" h-full">
                <org v-model="orgid" @change="changeOrg"/>
            </div>
        </el-col>
        <el-col :span="20" style="border-left:1px solid rgb(232, 232, 232)">
            <moveRecordTable :orgid="orgid"/>
        </el-col>
    </el-row>
</template>
<script>
import org from '@/views/public/org.vue'
import moveRecordTable from './moveRecordTable'
export default {
    components:{
        moveRecordTable,
        org
    },
    data(){
        return {
            orgid:'',
        }
    },
    methods:{
        changeOrg(orgid){
            this.orgid = orgid
        },
    },
    async created(){
        
    }
}
</script>

