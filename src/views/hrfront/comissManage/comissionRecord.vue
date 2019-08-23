<template>

 <el-row class="h-full">
    <el-col :span="5" class="h-full">
        <div class=" h-full">
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
        </div>

    </el-col>
    <el-col :span="19" style="border-left:1px solid rgb(232, 232, 232)">
        <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
            <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
        </el-tabs>
        <div v-if="view_activeName==='个人提成汇总'">
            <comissionRecordTable url="commission/presoncommcollect" @change="changeTab"  :id="orgid"/>
        </div>
        <div v-if="view_activeName==='客户提成明细'">
            <comissionRecordTable url="commison/cuscommdetail" @change="changeTab" :id="orgid"/>
        </div>
        <div v-if="view_activeName==='收款提成明细'">
            <comissionRecordTable @change="changeTab" url="commission/receiptCommDetail" :id="orgid"/>
        </div>
    </el-col>
  </el-row>
</template>
<script>
import org from '@/views/public/org'
import { getTabs } from '@/api/common'
import comissionRecordTable from './comissionRecordTable'
export default {
    components:{
        comissionRecordTable,
        org
    },
    watch:{
        filterText(val) {
            this.$refs.tree2.filter(val);
        },
        async view_activeName(){
            this.filterText = ''
            if(this.view_activeName=='收款提成明细'){
                this.data2 =  await this.$request.get('org?org_id=d4&showteam=1&showstaff=1&filter_model=StaffCommission')
                if(!Number(this.orgid)){
                    let defaultId = this.data2[0].orgid
                    this.orgid = defaultId
                    this.$nextTick(()=>{
                        this.$refs.tree2.setCurrentKey(defaultId)
                    })
                }
            }else{
                this.orgid = ''
                this.data2 =  await this.$request.get('org?org_id=d4')
                let defaultId = this.data2[0].orgid
                this.orgid = defaultId
                this.$nextTick(()=>{
                    this.$refs.tree2.setCurrentKey(defaultId)
                })
            }
        },
    },
    data(){
        return {
            activeName:'first',
            orgid:'',
            filterText:'',
            view_activeName:'',
            menu:[],
            data2:[],
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


