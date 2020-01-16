<template>

<!-- 考勤明细2 -->
 <el-row class="h-full public-table-container">
    <el-col :span="4" class="h-full" style="border-right:1px solid #e8e8e8">
      <div class=" h-full">
           <org v-model="orgid" @change="changeOrg"/>
      </div>

    </el-col>
    <el-col :span="20">
        <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
            <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
        </el-tabs>
        <div v-if="view_activeName==='审核列表'">
            <recordlistTable url="attendance/recordlist" a='1' :id="orgid"/>
        </div>
        <div v-if="view_activeName==='差异列表'">
            <recordlistTable url="attendance/recorddifflist" a='2' :id="orgid"/>
        </div>
    </el-col>
  </el-row>
</template>
<script>
import org from '@/views/public/org'
import { getTabs } from '@/api/common'
import recordlistTable from './recordlistTable'
export default {
    components:{
        recordlistTable,
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
            view_activeName:'',
            menu:[],
        }
    },
    methods:{
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
    }
}
</script>
<style lang="scss">
    .default-span{
        cursor: default!important;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .attendance-table.el-table--small td, .attendance-table.el-table--small th{
        padding: 0!important;
    }
    .freeze-info{
        font-size: 12px;
        margin-left:20px;
        color:#F2353C
    }
    .col-red{
        color: red
    }
    .col-bag-gray{
        background-color: rgb(245,250,251)
    }
    .col-bag-one{
        background-color: #f2353c
    }
    .col-bag-two{
        background-color:#1fd361;
    }
    .col-bag-three{
        background-color:#0bb2d4;;
    }
    .col-bag-four{
        background-color:#ff5698;
    }
    .col-bag-five{
        background-color:#f4af24;
    }
    .col-bag-six{
        background-color:#f47a24;
    }
    .col-bag-nine{
        background-color:#68f59c;
    }
    .col-bag-ten{
        background-color:#1cbe57;
    }
</style>


