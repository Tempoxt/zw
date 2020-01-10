<template>
    <ui-table 
        class="public-table-container"
        ref="table" 
        :table_column="table_field" 
        :table_query.sync="table_form.query"
        @query="querySubmit"
        >
        <el-dialog
            :title="dialogStatus==='insert'?'添加设备类型':'编辑设备类型'"
            :visible.sync="dialogFormVisible"
            class="public-dialog"
            v-el-drag-dialog
            >
            <el-form ref="form" :model="form"  label-width="110px" :rules="rules">
				<el-row >
					<!-- <el-col :span="18" :offset="2">
						<form-render :type="`input`" prop="uniueTitle" :disabled="!isInsert" :field="{name:'唯一标识'}" v-model="form.uniueTitle" />
					</el-col> -->
					<el-col :span="18" :offset="2">
						<form-render :type="`input`" prop="title" :field="{name:'类型名称'}" v-model="form.title" />
					</el-col>
                    <el-col :span="18" :offset="2">
                        <form-render :type="`number`" :field="{name:'顺序'}" v-model="form.sort"/>
                    </el-col>
                    <el-col :span="18" :offset="2">
                        <form-render :type="`radio`" prop="deviceStatus" :field="{name:'状态',options:[{'label':'启用','value':1},{'label':'禁用','value':2}]}" v-model="form.typeStatus"/>
                    </el-col>
				</el-row>
			</el-form>
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
                    <el-button type="primary" @click="handleFormSubmit" :disabled="disabled">确 定</el-button>
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
const api_resource = api_common.resource("devicemanager/devicetype");
export default {
    mixins: [table_mixin],
    data() {
        const defaultForm  = function(){
            return {
                uniueTitle:'',
                sort:1,
                typeStatus:1,
                title:''
            }
        }
        return {
            defaultForm,
            loading: false,
            form:{},
            api_resource,
            queryDialogFormVisible:true,
            table_topHeight:235,
            dialogFormVisible:false,
            statusData:[],
            rules:{
                // uniueTitle:[
                //     { required: true, message: '请输入', trigger:  'blur' },
                // ],
                title:[
                    { required: true, message: '请输入', trigger: 'blur'},
                ],
            }
        };
    },
    computed:{
        disabled(){
            if(this.form.title!==''){
                return false
            }
            return true
        }
    },
    methods: {
        async fetchTableData() {
            this.table_loading = true;
            const {rows , total }= await api_resource.get(this.table_form);
            this.table_data  = rows
            this.table_form.total = total
            setTimeout(() => {
                this.table_loading = false;
            }, 300);
        },
        async delete(){
            let rows = this.table_selectedRows.map(row=>row.id)
            await this.$request.get('devicemanager/devicetype/bluk?ids='+rows.join(','))
            this.$message.success({message:'删除成功'})
            this.fetchTableData();
        },
        async getStatus(){
            this.statusData = (await this.$request.get('devicemanager/getdevicestatus')).map(o=>{return {label:o.name,value:o.value}})
        },
        add(){
            this.form = this.defaultForm()
            // this.getStatus()
            this.dialogFormVisible = true
        },
        async edit(){
            // this.getStatus()
            let row = this.table_selectedRowsInfo[0];
			this.dialogFormVisible = true
			this.form = await this.api_resource.find(row.id)
        },  
        async handleFormSubmit(){
            await this.form_validate()
            let form = Object.assign({},this.form)
            if(this.isInsert){
                await api_resource.create(form)
            }else{
                await api_resource.update(form.id,form)
            }
            if(this.isInsert&&this.form_multiple){
                this.form = this.defaultForm()
            	this.$nextTick(()=>{
					this.$refs['form'].clearValidate()
				})
				this.fetchTableData()
			}else{
				this.dialogFormVisible = false
				this.fetchTableData()
			}
            // await this.throwFormError(api_resource.create(this.form))
            // this.dialogFormVisible = _.stubFalse()
        }
    },
    async created() {
        const { field, action,table } = await api_common.menuInit("devicemanager/devicetype");
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table
        this.fetchTableData();
    },
};
</script>