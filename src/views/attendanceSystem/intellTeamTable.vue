<template>
    <ui-table ref="table" 
        :table_column="table_field" 
        :table_query.sync="table_form.query"
        @query="querySubmit"
        >

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
import { setTimeout } from 'timers';
import OrgSelect from '@/components/Org/OrgSelect'
const api_resource = api_common.resource("attendance/intelligentteam/list/classes");
export default {
    mixins: [table_mixin],
    props:['id','changes'],
    components:{
        OrgSelect
    },
    data() {
        return {
            loading: false,
            form:{},
            api_resource,
            queryDialogFormVisible:true,
            table_topHeight:220,
            dialogFormVisible:false,
            deviceData:[],
            nameData:[],
            typew:'',
            rules:{
                deviceType:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                device:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
            },
            checkList:[],
        };
    },
    watch:{
        id(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
         changes(){
            if(this.changes==true){
                this.table_form.currentpage = 1
                this.fetchTableData()
            }
        }
    },
    methods: {
        async delete(){
            let rows = this.table_selectedRows.map(row=>row.id)
            const mes = await this.$request.get('/attendance/intelligentteam/list/classes/bluk?ids='+rows.join(','));
            this.$message.success({message:mes});
            this.fetchTableData();
        },
        async fetchTableData() {
            if(this.id==''){
                return 
            }
            this.table_loading = true;
            this.table_form.team_id = this.id
            const {rows , total }= await api_resource.get(this.table_form);
            this.table_data  = rows
            this.table_form.total = total
            setTimeout(() => {
                this.table_loading = false;
            }, 300);
        },
    },
    async created() {
        const { field, action,table } = await api_common.menuInit("attendance/intelligentteam/list/classes");
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table
        this.fetchTableData();
    },
};
</script>
<style>
    .checkbox_finger{
        margin-right: -16px;
    }
    .checkbox_finger .el-checkbox__label{
        padding-left: 4px
    }
</style>