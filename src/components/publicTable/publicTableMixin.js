import publicTreeTable from '@c/publicTable/publicTreeTable'
export default {
    components:{
        publicTreeTable
    },
    data(){
        return {
            dialogStatus: 'insert',
            dialogFormVisible:false
        }
    },
    methods:{
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
        }
    }
}