<template>
   <el-row class="h-full">
    <el-col :span="5" class="h-full" style="border-right:1px solid #e8e8e8">
        <org @change="changeOrg" />
    </el-col>
    <el-col :span="19">
            <orderingmeals :currentMenuid="orgid"/>
    </el-col>
  </el-row>
</template>
<script>
import org from '@/views/public/org.vue'
import orderingmeals from './restaurant/orderingmeals'

export default {
    components:{
        org,
        orderingmeals
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
        

    }
    
}
</script>

