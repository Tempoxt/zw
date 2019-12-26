<template>
    <el-row class="h-full">
         <el-col :span="4" class="h-full">
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
                        :props="{children: 'sub', label: 'deckCodeDesc' }"
                        default-expand-all
                        node-key="deckCode"
                        :filter-node-method="filterNode"
                        ref="tree2"
                        :highlight-current="true"
                        :check-on-click-node="false"
                        @node-click="handleChangeNode"
                        :expand-on-click-node="false"
                        >
                        <div slot-scope="{ node,data }">
                            <div>
                                <span class="icon iconfont icon-wenjian" v-if="data.deckCodeDesc==0"></span>&nbsp;<span>{{ node.label }}</span>
                            </div>
                        </div>
                    </el-tree>
                </el-scrollbar>
            </div>
        </el-col>
        <el-col :span="20" style="border-left:1px solid rgb(232, 232, 232)">
            <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
                <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
            </el-tabs>
            <div v-if="view_activeName==='员工排位'">
                <rankTable url="invitation/sitemanager/rank" :org_id="this.org_id"/>
            </div>
            <div v-if="view_activeName==='预留排位'">
                <rankTable url="invitation/departdraw/reserved" :org_id="this.org_id"/>
            </div>
        </el-col>
    </el-row>
    
</template>
<script>
import table_mixin from "@c/Table/table_mixin";
import { getTabs } from '@/api/common'
import rankTable from './rankTable'
import * as api_common from "@/api/common";
const api_resource = api_common.resource("toolstationery/type");
export default {
    mixins: [table_mixin],
    components:{
        rankTable,
    },
    watch:{
        filterText(val) {
            this.$refs.tree2.filter(val);
        },
        async view_activeName(){
            this.filterText = ''
            if(this.view_activeName=='员工排位'){
                this.orgid = 0
                this.data2 = await this.$request.get('invitation/tablelist?page_tag=1');
            }else{
                this.orgid = 0
                this.data2 = await this.$request.get('invitation/tablelist?page_tag=2');
            }
            let defaultId = this.data2[0].deckCode
            this.org_id = defaultId
            this.$nextTick(()=>{
                this.$refs.tree2.setCurrentKey(defaultId)
            })
        },
    },
    data(){
        return {
            api_resource,
            id:'',
            org_id:'',
            data2:[],
            filterText:'',
            activeName:'first',
            orgid:'',
            view_activeName:'',
            menu:[],
        }
    },
    methods:{
        handleClick(val){
            
        },
        handleChangeNode(val){
            this.org_id = val.deckCode
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.deckCodeDesc && data.deckCodeDesc.indexOf(value) !== -1;
        },
    },
    async created(){
        const { menu } = await getTabs(this.$route.query.menuid)
        this.menu = menu
        this.view_activeName = menu[0].name;
    }
}
</script>
<style lang="scss" scoped>

.scroll {
  height: 100%;
  width: 100%;
  padding-bottom: 20px;
 /deep/ .scrollbar-wrapper {
    overflow-x: hidden;
  }
}
.none{
    margin-top: 15px
}
.side-header{
    display: flex;
    justify-content:space-between;
    align-items: center;
}
.tree .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content .icon-lajitong,
.tree .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content .icon-bianji{
    color: #CCD5DB
}
.addIcon{
    border: 1px solid #E4EAEC;
    padding: 1px 10px;border-radius:4px;
    margin-left: 10px;
}
.tree .el-icon-caret-right{
    display: none
}
.tree .icon-bianji,.tree .icon-lajitong{
    font-size: 14px;
    color: transparent;
}
.ml15{
    margin-left: 15px;
}
.mr5{
    margin-right:5px;
}
</style>

