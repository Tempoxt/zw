<template>
  	<div>
		<div class="side-header" style="margin-top:20px;padding-left:20px">
			<el-input placeholder="快速查找" v-model="filterText" class="input">
				<i slot="suffix" class="el-input__icon el-icon-search"></i>
			</el-input>
		</div>

		<el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
			<div style="padding:10px 20px 20px">
				<el-tree
					class="tree"
					:data="data"
					:props="{children: 'subs', label: 'name',isLeaf:'leaf' }"
					node-key="id"
					:filter-node-method="filterNode"
					ref="treeSame"
					:highlight-current="true"
					:check-on-click-node="false"
					@node-click="handleChangeNode"
					:expand-on-click-node="false"
					:load="loadNode1"
					lazy
					:class="{'search-for':searchFor}"
					>
					<span slot-scope="{ node, data }" :class="`${data.disabled?'disabled':''}`" >
						<span v-if="data.subs === 1" class="icon iconfont icon-zonggongsi"></span>
						<!-- <span v-if="data.org_type === 2" class="icon iconfont icon-fengongsi"></span>v-show="data.seleSim!=true&&data.leaf!=true"
						<span v-if="data.org_type === 3" class="icon iconfont icon-fenbumen"></span> -->
						&nbsp;
						<span class="label">{{ node.label }}&nbsp;
							<span style="color:#A3AFB7;">{{data.principalship}}</span>&nbsp;
							<span v-show="data.employeeCode!=0" style="color:#A3AFB7;">{{data.employeeCode}}</span>
						</span>
					</span>
				</el-tree>
			</div>
		</el-scrollbar>
	</div>  
</template>
<script>
import * as api_common from "@/api/common";
import { setInterval } from 'timers';
export default {
    props:{
        same:{
            default:'true'
        },
		filter_mark:{
            default:''
        },
		getApi:{
		    default:'/org/select'
        },
		searchApi:{
			default:'hrm/basesearsh'
		},
		month:{
			default:''
		},
		sele:'',
		leaf:false,
		dataList:{}
    },
    watch:{
       	async filterText(val) {
		   
			if (val!="") {
				if(this.searchApi&&this.month){
					let res = await this.$request.get(this.searchApi+"?keyword="+val+'&month='+this.month)
					this.data=res;
				}else if(this.searchApi){
					let res = await this.$request.get(this.searchApi+"?keyword="+val)
					this.data=res;
				}else{
					this.$refs.treeSame.filter(val);
				}
				this.searchFor=true
			} else{
				this.init()
				this.searchFor=false
			}
		},
		sele(){
			
		},
		leaf(){
		
		}
    },
    methods:{
		handleChangeNode(data,node){
			this.$emit('change',data)
		},
		filterNode(value, data) {
			if (!value) return true;
			return data.name && data.name.indexOf(value) !== -1;
		},
		async loadNode1(node, resolve) {
			const  { data }  = node
			if (data.subs) {
				let _id = data.id
				if (data.orgid) {
					_id = data.orgid
				}
				let _urldata = 'org/select?org_id='+_id
				if (this.filter_mark) {
					_urldata = 'org/select?org_id='+_id+"&filter_mark="+this.filter_mark
				}
				let res = await this.$request.get(_urldata)
				// if(Array.isArray(res.subs)){
				// 	res.subs = res.subs.length
				// }
				res.forEach( o=> {
					o.leaf = !o.subs
					if(node){
						o.disabled = node&&node.dd
					}
				})
				resolve(res);
			} else{
				resolve([]);
			}
		},
		async init(){
			let _urldata = this.getApi
			if (this.filter_mark) {
				_urldata = this.getApi+"?filter_mark="+this.filter_mark
			}
			this.data = await this.$request.get(_urldata);
			if(this.getApi=='/org/samedeptselect'){
				if(this.data[0]){
					this.data[0].subs = 1
				}
			}
		},
		empty(){
			this.filterText=""
		}
    },
    data(){
        return {
            data:[],
			searchFor:false,
			filterText:''
        }
    },
    created(){
        this.init()
    }
}
</script>
<style>
	.search-for .el-tree-node__content>.el-tree-node__expand-icon {
	  	color: transparent;
	}
</style>
<style lang="scss" scoped>

.scroll {
	height: calc(100% - 30px);
	width: 100%;
	/deep/ .scrollbar-wrapper {
		overflow-x: hidden;
	}
}
.disabled {
    .label {
        color:#A3AFB7;
    }
    .icon {
        color:#A3AFB7;
    }
}
</style>

