<template>
<!-- 部门预算明细 -->
 <el-row class="h-full public-table-container">
    <el-col :span="4" class="h-full" style="border-right:1px solid #e8e8e8">
        <div class=" h-full">
            <org v-model="orgid" @change="changeOrg" getApi="org/tree"/>   
        </div>
    </el-col>

    <el-col :span="20">
        <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
            <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
        </el-tabs>
        <div v-if="view_activeName==='预算费用'">
            <chargeDetailTable a='1' url="budgetcontrol/detialsofcharger" :id="orgid"/>
        </div>
        <div v-if="view_activeName==='实际费用'">
            <chargeDetailTable a='2' url="budgetcontrol/actualcosts" :id="orgid"/>
        </div>
    </el-col>
  </el-row>
</template>
<script>
import { getTabs } from '@/api/common'
import org from '@/views/public/org'
import chargeDetailTable from './chargeDetailTable'
export default {
    components:{
        chargeDetailTable,
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
            activeName:'first',
            menu:[],
            orgid:'',
            filterText:'',
        }
    },
    methods:{
        changeOrg(orgid){
            this.orgid = orgid
        },
        handleClick(val){
            
        },
    },
    async created(){
        const { menu } = await getTabs(this.$route.query.menuid)
        this.menu = menu
        this.view_activeName = menu[0].name;
    }
}
</script>