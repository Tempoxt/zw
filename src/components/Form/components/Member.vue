<template>
     <el-form-item :label="field.name">
        <el-popover ref="popover" placement="bottom" width="auto" trigger="click" v-model="visible" transition="el-zoom-in-top">
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
            <li class="el-select-dropdown__item" v-for="item in user" :key="item.id" @click="select(item)">{{item.chineseName}} - {{item.employeeCode}}</li>
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
import * as api_user from "@/api/user";
import { setTimeout } from 'timers';
export default {
  name: "form-member",
  props: {
    field: Object,
    value: {}    
  },
  methods: {
    async fetchUser(){
      this.user = await api_common.resource('hrm/partstaff').get({
        keyword:this.filterText,
        pagesize:10
      })
    },
    aaa(e) {
      e.stopPropagation();
      return false;
    },
    aa(data) {
      console.log(data);
    },
    select(data){
        console.log(data,'da222ta')
        this.visible = false;
        this.data = data.id;
        this.input5 = data.name
        this.field.defaultName = this.input5
    },
    nodeSelect(data) {
      if(data.leaf){
         this.visible = false;
         this.data = data.id;
         this.input5 = data.name
     
         this.field.defaultName = this.input5
        
      }
    },
    async loadNode1(node, resolve){
        let id = ''
        if(node.data){
            id = node.data.id
        }
        let data = await api_user.partuser(id);
        data.forEach(item=>{
            item.leaf = item.subs === 0 ? true : false
        })
        resolve(data)
    },
    findDataName() {
      if (this.data === undefined) {
        return;
      }
      let id = this.data;
      let info = {};
      (function f(data) {
        data.some(row => {
          if (row.id == id) {
            info = row;
            return true;
          }
          if (row.subs && row.subs.length) {
            f(row.subs);
          }
        });
      })(this.data2);
      this.input5 = info.name;
    }
  },
  watch: {
    filterText(){

    },
    data(val) {
    //   this.input5 = ''
    //   this.findDataName();
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
        if(isNaN(+this.value)){
          this.input5 = this.value
        }
        // this.input5 = this.field.real_name
      }
    },
    
  },
  data() {
    return {
      visible: false,
      filterText: "",
      input5: "",
      data: "",
      data2: [],
      defaultProps: {
        label: "name",
        isLeaf: 'leaf'
      },
      user:[]
    };
  },
  created(){
  
  }
//   async created() {
//     this.data2 = await api_common.api_org();
//     this.findDataName();
//   }
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