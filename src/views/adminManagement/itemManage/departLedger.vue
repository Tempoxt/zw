<template>
    <el-row class="h-full public-table-container">
        <el-col :span="4" class="h-full">
            <div class=" h-full">
                <org v-model="orgid" @change="changeOrg"/>
            </div>
        </el-col>
        <el-col :span="20" style="border-left:1px solid rgb(232, 232, 232)">
            <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
                <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
            </el-tabs>
            <div v-if="view_activeName==='部门管理员'">
                <departLedgerTable url="toolstationery/departledgermanager" :orgid="orgid"/>
            </div>
            <div v-if="view_activeName==='部门台账'">
                <departLedgerTable url="toolstationery/departledger" :orgid="orgid"/>
            </div>
        </el-col>
    </el-row>
</template>
<script>
import org from '@/views/public/org.vue'
import { getTabs } from '@/api/common'
import departLedgerTable from './departLedgerTable'
export default {
    components:{
        departLedgerTable,
        org
    },
    data(){
        return {
            orgid:'',
            activeName:'first',
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

