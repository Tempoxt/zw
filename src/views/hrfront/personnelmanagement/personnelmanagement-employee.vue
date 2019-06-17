<template>
   <el-row class="h-full">
    <el-col :span="5" class="h-full" style="border-right:1px solid #e8e8e8">
        <!-- <org @change="changeOrg"/> -->
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
    </el-col>
    <el-col :span="19">
        <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
            <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id" ></el-tab-pane>
        </el-tabs>
        <div v-if="view_activeName==='在职员工' && orgid">
            <personnelmanagement :orgid="orgid"/>
        </div>
        <div v-if="view_activeName==='离职员工' && orgid">
            <personnelmanagementOut :orgid="orgid"/>
        </div>
    </el-col>
  </el-row>
</template>
<script>
import org from '@/views/public/org.vue'
import { getTabs } from '@/api/common'
import personnelmanagement from './personnelmanagement'
import personnelmanagementOut from './personnelmanagementOut'
export default {
    components:{
        org,
        personnelmanagement,
        personnelmanagementOut
    },
     watch:{
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    data(){
        return {
            view_activeName:'',
            menu:[],
            orgid:0,
            activeName:'second',
            data2:[],
            filterText:'',
        }
    },
    methods:{
        handleChangeNode(val){
            this.orgid = val.orgid
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name && data.name.indexOf(value) !== -1;
        },
        handleClick(val){
            
        },
        changeOrg(orgid){
            this.orgid = orgid
        }
    },
    async created(){
        const { menu } = await getTabs(this.$route.query.menuid)
        this.menu = menu
        this.view_activeName = menu[0].name;
        console.log()
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
<style lang="scss" scoped>

.scroll {
  height: calc(100% - 30px);
  width: 100%;
 /deep/ .scrollbar-wrapper {
    overflow-x: hidden;
  }
}
</style>
<style >
    .line-boxs{
        margin-top: 20px;
    }
    .img-show-mask {
        width: 100%;
        height: 100%;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 3000;
        background: rgb(0,0,0,.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .ivu-drawer-body{
        padding-left: 30px;
    }
    .detail{
        color: #37474F;
        font-size: 14px;
        font-weight: bold;
        height: 50px;
        line-height: 50px;
        padding-left: 20px;
        background: #E4EAEC;
        box-shadow: 0px 1px 0px rgba(228,234,236,1);
        margin:-16px -30px 0;
        margin-bottom: 0
    }
    .info{
        color: #0BB2D4;
        font-size: 16px;
        font-weight: bold;
        margin: 17px 0 24px 2px;
    }
    .conStyle{
        margin-left: -20px;
        display: flex;
        align-items: flex-start
    }
    .labelCon{
        display: inline-block;
        width: 112px;
        text-align: right;
        font-size: 14px;
        color: #4C5D66;
    }
    .promp{
        color: #A3AFB7;
        text-align: left;
        width: auto;
    }
    .ivu-col{
        margin-bottom: 8px;
    }
    .addr{
        width: 215px;
        word-wrap:break-word;
    }
    .alignStart{
        display: flex;
        align-items: flex-start
    }
    .ivu-row{
        margin-left: -27px;
        margin-bottom: -8px;
    }
    .posti{
        width: 107px;
        height: 65px;
    }
    .mt30{margin-top: 30px;}
    .mb20{margin-bottom: 20px;}
    .flexImg{
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
    }
    .flexImg>div{
        width: 140px;
        height: 176px;
        background: #F5FAFB;
        margin-right: 10px;
        text-align: center;
        padding-top: 7px;
    }
    .diploma{
        width: 107px
    }
    .imgInfo{
        font-size: 12px;
        color: #4C5D66;
        margin-bottom: 5px;
    }
    .editIcon{
        color:#CCD5DB;
        width: 16px;
        height: 14px;
        font-weight: normal;
        margin-left: 22px;
    }
</style>

