<template>

 <el-row class="h-full">
    <el-col :span="5" class="h-full">
      <div class=" h-full">
           <!-- <org v-model="orgid" @change="changeOrg" url="org/deptselect"/> -->
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
    <el-col :span="19">
        <countlistTable :id="orgid" />
    </el-col>
  </el-row>
</template>
<script>
import org from '@/views/public/org'
import countlistTable from './countlistTable'
export default {
    components:{
        countlistTable,
        org
    },
    data(){
        return {
            activeName:'first',
            orgid:''
        }
    },
    methods:{
        changeOrg(orgid){
            this.orgid = orgid
        }
    },
    async created(){
        this.data2 = await this.$request.get('org',{
            params:{
                showteam:1
            }
        });
        let defaultMenuid = this.data2[0].orgid
        this.$refs.tree2.setCurrentKey(defaultMenuid);
        this.orgid = defaultMenuid;
    }
}
</script>

