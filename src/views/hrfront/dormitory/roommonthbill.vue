<template>
   <el-row class="h-full public-table-container">
    <el-col :span="4" class="h-full">
      <div class="page-side h-full">
     
        <!-- <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll"> -->
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
            node-key="orgid"
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
               <span style="padding-right:10px">({{data.totalBeds}} - {{data.usedBeds}} )</span>
             </template>
              <template v-else>
                   <div>
                      <span class="icon iconfont icon-nv" v-if="data.dormType===0" style="color:rgba(255, 52, 160, 1)"></span>
                      <span class="icon iconfont icon-nan" v-if="data.dormType===1" style="color:rgba(11, 178, 212, 1)"></span>
                      &nbsp;
                      <span>{{ data.roomName }} </span>
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
    <el-col :span="20">
       <div style="overflow: hidden;">
           <div>
              <roommonthbillInner :id="current_id" :data="current_data" v-if="current_type==='start'" :rows="rows"/>
              <roommonthbillDorm :id="current_id" :data="current_data" v-if="current_type==='dorm'"  :rows="rows"/>
              <roommonthbillRoom :id="current_id" :data="current_data" v-if="current_type==='room'"   :rows="rows"/>
           </div>
       </div>
    </el-col>
  </el-row>
</template>
<script>
import * as api_common from "@/api/common";
const api_restaurant = api_common.resource('restaurant')
import roommonthbillRoom from './roommonthbill-dormRoom'
import roommonthbillDorm from './roommonthbill-dorm'
import roommonthbillInner from './roommonthbill-inner'
export default {
    provide(){
      return {
        elParent: this
      }
    },
    components:{
       roommonthbillRoom,
       roommonthbillDorm,
       roommonthbillInner,
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
            current_type:'start',
            current_data:{},
            rows:[]
        }
    },
    methods:{
		filterNode(value, data) {
			if (!value) return true;
			return data.restaurantname && data.restaurantname.indexOf(value) !== -1;
		},
		async handleChangeNode(data,node){
			
			console.log(this.orgid)
			// const { id } = data
			// this.current_id = id
			// this.current_type =  data.start?'start':(data.roomName?'room':'dorm')
			// this.current_data = data
			// if(!data.roomName){
			//     const { rows } = await api_common.resource('dormitory/room').get({dorm:id});
			//     this.$set(data,'subs',rows)
			// }
			
			const { roomId,dormId } = data
			const { rows } = await api_common.resource('dormitory/room').get({dorm:roomId||dormId});
			this.rows = rows
			this.current_id = roomId||dormId
			this.current_type =  data.start?'start':(data.roomName?'room':'dorm')
			this.current_data = data

			console.log( this.current_type,' this.current_type')
			
		},
		async refresh(){
			this.data2 =  await api_common.resource('restaurant/enable').get();
			this.$nextTick(()=>{
				this.$refs.tree2.setCurrentKey(this.orgid)
			})
		},
		async getTree(){
			this.data2 =  [await api_common.resource('dormitory/dormtree/front').get()];
			this.$nextTick(()=>{
				this.$refs.tree2.setCurrentKey(this.data2[0].orgid)
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
  height: 100%;
  width: 100%;
  padding-bottom: 35px;
 /deep/ .scrollbar-wrapper {
    overflow-x: hidden;
  }
}
</style>

