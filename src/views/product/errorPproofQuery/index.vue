<template>
    <div id="errorPproofQuery">
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
                    @action="handleAction"
                >
                    <div class="flex-r-s-c searchBox" style="padding-left:10px">
                        <el-date-picker
                        v-model="searchTime"
                        type="date"
                        placeholder="选择时间">
                        </el-date-picker>

                        <el-input placeholder="请输入箱号" v-model="searchCode"></el-input>

                        <el-button @click="searchClick">查询</el-button>
                    </div>
                </table-header>
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
                    <!-- <el-table-column 
                    type="selection" 
                    width="60" 
                    class-name="table-column-disabled"
                    :selectable="table_disable_selected"
                    ></el-table-column> -->

                    <el-table-column type="index" label="序号" :index="indexMethod"  fixed="left"/>

                    <each-table-column :table_field="table_field"  :template="template" />
                    <!-- <each-table-column :table_field="table_field"/> -->
                        
                
                </el-table>

                <table-pagination 
                :total="table_form.total"
                :pagesize.sync="table_form.pagesize"
                :currentpage.sync="table_form.currentpage"
                @change="fetchTableData"
                :table_config="table_config"/>
            </ui-table>
        </div>
        
    </div>
</template>

<script>
import dayjs from 'dayjs'
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";

export default {
    name: 'errorPproofQuery',
    mixins: [table_mixin],
    data(){
        return {
            url: 'productrecheck/error_proof_record_query',
            dialogFormVisible: false,
            api_resource: '',
            template:{
                data_time(column,row){
                    let val = row.data_time?dayjs(row.data_time).format('YYYY-MM-DD HH:mm'):'-'
                    return <span>{val}</span>
                },
            },
            searchTime: dayjs().format('YYYY-MM-DD'),
            searchCode: '',
        }
    },
    computed: {

    },
    methods: {
        async fetchFormData() {
            this.api_resource = api_common.resource(`${`productrecheck/error_proof_record_query?pid__fdate=${this.searchTime}&pid__worknocode=${this.searchCode}`}`)
        },
        async fetchTableData() {
            this.table_loading = true
            let {rows,total}  =  await this.api_resource.get(this.table_form);
            this.table_data = rows
            this.table_form.total = total
            setTimeout(()=>{
                this.table_loading = false
            },300)
        },
        async fetchMenu(){
            const { field, action,table } = await api_common.menuInit('productrecheck/error_proof_record_query');
            this.table_field = field;
            this.table_actions = action;
            this.table_config = table

            this.fetchTableData()
        },
        async searchClick() {
            let msg = ''
            if(this.searchTime === '' || this.searchCode === ''){
                msg = this.searchTime === ''?'请填写查询时间':'请填写查询箱号'
                this.$message.warning(msg)
            }else{
                this.searchTime = dayjs(this.searchTime).format('YYYY-MM-DD')
                this.fetchFormData()
                this.fetchTableData()
            }

        }
    },
    created() {
        this.fetchMenu()
        this.fetchFormData()
    }
    
}
</script>

<style lang="scss">
#errorPproofQuery{
    .flex-r-s-c{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }
    .searchBox{
        .el-input{
            margin-right: 10px;
        }
    }
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