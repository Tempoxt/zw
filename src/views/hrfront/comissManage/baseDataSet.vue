<template>
    <div>
        <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
            <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
        </el-tabs>
        <div v-if="view_activeName==='年限系数'">
            <baseDataSetTable url="commission/productyearsview" m="1"/>
        </div>
        <div v-if="view_activeName==='计提金额系数'">
            <baseDataSetTable url="commission/shippingratio" m="2"/>
        </div>
        <div v-if="view_activeName==='阶梯提成系数'">
            <baseDataSetTable url="commission/stepcommission" m="3"/>
        </div>
    </div>
</template>
<script>
import { getTabs } from '@/api/common'
import baseDataSetTable from './baseDataSetTable'
export default {
    components:{
        baseDataSetTable
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
            filterText:'',
            view_activeName:'',
            menu:[],
        }
    },
    methods:{
        changeOrg(orgid){
            this.orgid = orgid
        },
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
<style lang="scss">
.flex{
    display: flex;
    align-items: center
}
.dateLap-select {
    .el-input__inner {
        border-right: none;
        border-radius: 2px 0 2px 2px;
    }
}
.dateLap-date{
    border-radius: 0px 2px 2px 0px!important;
    .el-input__inner {
        border-radius: 2px 2px 2px 0px;
    }
}
</style>



