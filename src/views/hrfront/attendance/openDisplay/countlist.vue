<template>

 <el-row class="h-full">
    <el-col :span="5" class="h-full" style="border-right:1px solid #e8e8e8">
      <div  style="padding:20px" class="h-full">
           <org v-model="orgid" @change="changeOrg"/>
            <!-- <div class="side-header">
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
            </el-scrollbar> -->
        </div>

    </el-col>
    <el-col :span="19">
        <countlistTable :id="orgid" />
    </el-col>
  </el-row>
</template>
<script>
import * as api_common from "@/api/common";
import org from '@/views/public/org'
import countlistTable from './countlistTable'
export default {
    components:{
        countlistTable,
        org
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
            data2:[],
            filterText:'',
            expandedArr:[]
        }
    },
    methods:{
        changeOrg(orgid){
            this.orgid = orgid
        },
        // handleChangeNode(val,node){
        //     this.orgid = val
        // },
        // filterNode(value, data) {
        //     if (!value) return true;
        //     return data.name && data.name.indexOf(value) !== -1;
        // },
    },
    async created(){
        // this.data2 = await this.$request.get('org',{
        //     params:{
        //         showteam:1
        //     }
        // });
        // let that = this;
        // (function f(data) {
        //     data.some(row => {
        //         if(row.subs && row.subs.length){
        //             row.subs.forEach(o=>{
        //                 if(o.orgid.indexOf('d')==0){
        //                     that.expandedArr.push(o.orgid)
        //                 }
        //             })
        //         }
        //     });
        // })(this.data2);
        // let defaultId = this.data2[0].orgid
        // this.orgid = defaultId
        // this.$nextTick(()=>{
        //     this.$refs.tree2.setCurrentKey(defaultId)
        // })
    }
}
</script>

<style lang="scss" scoped>

// .scroll {
//   height: calc(100% - 30px);
//   width: 100%;
//  /deep/ .scrollbar-wrapper {
//     overflow-x: hidden;
//   }
// }
</style>
