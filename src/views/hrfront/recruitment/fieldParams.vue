<template>
    <div id="backgroundCheck">
        <ui-table ref="table" 
            :table_column="table_field" 
            :table_query.sync="table_form.query"
            @query="querySubmit"
            >

            <el-dialog
                title="添加"
                :visible.sync="dialogFormVisible"
                class="public-dialog"
                v-el-drag-dialog
                >
                <div>
                    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
                        <div class="line-boxs">
                            <el-row :gutter="40">
                                <el-col :span="17" :offset="2">
                                    <form-render :type="`input`" prop="fieldname" :field="{name:'字段名'}" v-model="form.fieldname"/>
                                </el-col>
                                <el-col :span="17" :offset="2">
                                    <form-render prop="showname" :type="`input`" :field="{name:'显示名'}" v-model="form.showname"/>
                                </el-col>
                                <el-col :span="17" :offset="2">
                                    <form-render :type="`input`" prop="fieldtype" :field="{name:'字段类型'}" v-model="form.fieldtype"/>
                                </el-col>
                                <el-col :span="17" :offset="2">
                                    <form-render
                                        prop="value"
                                        :type="`select`"
                                        :field="{name:'页面标记',options:jobtitles}"
                                        v-model="form.value"
                                    />
                                </el-col>
                                <el-col :span="17" :offset="2">
                                    <form-render
                                        prop="isshow"
                                        :type="`radio`"
                                        :field="{name:'是否显示',options:[{
                                            value: 1,
                                            label: '显示'
                                        },{
                                            value: 0,
                                            label: '隐藏'
                                        }]}"
                                        v-model="form.isshow"
                                    />
                                </el-col>
                                <el-col :span="17" :offset="2">
                                    <form-render 
                                        prop="isrequired"
                                        :type="`radio`"
                                        :disabled="isreDisable"
                                        :field="{name:'是否必填',options:[{
                                            value: 1,
                                            label: '必填'
                                        },{
                                            value: 0,
                                            label: '非必填'
                                        }]}"
                                        v-model="form.isrequired"
                                    />
                                </el-col>
                                <el-col :span="17" :offset="2">
                                    <form-render :type="`number`" prop="sort" :field="{name:'显示排序'}" v-model="form.sort" />
                                </el-col>
                            </el-row>
                        </div>
                    </el-form>
                </div>

                <div slot="footer" class="dialog-footer">
                    <div>
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
                    </div>
                </div>
            </el-dialog>

            <el-dialog
                title="批量编辑"
                :visible.sync="dialogForm1Visible"
                class="public-dialog"
                v-el-drag-dialog
                width="800px"
                >
                <div class="h-full">
                    <el-form ref="form1" label-width="100px" class="h-full batchEdit" style="height:630px;margin:0 10px;">
                        <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll"> 
                            <div class="line-boxs">
                                <el-row :gutter="40" v-for="item in form1" :key="item.id">
                                    <div class="itemField">
                                        <el-col :span="3"><div class="itemName">{{item.showname}}</div></el-col>
                                        <el-col :span="10">
                                            <form-render
                                                prop="isshow"
                                                :type="`radio`"
                                                :field="{name:'是否显示',options:[{
                                                    value: 1,
                                                    label: '显示'
                                                },{
                                                    value: 0,
                                                    label: '隐藏'
                                                }]}"
                                                v-model="item.isshow"
                                            />
                                        </el-col>
                                        <el-col :span="1">
                                            <div style="color:#E4E4E4">|</div>
                                        </el-col>
                                        <el-col :span="10">
                                            <form-render 
                                                prop="isrequired"
                                                :type="`radio`"
                                                :disabled="isreDisable"
                                                :field="{name:'是否必填',options:[{
                                                    value: 1,
                                                    label: '必填'
                                                },{
                                                    value: 0,
                                                    label: '非必填'
                                                }]}"
                                                v-model="item.isrequired"
                                            />
                                        </el-col>
                                    </div>
                                </el-row>
                            </div>
                        </el-scrollbar>
                    </el-form>
                </div>

                <div slot="footer" class="dialog-footer">
                    <div>
                        <el-button @click="dialogForm1Visible = false">取 消</el-button>
                        <el-button type="primary" @click="handleForm1Submit">确 定</el-button>
                    </div>
                </div>
            </el-dialog>
            <table-header
                :table_actions="table_actions"
                :table_selectedRows="table_selectedRows"
                @action="handleAction"
                :table_form.sync="table_form"
                :table_column="table_field"
            >
                <div style="padding-left:10px">
                    <el-select v-model="table_form.value" @change="fetch" placeholder="请选择">
                        <el-option
                            v-for="item in jobtitlesData"
                            :key="item.id"
                            :label="item.title"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </table-header>
            <el-table
                ref="elTable"
                @selection-change="handleChangeSelection"
                :data="table_data"
                border
                style="width: 100%"
                v-loading="table_loading"
                :header-cell-style="headerCellStyle"
                :height="table_height"
                @header-dragend="table_dragend"
                @sort-change="table_sort_change"
                >
                <el-table-column 
                    type="selection" 
                    width="60" 
                    class-name="table-column-disabled"
                    :selectable="table_disable_selected"
                    >
                </el-table-column>
                <each-table-column :table_field="table_field" :template="template"/>
            </el-table>
            <table-pagination 
                :total="table_form.total" 
                :pagesize.sync="table_form.pagesize"
                :currentpage.sync="table_form.currentpage"
                @change="fetchTableData"
                :table_config="table_config"
            />
        </ui-table>
    </div>
