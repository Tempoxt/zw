<template>
   <el-row class="h-full">
    <el-col :span="5" class="h-full" style="border-right:1px solid #e8e8e8">
        <org @change="changeOrg" />
    </el-col>
    <el-col :span="19">
          <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
                <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id" ></el-tab-pane>
           </el-tabs>
           <div v-if="view_activeName==='在职员工' && orgid">
               <personnelmanagement :orgid="orgid"/>
           </div>
            <div v-if="view_activeName==='离职员工' && orgid">
               <personnelmanagement-out :orgid="orgid"/>
           </div>
    </el-col>
  </el-row>
</template>
<script>
import org from '@/views/public/org.vue'
import { getTabs } from '@/api/common'
import personnelmanagement from './personnelmanagement'
import personnelmanagementOut from './personnelmanagementOut'
export default {
    components:{
        org,
        personnelmanagement,
        personnelmanagementOut
    },
    data(){
        return {
            view_activeName:'',
            menu:[],
            orgid:'',
        }
    },
    methods:{
        handleClick(val){
            
        },
        changeOrg(id){
            this.orgid = id
       
        }
    },
    async created(){
         const { menu } = await getTabs(this.$route.query.menuid)
         this.menu = menu
         this.view_activeName = menu[0].name

    }
    
}
</script>

