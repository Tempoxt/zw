<template>
    <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
        <div style="padding:20px">
          <div class="side-header">
            <el-input placeholder="快速查找" v-model="filterText" class="input">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
          
          </div>

          <el-tree
            class="tree"
            :data="data2"
            :props="{children: 'subs', label: 'name' }"
            default-expand-all
            node-key="orgid"
            :filter-node-method="filterNode"
            ref="tree2"
            :highlight-current="true"
            :check-on-click-node="false"
            @node-click="handleChangeNode"
            :expand-on-click-node="false"
          >
            <span slot-scope="{ node, data }">

              <span v-if="data.org_type === 1" class="icon iconfont icon-zonggongsi"></span>
              <span v-if="data.org_type === 2" class="icon iconfont icon-fengongsi"></span>
              <span v-if="data.org_type === 3" class="icon iconfont icon-fenbumen"></span>
              &nbsp;
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
         
        </div>
    </el-scrollbar>
</template>
<script>
import * as api_common from "@/api/common";
export default { 
  props:{
		showteam:{
      default:''
    },
	},
    watch:{
       filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    methods:{
      handleChangeNode(val,node){
          this.$emit('change',val.orgid)
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name && data.name.indexOf(value) !== -1;
      },
    },
    data(){
        return {
            data2:[],
            filterText:'',
           
        }
    },
    async created(){
      if (this.showteam) {
        this.data2 = await this.$request.get('org',{
            params:{
                showteam:this.showteam
            }
        });
      }else{
        this.data2 = await api_common.getOrg();
      }
        // this.data2 = await api_common.getOrg();
        let defaultId = this.data2[0].orgid
        this.$emit('change',defaultId)
        this.$nextTick(()=>{
           this.$refs.tree2.setCurrentKey(defaultId)
        })
      
    }
}
</script>
<style lang="scss" scoped>

.scroll {
  height: calc(100% - 30px);
  width: 100%;
 /deep/ .scrollbar-wrapper {
    overflow-x: hidden;
  }
}
</style>

