<template>
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
            <div style="padding-left:10px">
                <dateLap v-model="table_form.dateLap" @change="fetch"/>
            </div>
        </table-header>
        <el-table 
            ref="elTable"
            @selection-change="handleChangeSelection"
            :data="table_data"
            border 
            style="width: 100%"
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
                <el-table-column type="index" :index="indexMethod" />
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
const api_resource = api_common.resource("hrm/workwechat/list");
import dayjs from 'dayjs'

export default {
    props:['flag'],
    mixins: [table_mixin],
    data(){
        return {
            loading: true,
            api_resource,
            table_topHeight:295,
        }
    },
    watch:{
        flag(){
			this.table_form.query.query = []
			this.table_form.currentpage = 1
            this.fetchMenu()
        }
    },
    methods:{
        fetch(){
			this.table_form.currentpage = 1
            this.fetchTableData()
        },
        async fetchTableData() {
            this.table_loading = true
            this.table_form.flag = this.flag
            const {rows,total}  =  await api_resource.get(this.table_form);
            this.table_data = rows
            this.table_form.total = total
            setTimeout(()=>{
                this.table_loading = false
            },300)
        },
        async fetchMenu(){
            const { field, action,table } = await api_common.menuInit('hrm/workwechat/list'+this.flag);
            this.table_field = field;
            this.table_actions = action;
            this.table_config = table
            this.fetchTableData()
        }
    },
    
    async created() {
		this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM'))
        this.fetchMenu()
    }
}
</script>
<style lang="scss">

</style>
