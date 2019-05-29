<template>
    
    <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
        <div style="padding:20px">
          <div class="side-header">
            <el-input placeholder="快速查找" v-model="filterText" class="input">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
          
          </div>

        
            <div style="margin-top:4px;">
                <div v-for="(item,i) in data" :key="i" class="select-item" @click="handleClick(item)" :class="`${select===item?'active':''}`">
                   <span :style="`${item.subs === 1?'opacity: 1;':'opacity: 0;'}`" class="icon iconfont icon-zonggongsi"></span> <span> &nbsp;&nbsp;{{item.name}}</span>
                </div>
            </div>
        </div>
    </el-scrollbar>
 
</template>
<script>
export default {
    props:['data'],
    data(){
        return{
            filterText:'',
            select:{}
        }
    },
    methods:{
        handleClick(item){
            if(this.select === item){
                this.select = {}
            }else{
                this.select = item
            }
            this.$emit('change',this.select)
        }
    },
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
.select-item {
    cursor: pointer;
   line-height: 34px;
    padding-left: 10px;
}
.active {
    background-color: #ebf9fc;
}
</style>