</template>

<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
import dayjs from 'dayjs'
const  api_resource = api_common.resource("pagemanager/field/params")

export default {
    mixins: [table_mixin],
    name: 'applyResume',
    data() {
        const defaultForm  = function(){
            return {
                sort: 0,
            }
        }
        return {
            defaultForm,
            table_loading: false,
            table_topHeight: 230,
            dialogFormVisible: false,
            dialogForm1Visible: false,
            form: {},
            form1: [],
			rules:{
				fieldname:[
					{ required: true, message: '请输入', trigger:  ['blur', 'change'] },
				],
				showname:[
					{ required: true, message: '请输入', trigger:  ['blur', 'change'] },
				],
				fieldtype:[
					{ required: true, message: '请输入', trigger:  ['blur', 'change'] },
				],
				value:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
				],
				isshow:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
				],
				isrequired:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
				],
				sort:[
					{ required: true, message: '请输入', trigger:  ['blur', 'change'] },
				],
            },
            template:{},
            jobtitlesData:[],
            jobtitles: [],
            isreDisable: false,
        }
    },
    watch:{
        'form.isshow'(){
            if(this.form.isshow==0){
                this.form.isrequired = 0
                this.isreDisable = true
            }else{
                this.isreDisable = false
            }
        },
    },
    methods: {
        async getSelectOption(){
            this.jobtitlesData =  await this.$request.get('/hrm/jobtype?tag=RecruitmentType')
            this.jobtitles = this.jobtitlesData.map(o=>{return {label:o.title,value:o.value}})
            this.table_form.value = 'society'
            this.fetchTableData();
        },
        fetch(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
        add(){
            this.dialogFormVisible = true
            this.form = this.defaultForm()
        },
        BatchEdit(){ // 批量修改
            this.dialogForm1Visible = true
            this.form1 = this.table_data
        },
        async handleFormSubmit(){
            await this.form_validate()
            let form = Object.assign({},this.form)
            await this.$request.post('pagemanager/field/params',form)
            this.dialogFormVisible = false
            this.fetchTableData()
        },
        async handleForm1Submit(){
            let data = JSON.stringify(this.form1)
            await this.$request.put('pagemanager/field/params',{data:data})
            this.dialogForm1Visible = false
            this.fetchTableData()
        },
        async fetchTableData() {
			this.table_loading = true;
            this.table_form.flag = this.flag
			const {rows , total }= await api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
                this.table_loading = false;
                this.$refs.elTable.doLayout()
            }, 300);
        },
    },
    async created() {
        const { field, action,table } = await api_common.menuInit("pagemanager/field/params");
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table
        this.getSelectOption()
    }
}
</script>

<style lang="scss">
.batchEdit{
    .el-row{
        border-bottom: 1px solid #f5f5f5;
    }
    .itemField{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .itemName{
            font-size: 12px;
            width: 125px;
        }
        .el-form-item{
            height: 14px!important;
        }
        .el-form-item__label,.el-form-item__content{
            line-height: 53px;
        }
    }
}
</style>
<style lang="scss" scoped>

.scroll {
  height: calc(100%);
  width: 100%;

 /deep/ .scrollbar-wrapper {
    overflow-x: hidden;
  }
}
</style>