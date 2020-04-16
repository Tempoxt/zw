<template>
    <div id="productPlan">
        <div class="h-full public-table-container">
            <ui-table 
                ref="table" 
                :table_query.sync="table_form.query"
                :table_column="table_field" 
                @query="querySubmit"
            >
                <table-header
                :table_actions="table_actions"
                :table_selectedRows="table_selectedRows"
                :table_form.sync="table_form"
                :table_column="table_field"
                @action="handleAction"/>

                <el-table 
                ref="elTable"
                @selection-change="handleChangeSelection"
                :data="table_data"
                border 
                style="width: 100%"
                :default-sort = "{prop: 'production_date', order: 'descending'}"
                :row-class-name="table_state_className"
                :header-cell-style="headerCellStyle"
                :height="table_height"
                @header-dragend="table_dragend"
                @sort-change="table_sort_change"
                v-loading="table_loading">
                    <el-table-column 
                    type="selection" 
                    width="60" 
                    class-name="table-column-disabled"
                    :selectable="table_disable_selected"
                    ></el-table-column>

                    <el-table-column type="index" label="序号" :index="indexMethod"  fixed="left"/>

                    <el-table-column field="product_encoding" label="产品编码" width="85">
                        <template slot-scope="scope">
                            <span>{{scope.row.product_encoding}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column field="product_name" label="产品名称" width="85">
                        <template slot-scope="scope">
                            <span>{{scope.row.product_name}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column field="number" label="人数" width="85">
                        <template slot-scope="scope">
                            <span>{{scope.row.number.split('.')[1]>0?scope.row.number:scope.row.number.split('.')[0]}}</span>
                        </template>
                    </el-table-column>

                    <each-table-column :table_field="table_field.filter(o=>!['product_encoding','product_name','recently_modified_time','number','create_time'].includes(o.name))"  :template="template" />
                    <!-- <each-table-column :table_field="table_field"/> -->
                        
                    <el-table-column field="recently_modified_time" label="最近修改日期" width="85">
                        <template slot-scope="scope">
                            <span>{{format(scope.row.recently_modified_time)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column field="created" label="创建时间" width="85">
                        <template slot-scope="scope">
                            <span>{{format(scope.row.created)}}</span>
                        </template>
                    </el-table-column>
                
                </el-table>

                <table-pagination 
                :total="table_form.total"
                :pagesize.sync="table_form.pagesize"
                :currentpage.sync="table_form.currentpage"
                @change="fetchTableData"
                :table_config="table_config"/>
            </ui-table>
        </div>
        

        <el-dialog
        :title="dialogStatus==='insert'?'添加':'编辑'"
        :visible.sync="dialogFormVisible"
        class="public-dialog"
        v-el-drag-dialog>
            <el-form ref="form" :model="form" label-width="90px" label-position="right" :rules="rules">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <form-render
                            prop="product_encoding"
                            :type="`input`"
                            :field="{name:'产品编码'}"
                            v-model="form.product_encoding"
                        />
                    </el-col>
                    <el-col :span="12">
                        <form-render
                            prop="product_name"
                            :type="`input`"
                            :field="{name:'产品名称'}"
                            v-model="form.product_name"
                        />
                    </el-col>
                    <el-col :span="12">
                        <form-render
                            prop="production_number"
                            :type="`input`"
                            :field="{name:'8H生产数'}"
                            v-model="form.production_number"
                        />
                    </el-col>
                    <el-col :span="12">
                        <form-render
                            prop="number"
                            :type="`input`"
                            :field="{name:'人数'}"
                            v-model="form.number"
                        />
                    </el-col>
                    <el-col :span="12">
                        <form-render
                            prop="equilibrium_rate"
                            :type="`input`"
                            :field="{name:'产线平衡率'}"
                            v-model="form.equilibrium_rate"
                        />
                    </el-col>
                    <el-col :span="12">
                        <form-render
                            prop="initial_completion_time"
                            :type="`day`"
                            :field="{name:'初始完成时间'}"
                            v-model="form.initial_completion_time"
                        />
                    </el-col>
                    <el-col :span="12">
                        <form-render
                            prop="reasons_revision"
                            :type="`input`"
                            :field="{name:'变更原因'}"
                            v-model="form.reasons_revision"
                        />
                    </el-col>
                    <el-col :span="12">
                        <form-render
                            prop="mass_production_time"
                            :type="`day`"
                            :field="{name:'量产时间'}"
                            v-model="form.mass_production_time"
                        />
                    </el-col>
                </el-row>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <div>
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
                </div>
            </div>

        </el-dialog>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";

export default {
    name: 'productPlan',
    mixins: [table_mixin],
    data() {
        var validatorNum = (rule, value, callback) => {
            if(value == undefined || value == '') {
                callback(new Error('请输入'));
            }else if(!(/^[0-9]+(.[0-9]{1})?$/.test(value))){
                callback(new Error('请输入正确的数字'));
            }else{
                callback();
            }
        };
        var validatorNum2 = (rule, value, callback) => {
            if(value == undefined || value == '') {
                callback();
            }else if(!(/^[0-9]+(.[0-9]{2})?$/.test(value))){
                callback(new Error('请输入正确的数字'));
            }else{
                callback();
            }
        };
        return {
            url: 'productrecheck/production/promotion',
            dialogFormVisible: false,
            api_resource: api_common.resource(`${'productrecheck/production/promotion'}`),
            form: {},
            rules:{
                product_encoding: [{ required: true, message: '请选择', trigger: 'change' }],
                product_name: [{ required: true, message: '请选择', trigger: 'change' }],
                production_number: [{ required: true, message: '请选择', trigger: 'change' }],
                number: [{trigger: 'change', validator: validatorNum}],
                equilibrium_rate: [{trigger: 'change', validator: validatorNum2}],
            },
            statusList: [
                {name: '新产品', val: 1, color: 'tagC-blue'},
                {name: '已更新', val: 2, color: 'tagC-green'},
                {name: '待更新', val: 3, color: 'tagC-org'},
            ],
            template:{
                status(column,row){
                    if(row.status==1){
                        return  <el-tag size="mini" class="tagC-blue">新产品</el-tag>
                    }else if(row.status==2){
                        return  <el-tag size="mini" class="tagC-green">已更新</el-tag>
                    }else if(row.status==3){
                        return  <el-tag size="mini" class="tagC-org">待更新</el-tag>
                    }
                }
            },
        }
    },
    computed: {
        format() {
            return function(val) {
                return dayjs(val).format('YYYY-MM-DD')
            }
        },
        statusC() {
            return function(val) {
                let color = this.statusList.find(o=>o.val == val)?this.statusList.find(o=>o.val == val).color:''
                return color
            }
        },
        statusN() {
            return function(val) {
                let name = this.statusList.find(o=>o.val == val)?this.statusList.find(o=>o.val == val).name:''
                return name
            }
        },
    },
    methods: {
        async fetchFormData() {
            
        },
        importCheckIn(){
			this.importUploadUrl = '/prodpropelplan/list/upload'
			this.downloadUrl = "/dormitory/import/checkin"
			this.import()
		},
        async fetchTableData() {
            this.table_loading = true
            const {rows,total}  =  await this.api_resource.get(this.table_form);
            this.table_data = rows
           console.log(rows, 999)
            this.table_form.total = total
            setTimeout(()=>{
                this.table_loading = false
            },300)
        },
        add(){
            this.dialogFormVisible = true
            this.$nextTick(()=>{
                this.$refs['form'].clearValidate()
            })
            this.fetchFormData()
        },
        async edit(){
            this.form = this.table_data.find(o=>o.id == this.table_selectedRowsInfo[0].id)
            this.fetchFormData()
            this.dialogFormVisible = true
        },
        customExport(){
            this.table_data.forEach(o=>{
                o.status = o.status==1?'新产品':'更新'
                o.recently_modified_time = dayjs(o.recently_modified_time).format('YYYY-MM-DD')
                o.created = dayjs(o.created).format('YYYY-MM-DD')
            })
            this.export()
        },
        async handleFormSubmit() {
            await this.form_validate()
            let form = Object.assign({},this.form)
            form.genre = 0
            if(this.isInsert){
                await this.throwFormError(this.$request.post(`${this.url}`, form))
            }else{
                await this.throwFormError(this.$request.put(`${this.url}/${this.table_selectedRowsInfo[0].id}`, form))
            }
            this.dialogFormVisible = false
            this.fetchTableData()
        },
        async fetchMenu(){
            const { field, action,table } = await api_common.menuInit(this.url,);
            this.table_field = field;
            this.table_actions = action;
            this.table_config = table

            if(this.table_actions.find(a=>a.code === 'export')){
                this.table_actions.find(a=>a.code === 'export').code = 'customExport'
            }

            this.fetchTableData()
        },
    },
    created() {
        this.fetchFormData()
        this.fetchMenu()
    }
    
}
</script>

<style lang="scss">
#productPlan{
    .tag{
        display: inline-block;
        padding: 2px 10px;
        font-size: 10px;
        border-radius: 2px;
    }
    .tagC-green{
        color: rgba(24, 204, 114, 1);
        background: rgba(24, 204, 114, 0.1);
    }
    .tagC-gay{
        color: rgba(20, 48, 64, 1);
        background: rgba(20, 48, 64, 0.1);
    }
    .tagC-org{
        color: rgba(255, 128, 0, 1);
        background: rgba(255, 128, 0, 0.1);
    }
    .tagC-greenD{
        color: rgba(144, 171, 4, 1);
        background: rgba(144, 171, 4, 0.1);
    }
    .tagC-red{
        color: rgba(242, 53, 60, 1);
        background: rgba(242, 53, 60, 0.1);
    }
    .tagC-purple{
        color: rgba(100, 28, 226, 1);
        background: rgba(100, 28, 226, 0.1)
    }
    .tagC-purpleD{
        color: rgba(191, 0, 147, 1);
        background: rgba(191, 0, 147, 0.1);
    }
    .tagC-blue{
        color: rgba(11, 178, 212, 1);
        background: rgba(11, 178, 212, 0.1);
    }
    .tagC-yellow{
        color: rgba(255, 162, 0, 1);
        background: rgba(255, 162, 0, 0.1);
    }

    .color-red{
        color: rgba(242, 53, 60, 1);
    }
}
</style>