<template>
    <el-form-item :label="field.name">
        <el-popover ref="popover" placement="bottom" width="300" trigger="click" v-model="visible" transition="el-zoom-in-top">
			<el-input
			placeholder="搜索姓名或工号"
			class="input"
			@input="fetchUser"
			v-model="filterText">
			</el-input>
			<el-scrollbar
				ref="scrollContainer"
				class="scroll-container"
				>
				<ul class="el-select-dropdown__list" v-if="filterText" >
					<li class="el-select-dropdown__item" v-for="item in employee" :key="item.id" @click="select(item)">{{item.chineseName}} - {{item.employeeCode}}</li>
				</ul>
		
				<el-tree
					v-else
					class="filter-tree"
					:props="defaultProps"
					:expand-on-click-node="true"
					ref="tree2"
					:load="loadNode1"
					lazy
					@node-click="nodeSelect"
				>
					<span slot-scope="{ node, data }">
						<span :class="data.icon"></span>&nbsp;
						<span>{{ node.label }} <span v-if="data.employeeCode"> - {{data.employeeCode}}</span> </span>
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
		@remove-tag="removeTag"
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
	name: "form-multiporg",
	props: {
		field: Object,
		value: {}
	},
	data() {
		return {
			visible: false,
			filterText: "",
			input5: [],
			data: '',
			defaultProps: {
				label: "name",
				isLeaf: 'leaf'
			},
			employee:[],
			all:[]
		};
	},
	methods: {
		async fetchUser(){
			this.employee = await api_common.resource('hrm/basesearsh').get({keyword:this.filterText})
		},
		aaa(e) {
			e.stopPropagation();
			return false;
		},
		aa(data) {
			console.log(data);
		},
		removeTag(data){
			var a = this.all.map(o=>o.name)
			var idx = a.indexOf(data)
			this.all.splice(idx,1)
		},
		select(data){
			this.visible = false;
			this.data = data.employeeCode;
			this.input5.push(data.name)
			this.all.push(data)
		},
		nodeSelect(data) {
			if(data.leaf){
				this.visible = false;
				this.data = data.employeeCode;
				this.input5.push(data.name)
				this.all.push(data)
			}
		},
		async loadNode1(node, resolve){
			let id = ''
			if(node.data){
				id = node.data.id
			}
			let _urldata='hrm/baseselect?org_id='+id
			let data = await this.$request.get(_urldata)
			data.forEach(item=>{
				item.leaf = item.subs === 0 ? true : false
			})
			resolve(data)
		}
	},
	watch: {
		data(val) {
			if(this.field.defaultName){
				this.all = this.field.defaultName
				this.input5 = this.field.defaultName.map(o=>o.name)
			}
			var all = this.all.map(o=>o.employeeCode);
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
	created(){
	
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