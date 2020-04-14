<template>
    <ui-table ref="table" 
        :table_column="table_field" 
        :table_query.sync="table_form.query"
        @query="querySubmit"
    >
        <el-dialog
            title="添加"
            :visible.sync="dialogFormVisible"
            class="public-dialog"
            v-el-drag-dialog
            >
            <div>
                <el-form ref="form" :model="form" label-width="110px" :rules="rules">
                    <div class="line-boxs">
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <form-render prop="department" :type="`departMultiple`" :field="{name:'部门'}" v-model="form.department"/>
                            </el-col>
                            <el-col :span="24">
                                <form-render prop="job" :type="`select`" filterable multiple :field="{name:'职位',options:principalshipData}" v-model="form.job"/>
                            </el-col>
                            <el-col :span="24">
                                <form-render prop="interview" :type="`radio`" :field="{name:'是否面试',options:[{
                                       value: 0,
                                        label: '无需面试'
                                    },{
                                        value: 1,
                                        label: '需要面试'
                                    }]}" v-model="form.interview"/>
                            </el-col>
                            <el-col :span="24">
                                <form-render prop="secrecy" :type="`select`" :field="{name:'是否发送保密协议',options:[{
                                        value: 0,
                                        label: '无需保密'
                                    },{
                                        value: 1,
                                        label: '技术类保密协议'
                                    },{
                                        value: 2,
                                        label: '经营类保密协议'
                                    }]}" v-model="form.secrecy"/>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="面试人">      
                                    <el-select
                                        style="width:100%"
                                        v-model="form.interviewer"
                                        filterable
                                        clearable
                                        remote
                                        reserve-keyword
                                        placeholder="请输入关键词"
                                        :remote-method="remoteMethod"
                                        >
                                        <el-option
                                            v-for="item in introducerData"
                                            :key="item.value"
                                            :label="item.chineseName +`(${item.employeeCode})`"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer">
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
        >
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
let baseUrl = process.env.VUE_APP_STATIC
const api_resource = api_common.resource('hrm/deptjob')
import dayjs from 'dayjs'
export default {
    mixins: [table_mixin],
    props:['orgid'],
    data() {
        return {
            baseUrl,
            loading: false,
            api_resource,
            queryDialogFormVisible: true,
            table_topHeight: 235,
            form: {},
            dialogFormVisible: false,
            rules:{
                department: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                job: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
            },
            introducerData: [],
            principalshipData: [],
        };
    },
    watch:{
        orgid(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
    },
    methods: {
        async remoteMethod(query){
            if (query !== '') {
                this.introducerData = await api_common.resource('hrm/partstaff').get({
                    IsDimission:0,
                    keyword:query,
                    pagesize:10
                })
            } 
        },
        async add(){
            this.form.department = ''
            this.principalshipData = (await api_common.resource('basicdata/jobtitles').get()).map(o=>({label:o.name,value:o.id}))
            this.$nextTick(()=>{
                this.$refs['form'].clearValidate()
            })
            this.dialogFormVisible = true
        },
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
        },
        async handleFormSubmit(){
            await this.form_validate()
            this.form.department = this.form.department.split(',')
            let form = Object.assign({},this.form)
            form = JSON.stringify(form)
            let mes = await this.$request.post('hrm/deptjob',{data:form})
            this.$message.success(mes)
            this.dialogFormVisible = false
            this.fetchTableData()
        },
        async fetchTableData() {
            this.table_loading = true;
            this.table_form.org_id = this.orgid
            const {rows , total }= await this.api_resource.get(this.table_form);
            this.table_data  = rows
            this.table_form.total = total
            setTimeout(() => {
                this.table_loading = false;
            }, 300);
        },
    },
    async created() {
        const { field, action,table } = await api_common.menuInit('hrm/deptjob');
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table
		this.table_form.dateLap = dayjs().format('YYYY-MM')
        await this.fetchTableData();
    },
};
</script>