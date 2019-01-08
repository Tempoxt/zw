<template>
    <el-dialog
      title="高级查询"
      :visible.sync="queryDialogFormVisible"
      class="public-dialog"
      >    
      <div>
        <el-select v-model="tableQuery.type" placeholder="请选择">
          <el-option
              label="全部"
              :value="1">
            </el-option>
            <el-option
              label="任一"
              :value="2">
            </el-option>
          </el-select>
          &nbsp;
          <el-button icon="el-icon-plus" circle @click="addQuery"></el-button>
      </div>
      <div class="filter-wrap">
        <el-row :gutter="10" class="row" v-for="(query,i) in tableQuery.query" :key="i">
          <el-col :span="6">
            <el-select v-model="tableQuery.query[i][0]" placeholder="请选择">
                <el-option
                  v-for="column in table_column"
                  :key="column.id"
                  :label="column.showname"
                  :value="column.name">
                </el-option>
              </el-select>
          </el-col>
          <el-col :span="6">
             <el-select v-model="tableQuery.query[i][1]" placeholder="请选择">
                <el-option
                  v-for="(item,i) in mode"
                  :key="i"
                  :label="item.name"
                  :value="item.flag">
                </el-option>
              </el-select>
          </el-col>
          <el-col :span="10">
             <el-input v-model="tableQuery.query[i][2]" :placeholder="placeholder[query[1]]||'请输入内容'"></el-input>
          </el-col>
          <el-col :span="2">
              <el-button icon="el-icon-minus" circle @click="removeQuery(i)"></el-button>
          </el-col>
        </el-row>
      </div>
      <div>
        
      </div>


      <div slot="footer" class="dialog-footer">
        <el-button @click="clear">清 除</el-button>
        <el-button type="primary" @click="query">确 定</el-button>
      </div>
    </el-dialog>
</template>
<script>
export default {
  props:['table_queryFormVisible','table_column','table_query'],
    data(){
        return {
            tableQuery:{
              query:[]
            },
            queryDialogFormVisible:this.table_queryFormVisible,
            placeholder:{
              'c':'% 内容 %',
              'nc':'% 内容 %',
              'in':'内容,内容',
              'nin':'内容,内容',
              'b':'内容-内容',
              'nb':'内容-内容'
            },
            value:1,
            input:1,
            mode:[
              {
                name:'等于',
                flag:"="
              },
              {
                name:'大于',
                flag:">"
              },
               {
                name:'小于',
                flag:"<"
              },
               {
                name:'大于等于',
                flag:">="
              },
              {
                name:'小于等于',
                flag:"<="
              },
              {
                name:'不等于',
                flag:"!="
              },
               {
                name:'包含',
                flag:"c"
              },
               {
                name:'不包含',
                flag:"nc"
              },
               {
                name:'IN',
                flag:"in"
              },
               {
                name:'NOT IN',
                flag:"nin"
              },
               {
                name:'BETWEEN',
                flag:"b"
              },
               {
                name:'NOT BETWEEN',
                flag:"nb"
              }
            ]
        }
    },
    watch:{
      queryDialogFormVisible(val){
        this.$emit('update:table_queryFormVisible',val)
      },
      table_queryFormVisible(val){
        this.queryDialogFormVisible = val;
        if(val){
          this.tableQuery = JSON.parse(JSON.stringify(this.table_query))
        }
      }
    },
    computed:{
      queryType(i){
        return ()=>{
          this.table_column.find(item=>item.name==this.table_query.query[i].column).fieldtype
        }
      }
    },
    methods:{
      addQuery(){
        this.tableQuery.query.push([this.table_column[0].name,this.mode[0].flag])
      },
      removeQuery(i){
        this.tableQuery.query.splice(i,1)
      },
      query(){
        this.$emit('query',this.tableQuery)
        this.queryDialogFormVisible = false
      },
      clear(){
        this.tableQuery.query = []
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
