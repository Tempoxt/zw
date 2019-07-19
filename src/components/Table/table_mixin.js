
import uiTable from '@c/Table/Index.vue'
import treeTable from '@/components/TreeTable'
import FormRender from '@c/Form/render'
import tableHeader from '@c/Table/Header'
import tablePagination from '@c/Table/Pagination'
import * as api_common from "@/api/common";
const api_pagemanager = api_common.resource('pagemanager/field')
import treeToArray from "./eval";
import tableColumn from '@c/publicTable/tableColumn'
import eachTableColumn from '@c/publicTable/eachTableColumn'
import dateLap from '@/components/Table/DateLap'
import DateLapRange from '@/components/Table/DateLapRange'
import request from '@/plugins/request'
import { MessageBox } from 'element-ui';
const download = require('downloadjs')
export default {
  props:{
    resource:String,
    _fetchTableData:Function,
    _initTable:Function
  },
  components: {
    uiTable,
    treeTable,
    FormRender,
    tableHeader,
    tablePagination,
    tableColumn,
    eachTableColumn,
    DateLapRange
  },
  watch:{
    table_config(){
      this.table_form.pagesize = this.table_config.rowNum
      if(this.table_config.sortName){
        this.table_form.sortname = this.table_config.sortName
      }
      this.table_form.sorttype = this.table_config.sortOrder
    }
  },
  data() {
    return {
      headerCellStyle:{background:'#F5FAFB',color:'#37474F',height:'50px'},
      table_field: [],
      table_actions: [],
      table_data: [],
      table_config:{},
      table_loading: true,
      table_selectedRows: [],
      table_selectedRowsInfo: [],
      dialogStatus: 'insert',
      table_modal: false,
      dialogFormVisible: false,
      table_queryFormVisible: false,
      table_form:{
        pagesize:100,
        currentpage:1,
        query:{
          type:1,
          query:[]
        }
      },
      table_sort:{},
      form_multiple:false,
      importLoading:false,
      window_innerHeight:0
    }
  },
  computed: {
    table_height(){ 
      return (this.window_innerHeight||window.innerHeight) - (this.table_topHeight||236)
    },
    isInsert() {
      return this.dialogStatus === 'insert'
    },
    table_format_query(){
      return {
        type:this.table_query.type,
        query:this.table_query.query.map(item=>{
          return [item.column,item.mode,item.value]
        })
      }
    },
     // 格式化数据源
    table_tree_formatData: function() {
      let tmp;
      if (!Array.isArray(this.table_data)) {
        tmp = [this.table_data];
      } else {
        tmp = this.table_data;
      }
      const func = this.evalFunc || treeToArray;
      const args = this.evalArgs
        ? Array.concat([tmp, this.expandAll], this.evalArgs)
        : [tmp, this.expandAll];
      return func.apply(null, args);
    }
  },
  mounted(){
    let _onresize = window.onresize
    window.onresize = () => {
      _onresize && _onresize()
      this.window_innerHeight = window.innerHeight
    }
    
  },
  methods: {
    indexMethod(i){
      return (i+1)+(this.table_form.currentpage-1)*this.table_form.pagesize
    },
    table_disable_selected(row){
      
      return !(row.lockstate&&!this.table_actions.find(action=>action.code==='unlock'))
    },
    table_state_className({row, column, rowIndex, columnIndex}){
      return row.lockstate?'row-state-class':''
    },
    
    table_dragend(newWidth, oldWidth, column, event,b){
      let row = this.table_field.find(field=>field.showname===column.label)
      var isEnd = false
      this.table_field.forEach((item,i)=>{
        if(item==row&&i==this.table_field.length-2){
          isEnd = true
        }
      })
      // if(isEnd){
      //   var lastRow = this.table_field[this.table_field.length-1]
      //   lastRow.width = 'auto'
      //   lastRow.menuid = lastRow.menuid_id
      //   api_pagemanager.update(lastRow.id,{width:lastRow.width,menuid:lastRow.menuid_id},{alert:false})
      //   return
      // }
      row.width = newWidth
      row.menuid = row.menuid_id
      api_pagemanager.update(row.id,{
        width:newWidth,
        menuid:row.menuid_id
      },{alert:false})
    },
    table_sort_change({ column, prop, order }){
      this.table_sort = {}
      // this.table_sort[prop] = {}
      if(order){
        // console.log(arguments,'column')
        // console.log(this.table_field.find(o=>o.name==prop),'this.table_field')
        this.table_sort[prop] = {'ascending':'asc','descending':'desc'}[order]
        this.table_form.sortname = Object.keys(this.table_sort).join(',')
        this.table_form.sorttype = Object.values(this.table_sort).join(',')
      }
      this.fetchTableData()      
    },
    query() {
      this.$refs.table.table_queryFormVisible = true
    },
    querySubmit(query){
      this.table_form.currentpage = 1
      this.table_form.query = query
      this.fetchTableData()
    },
    async table_init(url){
      this.table_init_status = new Promise(async (resolve)=>{
        const { field, action,table } = await api_common.menuInit(url);
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table
        this.table_form.pagesize = this.table_config.rowNum
        resolve()
      })
     
    },
    async throwFormError(req,formName = 'form'){
      let error = {}
      try {
        await req
      } catch(err){
        let { field } = err
        error = field
      }
      for(let field in error){
        let msg = error[field].join(',')
        let formItem =  this.$refs[formName].formItem.find(({prop})=>prop===field)
        let x = Math.floor(Math.random() * (1 - 100)) + 100
        while(x>0){
          msg = msg+' '
          x--
        }
        formItem.changeError && formItem.changeError(msg)
      }
      return req
    },
    form_validate(){
      return new Promise((resolve,reject)=>{
          this.$refs.form.validate((valid) => {
          if(valid){
            resolve()
          }else{
            reject()
            return false
          }
        })
      })
    },
    form_math_sort(){
      var _data = this.table_data.map(o=>o.sort)
      if(_data.length){
        this.form.sort = Math.max.apply(Math,_data)+1
      }else{
        this.form.sort = 1
      }
    },
    handleAction(action) {
      // if(['toggleModal','export'].indexOf(action)!==-1){
      //   this[action]()
      // }else{
      //   this.$emit('action',action)
      // }
      if (this[action]) {
        if (action === 'add') {
          this.dialogStatus = 'insert'
          if (this.defaultForm && this.form) {
            this.form = this.defaultForm()
          }
          if(this.$refs.form){
            this.$refs.form.resetFields();
          }
        }
        if (action === 'edit') {
          this.dialogStatus = 'update'
        }
        this[action](action)
      } else {
        console.error(action)
      }
      
    },
    handleChangeSelection(val) {
      this.table_selectedRowsInfo = val
      this.table_selectedRows = val
      this.$emit("update:table_selectedRows",val)
    },
    toggleModal() {
      this.$refs.table.toggleModal()
    },
    async multipleAction(name,msg){
      console.log(this.table_selectedRows,'table_selectedRows')
      let rows = this.table_selectedRows.map(row=>row.id)
      await this.api_resource.action(name,rows.join(','))
      this.$message({
          type: 'success',
          message: msg
      })
      this.fetchTableData()
    },
    async forbid(){
      this.multipleAction('forbid','禁用成功')
    },
    async unlock(){
      this.multipleAction('unlock','解锁成功')
    },
    async enable(){
      this.multipleAction('enable','启用成功')
    },
    async lock(){
      this.multipleAction('lock','锁定成功')
    },
    // async audit(){
    //   this.multipleAction('check','审核成功')
    // },
    // async away(){
    //   this.multipleAction('forbid','办离成功')
    // },
    async delete() {
      let rows = this.table_selectedRows.map(row=>row.id)
      this.$confirm('此操作将删除选中行, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return this.api_resource.remove(rows.join(','))
        })
        .then(() => {
          this.fetchTableData({target:'delete'})
        })
    },
    remove(){
      let rows = this.table_selectedRows.map(row=>row.id)
      this.$confirm('此操作将移除选中行, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return this.api_resource.remove(rows.join(','))
        })
        .then(() => {
          this.fetchTableData()
        })
    },
    async download(){
      //  const { data,name,contentType} =  await request.get('hrm/v2/export',{
      //     params:this.table_form,
      //     responseType:'arraybuffer'
      //   })
        const { data,name,contentType} =  await this.api_resource.export(this.table_form,{
          responseType:'arraybuffer'
        })

        

        download(data,name||this.$route.meta.title,contentType)
    },
    async export(){
      const formatJson = function(filterVal, jsonData){
          var result = [];
          (function f(jsonData){
            jsonData.forEach((v)=>{
              result.push(filterVal.map((j)=>{
                if (j === 'timestamp') {
                  return parseTime(v[j])
                } else {
                  return v[j]
                }
              }))
              if(v.subs&&v.subs.length){
                f(v.subs)
              }
            })
          })(jsonData)
          return result
      }
      let header = this.table_field.filter(field=>!field.fed_isvisiable)
      let data = []
      if(this.table_selectedRows.length){
        data = [...this.table_selectedRows]
        data.forEach((item)=>{
          delete item.subs
        })
      }else{
        data = this.table_data
      }
      const export_file = async (type)=>{
        this.$msgbox.close()
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        if(type==='pdf'){
          var pdf = new jsPDF('p', 'pt', 'letter');
            pdf.html(document.querySelector('.el-table'), {callback: function(pdf) {
              pdf.save('two-by-four.pdf')
                        // console.log(pdf)
                        // var iframe = document.createElement('iframe');
                        // iframe.setAttribute('style','position:absolute;right:0; top:0; bottom:0; height:100%; width:500px');
                        // document.body.appendChild(iframe);
                        // iframe.src = pdf.output('datauristring');
                    }
              }
        );

          console.log(this.$refs.table)
          // doPrint(this.$refs.table.$el.innerHTML)
          // window.print()
        }else{
          const excel = await import('@/vendor/Export2Excel')
          // console.log(data,'data')
          // console.log(header,'header')
          // console.log(formatJson(header.map(field=>field.name),data),'formatJson')
          excel.export_json_to_excel({
              header:  header.map(field=>field.showname),
              data:this._export_kv?[data.map(item=>item._name)]:formatJson(header.map(field=>field.name),data),
              filename: (this.$route.meta && this.$route.meta.title)||'导出文件',
              bookType: type
          })
        }
        
        loading.close();
      }
      this.$alert(
        <el-button-group>
          <el-button type="primary" icon="el-icon-share" onClick={()=>{export_file('xlsx')}}>XLSX</el-button>
          <el-button type="primary" icon="el-icon-document" onClick={()=>{export_file('txt')}}>TXT</el-button>
          <el-button type="primary" icon="el-icon-document" onClick={()=>{export_file('csv')}}>CSV</el-button>
        </el-button-group>
        , '选择导出格式', {
        showConfirmButton:false,
        center:true
      });
      return false
    },
    async handleImportChange(ev){
      const files = ev.target.files;
      if (!files) return;
      var form = new FormData();
      form.append('the_file',files[0])
      this.importLoading = true
      MessageBox.close()
      MessageBox.alert(
          <div v-loading={true}><br /></div>, '导入中', {
          showConfirmButton:false,
          center:true
      });
      try {
        // await new Promise(resolve=>setTimeout(resolve,3000))
        await request.post(this.importUploadUrl,form)
        this.fetchTableData()
        this.$message({
          message: '导入成功',
          type: 'success'
        });
      } catch (error) {
        
      }finally{
        this.importLoading = false
        MessageBox.close()
        this.$nextTick(()=>{
          this.$refs.importInput.value = null
          ev.target.value = null
          this.fetchTableData()
        })
      }
      
    },
    import(){
      let {
        handleImportChange,
      } = this
      MessageBox.alert(
          <el-button-group class="table-import-upload" ref="import">
            <el-button type="primary" onClick={()=>{}}>选择文件</el-button>
            <input type="file" ref="input" class="input" on-change={handleImportChange} ref="importInput"></input>
          </el-button-group>
          , '选择文件导入', {
          showConfirmButton:false,
          center:true
        });
    },
    // tree table.......---------------------
    table_tree_showRow: function(row) {
      const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent._show
        : true;
      row.row._show = show;
      this.$nextTick(()=>{
        if(this.$refs.elTable){
          this.$refs.elTable.doLayout()
        }
      })
      return show
        ? "animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;"
        : "display:none;";
    },
    table_tree_showAll(){
       (function f(data) {
          data.forEach((row,i) => {
            if (row.subs && row.subs.length) {
              row._expanded = true
              f(row.subs);
            }
          });
        })(this.table_data);
    },
    // 切换下级是否展开
    table_tree_toggleExpanded: function(trIndex) {
      const record = this.table_tree_formatData[trIndex];
      record._expanded = !record._expanded;
    },
    // 图标显示
    table_tree_iconShow(index, record) {
      return index === 0 && record.subs && record.subs.length > 0;
    }
  }
}
