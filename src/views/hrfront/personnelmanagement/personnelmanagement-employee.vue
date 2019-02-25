<template>
   <el-row class="h-full">
    <el-col :span="5" class="h-full" style="border-right:1px solid #e8e8e8">
        <org />
    </el-col>
    <el-col :span="19">
          <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
                <el-tab-pane :label="'总部信息'" name="a1" lazy ></el-tab-pane>
                <el-tab-pane :label="'总部信息'" name="a2" lazy ></el-tab-pane>
                <el-tab-pane :label="'总部信息'" name="a3" lazy ></el-tab-pane>
                <el-tab-pane :label="'总部信息'" name="a4" lazy ></el-tab-pane>
           </el-tabs>
    </el-col>
  </el-row>
</template>
<script>
import org from '@/views/public/org.vue'
export default {
    components:{
        org
    },
    data(){
        return {
            view_activeName:''
        }
    },
    methods:{
        handleClick(){

        }
    }
    
}
</script>

