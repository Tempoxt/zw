<template>

<!-- 年假管理 -->
 <el-row class="h-full">
    <el-col :span="4" class="h-full" style="border-right:1px solid #e8e8e8">
        <div class=" h-full">
            <org v-model="orgid" @change="changeOrg" />   
        </div>

    </el-col>
    <el-col :span="20">
        <annualLeaTable :id="orgid" />
    </el-col>
  </el-row>
</template>
<script>
import org from '@/views/public/org'
import annualLeaTable from './annualLeaTable'
export default {
    components:{
        annualLeaTable,
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
        }
    },
    methods:{
        changeOrg(orgid){
            this.orgid = orgid
        },
    },
}
</script>
<style>
    .infoFlex{
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #4C5D66;
        background: #f8f8f8;
        margin:-15px -30px -5px -30px;
        padding:10px 30px 10px 30px;
    }
    .imgAvatar{
        width: 50px;
        height: 50px;
    }
    .infoSpan span{
        display: inline-block;
        width: 170px;
    }
    .ml30{
        margin-left: 30px
    }
    .ml110{
        margin-left: 110px;
    }
    .el-collapse-item__header{
        position: relative;
    }
    .el-collapse-item__header .el-collapse-item__arrow{
        position: absolute;
        left: 65px;
    }
    .demo-drawer-profile .el-collapse,.demo-drawer-profile .el-collapse-item__wrap,.demo-drawer-profile .el-collapse-item__header{
        border: 0!important;
    }
    .demo-drawer-profile .el-collapse-item__content{
        padding-bottom:0
    }
    .demo-drawer-profile .el-timeline-item__wrapper{
        top: -5px!important;
    }
    .line-boxs{
        margin-top: 20px;
    }
    .ivu-drawer-body{
        padding-left: 30px;
    }
    .fontStyle{
        color: #37474F;
        font-size: 14px;
    }
    .detail{
        font-weight: bold;
        height: 60px;
        line-height: 60px;
        padding:0 20px 0;
        background: #E4EAEC;
        box-shadow: 0px 1px 0px rgba(228,234,236,1);
        margin:0 -30px 0;
        margin-bottom: 0;
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 99999;
    }
    .info{
        color: #0BB2D4;
        font-size: 16px;
        font-weight: bold;
        margin: 20px 0 10px 2px;
    }
    .time{
        color: #A3AFB7;
        font-size: 12px;
    }
    .mt60{margin-top: 60px;}
    .mb20{margin-bottom: 20px;}
    .ml80{margin-left: 80px;}
    .mt10{margin-top: 10px;}
    .mt4{
        margin-top: 4px
    }
    /* .demo-drawer-profile .el-col-12{
        margin-bottom: 8px;
    } */
</style>


