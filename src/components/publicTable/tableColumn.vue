<script>
export default {
    props:['row','column'],
    methods:{
        menutype(){
            if(this.row.menutype===1){
                return  <el-tag size="mini">目录</el-tag>
            }else{
                return  <el-tag type="success" size="mini">菜单</el-tag>
            }
        },
        estate(){
            if(this.row.estate===1){
                return  <span >启用</span>
            }else{
                return <span class="text-danger">禁用</span>
            }
        },
        icon(){

            return <i class={this.row[this.column.name]}></i>
        }
    },
    render(){
        if(this[this.column.name]){
            return this[this.column.name]()
        }
        return <div>{this.row[this.column.name]}</div>
    }
}
</script>
