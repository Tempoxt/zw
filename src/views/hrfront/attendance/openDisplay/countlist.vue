<template>

<!-- 考勤总汇1 -->
 <el-row class="h-full">
    <el-col :span="4" class="h-full" style="border-right:1px solid #e8e8e8">
        <div  style="padding:20px" class="h-full">
            <org v-model="orgid" @change="changeOrg"/>
        </div>
    </el-col>
    <el-col :span="20">
        <countlistTable :id="orgid" />
    </el-col>
  </el-row>
</template>
<script>
import * as api_common from "@/api/common";
import org from '@/views/public/org'
import countlistTable from './countlistTable'
export default {
    components:{
        countlistTable,
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
            expandedArr:[]
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
