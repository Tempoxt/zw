<template>
    <div>
        <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
            <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
        </el-tabs>
        <div v-if="view_activeName==='审核中'">
            <outDutyLogCheck  :flag="1"/>
        </div>
        <div v-if="view_activeName==='待办离'">
            <outDutyLogCheck  :flag="2"/>
        </div>
        <div v-if="view_activeName==='未批准'">
            <outDutyLogCheck  :flag="3"/>
        </div>
    </div>
</template>
<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
import { getTabs } from '@/api/common'
import outDutyLogCheck from './outDutyLogCheck'
const api_resource = api_common.resource("hrm/quit");
export default {
    mixins: [table_mixin],
    components:{
      outDutyLogCheck
    },
    data() {
        return {
            api_resource,
            view_activeName:'',
            menu:[],
            activeName:'second',
        };
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
};
</script>


