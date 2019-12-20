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
                        <el-col :span="16" :offset="4" v-if="isInsert">
                            <form-render :type="`select`" prop="type_id" :field="{name:'类别',options:typeList}" v-model="form.type_id"/>
                        </el-col>
                        <el-col :span="16" :offset="4" v-if="isInsert">
                            <el-form-item prop="title" label="物品名称" >
                                <el-select v-model="form.title" placeholder="请搜索或选择" :disabled="!isInsert" style="width:100%" filterable>
                                    <el-option v-for="item in titleList" :key="item.id" :label="item.title" :value="item.title"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="16" :offset="4" v-if="isInsert">
                            <el-form-item prop="size" label="规格">
                                <el-select v-model="form.size" placeholder="请选择" :disabled="!isInsert" style="width:100%">
                                    <el-option v-for="item in sizeList" :key="item.id" :label="item.size" :value="item.size"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="16" :offset="4" v-if="!isInsert">
                            <form-render :type="`input`" prop="type__title" :field="{name:'类别'}" v-model="form.type__title" :disabled="true"/>
                        </el-col>
                        <el-col :span="16" :offset="4" v-if="!isInsert">
                            <form-render :type="`input`" prop="title" :field="{name:'物品名称'}" v-model="form.title" :disabled="!isInsert"/>
                        </el-col>
                        <el-col :span="16" :offset="4" v-if="!isInsert">
                            <form-render :type="`input`" prop="size" :field="{name:'规格'}" v-model="form.size" :disabled="!isInsert"/>
                        </el-col>
                        <el-col :span="16" :offset="4">
                            <form-render :type="`input`" prop="dose" :field="{name:'标准用量'}" v-model="form.dose"/>
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
const api_resource = api_common.resource("toolstationery/standarddose");
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
			}else if (!(/^[0-9]*[0-9][0-9]*$/.test(value))) {
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
            table_topHeight:220,
            dialogFormVisible:false,
            form:{},
            rules:{
                type_id:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                title:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                size:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                dose:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
                type__title:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                month:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
            },
            template:{
                image(row,column){
                    if(column.image!=''&&column.image!=undefined){
                        return <img src={baseUrl+column.image} width="50" height="50"></img>
                    }
                }
            },
            typeList:[],
            titleList:[],
            sizeList:[],
            importUploadUrl:'/toolstationery/standarddose/upload',
            downloadUrl:'/toolstationery/standarddose/upload',
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
        'form.type_id'(){
            if(this.form.type_id!=''&&this.form.type_id!=null&&this.dialogStatus=='insert'){
                this.getTitle()
                delete this.form.title
                delete this.form.size
                this.$nextTick(()=>{
                    this.$refs['form'].clearValidate()
                })
            }
        },
        'form.title'(){
            if(this.form.title!=''&&this.form.title!=null&&this.dialogStatus=='insert'){
                this.getSize()
                delete this.form.size
                this.$nextTick(()=>{
                    this.$refs['form'].clearValidate()
                })
            }
        },
    },
    methods: {
        async getUrl(){
			if(this.statusk!=0){
                this.url = await this.$request.get('toolstationery/standarddose/download',{alert:false})
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
                let mes = await this.$request.post('toolstationery/standarddose/download',{dateLap:this.table_form.dateLap})
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
        async getType(){
            this.typeList = (await this.$request.get('toolstationery/type')).map(o=>{return {label:o.title,value:o.id}});
        },
        async getTitle(){
            this.titleList = await this.$request.get('toolstationery/inventory/pulldownbytype?type_id='+this.form.type_id)
        },
        async getSize(){
            this.sizeList = await this.$request.get('toolstationery/inventory/pulldownbytitle?type_id='+this.form.type_id+'&title='+this.form.title)
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