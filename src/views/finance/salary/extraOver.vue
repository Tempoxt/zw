<template>
    <!-- 额外加班费 -->
    <div>
        <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
            <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
        </el-tabs>
        <div v-if="view_activeName==='日度明细'">
            <extraOverTable url="overtime/daysdetail" m="1"/>
        </div>
        <div v-if="view_activeName==='月度明细'">
            <extraOverTable url="overtime/monthdetail" m="2"/>
        </div>
        <div v-if="view_activeName==='数据统计'">
            <extraOverTable url="overtime/analysis" m="3"/>
        </div>
    </div>
       
</template>
<script>
import { getTabs } from '@/api/common'
import extraOverTable from './extraOverTable'
export default {
    components:{
        extraOverTable,
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


