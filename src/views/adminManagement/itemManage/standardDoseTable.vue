<template>
    <ui-table ref="table" 
        :table_column="table_field" 
        :table_query.sync="table_form.query"
        @query="querySubmit"
        >
        <el-dialog
            :title="dialogStatus==='insert'?'添加标准用量':'编辑标准用量'"
            :visible.sync="dialogFormVisible"
            class="public-dialog"
            v-el-drag-dialog
		    width="800px"
            >
           	<div>
                <el-form ref="form" :model="form" label-width="70px" :rules="rules">
                    <el-row :gutter="20">
                        <el-col :span="16" :offset="4">
                            <form-render :type="`input`" :field="{name:'部门'}" v-model="name" :disabled="true"/>
                        </el-col>
                        <el-col :span="16" :offset="4">
                            <el-form-item label="月份" prop="month">
                                <el-date-picker
                                    :disabled="!isInsert"
                                    v-model="form.month"
                                    type="month"
                                    style="width:100%"
                                    format="yyyy-MM"
                                    value-format="yyyy-MM"
                                    placeholder="选择月份">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="16" :offset="4">
                            <el-form-item label="物料编码" prop="articleId">
                                <el-select v-model="form.articleId" placeholder="请搜索或选择" filterable style="width:100%"
                                    :disabled="!isInsert">
                                    <el-option
                                        v-for="item in typeList"
                                        :key="item.articleId"
                                        :label="'['+item.materialCode+']'+' '+item.title+' '+item.size"
                                        :value="item.articleId">
                                        <span >[{{item.materialCode}}]&nbsp;{{item.title}} {{item.size}}</span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="16" :offset="4">
                            <form-render :type="`input`" prop="dose" :field="{name:'标准用量'}" v-model="form.dose"/>
                        </el-col>
                        <el-col :span="16" :offset="4">
                            <form-render :type="`textarea`" prop="formulaMethod" autosize :rows='1'  :field="{name:'计算方式'}"  placeholder="请输入" v-model="form.formulaMethod"/>
                        </el-col>
                        <el-col :span="16" :offset="4">
                            <form-render :type="`input`" prop="quota" :field="{name:'配额/人'}" v-model="form.quota"/>
                        </el-col>
                        <el-col :span="16" :offset="4">
                            <form-render :type="`input`" prop="needNumber" :field="{name:'需要人数'}" v-model="form.needNumber"/>
                        </el-col>
                        <el-col :span="16" :offset="4">
                            <form-render :type="`input`" prop="purchaseReason" :field="{name:'请购原因'}" v-model="form.purchaseReason"/>
                        </el-col>
                    </el-row>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
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
                <dateLap v-model="table_form.dateLap" @change="fetch"/>
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
import dayjs from 'dayjs'
const api_resource = api_common.resource("toolstationery/standarddose");
let baseUrl = process.env.VUE_APP_STATIC
const download = require('downloadjs')
export default {
    mixins: [table_mixin],
    props:['orgid','name'],
    data() {
        var checkNumber = (rule, value, callback)=>{
			if (value==='') {
				return callback(new Error('请输入'));
			}else if (!(/^[0-9]\d*$/.test(value))) {
				callback(new Error('请输入正整数'));
			}else{
				callback();
			}
		}
        var checkNumber1 = (rule, value, callback)=>{
			if (value==='') {
				return callback(new Error('请输入'));
			}else if (!(/^\d+(\.\d{1,2})?$/.test(value))) {
                callback(new Error('请输入精度为2位小数以内的正数'));
			}else{
				callback();
			}
		}
        return {
            baseUrl,
            loading: false,
            api_resource,
            queryDialogFormVisible:true,
            table_topHeight:235,
            dialogFormVisible:false,
            form:{},
            form1:{
                take_number:''
            },
            rules:{
                articleId:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                dose:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
                quota:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                    { validator: checkNumber1, trigger: 'blur' }
                ],
                needNumber:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
                month:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                formulaMethod:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                purchaseReason:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
            },
            template:{
                image(row,column){
                    if(column.image!=''&&column.image!=undefined){
                        return <img src={baseUrl+column.image} width="30" height="30"></img>
                    }
                }
            },
            typeList:[],
            titleList:[],
            sizeList:[],
            importUploadUrl:'/toolstationery/standarddose/upload',
            downloadUrl:'/toolstationery/standarddose/upload',
        };
    },
    watch:{
        orgid(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
    },
    methods: {
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
        async getType(){
            this.typeList = await this.$request.get('toolstationery/standarddose/materiallist?department_id='+this.orgid);
        },
        async add(){
            await this.$request.get('toolstationery/standarddose/checkorg?org_id='+this.orgid)
            this.getType()
            this.form = {
                type_id:''
            }
			this.$nextTick(()=>{
				this.$refs['form'].clearValidate()
			})
            this.dialogFormVisible = true
        },
        async edit(){
            let row = this.table_selectedRows[0];
            this.form = (await api_resource.find(row.id))[0]
            this.getType()
            this.dialogFormVisible = true
            this.name = this.form.department__name
        },
        async handleFormSubmit(){
            await this.form_validate()
            this.form.org_id = this.orgid
            let form = Object.assign({},this.form)
            if(this.dialogStatus=='insert'){
                let mess = await api_resource.create(form)
                this.$message.success(mess);
                this.fetch()
                this.dialogFormVisible = false
            }else{
                await api_resource.update(form.id,form)
                this.fetch()
                this.dialogFormVisible = false
            }
        },
        async fetchTableData() {
            if(this.orgid==''){
                return 
            }
            this.table_loading = true;
            this.table_form.orgid  = this.orgid
            const {rows , total }= await api_resource.get(this.table_form);
            this.table_data  = rows
            this.table_form.total = total
            setTimeout(() => {
                this.table_loading = false;
            }, 300);
        },
    },
    async created() {
        const { field, action,table } = await api_common.menuInit("toolstationery/standarddose");
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table
		this.table_form.dateLap = dayjs().format('YYYY-MM') 
        this.fetchTableData();
    },
};
</script>
<style lang="scss" scoped>
    .scroll {
        height: calc(100%);
        width: 100%;

        /deep/ .scrollbar-wrapper {
            overflow-x: hidden;
        }
    }
</style>