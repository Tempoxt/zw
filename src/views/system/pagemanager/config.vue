<template>
    <ui-table 
    ref="table"
    :table_column="table_field" 
    :table_query.sync="table_form.query"
    @query="querySubmit"
    >
         <el-dialog
            title="修改参数"
            :visible.sync="dialogFormVisible"
            class="public-dialog"
            v-el-drag-dialog
            >
            <dialog-scroll>
              <div style="width:500px;margin:0 auto" v-loading="dialog_loading">
                <el-form ref="form" :model="form" label-width="150px">
                    <el-form-item label="页默认显示数">
                      <el-input v-model="form.rowNum"></el-input>
                    </el-form-item>
                    <el-form-item label="页记录数选项">
                      <el-input v-model="form.rowList"></el-input>
                    </el-form-item>
                    <el-form-item label="隔行样式">
                      <el-input v-model="form.altClass"></el-input>
                    </el-form-item>
                    <el-form-item label="求和列">
                      <el-select v-model="form.sumCol" placeholder="求和列">
                        <el-option :label="item.showname" :value="item.name" v-for="item in col" :key="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="默认排序列">
                      <el-select v-model="form.sortName" placeholder="默认排序列">
                        <el-option label="后端排序" value=""></el-option>
                        <el-option :label="item.showname" :value="item.name" v-for="item in col" :key="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="排序方式">
                      <el-radio v-model="form.sortOrder" label="asc">顺序</el-radio>
                      <el-radio v-model="form.sortOrder" label="desc">倒序</el-radio>
                    </el-form-item>
                    <el-form-item label="允许设置列宽">
                      <el-radio v-model="form.isSetWidth" :label="true">是</el-radio>
                      <el-radio v-model="form.isSetWidth" :label="false">否</el-radio>
                    </el-form-item>
                    <el-form-item label="动态表格">
                      <el-radio v-model="form.isScorll" :label="true">是</el-radio>
                      <el-radio v-model="form.isScorll" :label="false">否</el-radio>
                    </el-form-item>
                    <el-form-item label="显示序号列">
                      <el-radio v-model="form.isShowNum" :label="true">是</el-radio>
                      <el-radio v-model="form.isShowNum" :label="false">否</el-radio>
                    </el-form-item>
                    <el-form-item label="显示多选列">
                      <el-radio v-model="form.isMultiBoxOnly" :label="true">是</el-radio>
                      <el-radio v-model="form.isMultiBoxOnly" :label="false">否</el-radio>
                    </el-form-item>
                    <el-form-item label="显示统计行">
                      <el-radio v-model="form.isShowFooter" :label="true">是</el-radio>
                      <el-radio v-model="form.isShowFooter" :label="false">否</el-radio>
                    </el-form-item>
                    <!-- <el-form-item label="树形控件选择设置">
                      <el-radio v-model="form.radio" label="1">是</el-radio>
                      <el-radio v-model="form.radio" label="2">否</el-radio>
                    </el-form-item> -->
                  </el-form>
                
              </div>
           </dialog-scroll>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
            </div>
            </el-dialog>


            <table-header
            :table_actions="table_actions"
            :table_selectedRows="table_selectedRows"
            @action="handleAction"
            :table_form.sync="table_form"
            :table_column="table_field"
            ></table-header>
            <el-table 
                @selection-change="handleChangeSelection"
                :data="table_data"
                border 
                style="width: 100%"
                :header-cell-style="headerCellStyle"
                @header-dragend="table_dragend"
                :height="table_height"
                @sort-change="table_sort_change"
                v-loading="table_loading">
                <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                 <!-- <el-table-column type="index" :index="indexMethod" /> -->
               <!-- <each-table-column :table_field="table_field"/> -->
               <each-table-column :table_field="table_field" :template="template"/>
            </el-table>
           
    </ui-table>
