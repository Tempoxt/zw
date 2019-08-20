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
            <div>
                <OrgSelect v-model="form.hrmData" searchApi='hrm/oprpartstaff' filter_mark="operatorList" ref="OrgSelect" v-if="dialogFormVisible"/>
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
import OrgSelect from '@/components/Org/OrgSelect'
const api_resource = api_common.resource("operatelist/operatelist");
export default {
    mixins: [table_mixin],
    props:['orgid'],
    components:{
      OrgSelect
    },
    data() {
        return {
            loading: false,
            form:{},
            api_resource,
            queryDialogFormVisible:true,
            table_topHeight:226,
            dialogFormVisible:false,
            customId:'',
            customData:[],
        };
    },
    watch:{
        orgid(){
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
            // if(!this.orgid){
            //     return 
            // }
            this.table_loading = true;
            this.table_form.orgid = this.orgid
            const {rows , total }= await api_resource.get(this.table_form);
            this.table_data  = rows
            this.table_form.total = total
            setTimeout(() => {
                this.table_loading = false;
            }, 300);
        },
        
        add(){
            this.form = {}
            this.dialogFormVisible = true
        },
        async delete(){
            let rows = this.table_selectedRows.map(row=>row.id)
            await this.$request.delete('operatelist/operatelist?ids='+rows.join(','))
            this.$message.success({message:'删除成功'})
            this.fetchTableData();
        },
        async handleFormSubmit(){
            let ids = this.$refs.OrgSelect.getIdsResult()
            this.form.hrmData = ids;
            var repeat = await api_resource.create(this.form)
            if(repeat.no_team_list&&repeat.no_team_list.length!==0){
                var rep = repeat.no_team_list.map(o=>o)
                this.$confirm(rep+'没有小组', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
                // this.$message.error({message:rep+'没有小组',duration:12000})
            }else{
                this.dialogFormVisible = false
                this.$message.success({message:'创建成功'})
            }
            this.fetchTableData()
        }
    },
    async created() {
        const { field, action,table } = await api_common.menuInit("operatelist/operatelist");
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table
        this.fetchTableData();
    },
};
</script>