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
            <div v-if="view_activeName==='待招聘'">
                <jobmsg url="recruit/jobmsg" :id="orgid"/>
            </div>
            <div v-if="view_activeName==='已完成'">
                <jobmsg url="recruit/donejobmsg" :id="orgid"/>
            </div>
        </el-col>
    </el-row>
    <!-- <div>
        <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
            <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
        </el-tabs>
        <div v-if="view_activeName==='待招聘'">
            <jobmsg url="recruit/jobmsg"/>
        </div>
        <div v-if="view_activeName==='已完成'">
            <jobmsg url="recruit/donejobmsg"/>
        </div>
    </div> -->
</template>
<script>
import org from '@/views/public/org'
import jobmsg from './jobmsg'
import { getTabs } from '@/api/common'
export default {
    components:{
        jobmsg,
        org
    },
    data(){
        return {
            // activeName:'first',
            view_activeName:'',
            menu:[],
            activeName:'first',
            orgid:'',
            filterText:'',
        }
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
}
</script>
