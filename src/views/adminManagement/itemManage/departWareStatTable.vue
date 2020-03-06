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
        >
            <div style="padding-left:10px">
                <dateLap v-model="table_form.dateLap" @change="fetch" :disabled="true"/>
            </div>
        </table-header>
        <div>
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
        </div>
  </ui-table>
</template>
<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
import dayjs from 'dayjs'
const api_resource = api_common.resource("toolstationery/departledger/tablestat");
let baseUrl = process.env.VUE_APP_STATIC
let baseUri = process.env.VUE_APP_BASEAPI
const download = require('downloadjs')
export default {
    mixins: [table_mixin],
    props:['orgid'],
    data() {
        return {
            baseUrl,
            baseUri,
            loading: false,
            api_resource,
            queryDialogFormVisible:true,
            table_topHeight:295,
			timer:'',
			url:'',
            statusk:1,
        };
    },
    watch:{
        orgid(){
            this.table_form.currentpage = 1
            this.fetch()
        },
    },
    methods: {
        async getUrl(){
			if(this.statusk!=0){
                this.url = await this.$request.get('toolstationery/purchase/stat/download',{alert:false})
                if(this.url!=''){
                    const res = download(baseUri+'/'+this.url)
                    this.statusk = 0
                }
			}else{
				clearInterval(this.timer)
			}
		},
		async download(){
			this.statusk = 1
			if(this.timer!=''){
				clearInterval(this.timer)
			}
			try{
                let mes = await this.$request.post('toolstationery/purchase/stat/download',{dateLap:this.table_form.dateLap})
                this.$message.success(mes);
				this.timer = setInterval(()=>{
					this.getUrl()
				}, 10000)
			}catch(err){
				console.log(err)
			}
		},
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
        async fetchTableData() {
            if(this.orgid==''){
                return 
            }
            this.table_loading = true;
            this.table_form.orgid  = this.orgid
            const {rows , total }= await api_resource.get(this.table_form);
            this.table_data  = rows
            this.table_form.total = total
            setTimeout(() => {
                this.table_loading = false;
            }, 300);
        }
    },
    async created() {
        const { field, action,table } = await api_common.menuInit("toolstationery/departledger/tablestat");
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table
		this.table_form.dateLap = dayjs().format('YYYY-MM') 
        this.fetchTableData();
    },
};
</script>