</template>
<script>
import * as api_common from "@/api/common";
import * as api_actionsheet from "@/api/actionsheet";
import table_mixin from "@c/Table/table_mixin";
const api_resource = api_common.resource('pagemanager/tableconfig')
import dialogScroll from '@c/Dialog/dialogScroll'
export default {
  components:{
    dialogScroll
  },
  mixins: [table_mixin],
  props:{
      currentMenuid:Number
  },
  watch:{
     currentMenuid:{
      handler(){
        this.fetchTableData();
      },
      immediate:true
    }

  },
  methods: {
    async customEdit(){
        this.form = Object.assign({},this.ccc)
        this.dialog_loading = true
        this.dialogFormVisible = true
        this.col = await api_common.resource("pagemanager/field").get({menuid:this.currentMenuid})
        setTimeout(()=>{
          this.dialog_loading = false
        },300)
        
    },
    async add(){
      this.dialogFormVisible = true
      this.dialog_loading = true
      this.actionsModel = []
      const actionsList = await api_actionsheet.get()
      this.actionsList = actionsList.filter(action=>!this.table_data.find(item=>item.actionid===action.id))
      setTimeout(()=>{
        this.dialog_loading = false
      },300)
    },

    async handleFormSubmit(){
      await api_resource.update(this.currentMenuid,this.form)
      this.dialogFormVisible = false
      this.fetchTableData()
    },
    async fetchTableData(menuid) {
      this.table_loading = true
      this.table_form.menuid = this.currentMenuid
      // const { rows }  = await api_resource.get(this.table_form);
      // this.table_data = rows
      if(!this.table_data.length){
        await this.getField()
      }
     const data =  await api_resource.find(this.currentMenuid);
      this.table_data.forEach(item=>{
        this.$set(item,'ccc',data[item.name])
      }) 
      this.ccc = data

      console.log(this.ccc,'this.ccc')
      setTimeout(()=>{
        this.table_loading = false
      },300)
    },
    async getField(){
      const { postion } = this.$route.query;
      const { field, action } = await api_common.menuInit(
        "tableconfig"
      );
      this.table_field = [
        {
              "id": 121,
              "name": "showname",
              "icon": "",
              "showname": "表格设置",
              "isblank": true,
              "isvisiable": false,
              "sort": 1,
              "isquicksearch": false,
              "issearch": false,
              "iseditable": true,
              "fieldtype": "text",
              "validation": "",
              "width": "450px"
        },
        {
              "id": 122,
              "name": "ccc",
              "icon": "",
              "showname": "",
              "isblank": true,
              "isvisiable": false,
              "sort": 1,
              "isquicksearch": false,
              "issearch": false,
              "iseditable": true,
              "fieldtype": "text",
              "validation": "",
              "width": "auto"
        },
        
      ];
      this.table_data = field
      this.table_actions = action;
      this.table_actions[0].code = 'customEdit'
    }
  },

  data() {
    var self = this
    return {
      table_loading:true,
      actionsList:[],
      actionsModel:[],
      dialog_loading:true,
      api_resource,
      form:{},
      col:[],
      dialog_loading:true,
      ccc:{},
      template:{
        ccc(column,row){
          // console.log(column,'col')
          // console.log(row,'row')

          // console.log(,'this.cccData[row.name]')
          const f = {
            sortOrder(val){
              return val==='asc'?'顺序':'倒序'
            },
            isSetWidth(val){
              return val?'是':'否'
            },
            isShowNum(val){
              return val?'是':'否'
            },
            isMultiSelect(val){
               return val?'是':'否'
            },
            isShowFooter(val){
              return val?'是':'否'
            },
            isMultiBoxOnly(val){
              return val?'是':'否'
            },
            isScorll(val){
              return val?'是':'否'
            }
          }
          if(f[row.name]){
            return  <span>{f[row.name](self.ccc[row.name])}</span>
          }else{
              console.log(row,'row.name')
             return <span>{self.ccc[row.name]}</span>
          }
         
        }
      }
    };
  },
  async created() {
  
    
  }
};
</script>
<style lang="scss" scoped>

</style>

