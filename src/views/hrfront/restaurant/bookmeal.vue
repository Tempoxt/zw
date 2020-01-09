<template>
    <el-row class="h-full public-table-container">
        <el-col :span="4" class="h-full" style="border-right:1px solid #e8e8e8">
            <div class=" h-full">
                <org v-model="orgid" @change="changeOrg" />   
            </div>
        </el-col>
        <el-col :span="20">
            <orderingmeals :currentMenuid="orgid"/>
        </el-col>
    </el-row>
</template>
<script>
import org from '@/views/public/org'
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

