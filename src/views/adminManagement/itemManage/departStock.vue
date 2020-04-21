<template>
    <el-row class="h-full public-table-container">
       <el-col :span="4" class="h-full">
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
                        node-key="orgid"
                        :filter-node-method="filterNode"
                        :default-expanded-keys="expandedArr"
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
                </el-scrollbar>
            </div>
        </el-col>
        <el-col :span="20" style="border-left:1px solid rgb(232, 232, 232)">
            <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
                <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
            </el-tabs>
            <div v-if="view_activeName==='汇总'">
                <departStockTable :orgid="orgid" url="toolstationery/departstock/collect"/>
            </div>
            <div v-if="view_activeName==='发放明细'">
                <departStockTable :orgid="orgid" url="toolstationery/departstock/grant"/>
            </div>
            <div v-if="view_activeName==='入库明细'">
                <departStockTable :orgid="orgid" url="toolstationery/departstock/putstorage"/>
            </div>
            <div v-if="view_activeName==='部门台账'">
                <departStockTable :orgid="orgid" url="toolstationery/departledger"/>
            </div>
        </el-col>
    </el-row>
</template>
<script>
import { getTabs } from '@/api/common'
import departStockTable from './departStockTable'
export default {
    components:{
        departStockTable,
    },
    data(){
        return {
            orgid:'',
            activeName:'first',
            filterText:'',
            view_activeName:'',
            menu:[],
            data2:[],
            expandedArr:[],
        }
    },
    methods:{
        changeOrg(orgid){
            this.orgid = orgid
        },
        handleClick(val){
            
        },
        handleChangeNode(val,node){
            this.orgid = val.orgid
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
        this.data2 = await this.$request.get('toolstationery/standarddose/tree?showoffice=1');
        let that = this;
		(function f(data) {
			data.some(row => {
				if(row.subs && row.subs.length){
					row.subs.forEach(o=>{
						if(o.orgid.indexOf('d')==0){
							that.expandedArr.push(o.orgid)
						}
					})
				}
			});
		})(this.data2);
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
        height: calc(100% - 0px);
        width: 100%;
        padding-bottom: 20px;
        /deep/ .scrollbar-wrapper {
            overflow-x: hidden;
        }
    }
</style>
