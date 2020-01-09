<template>
<div>
    <el-row class="h-full public-table-container">
         <el-col :span="4" class="h-full">
            <div style="padding:20px" class="h-full">
                <div class="side-header">
                    <el-input placeholder="快速查找" v-model="filterText" class="input">
                    <i slot="suffix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                    <span class="icon iconfont icon-tianjia addIcon" @click="addCustom"></span>
                </div>

                <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
                    <el-tree
                        class="tree"
                        :data="data2"
                        :props="{children: 'subs', label: 'title' }"
                        default-expand-all
                        node-key="org_id"
                        :filter-node-method="filterNode"
                        ref="tree2"
                        :highlight-current="true"
                        :check-on-click-node="false"
                        @node-click="handleChangeNode"
                        :expand-on-click-node="false"
                        >
                        <div slot-scope="{ node, data }" class="flexSpace">

                            <div>
                                <span class="icon iconfont icon-wenjian"></span>
                                &nbsp;<span>{{ node.label }}</span>
                            </div>
                            <div v-if="data.id!=0">
                                <span class="icon iconfont icon-lajitong" @click="deleteCustom(data)"></span>
                                <span class="icon iconfont icon-bianji ml15" @click="editCustom(data)"></span>
                            </div>
                        </div>
                    </el-tree>
                </el-scrollbar>
            </div>
        </el-col>
        <el-col :span="20" style="border-left:1px solid rgb(232, 232, 232)">
            <itemListTable :org_id="org_id" :changes="changes"/>
        </el-col>
    </el-row>

    <el-dialog
        :title="dialogStatus==='insert'?'添加类别':'编辑类别'"
        :visible.sync="dialogFormVisible"
        class="public-dialog"
        v-el-drag-dialog
        >
        <div>
            <el-form ref="form" :model="form" label-width="100px" :rules="rules">
                <el-row >
                    <el-col :span="17">
                        <form-render :type="`input`" prop="title" :field="{name:'类别名称'}" v-model="form.title" />
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
        </div>
    </el-dialog>
</div>
    
</template>
<script>
import table_mixin from "@c/Table/table_mixin";
import { getTabs } from '@/api/common'
import itemListTable from './itemListTable'
import * as api_common from "@/api/common";
const api_resource = api_common.resource("toolstationery/type");
export default {
    mixins: [table_mixin],
    components:{
        itemListTable,
    },
    watch:{
        filterText(val) {
            this.$refs.tree2.filter(val);
        },
    },
    data(){
        return {
            api_resource,
            id:'',
            org_id:'',
            data2:[],
            filterText:'',
            dialogFormVisible: false,
            form:{
                title:''
            },
            classData:[],
			result:[],
            rules:{
                title:[
                    { required: true, message: '请输入', trigger: 'blur'},
                ],
            },
            changes:false
        }
    },
    computed:{
        disabeld(){
            if(this.form.title==''){
                return true
            }else{
                return false
            }
        }
    },
    methods:{
        handleClick(val){
            
        },
        handleChangeNode(val){
            this.org_id = val.org_id
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.title && data.title.indexOf(value) !== -1;
        },
        addCustom(){
            this.dialogStatus='insert'
            this.form ={}
            this.dialogFormVisible = true
			this.$nextTick(()=>{
				this.$refs['form'].clearValidate()
			})
        },
        async editCustom(data){
            this.dialogStatus = 'inse'
            this.form = (await api_resource.find(data.id))[0]
            this.dialogFormVisible = true;
        },
        async deleteCustom(data){
            this.$confirm('此操作将删除选中行, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                return this.$request.delete('toolstationery/type/'+data.id);
                this.$message.success('删除成功');
            })
            .then(() => {
                this.changes = true
                this.fetch()
            })
        },
        async handleFormSubmit(){
            await this.form_validate()
            let form = Object.assign({},this.form)
            if(this.dialogStatus=='insert'){
                let mess = await api_resource.create(form)
                this.$message.success('创建成功');
                this.changes = true
                this.fetch()
                this.dialogFormVisible = false
            }else{
                await api_resource.update(form.id,form)
                this.changes = true
                this.fetch()
                this.dialogFormVisible = false
            }
        },
        async fetch(){
            this.data2 = await this.$request.get('toolstationery/type');
            let defaultId = this.data2[0].org_id
            this.org_id = defaultId
            this.$nextTick(()=>{
                this.$refs.tree2.setCurrentKey(defaultId)
            })
        }
    },
    async created(){
        this.fetch()
    }
}
</script>
<style lang="scss" scoped>

.scroll {
  height: 100%;
  width: 100%;
  padding-bottom: 20px;
 /deep/ .scrollbar-wrapper {
    overflow-x: hidden;
  }
}
.none{
    margin-top: 15px
}
.side-header,.flexSpace{
    display: flex;
    justify-content:space-between;
    align-items: center;
}
.flexSpace{
    width: 100%;
    line-height: 33px;
}
.flexSpace:hover .icon-lajitong,.flexSpace:hover .icon-bianji,.flexSpace:active .icon-lajitong,.flexSpace:active .icon-bianji{
    color: #CCD5DB
}
.tree .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content .icon-lajitong,
.tree .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content .icon-bianji{
    color: #CCD5DB
}
.addIcon{
    border: 1px solid #E4EAEC;
    padding: 1px 10px;border-radius:4px;
    margin-left: 10px;
}
.tree .el-icon-caret-right{
    display: none
}
.tree .icon-bianji,.tree .icon-lajitong{
    font-size: 14px;
    color: transparent;
}
.ml15{
    margin-left: 15px;
}
.mr5{
    margin-right:5px;
}
</style>

