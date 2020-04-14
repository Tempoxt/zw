<template>
  <div class="header">
    <div class="actions">
      <el-button-group>
        <el-button
          :type="(action.code=='query'&&table_form.query.query.length>0)?'primary':'default'"
          v-for="action in table_actions.slice(0,table_actions_morelen)"
          :icon="action.icon || 'icon iconfont icon-tianjia'"
          :key="action.id"
          @click="handleAction(action.code,action)"
          :disabled="!isDisabled(action.code)"

        >
          <span style="margin-left:4px">{{action.name}}</span>
        </el-button>

        <el-dropdown
          style="border-left: 1px solid #e8e8e8;"
          placement="bottom"
          size="medium"
          v-if="table_actions[table_actions_morelen]"
        >
          <el-button type="default" style="border-left: 0;"  size="medium">
            <span style="font-size: 12px;">更多</span>
            <i class="el-icon-arrow-down el-icon--right" style="font-size: 12px"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" :split-button="true">
            <el-dropdown-item
              v-for="action in table_actions.slice(table_actions_morelen,table_actions.length)"
              :key="action.id"
              @click.native="handleAction(action.code,action)"
              :disabled="!isDisabled(action.code)"
            >
              <i :class="action.icon" style="padding-right:10px;margin-right:-10px;font-size:12px"></i>
              {{action.name}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-button-group>
      <slot />
    </div>

    <div class="right-actions">
      <div class="right-aciton-item">
        <el-select v-model="ttype" @change="changeSelect" placeholder="请选择" :style="{width:width}" class="select-list" v-if="table_column.some(item=>item.isquicksearch)">
            <el-option
                v-for="item in selectList"
                :key="item.id"
                :label="item.showname"
                :value="item.name">
            </el-option>
        </el-select><el-input
          style="width:180px"
          placeholder="快速查找"
          v-model.trim="table_form.keyword"
          class="actions-input"
          @keyup.enter.native="search()"
          clearable
          @clear="search()"
          v-if="table_column.some(item=>item.isquicksearch)"
        >
        </el-input>
      </div>
      <el-button-group class="right-aciton-item">
        <el-tooltip class="item" effect="dark" content="全屏" placement="bottom">
          <el-button
            icon="icon iconfont icon-xingzhuang"
            size="small"
            @click="handleAction('toggleModal')"
          ></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="刷新" placement="bottom">
          <el-button
            icon="icon iconfont icon-shuaxin"
            size="small"
            @click="handleAction('fetchTableData')"
          ></el-button>
        </el-tooltip>

         <el-popover v-if="table_column.length<38"
            placement="bottom"
            trigger="click"
            transition="el-zoom-in-top" 
          >
            <el-checkbox-group v-model="checkList" @change="handleChange" text-color="#606266" class="checkbox-group">
                <div v-for="column in table_column" :key="column.id" class="column-item" >
                  <el-checkbox :label="column.id" >{{column.showname}}</el-checkbox>
                </div>
            </el-checkbox-group>
          <el-button icon="icon iconfont icon-lie" size="small"  slot="reference"   :disabled="!(showColumnfilter && table_column && table_column.length)"></el-button>
        </el-popover>

        <el-popover
        
            v-else
            placement="bottom"
            trigger="click"
            transition="el-zoom-in-top" popper-class="h-full"
          >

          <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
            <el-checkbox-group v-model="checkList" @change="handleChange" text-color="#606266" class="checkbox-group">
                <div v-for="column in table_column" :key="column.id" class="column-item" >
                  <el-checkbox :label="column.id" >{{column.showname}}</el-checkbox>
                </div>
            </el-checkbox-group>
          
          </el-scrollbar>
          <el-button icon="icon iconfont icon-lie" size="small"  slot="reference"   :disabled="!(showColumnfilter && table_column && table_column.length)"></el-button>
        </el-popover>

        <!-- <el-tooltip class="item" effect="dark" content="设置列" placement="bottom">
          <el-button icon="icon iconfont icon-lie" size="small"></el-button>
        </el-tooltip> -->
      </el-button-group>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    table_actions: Array,
    table_selectedRows: Array,
    table_column: Array,
    table_form:Object,
    showColumnfilter:{
      default:true
    }
  },
  computed: {
    isDisabled() {
      
      let len = this.table_selectedRows.length;
      return function(code) {
        if (code === "add") {
          return len <= 1;
        }
        if (code === "edit"||code==='warehouse'||code==='inventory'||code === "settlement" || code === "checkIn" || code === "checkOutTalent") {
          return len === 1;
        }
        if (code === "disableModify1" ||code === "enableModify1") {
          return len < 0;
        }
        if (['delete','forbid','lock','unlock','enable','away','remove','checkout','change','audit','confirm','finish','issue','apply','pass','back','financialaudit',
        'cancelAudit','editClass','schedule','purchase','purchaseList','ensure'].indexOf(code)!==-1) {
          return len >= 1;
        }
        return true;
      };
    }
  },
  watch:{
    table_column:{
      deep:true,
      handler(){
        this.checkList = this.table_column.filter(item=>(!item.fed_isvisiable)).map(item=>item.id)
        this.selectList = this.table_column.filter(o=>(o.isquicksearch))
        this.ttype = this.selectList[0].name
        this.table_form.quicksearch = this.ttype
        let len = this.selectList[0].showname.length
        // console.log(len)
        if(len==2){
          this.width = len*40+'px'
        }else if(len==3){
          this.width = len*30+'px'
        }else if(len==4){
          this.width = len*25+'px'
        }else if(len>=5&&len<7){
          this.width = len*23+'px'
        }else if(len>=7){
          this.width = len*18+'px'
        }
        
      }
    },
    table_actions(){
      let length = this.table_actions.length
      if( length == this.table_actions_morelen+1){
        this.table_actions_morelen =  length
      }
    }
  },
  data() {
    return {
      table_actions_morelen: 4,
      form: {},
      checkList:[],
      selectList:[],
      ttype:'',
      width:'80px'
    };
  },
  methods: {
    changeSelect(){
      this.table_form.quicksearch =  this.ttype
      let list = this.selectList.filter(o=>o.name==this.ttype)
      let len = list[0].showname.length
      if(len==2){
        this.width = len*40+'px'
      }else if(len==3){
        this.width = len*30+'px'
      }else if(len==4){
        this.width = len*25+'px'
      }else if(len>=5&&len<7){
        this.width = len*23+'px'
      }else if(len>=7){
        this.width = len*18+'px'
      }
    },
    search(){
      this.table_form.currentpage = 1
      this.handleAction('fetchTableData')
    },
    handleAction(action) {
      this.$emit("action", action);
    },
    handleChange(val){
      this.table_column.forEach(item=>{
          if(this.checkList.indexOf(item.id)===-1){
            this.$set(item,'fed_isvisiable',true)
 
          }else{
            this.$set(item,'fed_isvisiable',false)
            
          }
      })
      if(this.$route.query.menuid==105){
        window.localStorage['curr_table_column'] = JSON.stringify(this.table_column)
      }
    }
  },
  created(){
    setTimeout(()=>{
      // window.localStorage.clear('curr_table_column');
        // console.log(this.table_column,'table_column')
    },2000)
  }
};
</script>
<style>
  .el-input--small{
    font-size: 12px;
  }
