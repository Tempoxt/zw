<script>
export default {
    props:['row','column'],
    methods:{
        'isblank'(){
             return <span>{this.row.isblank?'是':'否'}</span>
        },
        'isvisiable'(){
             return <span>{this.row.isvisiable?'是':'否'}</span>
        },
        'iseditable'(){
             return <span>{this.row.iseditable?'是':'否'}</span>
        },
        'selectable'(){
            return <span>{['否','单选','多选'][this.row.selectable]}</span>
        },
        'menutype'(){
            if(this.row.menutype===1){
                return  <el-tag size="mini">目录</el-tag>
            }else if(this.row.menutype===2){
                return  <el-tag type="success" size="mini">菜单</el-tag>
            }else{
                return  <el-tag type="info" size="mini">页签</el-tag>
            }
        },
        'estate'(){
            if(this.row.estate===1){
                return  <span >启用</span>
            }else{
                return <span class="text-danger">禁用</span>
            }
        },
        'icon'(){
            return <i class={this.row[this.column.name]}></i>
        }
    },
    render(){
        if(this[this.column.name]){
            return this[this.column.name]()
        }
        return <div domPropsInnerHTML={this.row[this.column.name]}></div>
    }
}
</script>
