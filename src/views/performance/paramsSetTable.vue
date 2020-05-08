<template>
    <ui-table ref="table" 
        :table_column="table_field" 
        :table_query.sync="table_form.query"
        @query="querySubmit"
        >

        <el-dialog
            :title="dialogStatus==='insert'?'添加参数':'编辑参数'"
            :visible.sync="dialogFormVisible"
            class="public-dialog"
            v-el-drag-dialog
		    width="600px"
            >
           	<div>
                <el-form ref="form" :model="form" label-width="120px" :rules="rules">
                    <el-row :gutter="20">
                        <el-col :span="16" :offset="4">
                            <form-render :type="`input`" :field="{name:'参数名称'}" prop="parameter_name" v-model="form.parameter_name"/>
                        </el-col>
                        <el-col :span="16" :offset="4">
                            <form-render :type="`input`" :field="{name:'参数说明'}" v-model="form.parameter_source"/>
                        </el-col>
                        <el-col :span="16" :offset="4" v-if="this.url!='YearTargetParameter'">
                            <form-render :type="`radio`" :field="{name:'参数分类',options:[{
                                value: 0,
                                label: '基础参数'
                            },{
                                value: 1,
                                label: '计算参数'
                            }]}" v-model="form.parameter_category"/>
                        </el-col>
                        <el-col :span="16" :offset="4">
                            <form-render :type="`radio`" :field="{name:'记录状态',options:[{
                                value: 1,
                                label: '启用'
                            },{
                                value: 0,
                                label: '停用'
                            }]}" v-model="form.status"/>
                        </el-col>
                    </el-row>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer dialog-multiple-footer">
                <div>
                    <el-switch
                        v-if="isInsert"
                        v-model="form_multiple"
                        active-text="连续添加"
                        inactive-text="">
                    </el-switch>
                </div>
                <div>
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
                </div>
            </div>
        </el-dialog>

        <table-header
            :table_actions="table_actions"
            :table_selectedRows="table_selectedRows"
            @action="handleAction"
            :table_form.sync="table_form"
            :table_column="table_field"
        ></table-header>
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
            :show-summary="table_config.isShowFooter"
            :summary-method="getSummaries"
            >
            <el-table-column 
                type="selection" 
                width="60" 
                class-name="table-column-disabled"
                :selectable="table_disable_selected"
                >
            </el-table-column>
            <el-table-column type="index" :index="indexMethod"/>
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
</template>
<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
import { MessageBox } from 'element-ui';
const download = require('downloadjs')
let baseUrl = process.env.VUE_APP_STATIC
const api_resource = api_common.resource('performance/parameter/name')
export default {
    mixins: [table_mixin],
    props:['orgid','id','paramv','url'],
    data() {
        return {
            baseUrl, 
            api_resource,
            loading: false,
            queryDialogFormVisible:true,
            table_topHeight: 300,
            form:{},
            dialogFormVisible: false,
            rules:{
                parameter_name:[
                    { required: true, message: '请输入', trigger: ['blur','change'] }
                ],
            },
            template:{
                status(row,column){
                    if(column.status==1){
                        return <span>启用</span>
                    }else{
                        return <span>停用</span>
                    }
                },
                parameter_category(row,column){
                    if(column.parameter_category==1){
                        return <span>计算参数</span>
                    }else{
                        return <span>基础参数</span>
                    }
                },
            }
        };
    },
    computed:{
       
    },
    watch:{
        orgid(){
            this.fetch()
        },
		url(){
			delete this.table_form.keyword
			delete this.table_form.sortname
			this.table_form.currentpage = 1
			this.table_form.query.query= []
            this.fetchMenu()
		}
    },
    methods: {
        async add(){
            this.form_multiple = false
            await this.$request.get('performance/parameter/name/add?department='+this.id)
            this.form = {
               parameter_name: '' ,
               status: 1,
               parameter_category: 0,
            }
            this.dialogFormVisible = true
            this.$nextTick(()=>{
                this.$refs['form'].clearValidate()
            })
        },
         async handleForm2Submit(){
            await this.form_validate('form2')
            let form2 = Object.assign({},this.form2)
			await api_resource.create(form2)
			this.dialogForm2Visible = false
			this.fetch()
        },
        async edit(){
            this.dialogFormVisible = true
            let row = this.table_selectedRows[0]
            this.form = (await api_resource.find(row.id))[0]
        },
        async handleFormSubmit(){
            await this.form_validate()
            this.form.department = this.id
            this.form.parameter_classify = this.paramv
            let form = Object.assign({},this.form)
            if(this.isInsert){
                await api_resource.create(form)
            }else{
                await api_resource.update(form.id,form)
            }
            if(this.form_multiple){
                this.form = {
                    parameter_name: '' ,
                    status: 1,
                }
                this.$nextTick(()=>{
                    this.$refs['form'].clearValidate()
                })
                this.fetchTableData()
            }else{
                this.dialogFormVisible = false
                this.fetchTableData()
            }
        },
        async delete(){
            let row = this.table_selectedRows.map(row=>row.id)
            await this.$request.delete('performance/parameter/name/destroys?ids='+row.join(','))
            this.fetch()
        },
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
        async fetchTableData() {
            if(this.id==''){
                return 
            }
            this.table_loading = true;
            this.table_form.department = this.id
            this.table_form.parameter_classify = this.paramv
            const {rows , total }= await api_resource.get(this.table_form);
            this.table_data  = rows
            this.table_form.total = total
            setTimeout(() => {
                this.table_loading = false;
            }, 300);
        },
		async fetchMenu(){
			const { field, action,table } = await api_common.menuInit(this.url);
			this.table_field = field;
			this.table_actions = action;
			this.table_config = table
			this.fetchTableData()
		},
    },
    async created() {
        this.fetchMenu();
    },
};
</script>