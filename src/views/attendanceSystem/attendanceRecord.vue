<template>

<!-- 考勤记录 -->
 <el-row class="h-full public-table-container">
    <el-col :span="orgBarOpen?4:1" class="h-full" style="border-right:1px solid #e8e8e8;position: relative;">
        <div class=" h-full" v-if="orgBarOpen">
            <org v-model="orgid" @change="changeOrg" />   
        </div>
        <div class="toggle-orgBar" @click="toggleOrgBar">
            <el-link class="toggle-orgBar-btn" :title="orgBarOpen?'隐藏部门':'显示部门'"><i :class="orgBarOpen?'el-icon-d-arrow-left':'el-icon-d-arrow-right'"></i></el-link>
        </div>
    </el-col>
    <el-col :span="orgBarOpen?20:23">
        <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
            <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
        </el-tabs>
        <div v-if="view_activeName==='日统计记录'">
            <attendanceRecordTable url="attendance/dailyreport" m="1" :id="orgid"/>
        </div>
        <div v-if="view_activeName==='月统计记录'">
            <attendanceRecordTable url="attendance/monthcollect" m="2" :id="orgid"/>
        </div>
    </el-col>
  </el-row>
</template>
<script>
import org from '@/views/public/org'
import { getTabs } from '@/api/common'
import attendanceRecordTable from './attendanceRecordTable'
export default {
    components:{
        attendanceRecordTable,
        org
    },
    watch:{
        filterText(val) {
            this.$refs.tree2.filter(val);
        }
    },
    data(){
        return {
            activeName:'first',
            orgid:'',
            filterText:'',
            view_activeName:'',
            menu:[],
            orgBarOpen:true
        }
    },
    methods:{
        changeOrg(orgid){
            this.orgid = orgid
        },
        handleClick(val){
            
        },
        toggleOrgBar(){
            this.orgBarOpen = !this.orgBarOpen
        }
    },
    async created() {
        const { menu } = await getTabs(this.$route.query.menuid)
        this.menu = menu
        this.view_activeName = menu[0].name;
    }
}
</script>

<style lang="scss">
    .toggle-orgBar {
        position: absolute;
        right: 6px;
        top:50%;
        .toggle-orgBar-btn {
            font-size:16px;
        }
    }
</style>
