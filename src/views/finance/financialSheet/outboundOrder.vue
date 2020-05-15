<template>
 
    <div class="public-table-container">
        <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
            <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
        </el-tabs>
        <div v-if="view_activeName==='材料出库单'">
            <outboundTable a='1' url="materialsexware/list"/>
        </div>
        <div v-if="view_activeName==='其他出库单'">
            <outboundTable a='2' url="otherexware/list"/>
        </div>
    </div>
</template>
<script>
import * as api_common from "@/api/common";
import { getTabs } from '@/api/common'
import outboundTable from './outboundTable'
export default {
    data(){
        return {
            view_activeName:'',
            menu:[],
            activeName:'second',
            filterText:'',
            currentMenuid:0,
        }
    },
    components:{
        outboundTable,
    },
    methods:{
        changeOrg(id){
            this.currentMenuid = id
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
