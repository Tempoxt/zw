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
                <employeeTable url="hrm/staffwaitshiftlist" :id="orgid"/>
            </div>
            <div v-if="view_activeName==='已转正'">
                <employeeTable url="hrm/staffalreadyshiftlist" :id="orgid"/>
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
export default {
    mixins: [table_mixin],
    components:{
        employeeTable,
        org
    },
    data() {
        return {
            view_activeName:'',
            menu:[],
            activeName:'first',
            orgid:''
        };
    },
    methods: {
        handleClick(val){
            
        },
        changeOrg(id){
            this.orgid = id
        }
    },
    
    async created() {
        const { menu } = await getTabs(this.$route.query.menuid)
        this.menu = menu
        this.view_activeName = menu[0].name;
    }
};
</script>


