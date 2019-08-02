<template>

 <el-row class="h-full">
    <el-col :span="5" class="h-full">
      <div class=" h-full">
           <org v-model="orgid" @change="changeOrg" getApi="org?org_id=d4"/>
      </div>

    </el-col>
    <el-col :span="19">
        <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
            <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
        </el-tabs>
        <div v-if="view_activeName==='个人提成汇总'">
            <comissionRecordTable url="commission/presoncommcollect" @change="changeTab"  :id="orgid"/>
        </div>
        <div v-if="view_activeName==='客户提成明细'">
            <comissionRecordTable url="commison/cuscommdetail"  @change="changeTab" :id="orgid"/>
        </div>
        <div v-if="view_activeName==='收款提成明细'">
            <comissionRecordTable @change="changeTab" url="commission/receiptCommDetail" :id="orgid"/>
        </div>
    </el-col>
  </el-row>
</template>
<script>
import org from '@/views/public/org'
import { getTabs } from '@/api/common'
import comissionRecordTable from './comissionRecordTable'
export default {
    components:{
        comissionRecordTable,
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
        changeTab(view_activeName){
            this.view_activeName = view_activeName
            console.log(this.view_activeName,'view_activeName')
        }
    },
    async created() {
        const { menu } = await getTabs(this.$route.query.menuid)
        this.menu = menu
        this.view_activeName = menu[0].name;
    }
}
</script>


