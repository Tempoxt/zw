<template>
    <el-dialog
      title="高级查询"
      :visible.sync="queryDialogFormVisible"
      class="public-dialog"
      v-el-drag-dialog
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
                  v-for="column in table_column.filter(item=>item.issearch)"
                  :key="column.id"
                  :label="column.showname"
                  :value="column.name">
                </el-option>
              </el-select>
          </el-col>
          <el-col :span="6">
             <el-select v-model="tableQuery.query[i][1]" placeholder="请选择" @change="changeFlag(i)">
                <el-option
                  v-for="(item,i) in computeMode(i)"
                  :key="i"
                  :label="item.name"
                  :value="item.flag">
                </el-option>
              </el-select>
          </el-col>
          <el-col :span="10">
            <template v-if="inputType(i,'text')" >
              <el-input 
                v-model="tableQuery.query[i][2]" :placeholder="placeholder[query[1]]||'请输入内容'"
                v-if="['=','>','<','>=','<=','!=','c','nc'].indexOf(tableQuery.query[i][1])!==-1 "
              ></el-input>
              <div
              v-if="['in','nin','b','nb'].indexOf(tableQuery.query[i][1])!==-1 && Array.isArray(tableQuery.query[i][2])"
              class="number-range"
              >
                <el-input-number v-model="tableQuery.query[i][2][0]" controls-position="right"></el-input-number>
                <span>至</span>
                <el-input-number v-model="tableQuery.query[i][2][1]" controls-position="right"></el-input-number>
              </div>
            </template>
            <template v-if="inputType(i,'number')" >
              <el-input 
                v-model="tableQuery.query[i][2]" :placeholder="placeholder[query[1]]||'请输入内容'"
                v-if="['=','>','<','>=','<=','!=','c','nc'].indexOf(tableQuery.query[i][1])!==-1 "
              ></el-input>
              <div
              v-if="['in','nin','b','nb'].indexOf(tableQuery.query[i][1])!==-1 && Array.isArray(tableQuery.query[i][2])"
              class="number-range"
              >
                <el-input-number v-model="tableQuery.query[i][2][0]" controls-position="right"></el-input-number>
                <span>至</span>
                <el-input-number v-model="tableQuery.query[i][2][1]" controls-position="right"></el-input-number>
              </div>
            </template>
            <template v-if="inputType(i,'date')" >
              <el-date-picker
                v-model="tableQuery.query[i][2]"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                v-if="['=','>','<','>=','<=','!=','c','nc'].indexOf(tableQuery.query[i][1])!==-1 "
                >
              </el-date-picker>

               <el-date-picker
                v-if="['in','nin','b','nb'].indexOf(tableQuery.query[i][1])!==-1"
                v-model="tableQuery.query[i][2]"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                class="date-daterange"
                value-format="yyyy-MM-dd"
                end-placeholder="结束日期">
              </el-date-picker>
            </template>
             <template v-if="inputType(i,'select')" >
               <el-select v-model="tableQuery.query[i][2]" placeholder="请选择"
               v-if="['=','>','<','>=','<=','!=','c','nc'].indexOf(tableQuery.query[i][1])!==-1 "
               >
                  <el-option
                    v-for="item in column_item(i).sourcefrom.choice"
                    :key="item[0]"
                    :label="item[1]"
                    :value="item[0]">
                  </el-option>
                </el-select>
                  <div
                  v-if="['in','nin','b','nb'].indexOf(tableQuery.query[i][1])!==-1 && Array.isArray(tableQuery.query[i][2])"
                  class="number-range"
                  >
                    <el-input-number v-model="tableQuery.query[i][2][0]" controls-position="right"></el-input-number>
                    <span>至</span>
                    <el-input-number v-model="tableQuery.query[i][2][1]" controls-position="right"></el-input-number>
                  </div>
            </template>
            
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
      computeMode(){
        return (i)=>{
          var mode = {
            text:['=','>','<','>=','<=','!=','c','nc'],
            date:['=','>','<','>=','<=','!=','c','nc','b','nb'],
            number:['=','>','<','>=','<=','!=','c','nc','in','nin','b','nb'],
            select:['=','!=']
          }
          if(mode[this.column_item(i).fieldtype]){
             return this.mode.filter(item=>(mode[this.column_item(i).fieldtype].indexOf(item.flag)!==-1))
          }
        }
      },
      queryType(i){
        return ()=>{
          this.table_column.find(item=>item.name==this.table_query.query[i].column).fieldtype
        }
      }
    },
    methods:{

      column_item(i){
        return this.table_column.find(item=>item.name==this.tableQuery.query[i][0])
      },
      inputType(i,name){
         return  this.table_column.find(item=>item.name==this.tableQuery.query[i][0]).fieldtype === name
      },
      flagType(i,type){
        return this.tableQuery.query[i][1]
      },
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
      },
      isArrayType(i){
        return ['=','>','<','>=','<=','!=','c','nc'].indexOf(tableQuery.query[i][1])!==-1
      },
      changeFlag(i){
        if(['in','nin','b','nb'].indexOf(this.tableQuery.query[i][1]!==-1)){
          this.tableQuery.query[i][2] = []
        }else{
          this.tableQuery.query[i][2] = ''
        }
        
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
.number-range {
  display: flex;
  align-items: center;
  // border:1px solid #dcdfe6;
  box-shadow: 0px 0px 0px 1px #dcdfe6;
  border-radius: 4px;
  /deep/ .el-input__inner ,/deep/ .el-input-number__decrease,/deep/ .el-input-number__increase{
    border:none;
  }
  /deep/ .el-input-number__decrease,/deep/ .el-input-number__increase{
    display: none;
  }
}
.date-daterange {
  width: 260px;
  /deep/ .el-range-separator {
    width:23px;
  }

}
</style>
