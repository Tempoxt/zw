<template>

 <el-row class="h-full">
    <el-col :span="5" class="h-full">
      <div class=" h-full">
           <hignAllowance v-model="orgid" url="org/hotselect"/>
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
import hignAllowance from '@/views/public/customOrg'
import hotLogTable from './hotLogTable'
import hotListTable from './hotListTable'
export default {
    components:{
        hignAllowance,
        hotLogTable,
        hotListTable
    },
    data(){
        return {
            activeName:'first',
            orgid:''
        }
    }
}
</script>