</style>

<style lang="scss" scoped>

.el-button--small{
  padding: 9px 10px;
}
.flex{
  display: flex;
  align-items: center;
}

.scroll {
  height: calc(100%);
  width: 100%;
 /deep/ .scrollbar-wrapper {
    overflow-x: hidden;
  }
}
.header {
  display: flex;
  justify-content: space-between;
  // padding: 0 20px;
  margin-bottom: 10px;
  
  /deep/.iconfont{
    font-size: 14px;
  }
  .actions {
    display: flex;
    /deep/.el-button{
      padding: 9px 10px;
    }
    .more {
      margin-left: 10px;
    }
  }
  
  .right-actions {
    display: flex;
    justify-content: flex-end;
    .right-aciton-item {
      cursor: pointer;
      margin-left: 20px;
    }
    // /deep/ .el-input__suffix {
    //     right: 10px;
    //     top: 6px;
    // }
    
    .select-list{
      /deep/ input {
        border-right: none;
        border-radius: 2px 0 2px 2px;
        text-align: center;
        height: 34px;
        line-height: 34px;
      }
    }
    .actions-input {
      /deep/ input {
        border-radius: 2px 2px 2px 0px;
        height: 34px;
        line-height: 34px
        // border-radius: 20px;
      }
    }
  }
}
.column-item {
  margin:6px 0;
}
.checkbox-group {
  /deep/ .el-checkbox__label {
    color: #606266;
    font-weight: normal;
  }
}
</style>
