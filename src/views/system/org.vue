<template>
   <el-row class="h-full">
    <el-col :span="5" class="h-full">
      <div class="page-side h-full">
         <span class="page-title">
          <el-radio-group v-model="tabActive">
            <el-radio-button :label="item.position" v-for="item in tabs" :key="item.id">{{item.showname}}</el-radio-button>
          </el-radio-group>
        </span>
        <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
        <div>
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
            node-key="id"
            :filter-node-method="filterNode"
            ref="tree2"
            :highlight-current="true"
            :check-on-click-node="false"
            @node-click="handleChangeNode"
            :expand-on-click-node="false"
          >
            <span slot-scope="{ node, data }">
              <span v-if="node.isLeaf" class="icon iconfont icon-zuzhi2"></span>
              <span v-else class="icon iconfont icon-zuzhi1"></span>&nbsp;
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
         
        </div>
         </el-scrollbar>
      </div>

    </el-col>
    <el-col :span="19">
       <div v-if="tabActive===1">
          <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">

            <template  v-if="currentType=== 1">
               <el-tab-pane :label="'总部信息'" name="a1" lazy >
                    <org-info-t1 :currentMenuid="currentMenuid" ></org-info-t1>
                </el-tab-pane>
               <el-tab-pane label="下级分部" name="a2" lazy >
                  <org-list  :currentMenuid="currentMenuid" url="org/headcompanys"/>
                </el-tab-pane>
            </template>

            <template v-if="currentType===2">
              <el-tab-pane :label="'分部信息'" name="b1" lazy  >
                  <org-info-t2 :currentMenuid="currentMenuid" ></org-info-t2>
              </el-tab-pane>
              <el-tab-pane label="下级分部" name="b2" lazy >
                <org-list  :currentMenuid="currentMenuid" url="org/subcompanys"/>
              </el-tab-pane>
              <el-tab-pane label="下级部门" name="b3" lazy >
                <org-list-t2  :currentMenuid="currentMenuid"/>
              </el-tab-pane>
            </template>
            <template v-if="currentType===3">
              <el-tab-pane :label="'部门信息'" name="c1" lazy  >
                  <org-info-t1 :currentMenuid="currentMenuid" url="org/departments" initurl="org/department"></org-info-t1>
              </el-tab-pane>
        
              <el-tab-pane label="下级部门" name="c2" lazy >
                <org-list-t2  :currentMenuid="currentMenuid"/>
              </el-tab-pane>
              
              <!-- <el-tab-pane :label="'人力资源'" name="c4" lazy  >
                  <org-job :currentMenuid="currentMenuid" ></org-job>
              </el-tab-pane>
              <el-tab-pane :label="' 岗位 '" name="c3" lazy>
                  <org-info-t2 :currentMenuid="currentMenuid" ></org-info-t2>
              </el-tab-pane> -->
            </template>
          </el-tabs>
       </div>
       <div v-else style="overflow: hidden;">
         <org-tree ref="tree"/>
       </div>
    </el-col>
  </el-row>
</template>
<script>
import * as api_common from "@/api/common";
import userTable from './user/userTable'
import orgInfo from './org/orgInfo'
import orgInfoT1 from './org/orgInfoT1'
import orgInfoT2 from './org/orgInfoT2'
import orgList from './org/orgList'
import orgListT2 from './org/orgListT2'
import orgJob from './org/orgJob'
import orgTree from './org/orgTree'
export default {
    components:{
      orgInfo,
      userTable,
      orgTree,
      orgInfoT1,
      orgInfoT2,
      orgList,
      orgListT2,
      orgJob
    },
    watch:{
      tabActive(val){
        if(val===2){
          this.$refs.tree.fetchData()
        }
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
            currentType:0,
            tabs:[
              {
                showname:'组织架构管理',
                id:0,
                position:1
              },
              {
                showname:'组织架构图',
                id:1,
                position:2
              }
            ],
            tabActive:1,
            view_activeName:'a'
        }
    },
    methods:{
      handleChangeNode(val){
        
          this.currentMenuid = val.id
          this.currentType = val.org_type

          if(this.currentType===1){
            this.view_activeName = 'a1'
          }
          if(this.currentType===2){
           this.view_activeName = 'b1'
          }
          if(this.currentType===3){
           this.view_activeName = 'c1'
          }
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name && data.name.indexOf(value) !== -1;
      },
      handleClick(tab, event){
       
      }

    },
    async created(){
        this.data2 = await api_common.getOrg();
        let defaultMenuid = this.data2[0].id
        console.log(defaultMenuid,'defaultMenuid')
       this.$nextTick(()=>{
          // this.$refs.tree2.setCurrentNode(defaultMenuid);
          this.currentMenuid = defaultMenuid;
          this.handleChangeNode({id:defaultMenuid,org_type:1})
       })
        
        this.$bus.$on('updateData', async target => {  
           this.data2 =  await api_common.getOrg();
        });  
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

