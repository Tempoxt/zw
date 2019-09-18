<template>
    <el-row class="h-full">
        <el-col :span="4" class="h-full">
            <div class=" h-full">
                <org v-model="orgid" @change="changeOrg"/>
            </div>
        </el-col>
        <el-col :span="20" style="border-left:1px solid rgb(232, 232, 232)">
            <el-tabs v-model="activeName" @tab-click="handleClick" class="table-tabs" >
                <el-tab-pane label="待转正" name="first">
                    <employeeTable  url="hrm/staffwaitshiftlist" :id="orgid"/>
                </el-tab-pane>
                <el-tab-pane label="已转正" name="second">
                    <employeeTable  url="hrm/staffalreadyshiftlist" :id="orgid"/>
                </el-tab-pane>
            </el-tabs>
        </el-col>
    </el-row>
</template>
<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
import { getTabs } from '@/api/common'
import org from '@/views/public/org'
import employeeTable from './employeeTable'
export default {
    mixins: [table_mixin],
    components:{
        employeeTable,
        org
    },
    data() {
        return {
            view_activeName:'',
            menu:[],
            activeName:'first',
            orgid:''
        };
    },
    methods: {
        handleClick(val){
            
        },
        changeOrg(id){
            this.orgid = id
        }
    },
    async created() {
       
    }
};
</script>


