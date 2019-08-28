<template>
   <el-row class="h-full">
    <el-col :span="5" class="h-full">
      <div class="page-side h-full">
     
        <div class="h-full">
          <div class="side-header">
            <el-input placeholder="快速查找" v-model="filterText" class="input">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <!-- <el-button icon="el-icon-refresh" circle @click="refresh"></el-button> -->
          </div>
          
        <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
          <el-tree
            class="tree"
            :data="data2"
            :props="{children: 'subs', label: 'dormName' }"
            default-expand-all
            node-key="id"
            :filter-node-method="filterNode"
            ref="tree2"
            :highlight-current="true"
            :check-on-click-node="false"
            @node-click="handleChangeNode"
            :expand-on-click-node="false"
          >
            <span slot-scope="{ node, data }" style="display:flex;justify-content: space-between;width: 100%;">
              <template v-if="!data.roomName">
              <div >
                  <span class="icon iconfont icon-zonggongsi"></span>
                &nbsp;
                <span>{{ node.label||data.name }} </span>
            
              </div>
               <span style="padding-right:10px">({{data.totalBeds}} - {{data.usedBeds}})</span>
             </template>
              <template v-else>
                   <div>
                      <span class="icon iconfont icon-nv" v-if="data.dormType===0" style="color:rgba(255, 52, 160, 1)"></span>
                      <span class="icon iconfont icon-nan" v-if="data.dormType===1" style="color:rgba(11, 178, 212, 1)"></span>
                      &nbsp;
                      <span>{{ data.roomName||data.name }} </span>
                  </div>
                  <span style="padding-right:10px" v-if="data.totalBeds">
                    ( {{data.totalBeds+' - '}}
                    <span style="color:red" v-if="data.totalBeds-data.usedBeds">{{data.usedBeds}}</span>
                    <span style="color:rgba(0, 187, 69, 1)" v-else>住满</span>
                    )

                  </span>
              </template>
             
            </span>
          </el-tree>
         </el-scrollbar>
         
        </div>
      </div>

    </el-col>
    <el-col :span="19">
       <div style="overflow: hidden;">
           <div>
              <dormInner :id="current_id" :data="current_data" v-if="current_type==='start'" />
              <dormDorm :id="current_id" :data="current_data" v-if="current_type==='dorm'" />
              <dormRoom :id="current_id" :data="current_data" v-if="current_type==='room'" :type="current_t"/>
           </div>
       </div>
    </el-col>
  </el-row>
</template>
<script>
import * as api_common from "@/api/common";
const api_restaurant = api_common.resource('restaurant')
import dormInner from './dormInner'
import dormRoom from './dormRoom'
import dormDorm from './dormDorm'
export default {
    provide () {
      return {
        $side:this
      }
    },
    components:{
       dormInner,
       dormRoom,
       dormDorm
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
            current_id:'',
            current_type:'room',
            current_t:"",
            current_data:{}
        }
    },
    methods:{

      filterNode(value, data) {
        if (!value) return true;
        return (data.dormName && data.dormName.indexOf(value) !== -1) || (data.roomName && data.roomName.indexOf(value) !== -1)
      },
      async handleChangeNode(data,node){

          const { roomId,dormId } = data
          this.current_id = roomId||dormId
          // this.current_type =  data.name?'start':(data.roomName?'room':'dorm')
          this.current_t =  data.name?'start':(data.roomName?'room':'dorm')
          // this.current_type = 'room'
          this.current_data = data
          

          // if(!data.roomName){
          //     const { rows } = await api_common.resource('dormitory/room').get({dorm:id});
          //     this.$set(data,'subs',rows)
          // }
         
          // data.subs = rows
          
      },
      async refresh(){
  
          this.data2 =  await api_common.resource('restaurant/enable').get();
          this.$nextTick(()=>{
            this.$refs.tree2.setCurrentKey(this.orgid)
          })

         
      },
      async getTree(){
          this.data2 =  [await api_common.resource('dormitory/dormtree/front').get()];
          this.data2[0].id = 0
          this.$nextTick(()=>{
            this.$refs.tree2.setCurrentKey(this.data2[0].id)
          })
      }

    },
    async created(){
        this.getTree()
 
        
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

