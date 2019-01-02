
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
      table_field: [],
      table_actions: [],
      table_data: [],
      table_loading: true,
      table_selectedRows: [],
      table_selectedRowsInfo: [],
      dialogStatus: 'insert',
      table_modal: false,
      dialogFormVisible: false,
      table_queryFormVisible: false
    }
  },
  computed: {
    isInsert() {
      return this.dialogStatus === 'insert'
    }
  },
  methods: {
    query() {
      this.$refs.table.table_queryFormVisible = true
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
      this.table_selectedRows = val.map(item => item.id)
    },
    toggleModal() {
      // this.table_modal = !this.table_modal
      this.$refs.table.toggleModal()
    },
    async delete() {
      let rows = this.table_selectedRows
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
