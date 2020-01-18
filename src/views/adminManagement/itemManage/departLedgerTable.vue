<template>
    <ui-table ref="table" 
        :table_column="table_field" 
        :table_query.sync="table_form.query"
        @query="querySubmit"
        >

        <el-dialog
            title="盘点"
            :visible.sync="dialogFormVisible"
            class="public-dialog"
            v-el-drag-dialog
		    width="800px"
            >
           	<div>
                <el-form ref="form" :model="form" label-width="70px" :rules="rules">
                    <el-row :gutter="20">
                        <el-col :span="16" :offset="4">
                            <form-render :type="`input`" prop="materialCode" :field="{name:'物料代码'}" :disabled="true" v-model="form.materialCode"/>
                        </el-col>
                        <el-col :span="16" :offset="4">
                            <form-render :type="`input`" prop="articleType" :field="{name:'类别'}" :disabled="true" v-model="form.articleType"/>
                        </el-col>
                        <el-col :span="16" :offset="4">
                            <form-render :type="`input`" prop="articleTitle" :field="{name:'名称'}" :disabled="true" v-model="form.articleTitle"/>
                        </el-col>
                        <el-col :span="16" :offset="4">
                            <form-render :type="`input`" prop="articleSize" :field="{name:'规格'}" :disabled="true" v-model="form.articleSize"/>
                        </el-col>
                        <el-col :span="16" :offset="4">
                            <form-render :type="`input`" prop="take_number" :field="{name:'账面库存'}" v-model="form.take_number"/>
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
            :title="dialogStatus==='insert'?'添加部门管理员':'编辑部门管理员'"
            :visible.sync="dialogForm1Visible"
            class="public-dialog"
            v-el-drag-dialog
		    width="600px"
            >
           	<div>
                <el-form ref="form1" :model="form1" label-width="70px" :rules="rules1">
                    <el-row :gutter="20">
                        <el-col :span="16" :offset="4">
                            <form-render :type="`depart`" prop="departmentId" :field="{name:'部门',disable:!isInsert}" :disabled="!isInsert" v-model="form1.departmentId"/>
                        </el-col>
                        <el-col :span="16" :offset="4">
                            <form-render :type="`member`" prop="staff_id" :field="{name:'员工',defaultName:form1.chineseName}" v-model="form1.staff_id"/>
                        </el-col>
                    </el-row>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogForm1Visible = false">取 消</el-button>
                <el-button type="primary" @click="handleForm1Submit" :disabled="disabled">确 定</el-button>
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
        <div style="margin:10px 0 0 10px;" v-if="total_price">总金额：{{total_price}}元</div>
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
let baseUrl = process.env.VUE_APP_STATIC
export default {
    mixins: [table_mixin],
    props:['orgid','url'],
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
			api_resource :api_common.resource(this.url),
            queryDialogFormVisible:true,
            table_topHeight: 300,
            total_price:'',
            form:{
               take_number: '' 
            },
            dialogFormVisible: false,
            rules:{
                take_number:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
            },
            template:{
                articleImage(row,column){
                    if(column.articleImage!=''&&column.articleImage!=undefined){
                        return <img src={baseUrl+column.articleImage} width="30" height="30"></img>
                    }
                }
            },
            dialogForm1Visible: false,
            form1:{},
            importUploadUrl:'toolstationery/departledgermanager/upload',
            downloadUrl:'toolstationery/departledgermanager/upload',
            rules1:{
                departmentId:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                staff_id:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
            }
        };
    },
    computed:{
        disabled(){
            if(this.form1.departmentId!=''&&this.form1.staff_id!=''&&this.form1.departmentId!=undefined&&this.form1.staff_id!=undefined){
                return false
            }
            return true
        }
    },
    watch:{
        orgid(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
		url(){
            this.api_resource = api_common.resource(this.url)
			delete this.table_form.keyword
			delete this.table_form.sortname
			this.table_form.currentpage = 1
			this.table_form.query.query= []
			this.fetchMenu()
		}
    },
    methods: {
        add(){
            this.dialogForm1Visible = true
            this.form1 = {
                departmentId:'',
                staff_id:''
            }
            this.$nextTick(()=>{
				this.$refs['form1'].clearValidate()
			})
        },
        async edit(){
            this.dialogForm1Visible = true
            let row = this.table_selectedRows[0]
            this.form1 = (await this.api_resource.find(row.id))[0]
        },
        async handleForm1Submit(){
            await this.form_validate('form1')
            let form1 = Object.assign({},this.form1)
            if(this.isInsert){
				await this.api_resource.create(form1)
			}else{
				await this.api_resource.update(form1.id,form1)
			}
			this.dialogForm1Visible = false
			this.fetchTableData()
        },
        inventory(){
            this.form.take_number = ''
            this.$nextTick(()=>{
				this.$refs['form'].clearValidate()
            })
            let row = this.table_selectedRows[0];
            this.form = row
            this.form.ledger_id = row.id
            this.dialogFormVisible = true
        },
        async handleFormSubmit(){
            await this.form_validate()
            let form = Object.assign({},this.form)
            let mess = await this.$request.post('toolstationery/departledger/takestock',form)
            this.$message.success(mess);
            this.fetch()
            this.dialogFormVisible = false
        },
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
        async fetchTableData() {
            if(this.orgid==''){
                return 
            }
            this.table_topHeight = this.url=='toolstationery/departledgermanager'?300:325
            this.table_loading = true;
            this.table_form.org_id  = this.orgid
            const {rows , total, total_price}= await this.api_resource.get(this.table_form);
            this.table_data  = rows
            this.table_form.total = total
            this.total_price = total_price
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