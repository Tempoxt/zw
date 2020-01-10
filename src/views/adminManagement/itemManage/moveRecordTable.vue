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
                <el-select v-model="status" placeholder="请选择" @change="changeStatus" style="width:140px">
                    <el-option
                        v-for="item in moveData"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
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
            <each-table-column :table_field="table_field" :template="template"/>
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
const api_resource = api_common.resource("toolstationery/moverecord");
let baseUrl = process.env.VUE_APP_STATIC
let baseUri = process.env.VUE_APP_BASEAPI
const download = require('downloadjs')
import dayjs from 'dayjs'
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
            table_topHeight:235,
            form:{},
            template:{
                recordStatus(row,column){
                    switch(column.recordStatus){
                        case '待发放':
                            return <el-tag type="danger">{column.recordStatus}</el-tag>
                        case '已发放':
                            return <el-tag type="success">{column.recordStatus}</el-tag>
                        case '待退转':
                            return <el-tag type="warning">{column.recordStatus}</el-tag>
                        case '已退转':
                            return <el-tag type="">{column.recordStatus}</el-tag>
                        case '已完成':
                            return <el-tag type="info">{column.recordStatus}</el-tag>
                    }
                }
            },
			timer:'',
			url:'',
            statusk:1,
            moveData:[],
            status:''
        };
    },
    watch:{
        orgid(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
    },
    methods: {
		changeStatus(val){
			this.status = val
			this.fetchTableData()
		},
        async getUrl(){
			if(this.statusk!=0){
                this.url = await this.$request.get('toolstationery/moverecord/download',{alert:false})
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
                delete this.table_form.pagesize
                delete this.table_form.currentpage
                let mes = await this.$request.post('toolstationery/moverecord/download?dateLap='+this.table_form.dateLap+'&moveType='+this.status+'&org_id='+this.orgid,{
                    dateLap: this.table_form.dateLap,
                    moveType: this.status,
                    org_id:this.orgid
                })
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
            if(this.orgid==''||this.status===''){
                return 
            }
            this.table_loading = true;
            this.table_form.org_id  = this.orgid
            this.table_form.moveType = this.status
            const {rows , total }= await api_resource.get(this.table_form);
            this.table_data  = rows
            this.table_form.total = total
            setTimeout(() => {
                this.table_loading = false;
            }, 300);
        },
    },
    async created() {
        const { field, action,table } = await api_common.menuInit("toolstationery/moverecord");
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table
		this.table_form.dateLap = dayjs().format('YYYY-MM')
        this.moveData = (await this.$request.get('toolstationery/moverecord/movetype')).map(o=>{return {label:o.type_title,value:o.type_id}});
        this.status = this.moveData[0].value
        await this.fetchTableData();
    },
};
</script>
<style lang="scss" scoped>
    .scroll {
        height: calc(100%);
        width: 100%;

        /deep/ .scrollbar-wrapper {
            overflow-x: hidden;
        }
    }
</style>