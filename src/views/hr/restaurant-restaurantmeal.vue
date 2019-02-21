<template>
   <el-row class="h-full">
    <el-col :span="5" class="h-full">
      <div class="page-side h-full">
         <span class="page-title">
         餐厅餐次设置
        </span>
        <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
        <div>
          <div class="side-header">
            <el-input placeholder="快速查找" v-model="filterText" class="input">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <!-- <el-button icon="el-icon-refresh" circle @click="refresh"></el-button> -->
          </div>
          <el-tree
            class="tree"
            :data="data2"
            :props="{children: 'subs', label: 'restaurantname' }"
            default-expand-all
            node-key="id"
            :filter-node-method="filterNode"
            ref="tree2"
            :highlight-current="true"
            :check-on-click-node="false"
            @node-click="handleChangeNode"
            :expand-on-click-node="false"
          >
            <span slot-scope="{ node, data }">
              <span class="icon iconfont icon-wenjian"></span>
              &nbsp;
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
         
        </div>
         </el-scrollbar>
      </div>

    </el-col>
    <el-col :span="19">
       <div style="overflow: hidden;">
         <restaurantmeal :id="current_id"/>
       </div>
    </el-col>
  </el-row>
</template>
<script>
import * as api_common from "@/api/common";
const api_restaurant = api_common.resource('restaurant')
import restaurantmeal from './restaurant/restaurantmeal'
export default {
    components:{
        restaurantmeal
    },
    watch:{
      tabActive(val){
        
      },
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    data(){
        return {
            filterText:'',
            data2:[],
            currentMenuid:0,
            current_id:''
        }
    },
    methods:{

      filterNode(value, data) {
        if (!value) return true;
        return data.restaurantname && data.restaurantname.indexOf(value) !== -1;
      },
      handleChangeNode(val,node){
          this.current_id = val.id
      },
      async refresh(){
          this.data2 =  await api_common.getOrg();
          this.$nextTick(()=>{
            this.$refs.tree2.setCurrentKey(this.orgid)
          })
      }

    },
    async created(){
        this.data2 = await api_common.resource('restaurant/enable').get();
        let defaultMenuid = this.data2[0].id
        
        this.$nextTick(()=>{
          this.$refs.tree2.setCurrentKey(this.data2[0].id)
        })
        let that = this
       this.$nextTick(()=>{
          this.current_id = defaultMenuid;
          this.handleChangeNode({id:this.data2[0].id})
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

