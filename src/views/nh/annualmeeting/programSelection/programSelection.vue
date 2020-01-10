<template>

    <div class="public-table-container">
        <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
            <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
        </el-tabs>
        <div v-if="view_activeName==='评选列表'">
            <selectlistTable/>
        </div>
        <div v-if="view_activeName==='评委名单'">
            <judgeList/>
        </div>
    </div>
</template>
<script>
import { getTabs } from '@/api/common'
import selectlistTable from './selectlistTable'
import judgeList from './judgeList'
export default {
    components:{
        selectlistTable,
        judgeList,
    },
    data(){
        return {
            activeName:'first',
            view_activeName:'',
            menu:[],
        }
    },
    methods:{
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


