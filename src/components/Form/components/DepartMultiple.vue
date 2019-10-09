<template>
     <el-form-item :label="field.name" v-bind="$parent.$attrs"  v-on="$parent.$listeners">
        <el-popover ref="popover" placement="bottom" width="300" trigger="click" v-model="visible" transition="el-zoom-in-top">
			<el-input placeholder="搜索部门" class="input" v-model="filterText"></el-input>
			<el-scrollbar ref="scrollContainer" class="scroll-container" >
				<el-tree
					class="filter-tree"
					:data="data2"
					:props="defaultProps"
					default-expand-all
					:expand-on-click-node="false"
					ref="tree2"
					@node-click="nodeSelect"
					:filter-node-method="filterNode"
				>
					<span slot-scope="{ node, data }">
					<span :class="`icon iconfont ${(node.isLeaf&&data.name)?'icon-zuzhi2':'icon-wenjian'}`"></span>&nbsp;
					<span>{{ node.label }}</span>
					</span>
				</el-tree>
			</el-scrollbar>
        </el-popover>
        <el-select
			v-model="input5"
			multiple
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
	name: "form-departMultiple",
	props: {
		field: Object,
		value: {},
		field_key:{
			default:'id'
		}
	},
	data() {
		return {
			visible: false,
			filterText: "",
			input5: [],
			data: "",
			data2: [],
			defaultProps: {
				children: "subs",
				label: "name"
			},
			all:[]
		};
	},
	watch: {
		filterText(val) {
			this.$refs.tree2.filter(val);
		},
		visible(){
			if(this.visible){
				this.filterText = ''
			}
		},
		data(val) {
			if(this.field.defaultName){
				this.all = this.field.defaultName
				this.input5 = this.field.defaultName.map(o=>o.name)
			}
			var all = this.all.map(o=>o.id);
			var list = all.join(',')
			this.data = list;
			this.$parent.$emit("input", this.data);
		},
		value: {
			immediate: true,
			handler(val) {
				this.data = this.value;
			}
		},
  	},
	methods: {
		removeTag(data){
			var a = this.all.map(o=>o.name)
			var idx = a.indexOf(data)
			this.all.splice(idx,1)
		},
		filterNode(value, data) {
			if (!value) return true;
			return data.name.indexOf(value) !== -1;
		},
		aaa(e) {
			e.stopPropagation();
			return false;
		},
		aa(data) {
			console.log(data);
		},
		nodeSelect(data) {
			// this.data = data[this.field.field_key || 'id'];
			this.visible = false;
			this.data = data.id;
			this.all.push(data)
			this.input5.push(data.name)
		},
		async fetchData(){
			this.data2 = [(await api_common.resource('org/branchdepartment').get({id:1}))];
		},
	},
	async created() {
		this.fetchData()
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
.input {
  margin-bottom: 10px;
  /deep/ .el-input__inner {
    border-radius: 14px;
  }
   
}
.scroll-container {
  height: 300px;
  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>