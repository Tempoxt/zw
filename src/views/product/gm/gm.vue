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
                            <form-render :type="`input`" prop="VCode" :field="{name:'VCode'}" v-model="form.VCode"/>
                        </el-col>
                        <el-col :span="24">
                            <form-render :type="`input`" prop="RCUCode" :field="{name:'RCUCode'}" v-model="form.RCUCode"/>
                        </el-col>
                        <el-col :span="24">
                            <form-render :type="`input`" prop="RCUSN" :field="{name:'RCUSN'}" v-model="form.RCUSN"/>
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
const api_resource = api_common.resource("productrecheck/gmscanrecord");
export default {
    mixins: [table_mixin],
    data() {
        return {
            loading: false,
            form:{},
            api_resource,
            queryDialogFormVisible:true,
            table_topHeight:296,
            dialogFormVisible:false,
            rules:{
                VCode:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                RCUCode:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                RCUSN:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
            }
        };
    },
    computed:{
        disabeld(){
            console.log(this.form,'hhh')
            if(this.form.VCode==''||this.form.RCUCode==''||this.form.RCUSN==''){
                return true
            }else{
                console.log('555')
                return false
            }
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
        add(){
            this.form = {
                VCode:'',
                RCUCode:'',
                RCUSN:''
            },
            this.dialogStatus='insert'
            this.dialogFormVisible = true
        },
        async edit(){
            this.dialogStatus = 'inse'
            this.dialogFormVisible = true;
            let row = this.table_selectedRows[0];
            this.form = await this.$request.get('/productrecheck/gmscanrecord/'+row.id)
            console.log(this.form,'fff')
        },
        async delete(){
            let row = this.table_selectedRows[0];
            await this.$request.delete('/productrecheck/gmscanrecord/'+row.id)
            this.fetchTableData();
        },
        async handleFormSubmit(){
            if(this.dialogStatus=='insert'){
                await api_resource.create(this.form)
            }else{
                await this.$request.put('/productrecheck/gmscanrecord/'+this.form.id,this.form)
            }
            this.fetchTableData();
            this.dialogFormVisible = false
        }
    },
    async created() {
        const { field, action,table } = await api_common.menuInit("productrecheck/gmscanrecord");
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table
        this.fetchTableData();
    }
};
</script>