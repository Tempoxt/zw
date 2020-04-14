<template>
    <div>
        <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
            <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
        </el-tabs>
        <div v-if="view_activeName==='入住退宿'">
            <talentManagerTable url="dormitory/checkinout/v1/roominfo" m="1"/>
        </div>
        <div v-if="view_activeName==='住宿费用'"> 
            <talentManagerTable url="dormitory/accommodationfee/v1/accommodationfees" m="2"/>
        </div>
        <div v-if="view_activeName==='住宿记录'">
            <talentManagerTable url="dormitory/accommodationrecord/v1/accommodationrecord" m="3"/>
        </div>
    </div>
</template>
<script>
import { getTabs } from '@/api/common'
import org from '@/views/public/org.vue'
import talentManagerTable from './talentManagerTable'
export default {
    components:{
        talentManagerTable,
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
    async created(){
        const { menu } = await getTabs(this.$route.query.menuid)
        this.menu = menu
        this.view_activeName = menu[0].name;
    }
}
</script>

