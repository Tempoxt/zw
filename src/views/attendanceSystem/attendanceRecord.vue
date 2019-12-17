<template>

<!-- 考勤记录 -->
 <el-row class="h-full">
    <el-col :span="4" class="h-full" style="border-right:1px solid #e8e8e8">
        <div class=" h-full">
            <org v-model="orgid" @change="changeOrg" />   
        </div>
    </el-col>
    <el-col :span="20">
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
        }
    },
    methods:{
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


