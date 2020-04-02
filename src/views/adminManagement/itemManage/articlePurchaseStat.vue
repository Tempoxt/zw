<template>
    <ui-table ref="table" 
        :table_column="table_field" 
        :table_query.sync="table_form.query"
        @query="querySubmit"
        >
        <el-dialog
            :title="dialogStatus==='insert'?'添加请购物品':'编辑请购物品'"
            :visible.sync="dialogFormVisible"
            class="public-dialog"
            v-el-drag-dialog
		    width="800px"
            >
           	<div>
                <el-form ref="form" :model="form" label-width="70px" :rules="rules">
                    <el-row :gutter="20">
                        <el-col :span="16" :offset="4">
                            <form-render :type="`input`" prop="materialCode" :field="{name:'物品编码'}" v-model="form.materialCode" :disabled="true"/>
                        </el-col>
                        <el-col :span="16" :offset="4">
                            <form-render :type="`input`" prop="articleTitle" :field="{name:'物品名称'}" v-model="form.articleTitle" :disabled="true"/>
                        </el-col>
                        <el-col :span="16" :offset="4">
                            <form-render :type="`input`" prop="articleSize" :field="{name:'规格'}" v-model="form.articleSize" :disabled="true"/>
                        </el-col>
                        <el-col :span="16" :offset="4">
                            <form-render :type="`input`" prop="articleUnit" :field="{name:'单位'}" v-model="form.articleUnit" :disabled="true"/>
                        </el-col>
                        <el-col :span="16" :offset="4">
                            <form-render :type="`input`" prop="purchaseNumber" :field="{name:'请购数量'}" v-model="form.purchaseNumber" :disabled="true"/>
                        </el-col>
                        <el-col :span="16" :offset="4">
                            <form-render :type="`textarea`" autosize :row="1" prop="remark" :field="{name:'备注'}" v-model="form.remark"/>
                        </el-col>
                    </el-row>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
            </div>
        </el-dialog>


       	<el-dialog
            title="发起请购单"
            :visible.sync="dialogForm1Visible"
            class="public-dialog"
            v-el-drag-dialog
            >
                <el-form ref="form1" :model="form1"  label-width="100px">
                    <el-row >
                        <el-col :span="16" :offset="3">
                            <el-form-item label="请购月份" prop="dateLap">
                                <el-date-picker
                                    v-model="table_form.dateLap"
                                    :clearable="false" :disabled="true"
                                    type="month"
                                    size="small"
                                    format="yyyy年MM月"
                                    value-format="yyyy-MM"
                                    placeholder="选择月份">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="16"  :offset="3">
                            <el-form-item label="附件" :required="true">
                                <el-upload
                                    class="upload-demo"
                                    ref="upload"
                                    action="www"
                                    :limit="1"
                                    :file-list="fileList"
                                    :on-change="changeFormUploadFiles"
                                    :auto-upload="false">
                                <el-button slot="trigger" size="small" type="primary">选取文件</el-button></el-upload>
                            </el-form-item>
                        </el-col>
                        <el-col :span="16" :offset="3">
                            <form-render :type="`textarea`" prop="remark" :field="{name:'备注'}" v-model="form1.remark"/>
                        </el-col>
                    </el-row>
                </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogForm1Visible = false">取 消</el-button>
                <el-button type="primary" @click="handleForm1Submit">确 定</el-button>
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
const api_resource = api_common.resource("toolstationery/purchase/stat");
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
        return {
            baseUrl,
            loading: false,
            api_resource,
            queryDialogFormVisible:true,
            table_topHeight:235,
            dialogFormVisible:false,
            dialogForm1Visible:false,
            form:{},
            form1:{},
            fileList: [],
            rules:{
                materialCode:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                articleTitle:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                articleSize:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                articleUnit:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                purchaseNumber:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
                remark:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
            },
            template:{
                status_desc(row,column){
                    switch(column.status){
                        case 0:
                            return <el-tag type="danger">{column.status_desc}</el-tag>
                        case 1:
                            return <el-tag type="info">{column.status_desc}</el-tag>
                        case 2:
                            return <el-tag type="warning">{column.status_desc}</el-tag>
                        case 3:
                            return <el-tag type="success">{column.status_desc}</el-tag>
                    }
                }
            },
            importUploadUrl:'toolstationery/purchase/stat/upload',
            downloadUrl:'toolstationery/purchase/stat/upload',
        };
    },
    watch:{
        orgid(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
    },
    methods: {
        async handleForm1Submit(){
            if(this.form1.the_file==undefined || this.form1.the_file==''){
                this.$message.error('请上传附件')
                return
            }
            let form1 = Object.assign({},this.form1)
            var formData = new FormData();
            Object.keys(form1).forEach(k=>{
                formData.append(k,form1[k])
            })
            let mes = await this.$request.post('toolstationery/purchase/stat',formData)
			this.dialogForm1Visible = false
            this.$message.success(mes);
            this.fetch()
        },
		changeFormUploadFiles(file, fileList){
			this.form1.the_file = file.raw
		},
		table_disable_selected(row){
			if(row.status==2||row.status==3){
				return false
			}else{
				return true
			}
        },
        async purchaseList(){
            this.form1 = {}
            this.fileList = []
            this.dialogForm1Visible = true
            this.form1.recordIds = this.table_selectedRows.map(row=>row.id)
        },
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
        async edit(){
            let row = this.table_selectedRows[0];
            this.form = (await api_resource.find(row.id))[0]
            this.dialogFormVisible = true
        },
        async handleFormSubmit(){
            await this.form_validate()
            this.form.org_id = this.orgid
            let form = Object.assign({},this.form)
            await api_resource.update(form.id,form)
            this.fetch()
            this.dialogFormVisible = false
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
        }
    },
    async created() {
        const { field, action,table } = await api_common.menuInit("toolstationery/purchase/stat");
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table
		this.table_form.dateLap = dayjs().add(1,'month').format('YYYY-MM') 
        this.fetchTableData();
    },
};
</script>