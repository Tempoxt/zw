<template>
    <div>
        <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
            <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
        </el-tabs>
        <div v-if="view_activeName==='未签合同'">
            <workContractTable :flag="0"/>
        </div>
        <div v-if="view_activeName==='已签合同'">
            <workContractTable :flag="1"/>
        </div>
    </div>
</template>
<script>
import workContractTable from './workContractTable'
import { getTabs } from '@/api/common'
export default {
    components:{
        workContractTable,
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
    },
    async created() {
        const { menu } = await getTabs(this.$route.query.menuid)
        this.menu = menu
        this.view_activeName = menu[0].name;
    }
}
</script>
