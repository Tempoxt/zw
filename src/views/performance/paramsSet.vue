<template>
    <!-- 考核方案参数设置 -->
    <el-row class="h-full public-table-container">
       <el-col :span="4" class="h-full">
           <org v-model="orgid" @change="changeOrg" getApi="org/tree"/>
        </el-col>
        <el-col :span="20" style="border-left:1px solid rgb(232, 232, 232)">
            <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
                <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
            </el-tabs>
            <div v-if="view_activeName==='年度参数'">
                <paramsSetTable :orgid="orgid" :id="id" paramv="年度参数" url="YearTargetParameter"/>
            </div>
            <div v-if="view_activeName==='月份参数'">
                <paramsSetTable :orgid="orgid" :id="id" paramv="月份参数" url="MonthParameter"/>
            </div>
            <div v-if="view_activeName==='个人月参数'">
                <paramsSetTable :orgid="orgid" :id="id" paramv="个人月度参数" url="PersonalParameter"/>
            </div>
        </el-col>
    </el-row>
</template>
<script>
import org from '@/views/public/org'
import { getTabs } from '@/api/common'
import paramsSetTable from './paramsSetTable'
export default {
    components:{
        paramsSetTable,
        org,
    },
    data(){
        return {
            orgid:'',
            activeName:'first',
            filterText:'',
            view_activeName:'',
            menu:[],
            data2:[],
            expandedArr:[],
            depart_name:'',
            id: ''
        }
    },
    methods:{
        changeOrg(orgid,id){
            this.orgid = orgid
            this.id = id
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

<style lang="scss" scoped>
    .scroll {
        height: calc(100% - 0px);
        width: 100%;
        padding-bottom: 20px;
        /deep/ .scrollbar-wrapper {
            overflow-x: hidden;
        }
    }
</style>
