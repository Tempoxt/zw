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
            :props="{children: 'subs', label: 'name',isLeaf:'leaf' }"
            node-key="orgid"
            :filter-node-method="filterNode"
            ref="tree2"
            :highlight-current="true"
            :check-on-click-node="false"
            @node-click="handleChangeNode"
            :expand-on-click-node="false"
            :load="loadNode1"
            lazy
          >
            <span slot-scope="{ node, data }" :class="`${data.disabled?'disabled':''}`">

              <span v-if="data.subs === 1" class="icon iconfont icon-zonggongsi"></span>
              <!-- <span v-if="data.org_type === 2" class="icon iconfont icon-fengongsi"></span>
              <span v-if="data.org_type === 3" class="icon iconfont icon-fenbumen"></span> -->
              &nbsp;
              <span class="label">{{ node.label }} <span style="color:#A3AFB7;">{{data.principalship}}</span></span>
            </span>
          </el-tree>
         
        </div>
    </el-scrollbar>
</template>
<script>
import * as api_common from "@/api/common";
export default {
    watch:{
       filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    methods:{

      handleChangeNode(data,node){
          this.$emit('change',data)
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name && data.name.indexOf(value) !== -1;
      },
       async loadNode1(node, resolve) {
          const  { data }  = node
          if(data.subs){
             let res = await this.$request.get('org/select',{
                 params:{
                     org_id:data.id
                 }
             })
             res.forEach(o=>{
                 o.leaf = !o.subs
             })
             resolve(res);
          }else{
              resolve([])
          }
      }
    },
    data(){
        return {
            data2:[],
            filterText:'',
           
        }
    },
    async created(){
         this.data2 = await this.$request.get('/org/select');
        //  this.data2[0].disabled = true
        //  let defaultId = this.data2[0].orgid
        //  this.$emit('change',defaultId)
        // this.$nextTick(()=>{
        //    this.$refs.tree2.setCurrentKey(defaultId)
        // })
      
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
.disabled {
    .label {
        color:#A3AFB7;
    }
    .icon {
        color:#A3AFB7;
    }
}
</style>

