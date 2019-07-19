export default {
    data(){
        return {
            error:''
        }
    },
    computed:{
        prop(){
            return this.$parent.$attrs.prop
        }
    },
    methods:{
        elform() {
          let parent = this.$parent;
          let parentName = parent.$options.componentName;
          while (parentName !== 'ElForm') {
            if (parentName === 'ElFormItem') {
              this.isNested = true;
            }
            parent = parent.$parent;
            parentName = parent.$options.componentName;
          }
          return parent;
        },
        changeError(error){
          this.error = error
        }
      },
      created() {
        let form = this.elform()
        form.formItem = form.formItem || []
        form.formItem.push(this)
      }
}
  