<template>
    <ui-table ref="table" 
        :table_column="table_field" 
        :table_query.sync="table_form.query"
        @query="querySubmit"
        >
        <el-dialog
            :title="dialogStatus==='insert'?'添加':'编辑'"
            :visible.sync="dialogFormVisible"
            class="public-dialog"
            v-el-drag-dialog
            >
            <div> <!-- style="width:400px;margin:0 auto" -->
                <el-form ref="form" :model="form" label-width="100px" :rules="rules">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <form-render :type="`select`" prop="customer" :field="{name:'客户名称',options:customData}" :disabled="dialogStatus!=='insert'" v-model="form.customer"/>
                        </el-col>
                        <el-col :span="24">
                            <form-render :type="`input`" prop="productCode" :field="{name:'产品编号'}" v-model="form.productCode"/>
                        </el-col>
                        <el-col :span="24">
                            <form-render :type="`input`" prop="quickMarkLen" :field="{name:'二维码长度'}" v-model="form.quickMarkLen"/>
                        </el-col>
                        <el-col :span="24">
                            <form-render :type="`input`" prop="fixPrefix" :field="{name:'固定前缀'}" v-model="form.fixPrefix"/>
                        </el-col>
                    </el-row>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleFormSubmit" :disabled="disabeld">确 定</el-button>
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
            <each-table-column :table_field="table_field"/>
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
import { setTimeout } from 'timers';
const api_resource = api_common.resource("productrecheck/product");
export default {
    mixins: [table_mixin],
    props:['proid','changes'],
    data() {
        return {
            loading: false,
            form:{},
            api_resource,
            queryDialogFormVisible:true,
            table_topHeight:276,
            dialogFormVisible:false,
            customId:'',
            customData:[],
            rules:{
                customer:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                fixPrefix:[
                    { required: true, message: '请输入', trigger: 'blur' },
                    { max: 8, message:'请输入小于8位字符', trigger:'blur'},
                ],
                quickMarkLen:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                productCode:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
            }
        };
    },
    watch:{
        proid(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
        changes(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        }
    },
    computed:{
        disabeld(){
            if(this.form.customer==''||this.form.productCode==''||this.form.quickMarkLen==''||this.form.fixPrefix==''){
                return true
            }else{
                return false
            }
        }
    },
    methods: {
        async fetchTableData() {
            // if(!this.proid){
            //     return 
            // }
            this.table_loading = true;
            this.table_form.customer = this.proid
            const {rows , total }= await api_resource.get(this.table_form);
            this.table_data  = rows
            this.table_form.total = total
            setTimeout(() => {
                this.table_loading = false;
            }, 300);
        },
        async fetchCustom(){
            this.customData = (await this.$request.get('productrecheck/allcustomer')).map(o=>{return {label:o.name,value:o.id}});
        },
        add(){
            this.form = {}
            if(this.proid ==''||this.proid =='0'){
                this.form.customer = ''
            }else{
                this.form.customer = this.proid
            }
            this.dialogFormVisible = true
            this.fetchCustom()  
        },
        async edit(){
            this.dialogStatus=='ins'
            this.fetchCustom()
            this.dialogFormVisible = true;
            let row = this.table_selectedRows[0];
            this.form = await api_resource.find(row.id);
        },
        async handleFormSubmit(){
            await this.form_validate()
            if(this.dialogStatus=='insert'){
                // let info = await api_resource.create(this.form)
                // if(!info.id){
                //     this.$message.error(info)
                // }
                 await this.throwFormError(api_resource.create(this.form))

            }else{
                await this.throwFormError(api_resource.update(this.form.id,this.form))
                // await this.$request.put('/productrecheck/product/'+this.form.id,this.form)
            }
           
            this.dialogFormVisible = false
            // this.data2 = await this.$request.get('productrecheck/customer');
            this.fetchTableData()
        }
    },
    async created() {
        const { field, action,table } = await api_common.menuInit("productrecheck/product");
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table
        this.fetchTableData();
    },
};
</script>