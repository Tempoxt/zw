<template>
    <el-row class="h-full public-table-container">
        <el-col :span="4" class="h-full" style="border-right:1px solid rgb(232, 232, 232)">
            <div class=" h-full">
                <div style="padding:20px" class="h-full">
                    <div class="side-header">
                        <el-input placeholder="快速查找" v-model="filterText" class="input">
                        <i slot="suffix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </div>
                    <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll"> 
                        <el-tree
                            class="tree"
                            :data="data2"
                            :props="{children: 'subs', label: 'name' }"
                        
                            :default-expanded-keys="expandedArr"
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
            <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
                <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
            </el-tabs>
            <div v-if="view_activeName==='个人业务提成'">
                <commissionStaff url="commission/staffcommissioncollect" a='1' :id="orgid"/>
                <!-- <comissionRecord1Table url="commission/staffcommissioncollect" a='1' @change="changeTab"  :id="orgid"/> -->
            </div>
            <div v-if="view_activeName==='客户提成汇总'">
                <comissionRecord1Table url="commission/customercommission" a='2' :id="orgid"/>
            </div>
            <div v-if="view_activeName==='产品提成汇总'">
                <comissionRecord1Table url="commission/productcommission" a='3' :id="orgid"/>
            </div>
            <div v-if="view_activeName==='模具提成汇总'">
                <comissionRecord1Table url="commission/modulecommission" a='4' :id="orgid"/>
            </div>
        </el-col>
    </el-row>
</template>
<script>
import { getTabs } from '@/api/common'
import comissionRecord1Table from './comissionRecord1Table'
import commissionStaff from './commissionStaff'
export default {
    components:{
        comissionRecord1Table,
        commissionStaff
    },
    watch:{
        filterText(val) {
            this.$refs.tree2.filter(val);
        },
        // async view_activeName(){
            // this.filterText = ''
            // if(this.view_activeName=='个人业务提成'){
                // this.data2 =  await this.$request.get('org?org_id=d4&showteam=1&showstaff=1&filter_model=StaffCommission')
                // if(!Number(this.orgid)){
                //     let defaultId = this.data2[0].orgid
                //     this.orgid = defaultId
                //     this.$nextTick(()=>{
                //         this.$refs.tree2.setCurrentKey(defaultId)
                //     })
                // }
            // }else{
            //     this.orgid = ''
            //     this.data2 =  await this.$request.get('org?org_id=d4')
            //     let defaultId = this.data2[0].orgid
            //     this.orgid = defaultId
            //     this.$nextTick(()=>{
            //         this.$refs.tree2.setCurrentKey(defaultId)
            //     })
            // }
           
        // },
    },
    data(){
        return {
            activeName:'first',
            orgid:'',
            filterText:'',
            view_activeName:'',
            menu:[],
            data2:[],
            expandedArr:[]
        }
    },
    methods:{
        handleChangeNode(val,node){
            this.orgid = val.orgid
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name && data.name.indexOf(value) !== -1;
        },
        changeOrg(orgid){
            this.orgid = orgid
        },
        handleClick(val){

        },
        changeTab(view_activeName,orgid){
            this.view_activeName = view_activeName
            this.orgid = orgid
        }
    },
    async created() {
        const { menu } = await getTabs(this.$route.query.menuid)
        this.menu = menu
        this.view_activeName = menu[0].name;
        this.data2 =  await this.$request.get('org?org_id=d4&showteam=1&showstaff=1&filter_model=StaffCommission')
        // if(!Number(this.orgid)){
            let defaultId = this.data2[0].orgid
            this.orgid = defaultId
            this.$nextTick(()=>{
                this.$refs.tree2.setCurrentKey(defaultId)
            })
            this.expandedArr=['d4']
        // }
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


