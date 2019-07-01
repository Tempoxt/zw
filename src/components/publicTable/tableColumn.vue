<script>
let baseUrl = process.env.VUE_APP_STATIC
export default {
    props:['row','column','template'],
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
        'action__icon'(){
             return <i class={this.row[this.column.name]}></i>
        },
        'issort'(){
              return <span>{this.row.issort?'是':'否'}</span>
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
        'isquicksearch'(){
            return <span>{this.row.isquicksearch?'是':'否'}</span>
        },
        'issearch'(){
            return <span>{this.row.issearch?'是':'否'}</span>
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
        },
        'image'(){
            return <img src={baseUrl+this.row.image} width="50" height="50"></img>
        },
        'signState'(){
            if(this.row.signState==1){
                return  <el-tag size="mini" type="danger">未签收</el-tag>
            }else if(this.row.signState==2){
                return <el-tag size="mini" type="success">已签收</el-tag>
            }else if(this.row.signState==3){
                return <el-tag size="mini" type="success">默认签收</el-tag>
            }
        },
        'signImage'(){
            if(this.row.signImage!=''&&this.row.signImage!=null){
                return <img src={baseUrl+this.row.signImage} width="50" height="50"></img>
            }
        },
        'staff__isDimission'(){
            if(this.row.staff__isDimission=='80'){
                return <span>离职</span>
            }else{
                return <span>在职</span>
            }
        },
        'selectState'(){
            if(this.row.selectState==1){
                return <span>待分配</span>
            }else if(this.row.selectState==2){
                return <span>待入住</span>
            }else if(this.row.selectState==3){
                return <span>待审核搬离</span>
            }else if(this.row.selectState==4){
                return <span>待搬离</span>
            }
        }
    },
    render(){
        
        if(this[this.column.name]){
            return this[this.column.name](this.column,this.row)
        }
        if(this.template&&this.template[this.column.name]){
            return this.template[this.column.name].call(this,this.column,this.row)
        }
        return <span domPropsInnerHTML={this.row[this.column.name]}></span>
    }
}
</script>
