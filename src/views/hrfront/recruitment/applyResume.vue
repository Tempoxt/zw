<template>
    <el-row class="h-full public-table-container">
        <el-col :span="4" class="h-full" style="border-right:1px solid #e8e8e8">
            <div class=" h-full">
                <org v-model="orgid" @change="changeOrg" getApi="org/recruitselect"/>
            </div>
        </el-col>
        <el-col :span="20">
            <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
                <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
            </el-tabs>
            <div v-if="view_activeName==='待初审'">
                <applyResumeTable  :flag="0" :orgid="orgid"/>
            </div>
            <div v-if="view_activeName==='待复审'">
                <applyResumeTable  :flag="1" :orgid="orgid"/>
            </div>
            <div v-if="view_activeName==='待面试'">
                <applyResumeTable  :flag="2" :orgid="orgid"/>
            </div>
            <div v-if="view_activeName==='待入职'">
                <applyResumeTable  :flag="3" :orgid="orgid"/>
            </div>
        </el-col>
    </el-row>
</template>
<script>
import org from '@/views/public/org'
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
import { getTabs } from '@/api/common'
import applyResumeTable from './applyResumeTable'
export default {
    mixins: [table_mixin],
    components:{
        applyResumeTable,
        org
    },
    watch:{
        filterText(val) {
            this.$refs.tree2.filter(val);
        }
    },
    data() {
        return {
            view_activeName:'',
            menu:[],
            activeName:'first',
            orgid:'',
            filterText:'',
        };
    },
    methods: {
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
};
</script>


