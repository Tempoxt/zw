<template>
    
    <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
        <div style="padding:20px">
          <div class="side-header">
            <el-input placeholder="快速查找" v-model="filterText" class="input">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
          
          </div>

        
            <div style="margin-top:4px;">
                <div v-for="(item,i) in data" :key="i">
                   <span v-if="item.subs === 1" class="icon iconfont icon-zonggongsi"></span> <span> &nbsp;&nbsp;{{item.name}}</span>
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
            filterText:''
        }
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
