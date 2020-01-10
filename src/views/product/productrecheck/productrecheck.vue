<template>
<div>
    <el-row class="h-full public-table-container">
        <el-col :span="4" class=" h-full">
            <div class="h-full" id="srceenFull">
                <div style="padding:20px" class="h-full">
                    <div class="side-header">
                        <el-input placeholder="快速查找" v-model="filterText" class="input">
                        <i slot="suffix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                        <span class="icon iconfont icon-tianjia addIcon" @click="addCustom"></span>
                    </div>
                    <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll" :style="{height:screenHeight}">
                        <el-tree
                            class="tree"
                            :data="data2"
                            :props="{children: 'subs', label: 'name' }"
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

                                <div>
                                    <span v-if="data.id==0" class="icon iconfont icon-wenjian"></span>
                                    <span v-else class="icon iconfont icon-geren"></span>
                                    &nbsp;
                                    <span>{{ node.label }}</span>
                                </div>
                                <div v-if="data.id!=0">
                                    <span class="icon iconfont icon-lajitong" @click="deleteCustom(data)"></span>
                                    <span class="icon iconfont icon-bianji ml15" @click="editCustom(data)"></span>
                                </div>
                            </div>
                        </el-tree>
                    </el-scrollbar>
                </div>
            </div>
        </el-col>
        <el-col :span="20">
            <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
                <el-tab-pane :label="item.name" :name="item.name" lazy v-for="item in menu" :key="item.id"></el-tab-pane>
            </el-tabs>
            <div v-if="view_activeName==='产品信息登记'">
                <productInfo :proid="proid" :changes="changes"/>
            </div>
            <div v-if="view_activeName==='扫码记录'">
                <scanRecord :proid="proid"/>
            </div>
        </el-col>
    </el-row>
    <el-dialog
      :title="dialogStatus==='insert'?'添加客户':'编辑客户'"
      :visible.sync="dialogFormVisible"
      class="public-dialog"
      v-el-drag-dialog
        >
        <!-- width:700px; -->
      <div style="margin:30px auto;">
        <el-form ref="form" :model="form" label-width="100px" :rules="rules">
          <el-row :gutter="20">
             <el-col :span="24">
              <form-render :type="`input`" prop="name" :field="{name:'客户名称'}" v-model="form.name" />
            </el-col> 
          </el-row>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleFormSubmit" :disabled="form.name==''">确 定</el-button>
      </div>
    </el-dialog>
</div>
    
</template>
<script>
import table_mixin from "@c/Table/table_mixin";
import { getTabs } from '@/api/common'
import productInfo from './productInfo'
import scanRecord from './scanRecord'
import * as api_common from "@/api/common";
const api_resource = api_common.resource("productrecheck/customer");
import org from '@/views/public/org'
export default {
    mixins: [table_mixin],
    components:{
        productInfo,
        scanRecord,
        org
    },
     watch:{
        filterText(val) {
            this.$refs.tree2.filter(val);
        },
    },
    computed:{
        disable(){
            if(this.form.name!=''){
                return false
            }
            return true
        },
        disabeld(){
            if(this.form.customer==''||this.form.productCode==''||this.form.quickMarkLen==''||this.form.fixPrefix==''){
                return true
            }else{
                return false
            }
        }
    },
    data(){
        return {
            dialogStatus:'insert',
            view_activeName:'',
            menu:[],
            proid:0,
            changes:false,
            activeName:'first',
            data2:[],
            filterText:'',
            name:'',
            api_resource,
            dialogFormVisible:false,
            dialogForm1Visible:false,
            view_activeName:'',
            menu:[],
            screenHeight:document.documentElement.clientHeight,
            form:{
                name:''
            },
            rules:{
                name:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
            },
        }
    },
    watch: {
        'screenHeight': function (val) { // 监听屏幕高度变化
            var oIframe = document.getElementById('srceenFull')
            oIframe.style.height = (Number(val) - 40) + 'px'
        }
    },
    mounted () {
        var _this = this
        window.onresize = function () { // 定义窗口大小变更通知事件
            _this.screenHeight = document.body.clientHeight-170+'px'// 窗口高度
        }
    },
    methods:{
        handleClick(val){
            
        },
        handleChangeNode(val){
            this.proid = val.id
            this.name = val.name
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name && data.name.indexOf(value) !== -1;
        },
        addCustom(){
            this.dialogStatus='insert'
            this.form.name = ''
            this.dialogFormVisible = true
        },
        async editCustom(data){
            this.dialogStatus = 'inse'
            this.dialogFormVisible = true;
            this.form = await this.$request.get('/productrecheck/customer/'+data.id)
        },
        async deleteCustom(data){
            await this.$request.delete('/productrecheck/customer/'+data.id)
            this.$message.success('删除成功');
            this.data2 = await this.$request.get('productrecheck/customer');
        },
        async handleFormSubmit(){
            if(this.dialogStatus=='insert'){
                let mess = await api_resource.create(this.form)
                if(mess.name!=this.form.name){
                    this.$message.error(mess.name[0]);
                }else{
                    this.$message.success('创建成功');
                } 
            }else{
                await this.$request.put('/productrecheck/customer/'+this.form.id,{name:this.form.name})
                
                this.changes = true
            }
            this.dialogFormVisible = false
            this.data2 = await this.$request.get('productrecheck/customer');
        },
    },
    
    async created(){
        const { menu } = await getTabs(this.$route.query.menuid)
        this.menu = menu
        this.view_activeName = menu[0].name;
        this.data2 = await this.$request.get('productrecheck/customer');
        this.proid = this.data2[0].id
        this.screenHeight = document.body.clientHeight-170+'px'
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
</style>

<style lang="scss" scoped>
.side-header,.flexSpace{
    display: flex;
    justify-content:space-between;
    align-items: center;
}
.flexSpace{
    width: 100%;
}
.flexSpace:hover .icon-lajitong,.flexSpace:hover .icon-bianji,.flexSpace:active .icon-lajitong,.flexSpace:active .icon-bianji{
    color: #CCD5DB
}
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content .icon-lajitong,
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content .icon-bianji{
    color: #CCD5DB
}
.addIcon{
    border: 1px solid #E4EAEC;
    padding: 0 10px;border-radius:4px;
    margin-left: 10px;
}
.el-icon-caret-right{
    display: none
}
.icon-bianji,.icon-lajitong{
    font-size: 14px;
    color: transparent
    // color: #CCD5DB
}
.ml15{
    margin-left: 15px;
}
.el-col{
    border-left: 1px solid #e8e8e8
}
</style>

