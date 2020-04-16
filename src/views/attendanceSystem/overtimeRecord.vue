<template>
    <div class="public-table-container">
        <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
            <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
        </el-tabs>
        <div v-if="view_activeName==='申请中'">
            <overtimeTable auditStatus='0' m='0' url="attendance/overtime"/>
        </div>
        <div v-if="view_activeName==='加班申请汇总'">
            <overtimeTable auditStatus='1' m='1' url="attendance/overtime"/>
        </div>
        <div v-if="view_activeName==='产线加班计划'">
            <overtimeTable m='2' url="attendance/prodovertime/plan"/>
        </div>
        <div v-if="view_activeName==='产线加班签名'">
            <overtimeTable  m='3' url="attendance/prodovertime/sign"/>
        </div>
    </div>
</template>
<script>
import overtimeTable from './overtimeTable'
import { getTabs } from '@/api/common'
export default {
    data(){
        return {
            view_activeName:'',
            menu:[],
        }
    },
    components:{
        overtimeTable,
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


