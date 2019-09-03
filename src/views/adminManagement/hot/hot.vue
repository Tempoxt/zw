<template>

 <el-row class="h-full">
    <el-col :span="5" class="h-full" style="border-right:1px solid #e8e8e8">
      <div class=" h-full">
           <org @change="changeOrg" getApi="org/hotselect"/>
           <!-- <hignAllowance v-model="orgid" url="org/hotselect"/>-->
      </div>

    </el-col>
    <el-col :span="19">
       <el-tabs v-model="activeName"  class="table-tabs">
            <el-tab-pane label="津贴记录" name="first">
               <hotListTable :id="orgid"/>
            </el-tab-pane>
            <el-tab-pane label="津贴名单" name="second" lazy>
               <hotLogTable :id="orgid"/>
            </el-tab-pane>
        </el-tabs>
    </el-col>
  </el-row>
</template>
<script>
// import hignAllowance from '@/views/public/customOrg'
import org from '@/views/public/org.vue'
import hotLogTable from './hotLogTable'
import hotListTable from './hotListTable'
export default {
    components:{
        // hignAllowance,
        hotLogTable,
        hotListTable,
        org
    },
    data(){
        return {
            activeName:'first',
            orgid:''
        }
    },
    methods:{
        changeOrg(id){
            this.orgid = id
        }
    },
    async created(){

    }
}
</script>

