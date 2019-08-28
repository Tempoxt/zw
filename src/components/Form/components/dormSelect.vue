<template>
    <el-form-item :label="field.name">
        <el-popover ref="popover" placement="bottom" width="300" trigger="click" v-model="visible" transition="el-zoom-in-top">
			<el-input
				placeholder="搜索"
				class="input"
				v-model="filterText">
			</el-input>
			<el-scrollbar class="scroll-container">
				<el-tree
					class="filter-tree"
					:data="data2"
					:props="{children: 'subs', label: 'dormName' }"
					default-expand-all
					:filter-node-method="filterNode"
					ref="tree2"
					node-key="id"
					@node-click="nodeSelect"
					:expand-on-click-node="false"
				>
					<span slot-scope="{ node, data }" style="display:flex;justify-content: space-between;width: 100%;">
						<template v-if="!data.roomName&&!data.bedName">
							<div >
								<span class="icon iconfont icon-zonggongsi"></span>
								&nbsp;
								<span>{{ node.label||data.name }} </span>
							</div>
						</template>
						<template v-else-if="data.roomName">
							<div>
								<span class="icon iconfont icon-nv" v-if="data.dormType===0" style="color:rgba(255, 52, 160, 1)"></span>
								<span class="icon iconfont icon-nan" v-if="data.dormType===1" style="color:rgba(11, 178, 212, 1)"></span>
								&nbsp;
								<span>{{ data.roomName||data.name }} </span>
							</div>
						</template>
						<template v-else-if="data.bedName">
							<div>
								<span>{{ data.bedName||data.name }} </span>
							</div>
						</template>
					</span>
				</el-tree>
			</el-scrollbar>
        </el-popover>
        
        <el-select
        v-model="input5"
        placeholder="请选择"
        v-popover:popover
        no-data-text
        @focus="aaa"
        v-bind="$parent.$attrs"
        v-on="$parent.$listeners"
        class="input-with-select"
        :popper-append-to-body="false"
        ></el-select>
    </el-form-item>
</template>
<script>
import * as api_common from "@/api/common";
export default {
	name: "form-dormselect",
	props: {
		field: Object,
		value: {},
	},
	methods: {
		filterNode(value, data) {
			if (!value) return true;
			return (data.dormName && data.dormName.indexOf(value) !== -1) || (data.roomName && data.roomName.indexOf(value) !== -1)
		},
		aaa(e) {
			e.stopPropagation();
			return false;
		},
		select(data){
			this.visible = false;
			this.data = data.id;
			this.input5 = data.name
			this.field.defaultName = this.input5
		},
		async nodeSelect(data) {
			if(data.bedId){
				this.data = data.bedId;
				let dorm = await this.$request.get('/dormitory/getdorm?bedId='+data.bedId)
				this.input5 = dorm.dormName+' - '+dorm.roomName+' - '+data.bedName
				this.visible = false;
			}
		},
	},
	watch: {
		async 'field.id'(val){
			if(this.field.id){
				let _urldata='/dormitory/selecttree?empId='+this.field.id
				this.data2 = [await this.$request.get(_urldata)]
			}else{
				this.value = ''
				this.input5 = ''
				return
			}
		},
		data(val) {
			if(this.field.defaultName){
				this.input5 = this.field.defaultName
			}
			this.$parent.$emit("input", this.data);
		},
		value: {
			immediate: true,
			handler(val) {
				if(!val){
					this.input5 = this.field.real_name
				}
				this.data = this.value;
			}
		},
		filterText(val) {
			this.$refs.tree2.filter(val);
		}
	},
	data() {
		return {
			visible: false,
			filterText: "",
			input5: "",
			data: "",
			data2:[],
		};
	},
	async created(){
		if(this.field.id){
			let _urldata='/dormitory/selecttree?empId='+this.field.id
			this.data2 = [await this.$request.get(_urldata)]
		}
	}
};
</script>

<style lang="scss" scoped>
.input-with-select {
  width: 100%;
  /deep/ .el-select-dropdown {
    display: none;
  }
}
.scroll-container {
  height: 300px;
  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>