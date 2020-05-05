<template>
    <div class="h-full public-table-container">
        <el-tabs v-model="activeName"  class="table-tabs">
            <el-tab-pane label="出货记录" name="first">
               <dispatchList url="commission/dispatchlists" m="1"/>
            </el-tab-pane>
            <el-tab-pane label="收款记录" name="second" lazy>
               <dispatchCollRecordTable url="commission/dispatchcollectionmatch" m="2"/>
               <!-- <collectiondetail url="commission/collectiondetail" m="2"/> -->
            </el-tab-pane>
            <el-tab-pane label="收款分配记录" name="third" lazy>
               <dispatchCollRecordTable url="commission/dispatchcollectionmatch" m="3"/>
            </el-tab-pane>
            <el-tab-pane label="销售调整" name="fourth" lazy>
               <dispatchCollRecordTable url="commission/selladjust" m="4"/>
            </el-tab-pane>
        </el-tabs>
        <!-- <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
            <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
        </el-tabs>
        <div v-if="view_activeName==='出货记录'">
            <dispatchList url="commission/dispatchlists" m="1"/>
        </div>
        <div v-if="view_activeName==='收款记录'">
            <dispatchCollRecordTable url="commission/collectiondetail" m="2"/>
        </div>
        <div v-if="view_activeName==='收款分配记录'">
            <dispatchCollRecordTable url="commission/dispatchcollectionmatch" m="3"/>
        </div>
        <div v-if="view_activeName==='销售调整'">
            <dispatchCollRecordTable url="commission/selladjust" m="4"/>
        </div> -->
    </div>
</template>
<script>
import { getTabs } from '@/api/common'
import dispatchCollRecordTable from './dispatchCollRecordTable'
import dispatchList from './dispatch/dispatchList'
import collectiondetail from './dispatch/collectiondetail'
import dispatchMatch from './dispatch/dispatchMatch'

export default {
    components:{
        dispatchList,
        // collectiondetail,
        // dispatchMatch,
        dispatchCollRecordTable
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
        // const { menu } = await getTabs(this.$route.query.menuid)
        // this.menu = menu
        // this.view_activeName = menu[0].name;
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



