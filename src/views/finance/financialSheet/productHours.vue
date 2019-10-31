<template>
<!-- 组件产品基准工时 -->
 <el-row class="h-full">
    <el-col :span="4" class="h-full" style="border-right:1px solid #e8e8e8">
        <div class="h-full">
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
						node-key="orgid"
						:filter-node-method="filterNode"
						ref="tree2"
						:highlight-current="true"
						:check-on-click-node="false"
						@node-click="handleChangeNode"
						:expand-on-click-node="false"
					>
						<span slot-scope="{ node, data }">
							<span v-if="data.orgid == 0" class="icon iconfont icon-zonggongsi"></span>
							<span v-if="data.orgid === 1" class="icon iconfont icon-fengongsi"></span>
							<span v-if="data.orgid === 2" class="icon iconfont icon-fenbumen"></span>
							&nbsp;
							<span>{{ node.label }}</span>
						</span>
					</el-tree>
				</el-scrollbar>  
			</div>
        </div>
    </el-col>

    <el-col :span="20">
        <productHoursTable :id="orgid" />
    </el-col>
  </el-row>
</template>
<script>
import org from '@/views/public/org'
import productHoursTable from './productHoursTable'
export default {
    components:{
        productHoursTable,
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
		handleChangeNode(val,node){
            this.orgid = val.orgid
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name && data.name.indexOf(value) !== -1;
        },
        changeOrg(orgid){
            this.orgid = orgid
        },
	},
	async created() {
		this.data2 =  await this.$request.get('org/prodlobarhourselect')
		let defaultId = this.data2[0].orgid
		this.orgid = defaultId
		this.$nextTick(()=>{
			this.$refs.tree2.setCurrentKey(defaultId)
		})
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