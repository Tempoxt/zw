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
                            <form-render :type="`input`" prop="nextStdDose" :field="{name:'标准用量'}" v-model="form.nextStdDose" :disabled="true"/>
                        </el-col>
                        <el-col :span="16" :offset="4">
                            <form-render :type="`input`" prop="purchaseNumber" :field="{name:'请购数量'}" v-model="form.purchaseNumber"/>
                        </el-col>
                        <el-col :span="16" :offset="4">
                            <form-render :type="`textarea`" autosize :row="2" prop="formulaMethod" :field="{name:'计算方式'}" v-model="form.formulaMethod"/>
                        </el-col>
                        <el-col :span="16" :offset="4">
                            <form-render :type="`textarea`" autosize :row="2" prop="remark" :field="{name:'请购原因'}" v-model="form.remark"/>
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
            title="退回"
            :visible.sync="dialogForm1Visible"
            class="public-dialog"
            v-el-drag-dialog
		    width="600px"
            >
           	<div>
                <el-form ref="form1" :model="form1" label-width="70px" :rules="rules1">
                    <el-row :gutter="20">
                        <el-col :span="16" :offset="4">
                            <form-render :type="`input`" prop="suggest_number" :field="{name:'建议数量'}" v-model="form1.suggest_number"/>
                        </el-col>
                        <el-col :span="16" :offset="4">
                            <form-render :type="`input`" prop="back_reason" :field="{name:'退回原因'}" v-model="form1.back_reason"/>
                        </el-col>
                    </el-row>
                </el-form>
            </div>

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
import dayjs from 'dayjs'
let baseUrl = process.env.VUE_APP_STATIC
const api_resource = api_common.resource('toolstationery/purchase/detail')
export default {
    mixins: [table_mixin],
    props:['orgid','status','name'],
    data() {
        var checkNumber = (rule, value, callback)=>{
			if (value==='') {
				return callback(new Error('请输入'));
			}else if (!(/^\d+$/.test(value))) {
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
            table_topHeight: 300,
            total_price:'',
            form:{
               take_number: '' 
            },
            dialogFormVisible: false,
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
                dose:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                nextStdDose:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                purchaseNumber:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
                formulaMethod:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
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
                },
                sysStatus(row,column){
                    switch(column.sysStatus){
                        case 0:
                            return <el-tag type="danger">已退回</el-tag>
                        case 1:
                            return <el-tag type="info">未申请</el-tag>
                        case 2:
                            return <el-tag type="warning">待审核</el-tag>
                        case 3:
                            return <el-tag type="success">已审核</el-tag>
                    }
                },
            },
            dialogForm1Visible: false,
            form1:{},
            rules1:{
                back_reason:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                suggest_number:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
            },
        };
    },
    computed:{
        disabled(){
            if(this.form1.staff_id!=''&&this.form1.staff_id!=undefined){
                return false
            }
            return true
        },
    },
    watch:{
        orgid(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
		status(){
			delete this.table_form.keyword
			delete this.table_form.sortname
			this.table_form.currentpage = 1
			this.table_form.query.query= []
            this.fetchMenu()
		}
    },
    methods: {
        async back(){
			this.dialogForm1Visible = true
        },
        async pass(){
            let row = this.table_selectedRows.map(row=>row.id)
            let mes = await this.$request.post('/toolstationery/purchase/verify',JSON.stringify({record_ids: row}),{
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            this.$message.success(mes)
            this.fetch()
        },
        async commit(){
            let row = this.table_selectedRows.map(row=>row.id)
            let mes = await this.$request.post('/toolstationery/purchase/commit',JSON.stringify({record_ids: row}),{
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            this.$message.success(mes)
            this.fetch()
        },
        async handleForm1Submit(){
            await this.form_validate('form1')
            let row = this.table_selectedRows.map(row=>row.id)
            this.form1.record_ids = row
            let form1 = Object.assign({},this.form1)
            let mes = await this.$request.post('/toolstationery/purchase/back',JSON.stringify(form1),{
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            this.$message.success(mes)
			this.dialogForm1Visible = false
			this.fetch()
        }, 
        async handleForm2Submit(){
            await this.form_validate('form2')
            let form2 = Object.assign({},this.form2)
			await this.api_resource.create(form2)
			this.dialogForm2Visible = false
			this.fetch()
        }, 
        async reset(){
            let mes = await this.$request.get('toolstationery/purchase/reset')
            this.$message.success(mes)
            this.fetch()
        },
		table_disable_selected(row){
			if(row.status==2||row.status==3){
				return false
			}else{
				return true
			}
		},
        async purchase(){
            let row = this.table_selectedRows.map(row=>row.id)
            await this.$request.post('toolstationery/purchase/detail',{recordIds:row.join(',')})
            this.fetch()
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
            this.table_form.org_id  = this.orgid
            this.table_form.sys_status = this.status
            const {rows , total}= await this.api_resource.get(this.table_form);
            this.table_data  = rows
            this.table_form.total = total
            setTimeout(() => {
                this.table_loading = false;
            }, 300);
        },
		async fetchMenu(){
			const { field, action,table } = await api_common.menuInit('ArticlePurchase'+this.status);
			this.table_field = field;
			this.table_actions = action;
			this.table_config = table
		    this.table_form.dateLap = dayjs().add(1,'month').format('YYYY-MM') 
			this.fetchTableData()
		},
    },
    async created() {
        this.fetchMenu();
    },
};
</script>
<style lang="scss">
    .drawerInfo{
        .ivu-drawer-body {
            padding:0;
        }
        .ivu-drawer-header{
            background: rgba(245,250,251,1)
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