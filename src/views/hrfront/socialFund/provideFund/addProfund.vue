<template>

 <el-row class="h-full">
    <el-col :span="5" class="h-full">
      <div class=" h-full">
           <org v-model="orgid" @change="changeOrg"/>
      </div>

    </el-col>
    <el-col :span="19">
        <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
            <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
        </el-tabs>
        <div v-if="view_activeName==='待设立'">
            <addProfundTable insure_status="11" :id="orgid"/>
        </div>
        <div v-if="view_activeName==='待确认'">
            <addProfundTable insure_status="12" :id="orgid"/>
        </div>
        <div v-if="view_activeName==='已设立'">
            <addProfundTable insure_status="13" :id="orgid"/>
        </div>
    </el-col>
  </el-row>
</template>
<script>
import org from '@/views/public/org'
import { getTabs } from '@/api/common'
import addProfundTable from './addProfundTable'
export default {
    components:{
        addProfundTable,
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
            filterText:'',
            view_activeName:'',
            menu:[],
        }
    },
    methods:{
        changeOrg(orgid){
            this.orgid = orgid
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name && data.name.indexOf(value) !== -1;
        },
    },
    async created() {
        const { menu } = await getTabs(this.$route.query.menuid)
        this.menu = menu
        this.view_activeName = menu[0].name;
    }
}
</script>



