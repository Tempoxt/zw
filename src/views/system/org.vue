<template>
  <el-tabs v-model="activeName" class="table-tabs" @tab-click="tabClick">
    <el-tab-pane label="组织架构管理" name="first">
      <org-table />
    </el-tab-pane>
    <el-tab-pane label="组织架构图" name="second">
      <org-tree ref="tree"/>
    </el-tab-pane>
  </el-tabs>

</template>
<script>
import orgTable from './org/orgTable'
import orgTree from './org/orgTree'
export default {
  components:{
    orgTable,
    orgTree
  },
  data(){
    return {
      activeName:'first'
    }
  },
  methods:{
    tabClick(tab){
      if(tab.index == 1){
        this.$refs.tree.fetchData()
      }
    
    }
  },
}
</script>
