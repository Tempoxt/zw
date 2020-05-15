<template>
   <el-row class="h-full public-table-container">
    <el-col :span="4" class="h-full" style="border-right:1px solid #e8e8e8">
      <div class=" h-full">
          <org @change="changeOrg" />
      </div>

    </el-col>
    <el-col :span="20">
        <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
            <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
        </el-tabs>
        <div v-if="view_activeName==='未签名'">
            <taxNoticeTable :id="currentMenuid" url="hrm/v3/getpersonalincometaxenull" murl="getpersonalincometaxenull2"/>
        </div>
        <div v-if="view_activeName==='已签名'">
            <taxNoticeTable :id="currentMenuid" url="hrm/v3/getpersonalincometaxe" murl="getpersonalincometaxe1"/>
        </div>
    </el-col>
  </el-row>
</template>
<script>
import * as api_common from "@/api/common";
import org from '@/views/public/org.vue'
import { getTabs } from '@/api/common'
import taxNoticeTable from './taxNoticeTable'
export default {
    data(){
        return {
            view_activeName:'',
            menu:[],
            activeName:'second',
            filterText:'',
            currentMenuid:0,
        }
    },
    components:{
        org,
        taxNoticeTable
    },
    methods:{
        changeOrg(id){
            this.currentMenuid = id
        },
        handleClick(val){
            // console.log(this.view_activeName)
        },
    },
    async created(){
        const { menu } = await getTabs(this.$route.query.menuid)
        this.menu = menu
        this.view_activeName = menu[0].name;
    }
}
</script>
