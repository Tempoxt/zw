import publicTreeTable from '@c/publicTable/publicTreeTable'
import FormRender from '@c/Form/render'
import * as api_common from "@/api/common";
const api_pagemanager = api_common.resource('pagemanager/field')
export default {
    computed: {
        isInsert() {
          return this.dialogStatus === 'insert'
        },
    },
    components:{
        publicTreeTable,
        FormRender,
    },
    data(){
        return {
            dialogStatus: 'insert',
            dialogFormVisible:false,
            table_selectedRows:[],
            table_queryFormVisible: false,
        }
    },
    
    methods:{
        fetchTableData(){
            this.$refs.table.fetchTableData()
        },
        table_dragend(newWidth, oldWidth, column, event,b){
            let row = this.table_field.find(field=>field.showname===column.label)
            row.width = newWidth
            row.menuid = row.menuid_id
            api_pagemanager.update(row.id,row,{
              alert:false
            })
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
        },
        handleAction(action){
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
          async audit(){
            this.multipleAction('check','审核成功')
          },
          async away(){
            this.multipleAction('forbid','办离成功')
          },
        query() {
            this.$refs.table.query()
        },
        add(){
            this.dialogFormVisible = true
        }
    }
}