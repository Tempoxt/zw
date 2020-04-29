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
            width="1600px"
            >
            <PerformanceSchemeForm @submit="handleFormSubmit"/>
           
            <!-- <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleFormSubmit">提 交</el-button>
            </div> -->
        </el-dialog>


        <table-header
            :table_actions="table_actions"
            :table_selectedRows="table_selectedRows"
            @action="handleAction"
            :table_form.sync="table_form"
            :table_column="table_field"
        >
            <div style="padding-left:10px">
                <!-- <dateLap :disabled="true" v-model="table_form.dateLap" @change="fetch"/> -->
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
import dayjs from 'dayjs'
const api_resource = api_common.resource('performance/scheme')
import PerformanceSchemeForm from './PerformanceSchemeForm'
export default {
    components:{
        PerformanceSchemeForm
    },
    mixins: [table_mixin],
    props:['orgid','id'],
    data() {
        return {
            baseUrl, 
            api_resource,
            loading: false,
            queryDialogFormVisible:true,
            table_topHeight: 235,
        };
    },
    computed:{ 
       
    },
    watch:{
        orgid(){
            this.fetch()
        },
    },
    methods: {
        add(){
            this.dialogFormVisible = true
        },
        async handleFormSubmit(){
            await this.form_validate()
            this.form.ids = this.$refs.OrgSelect.getIdsResult()
            this.form.department = this.id
            let form = Object.assign({},this.form)
            await api_resource.create(form)
            this.fetch()
            this.dialogFormVisible = false
        },
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
        async fetchTableData() {
            if(this.id==''){
                return 
            } 
            this.table_loading = true;
            this.table_form.department = this.id
            const {rows , total }= await api_resource.get(this.table_form);
            this.table_data  = rows
            this.table_form.total = total
            setTimeout(() => {
                this.table_loading = false;
            }, 300);
        },
		async fetchMenu(){
			const { field, action,table } = await api_common.menuInit('PerformanceScheme');
			this.table_field = field;
			this.table_actions = action;
            this.table_config = table
            if(this.id==''){
                return 
            }
            let fields = await this.$request.get('performance/scheme?department='+this.id)
			this.table_field.push(fields)
            this.table_form.dateLap = dayjs().format('YYYY-MM')
            // setTimeout(()=>{
            //     this.fetchTableData()
            // },1000)
		},
    },
    async created() {
        this.fetchMenu();
    },
};
</script>