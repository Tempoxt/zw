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
            <div v-if="view_activeName==='出货记录'">
                <dispatchList url="commission/dispatchlists" m="1" :id="orgid"/>
            </div>
            <div v-if="view_activeName==='收款记录'">
                <collectiondetail url="commission/collectiondetail" m="2" :id="orgid"/>
            </div>
            <div v-if="view_activeName==='收款分配记录'">
                <dispatchMatch url="commission/dispatchcollectionmatch" m="3" :id="orgid"/>
            </div>
            <div v-if="view_activeName==='销售调整'">
                <dispatchCollRecordTable url="commission/selladjust" m="4" :id="orgid"/>
            </div>
        </el-col>
    </el-row>
     
</template>
<script>
import { getTabs } from '@/api/common'
import dispatchCollRecordTable from './dispatchCollRecordTable'
import dispatchList from './dispatch/dispatchList'
import collectiondetail from './dispatch/collectiondetail'
import dispatchMatch from './dispatch/dispatchMatch'

export default {
    components:{
        dispatchList,
        collectiondetail,
        dispatchMatch,
        dispatchCollRecordTable
    },
    watch:{
        filterText(val) {
            this.$refs.tree2.filter(val);
        }
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
    },
    async created() {
        const { menu } = await getTabs(this.$route.query.menuid)
        this.menu = menu
        this.view_activeName = menu[0].name;
        this.data2 =  await this.$request.get('org?org_id=d4&showteam=1&showstaff=1&filter_model=StaffCommission')
        let defaultId = this.data2[0].orgid
        this.orgid = defaultId
        this.$nextTick(()=>{
            this.$refs.tree2.setCurrentKey(defaultId)
        })
        this.expandedArr=['d4']
    }
}
</script>
<style lang="scss">
.flex{
    display: flex;
    align-items: center
}
.dateLap-select {
    .el-input__inner {
        border-right: none;
        border-radius: 2px 0 2px 2px;
    }
}
.dateLap-date{
    border-radius: 0px 2px 2px 0px!important;
    .el-input__inner {
        border-radius: 2px 2px 2px 0px;
    }
}
</style>



