<template>
   <el-row class="h-full public-table-container">
    <el-col :span="4" class="h-full" style="border-right:1px solid #e8e8e8">
        <org @change="changeOrg"  v-model="orgid"/>
    </el-col>
    <el-col :span="20">
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
            filterText:'',
        }
    },
    methods:{
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
<style lang="scss">
    .drawerInfo{
        .ivu-drawer-body{
            padding:0;
        }
        .ivu-drawer-header{
            background: rgba(245,250,251,1)
        }
        .line-boxs{
            margin-top: 20px;
        }
        .info{
            color: #0BB2D4;
            font-size: 16px;
            font-weight: bold;
            margin: 17px 0 24px 20px;
        }
        .labelCon{
            display: inline-block;
            width: 112px;
            text-align: right;
            font-size: 12px;
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
        .diploma{
            width: 107px
        }
        .editIcon{
            color:#CCD5DB;
            width: 16px;
            height: 14px;
            font-weight: normal;
            margin-left: 22px;
        }
        .search-text{
            height: 30px;
            line-height: 30px;
            margin-left: 18px;
            padding-left: 5px;
        }
    }
    .imgInfo{
        font-size: 12px;
        color: #4C5D66;
        margin-bottom: 5px;
    }
    .imgInfo{
        .el-checkbox__label{
            display: none;
        }
    }
    .posti{
        width: 107px;
        height: 65px;
        margin-bottom: 3px;
    }
    .bankCard{
        width: 40%;
        height: 200px;
    }
    .preview{
        .el-dialog{
            width:35%
        }
        .el-dialog__header{
            line-height: 0;
            background: transparent
        }
    }
    .drawer-profile .el-col-12{
        margin-bottom: 8px;
    }
    
    .mt20{margin-top: 20px;}
    .mb20{margin-bottom: 20px;}
     .flexImg{
        margin-left: 10px;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
    }
    .flexImg>div{
        width: 140px;
        min-height: 176px;
        background: #F5FAFB;
        margin-right: 10px;
        text-align: center;
        padding-top: 7px;
    }
    
</style>

