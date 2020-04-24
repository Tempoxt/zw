<template>
    <!-- <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll"> -->
        <div style="padding:20px" class="h-full">
          <div class="side-header">
            <el-input placeholder="快速查找" v-model="filterText" class="input">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
          
          </div>
          <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
            <!-- <el-tree
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
            </el-tree> -->

			<el-tree
                class="tree"
                :data="data2"
                :props="{children: 'subs', label: 'name' }"
                :default-expanded-keys="expandedArr"
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

          </el-scrollbar>
        </div>
    <!-- </el-scrollbar> -->
</template>
<script>
import * as api_common from "@/api/common";
export default { 
  	props:{
		showteam:{
			default:''
		},
		getApi:{
		
		}
	},
    watch:{
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    methods:{
      handleChangeNode(val,node){
        this.$emit('input',val.orgid,val.id)
        this.$emit('change',val.orgid,val.id)
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name && data.name.indexOf(value) !== -1;
      },
    },
    data(){
        return {
            data2:[],
            filterText:'',
            expandedArr:[]
        }
    },
    async created(){
		if(this.getApi&&this.showteam){
			this.data2 = await this.$request.get(this.getApi,{
				params:{
					showteam:this.showteam
				}
			});
		}else if (this.getApi) {
			this.data2 = await this.$request.get(this.getApi);
		}else{
			this.data2 = await this.$request.get('org/tree',{
				params:{
					showteam:1
				}
			});
		}
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
        this.$emit('change',defaultId,this.data2[0].id)
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

