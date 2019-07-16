<template>
    <div>
        <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
            <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
        </el-tabs>
        <div v-if="view_activeName==='发放列表'">
            <issuepc flag="1"/>
        </div>
        <div v-if="view_activeName==='更换列表'">
            <issuepc flag='2'/>
        </div>
        <!-- <el-tabs v-model="activeName"  class="table-tabs">
            <el-tab-pane label="待招聘" name="first">
                <jobmsg url="recruit/jobmsg"/>
            </el-tab-pane>
            <el-tab-pane label="已完成" name="second" lazy>
                <jobmsg url="recruit/donejobmsg"/>
            </el-tab-pane>
        </el-tabs> -->
    </div>
</template>
<script>
import issuepc from './issuepc'
import { getTabs } from '@/api/common'
export default {
    components:{
        issuepc,
    },
    data(){
        return {
            // activeName:'first',
            view_activeName:'',
            menu:[],
            activeName:'first',
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
