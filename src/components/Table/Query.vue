<template>
    <el-dialog
      title="高级查询"
      :visible.sync="queryDialogFormVisible"
      class="public-dialog"
      >    
      <div>
        <el-select v-model="value" placeholder="请选择">
          <el-option
              label="全部"
              value="1">
            </el-option>
            <el-option
              label="任一"
              value="2">
            </el-option>
          </el-select>
          &nbsp;
          <el-button icon="el-icon-plus" circle></el-button>
      </div>
      <div class="filter-wrap">
        <el-row :gutter="10" class="row">
          <el-col :span="6">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                  label="全部"
                  value="1">
                </el-option>
                <el-option
                  label="任一"
                  value="2">
                </el-option>
              </el-select>
          </el-col>
          <el-col :span="6">
             <el-select v-model="value" placeholder="请选择">
                <el-option
                  label="全部"
                  value="1">
                </el-option>
                <el-option
                  label="任一"
                  value="2">
                </el-option>
              </el-select>
          </el-col>
          <el-col :span="10">
             <el-input v-model="input" placeholder="请输入内容"></el-input>
          </el-col>
          <el-col :span="2">
              <el-button icon="el-icon-minus" circle></el-button>
          </el-col>
        </el-row>
      </div>
      <div>
        
      </div>


      <div slot="footer" class="dialog-footer">
        <el-button @click="queryDialogFormVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>
</template>
<script>
export default {
  props:['table_queryFormVisible'],
    data(){
        return {
            queryDialogFormVisible:this.table_queryFormVisible,
            value:1,
            input:1
        }
    },
    watch:{
      queryDialogFormVisible(val){
        this.$emit('update:table_queryFormVisible',val)
      },
      table_queryFormVisible(val){
        this.queryDialogFormVisible = val
      }
    }
}
</script>
<style lang="scss" scoped>
.filter-wrap {
  .row {
    margin-top: 10px;
  }
}
</style>
