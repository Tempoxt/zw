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

        <table-header
            :table_actions="table_actions"
            :table_selectedRows="table_selectedRows"
            @action="handleAction"
            :table_form.sync="table_form"
            :table_column="table_field"
        >
            <div style="padding-left:10px">
                <dateLap v-model="table_form.dateLap" @change="fetch" :disabled="true"/>
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
const api_resource = api_common.resource("toolstationery/purchase/detail");
let baseUrl = process.env.VUE_APP_STATIC
let baseUri = process.env.VUE_APP_BASEAPI
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
            baseUri,
            loading: false,
            api_resource,
            queryDialogFormVisible:true,
            table_topHeight:235,
            dialogFormVisible:false,
            form:{},
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
			timer:'',
			url:'',
            statusk:1,
        };
    },
    watch:{
        orgid(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
    },
    methods: {
        async reset(){
            let mes = await this.$request.get('toolstationery/purchase/reset')
            this.$message.success(mes)
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
        async getUrl(){
			if(this.statusk!=0){
                this.url = await this.$request.get('toolstationery/purchase/detail/download',{alert:false})
                if(this.url!=''){
                    const res = download(baseUri+'/'+this.url)
                    this.statusk = 0
                }
			}else{
				clearInterval(this.timer)
			}
		},
		async download(){
			this.statusk = 1
			if(this.timer!=''){
				clearInterval(this.timer)
			}
			try{
                let mes = await this.$request.post('toolstationery/purchase/detail/download',{dateLap:this.table_form.dateLap})
                this.$message.success(mes);
				this.timer = setInterval(()=>{
					this.getUrl()
				}, 10000)
			}catch(err){
				console.log(err)
			}
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
        const { field, action,table } = await api_common.menuInit("toolstationery/purchase/detail");
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table
		this.table_form.dateLap = dayjs().format('YYYY-MM') 
        this.fetchTableData();
    },
};
</script>