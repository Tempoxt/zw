<template>
    <el-row class="h-full">
        <el-col :span="4" class="h-full">
            <div class=" h-full">
                <org v-model="orgid" @change="changeOrg"/>
            </div>
        </el-col>
        <el-col :span="20" style="border-left:1px solid rgb(232, 232, 232)">
            <personLedgerTable :orgid="orgid"/>
        </el-col>
    </el-row>
</template>
<script>
import org from '@/views/public/org.vue'
import personLedgerTable from './personLedgerTable'
export default {
    components:{
        personLedgerTable,
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

