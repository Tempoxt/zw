<template>
   <el-row class="h-full public-table-container">
    <el-col :span="4" class="h-full">
      <div class="page-side h-full">
         <span class="page-title">
          <el-radio-group v-model="tabActive">
            <el-radio-button :label="item.position" v-for="item in tabs" :key="item.id">{{item.showname}}</el-radio-button>
          </el-radio-group>
        </span>
        <div class="h-full">
          <div class="side-header">
            <el-input placeholder="快速查找" v-model="filterText" class="input">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-button icon="el-icon-refresh" circle @click="refresh"></el-button>
          </div>

        <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
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
         </el-scrollbar>
         
        </div>
      </div>

    </el-col>
    <el-col :span="20">


       <div v-if="tabActive===1">
          <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">

            <template  v-if="currentType=== 1">
               <el-tab-pane :label="'总部信息'" name="a1" lazy >
                    <org-info-t1 :currentMenuid="currentMenuid" ></org-info-t1>
                </el-tab-pane>
               <el-tab-pane label="下级分部" name="a2" lazy >
                  <org-list  :currentMenuid="currentMenuid" url="org/headcompanys"  :orgid="orgid" :org_type="currentType"/>
                </el-tab-pane>
            </template>

            <template v-if="currentType===2">
              <el-tab-pane :label="'分部信息'" name="b1" lazy  >
                  <org-info-t2 :currentMenuid="currentMenuid" ></org-info-t2>
              </el-tab-pane>
              <el-tab-pane label="下级分部" name="b2" lazy >
                <org-list  :currentMenuid="currentMenuid" url="org/subcompanys"  :orgid="orgid" :org_type="currentType"/>
              </el-tab-pane>
              <el-tab-pane label="下级部门" name="b3" lazy >
                <org-list-t2  :currentMenuid="currentMenuid" :orgid="orgid"/>
              </el-tab-pane>
            </template>
            <template v-if="currentType===3">
              <el-tab-pane :label="'部门信息'" name="c1" lazy  >
                  <org-info-t3 :currentMenuid="currentMenuid" url="org/department" initurl="org/department"></org-info-t3>
              </el-tab-pane>
        
              <el-tab-pane label="下级部门" name="c2" lazy >
                <org-list-t2  :currentMenuid="currentMenuid" :orgid="orgid" url="org/subdepartments"/>
              </el-tab-pane>
              <el-tab-pane label="下级小组" name="c3" lazy >
                <org-group-t3  :currentMenuid="currentMenuid" :orgid="orgid"/>
              </el-tab-pane>
              <el-tab-pane label="小组详情" name="c4" lazy >
                <org-group-t4  :currentMenuid="currentMenuid" :orgid="orgid"/>
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
import orgInfoT3 from './org/orgInfoT3'
import orgList from './org/orgList'
import orgListT2 from './org/orgListT2'
import orgJob from './org/orgJob'
import orgGroupT3 from './org/orgGroupT3'
import orgGroupT4 from './org/orgGroupT4'
import orgTree from './org/orgTree'
export default {
    components:{
      // orgInfo,
      // userTable,
      orgTree,
      orgInfoT1,
      orgInfoT2,
      orgInfoT3,
      orgList,
      orgListT2,
      // orgJob,
      orgGroupT3,
      orgGroupT4
    },
    watch:{
      tabActive(val){
        if(val===2){
         this.$nextTick(()=>{
            this.$refs.tree.fetchData()
         })
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
            orgid:'',
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
      handleChangeNode(val,node){
          this.currentNode = node
          this.currentMenuid = val.id
          this.currentType = val.org_type
          this.orgid = val.orgid
         

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
      aaa(){
        alert(123)
      },
      handleClick(tab, event){
       
      },
      async refresh(){
          this.data2 =  await api_common.getOrg();
          this.$nextTick(()=>{
            this.$refs.tree2.setCurrentKey(this.orgid)
          })
      }

    },
    async created(){
        this.data2 = await api_common.getOrg();
        let defaultMenuid = this.data2[0].id
        
        this.$nextTick(()=>{
          this.$refs.tree2.setCurrentKey(this.data2[0].orgid)
        })
        let that = this
       this.$nextTick(()=>{
        
          this.currentMenuid = defaultMenuid;
          this.handleChangeNode({id:defaultMenuid,org_type:1,orgid:this.data2[0].orgid})
       })
        
        this.$bus.$on('updateData', async target => {  
          this.data2 =  await api_common.getOrg();
          this.$nextTick(()=>{
            that.$refs.tree2.setCurrentKey(that.orgid)
          })
           
        });  
    }
}
</script>
<style lang="scss" scoped>

.scroll {
  height: calc(100%);
  width: 100%;
  padding-bottom: 80px;
 /deep/ .scrollbar-wrapper {
    overflow-x: hidden;
  }
}
</style>

