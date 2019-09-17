<template>
    <el-row class="h-full">
        <el-col :span="4" class="h-full">
            <div class=" h-full">
                <org v-model="orgid" @change="changeOrg"/>
            </div>
        </el-col>
        <el-col :span="20" style="border-left:1px solid rgb(232, 232, 232)">
            <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
                <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
            </el-tabs>
            <div v-if="view_activeName==='待转正'">
                <employeeTable  :flag="1"/>
            </div>
            <div v-if="view_activeName==='已转正'">
                <employeeTable  :flag="2"/>
            </div>
        </el-col>
    </el-row>
</template>
<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
import { getTabs } from '@/api/common'
import org from '@/views/public/org'
import employeeTable from './employeeTable'
const api_resource = api_common.resource("hrm/quit");
export default {
    mixins: [table_mixin],
    components:{
        employeeTable,
        org
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


