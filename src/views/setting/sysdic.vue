<template>
   <el-row class="h-full">
    <el-col :span="5" class="h-full">

         <el-dialog
            :title="dialogStatus==='insert'?'添加':'编辑'"
            :visible.sync="dialogFormVisible"
            class="public-dialog"
            v-el-drag-dialog
            width="500px"
            >
            <div>
                <el-form ref="form" :model="form" label-width="80px" label-position="left" >
                     <el-row :gutter="40">
                                 <el-col :span="24">
                                  <form-render :type="`input`" :field="{name:'标识'}" v-model="form.tag" />
                                </el-col>
                                <el-col :span="24">
                                    <form-render
                                        :type="`input`"
                                        :field="{name:'条目名称'}"
                                        v-model="form.title"
                                    /> 
                                </el-col>
                                
                        </el-row>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
            </div>
            </el-dialog>


      <div class="page-side h-full">
          
        <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
        <div>
          <div class="side-header">
            <el-input placeholder="快速查找" v-model="filterText" class="input">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-button icon="el-icon-plus" circle @click="add"></el-button>
          </div>
          <el-tree
            class="tree"
            :data="data2"
            :props="{children: 'subs', label: 'title' }"
            default-expand-all
            node-key="id"
            :filter-node-method="filterNode"
            ref="tree2"
            :highlight-current="true"
            :check-on-click-node="false"
            @node-click="handleChangeNode"
            :expand-on-click-node="false"
          >
            <div slot-scope="{ node, data }" class="flexSpace">
              <div >
                  <span class="icon iconfont icon-zonggongsi"></span>
                    &nbsp;
                <span>{{ node.label||data.title }} <span v-if="data.tag"> ({{data.tag}})</span></span>
            
              </div>
              <div class="actions">
                <span class="icon iconfont icon-lajitong" @click="del(data)"></span> &nbsp;
                <span class="icon iconfont icon-bianji" @click="edit(data)"></span>
              </div>
             
            </div>
          </el-tree>
         
        </div>
         </el-scrollbar>
      </div>

    </el-col>
    <el-col :span="19">
        <sysdicTable  :id="current_id"/>
    </el-col>
  </el-row>
</template>
<script>
import * as api_common from "@/api/common";
const api_resource = api_common.resource('basicdata/main')
import sysdicTable from './sysdicTable'
import table_mixin from "@c/Table/table_mixin";
export default {
    provide () {
      return {
        $side:this
      }
    },
    mixins:[table_mixin],
    components:{
       sysdicTable
    },
    watch:{
      tabActive(val){
        
      },
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    data(){
        return {
            form:{},
            dialogFormVisible:false,
            dialogStatus:'insert',
            filterText:'',
            data2:[],
            currentMenuid:0,
            current_id:'',
            current_type:'start',
            current_data:{}
        }
    },
    methods:{
        add(data){
            this.dialogFormVisible = true
        },
        async del({id}){
             this.$confirm('此操作将删除选中行, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
            return api_resource.remove(id)
            })
            .then(() => {
                    this.getTree()
                this.fetchTableData({target:'delete'})
            })
        },
        async edit({id}){
            this.dialogStatus = 'update'
            this.form = await api_resource.find(id)
            this.dialogFormVisible = true;
        },
      filterNode(value, data) {
        if (!value) return true;
        return data.title && data.title.indexOf(value) !== -1;
      },
      async handleFormSubmit(){
        if(this.isInsert){
            await api_resource.create(this.form)
        }else{
            await api_resource.update(this.form.id,this.form)
        }
         this.getTree()
         this.dialogFormVisible = false
      },
      async handleChangeNode(data,node){

          const { id } = data
          this.current_id = id
          this.current_data = data
          
      },
      async getTree(){
          this.data2 =  await api_common.resource('basicdata/main').get();
          this.$nextTick(()=>{
            this.$refs.tree2.setCurrentKey(this.orgid)
          })
      
      },
      

    },
    async created(){
       await  this.getTree()
        this.handleChangeNode(this.data2[0])
        this.$refs.tree2.setCurrentKey(this.data2[0].id);

    }
}
</script>
<style lang="scss" scoped>

.scroll {
  height: calc(100% - 30px);
  width: 100%;
 /deep/ .scrollbar-wrapper {
    overflow-x: hidden;
  }
}
.flexSpace{
    display: flex;
    justify-content:space-between;
    align-items: center;
    width: 100%;
}
.flexSpace:hover .icon-lajitong,.flexSpace:hover .icon-bianji,.flexSpace:active .icon-lajitong,.flexSpace:active .icon-bianji{
    color: #CCD5DB
}
.theme-0BB2D4 .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content .icon-lajitong,
.theme-0BB2D4 .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content .icon-bianji{
    color: #CCD5DB
}
.icon-bianji,.icon-lajitong{
    font-size: 14px;
    color: transparent
}
</style>

