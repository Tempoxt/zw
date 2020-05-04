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
            width="1400px"
            >
            <performanceSchemeForm :orgid="orgid"  :id="id" v-if="dialogFormVisible"/>

            
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
const api_resource = api_common.resource('performance/scheme')
import performanceSchemeForm from './performanceSchemeForm2'
export default {
    components:{
        performanceSchemeForm
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
    watch:{
        orgid(){
            this.fetchMenu()
        },
    },
    methods: {
        add(){
            this.dialogFormVisible = true
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
            this.fetchTableData()
		},
    },
    async created() {
        this.fetchMenu();
    },
};
</script>