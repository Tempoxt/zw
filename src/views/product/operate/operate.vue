<template>
<div>
    <el-row class="h-full public-table-container">
        <el-col :span="4">
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
                            default-expand-all
                            node-key="id"
                            :filter-node-method="filterNode"
                            ref="tree2"
                            :highlight-current="true"
                            :check-on-click-node="false"
                            @node-click="handleChangeNode"
                            :expand-on-click-node="false"
                        >
                            <div slot-scope="{ node }" class="flexSpace">

                                <div>
                                    <span class="icon iconfont icon-wenjian"></span>
                                    &nbsp;
                                    <span>{{ node.label }}</span>
                                </div>
                            </div>
                        </el-tree>
                    </el-scrollbar>
                </div>
        </el-col>
        <el-col :span="20">
            <operatelist :orgid="orgid"/>
        </el-col>
    </el-row>
</div>
    
</template>
<script>
import table_mixin from "@c/Table/table_mixin";
import operatelist from './operatelist'
import * as api_common from "@/api/common";
const api_resource = api_common.resource("productrecheck/customer");
export default {
    mixins: [table_mixin],
    components:{
        operatelist,
    },
     watch:{
        filterText(val) {
            this.$refs.tree2.filter(val);
        },
    },
    data(){
        return {
            orgid:'',
            data2:[],
            filterText:'',
            name:'',
            api_resource,
        }
    },
    methods:{
        handleChangeNode(val){
            this.orgid = val.orgid
            this.name = val.name
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name && data.name.indexOf(value) !== -1;
        }
    },
    
    async created(){
        this.data2 = await this.$request.get('org/oprselect');
        this.orgid = this.data2[0].orgid
    }
}
</script>
<style lang="scss" scoped>
.scroll {
  height: calc(100%);
  width: 100%;
  padding-bottom: 20px;
 /deep/ .scrollbar-wrapper {
    overflow-x: hidden;
  }
}
.side-header,.flexSpace{
    display: flex;
    justify-content:space-between;
    align-items: center;
}
.flexSpace{
    width: 100%;
}
.flexSpace:hover .icon-lajitong,.flexSpace:hover .icon-bianji,.flexSpace:active .icon-lajitong,.flexSpace:active .icon-bianji{
    color: #CCD5DB
}
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content .icon-lajitong,
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content .icon-bianji{
    color: #CCD5DB
}
.addIcon{
    border: 1px solid #E4EAEC;
    padding: 0 10px;border-radius:4px;
    margin-left: 10px;
}
.el-icon-caret-right{
    display: none
}
.icon-bianji,.icon-lajitong{
    font-size: 14px;
    color: transparent
    // color: #CCD5DB
}
.ml15{
    margin-left: 15px;
}
.el-col{
    border-left: 1px solid #e8e8e8
}
</style>

