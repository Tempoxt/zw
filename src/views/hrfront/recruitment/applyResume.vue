<template>
    <div class="public-table-container">
        <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
            <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
        </el-tabs>
        <div v-if="view_activeName==='待审核'">
            <applyResumeTable  :flag="0"/>
        </div>
        <div v-if="view_activeName==='审核通过'">
            <applyResumeTable  :flag="1"/>
        </div>
        <div v-if="view_activeName==='审核未通过'">
            <applyResumeTable  :flag="2"/>
        </div>
        <div v-if="view_activeName==='确认入职'">
            <applyResumeTable  :flag="3"/>
        </div>
    </div>
</template>
<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
import { getTabs } from '@/api/common'
import applyResumeTable from './applyResumeTable'
export default {
    mixins: [table_mixin],
    components:{
        applyResumeTable
    },
    data() {
        return {
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


