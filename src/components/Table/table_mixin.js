
import uiTable from '@c/Table/Index.vue'
import treeTable from '@/components/TreeTable'
import FormRender from '@c/Form/render'
import tableHeader from '@c/Table/Header'
import tablePagination from '@c/Table/Pagination'
export default {
  components: {
    uiTable,
    treeTable,
    FormRender,
    tableHeader,
    tablePagination
  },
  data() {
    return {
      headerCellStyle:{background:'#F5FAFB',color:'#37474F',height:'50px'},
      table_field: [],
      table_actions: [],
      table_data: [],
      table_loading: true,
      table_selectedRows: [],
      table_selectedRowsInfo: [],
      dialogStatus: 'insert',
      table_modal: false,
      dialogFormVisible: false,
      table_queryFormVisible: false,
      table_query:{
        type:1,
        query:[]
      },
      table_form:{}
    }
  },
  computed: {
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
    }
  },
  methods: {
    table_disable_selected(row){
      return !(row.lockstate&&!this.table_actions.find(action=>action.code==='unlock'))
    },
    table_state_className({row, column, rowIndex, columnIndex}){
      return row.lockstate?'row-state-class':''
    },
    query() {
      this.$refs.table.table_queryFormVisible = true
    },
    querySubmit(query){
      this.fetchTableData()
    },
    handleAction(action) {
      if (this[action]) {
        if (action === 'add') {
          this.dialogStatus = 'insert'
          if (this.defaultForm && this.form) {
            this.form = this.defaultForm()
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
          this.fetchTableData()
        })
    }
  }
}
