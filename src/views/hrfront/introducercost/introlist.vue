<template>
    <div>
        <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs">
            <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
        </el-tabs>
        <div v-if="view_activeName==='待处理'">
            <introlistTable flowStatus="1"/>
        </div>
        <div v-if="view_activeName==='待确认'">
            <introlistTable flowStatus="2"/>
        </div>
        <div v-if="view_activeName==='已完成'">
            <introlistTable flowStatus="3"/>
        </div>
        <div v-if="view_activeName==='全部记录'">
            <introlistTable flowStatus="4"/>
        </div>
    </div>
</template>
<script>
import introlistTable from './introlistTable'
import { getTabs } from '@/api/common'
export default {
    components:{
        introlistTable,
    },
    watch:{
       filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    data(){
        return {
            activeName:'first',
            view_activeName:'',
            menu:[],
        }
    },
    methods:{

    },
    async created() {
        const { menu } = await getTabs(this.$route.query.menuid)
        this.menu = menu
        this.view_activeName = menu[0].name;
    }
}
</script>


