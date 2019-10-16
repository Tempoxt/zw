<template>
   <el-row class="h-full">
		<el-col :span="4" class="h-full" style="border-right:1px solid #e8e8e8">
			<div class=" h-full">
				<org v-model="orgid" @change="changeOrg" />   
			</div>
		</el-col>
		<el-col :span="20">
			<div>
				<el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
					<el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
				</el-tabs>
				<div v-if="view_activeName==='已消费人员'">
					<consumeTable :id="orgid"  flag='1' url="consumedetail"/>
				</div>
				<div v-if="view_activeName==='未消费人员'">
					<consumeTable :id="orgid"  flag='2' url="unconsumedetail"/>
				</div>
			</div>
		</el-col>
  </el-row>
</template>
<script>
import { getTabs } from '@/api/common'
import consumeTable from './consumeTable'
import org from '@/views/public/org.vue'
export default {
    data(){
        return {
            activeName:'first',
            orgid:'',
            filterText:'',
            view_activeName:'',
            menu:[],
        }
    },
    components:{
        consumeTable,
        org
    },
    methods:{
        changeOrg(orgid){
            this.orgid = orgid
        },
        handleClick(val){
            
        },
    },
    async created(){
        const { menu } = await getTabs(this.$route.query.menuid)
        this.menu = menu
		this.view_activeName = menu[0].name;
    }
}
</script>

