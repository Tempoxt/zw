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
                        :props="{children: 'subs', label: 'title' }"
                        default-expand-all
                        node-key="org_id"
                        :filter-node-method="filterNode"
                        ref="tree2"
                        :highlight-current="true"
                        :check-on-click-node="false"
                        @node-click="handleChangeNode"
                        :expand-on-click-node="false"
                        >
                        <div slot-scope="{ node }" class="flexSpace">
                            <div>
                                &nbsp;<span>{{ node.label }}</span>
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
            <div v-if="view_activeName==='表格统计'">
                <warestatTable url="toolstationery/warestat" m="1" :orgid="org_id"/>
            </div>
            <div v-if="view_activeName==='图表统计'">
                <!-- <wareGraph url="" m="2" :orgid="org_id"/> -->
            </div>
        </el-col>
    </el-row>
</template>
<script>
import { getTabs } from '@/api/common'
import warestatTable from './warestatTable'
import wareGraph from './wareGraph'
export default {
    components:{
        warestatTable,
        // wareGraph,
    },
    data(){
        return {
            orgid:'',
            id:'',
            org_id:'',
            data2:[],
            filterText:'',
            view_activeName:'',
            menu:[],
        }
    },
    methods:{
        handleClick(val){
            
        },
        handleChangeNode(val){
            this.org_id = val.org_id
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.title && data.title.indexOf(value) !== -1;
        },
        changeOrg(orgid){
            this.orgid = orgid
        },
        async fetch(){
            this.data2 = await this.$request.get('toolstationery/warestat/org');
            let defaultId = this.data2[0].org_id
            this.org_id = defaultId
            this.$nextTick(()=>{
                this.$refs.tree2.setCurrentKey(defaultId)
            })
        }
    },
    async created(){
        this.fetch()
        const { menu } = await getTabs(this.$route.query.menuid)
        this.menu = menu
        this.view_activeName = menu[0].name;
    }
}
</script>
<style lang="scss" scoped>
    .scroll {
        height: calc(100% - 0px);
        width: 100%;
        padding-bottom: 20px;
        /deep/ .scrollbar-wrapper {
            overflow-x: hidden;
        }
    }
</style>


