<template>
<div>
    <el-row class="h-full">
         <el-col :span="4" class="h-full">
            <div style="padding:20px">
                <div class="side-header">
                    <el-input placeholder="快速查找" v-model="filterText" class="input">
                    <i slot="suffix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                    <span class="icon iconfont icon-tianjia addIcon" @click="addCustom"></span>
                </div>

                <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
                    <el-tree
                        class="tree none"
                        :data="data2"
                        :props="{children: 'subs', label: 'groupName' }"
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
                                <span class="icon iconfont icon-wenjian"></span>
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
        </el-col>
        <el-col :span="20" style="border-left:1px solid rgb(232, 232, 232)">
            <intellTeamTable :id="id" :changes="changes"/>
        </el-col>
    </el-row>

    <el-dialog
        :title="dialogStatus==='insert'?'添加':'编辑'"
        :visible.sync="dialogFormVisible"
        class="public-dialog"
        v-el-drag-dialog
        >
        <!-- width:700px; -->
        <div style="margin:30px auto;">
            <el-form ref="form" :model="form" label-width="100px" :rules="rules">
                <el-row >
                    <el-col :span="16" :offset="3">
                        <form-render :type="`input`" prop="groupName" :field="{name:'班组名称'}" v-model="form.groupName" />
                    </el-col> 
                    <el-col :span="16" :offset="3">
                        <form-render :type="`input`" :field="{name:'班组说明'}" v-model="form.groupDesc" />
                    </el-col> 
                    <el-col :span="16" :offset="3">
                        <form-render :type="`departMultiple`" prop="depart_id" :field="{name:'使用部门',defaultName:form.depart_info}" v-model="form.depart_id" />
                    </el-col> 
                    <el-col :span="16" :offset="3">
                        <form-render :type="`select`" multiple prop="classes_id" :field="{name:'班次',options:classData}" v-model="form.classes_id" filterable/>
                    </el-col> 
                </el-row>
            </el-form>
        </div>

        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleFormSubmit" :disabled="disabeld">确 定</el-button>
        </div>
    </el-dialog>
</div>
    
</template>
<script>
import table_mixin from "@c/Table/table_mixin";
import { getTabs } from '@/api/common'
import intellTeamTable from './intellTeamTable'
import * as api_common from "@/api/common";
const api_resource = api_common.resource("attendance/intelligentteam/list");
export default {
    mixins: [table_mixin],
    components:{
        intellTeamTable
    },
     watch:{
        filterText(val) {
            this.$refs.tree2.filter(val);
        },
    },
    data(){
        const defaultForm  = function(){
            return {
                groupName:'',
                depart_id:'',
                classes_id:'',
                depart_info:[]
            }
        }
        return {
            api_resource,
            id:'',
            data2:[],
            filterText:'',
            dialogFormVisible: false,
            form:{},
            defaultForm,
            classData:[],
            rules:{
                classes_id:[
                    { required: true, message: '请输入', trigger: ['blur','change']},
                ],
                depart_id:[
                    { required: true, message: '请选择', trigger: ['blur','change']},
                ],
                groupName:[
                    { required: true, message: '请选择', trigger: ['blur','change']},
                ],
            },
            changes:false
        }
    },
    computed:{
        disabeld(){
            if(this.form.groupName==''||this.form.depart_id==''||this.form.classes_id==''){
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
            this.id = val.id
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.groupName && data.groupName.indexOf(value) !== -1;
        },
        async getClass(){
            this.classData = (await this.$request.get('/attendance/intelligentteam/classeslist')).map(o=>{return {label:o.className,value:o.id}})
        },
        addCustom(){
            this.getClass()
            this.dialogStatus='insert'
            this.form = this.defaultForm()
            this.dialogFormVisible = true
			this.$nextTick(()=>{
				this.$refs['form'].clearValidate()
			})
        },
        async editCustom(data){
            this.dialogStatus = 'inse'
            this.getClass()
            this.dialogFormVisible = true;
            this.form = (await api_resource.find(data.id))[0]
        },
        async deleteCustom(data){
            this.$confirm('此操作将删除选中行, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                return this.$request.delete('attendance/intelligentteam/list/'+data.id);
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
            form.classes_id = this.form.classes_id.join(',')
            if(this.dialogStatus=='insert'){
                delete form.depart_info
                let mess = await api_resource.create(form)
                this.$message.success('创建成功');
                this.changes = true
                this.fetch()
            }else{
                try{
                    await api_resource.update(form.id,form)
                    this.changes = true
                    this.fetch()
                }catch(err){
                    console.log(err)
                }
            }
            this.dialogFormVisible = false
        },
        async fetch(){
            this.data2 = await this.$request.get('attendance/intelligentteam/list');
            let defaultId = this.data2[0].id
            this.id = defaultId
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
<style lang="scss">
    
.theme-0BB2D4 .none .el-tree-node__expand-icon.is-leaf{
    display: none!important;
}
</style>
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
    padding: 0 3px;
}
.flexSpace:hover .icon-lajitong,.flexSpace:hover .icon-bianji,.flexSpace:active .icon-lajitong,.flexSpace:active .icon-bianji{
    color: #CCD5DB
}
.theme-0BB2D4 .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content .icon-lajitong,
.theme-0BB2D4 .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content .icon-bianji{
    color: #CCD5DB
}
.addIcon{
    border: 1px solid #E4EAEC;
    padding: 1px 10px;border-radius:4px;
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
// .el-col{
//     border-left: 1px solid #e8e8e8
// }
</style>

