<template>
    <ui-table ref="table" 
        :table_column="table_field" 
        :table_query.sync="table_form.query"
        @query="querySubmit"
        >
        <!-- 物品流转追溯 -->
        <div>
            <Drawer title="物品流转追溯" :closable="false" width="640" v-model="openDrawers" class="drawerInfo">
                <div style="padding:20px">
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <p>名称: {{articleTitle}}</p>
                        </el-col>
                        <el-col :span="14">
                            <p>规格: {{articleSize}}</p>
                        </el-col>
                    </el-row>
                    <el-table
                        class="dtable"
                        :data="articleData"
                        :header-cell-style="headerStyle"
                        style="margin-top:20px"
                        >
                        <el-table-column type="index" :index="indexMethods"/>
                        <el-table-column prop="flowDate" label="流转日期"></el-table-column>
                        <el-table-column prop="giveChineseName" label="发出人" >
                            <template slot-scope="scope">
                                <span>{{scope.row.giveChineseName}} <span>{{scope.row.giveEmployeeCode!=null?'/'+scope.row.giveEmployeeCode:''}}</span></span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="receiveChineseName" label="接收人" >
                            <template slot-scope="scope">
                                <span>{{scope.row.receiveChineseName}} <span>{{scope.row.receiveEmployeeCode!=null?'/'+scope.row.receiveEmployeeCode:''}}</span></span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- <table-pagination 
                        :total="form.total" 
                        :pagesize.sync="form.page"
                        :currentpage.sync="form.currentp"
                        @change="fetchToolData"
                    /> -->
                </div>
            </Drawer>
        </div>

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
            @cell-click="openDrawer"
            :cell-style="cellStyle"
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
        <div style="margin:10px 0 0 10px;" v-if="total_price">总金额：{{total_price}}元</div>
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
const api_resource = api_common.resource("toolstationery/personledger");
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
            table_topHeight:265,
            form:{
                page:100,
                currentp:1,
            },
			timer:'',
			url:'',
            statusk:1,
            moveData:[],
            status:'',
            articleData:[],
            importUploadUrl:'/toolstationery/personledger/upload',
            downloadUrl:'/toolstationery/personledger/upload',
            openDrawers:false,
            materialCode:'',
            articleSize:'',
            articleTitle:'',
            total_price:'',
            employeeCode:'',
        };
    },
    watch:{
        orgid(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
    },
    methods: {
		indexMethods(i){
            return (i+1)+(this.form.currentp-1)*this.form.page
		},
        headerStyle(row,rowIndex,column,columnIndex){
            return "background:rgba(245,250,251,1);box-shadow:0px 1px 0px rgba(228,234,236,1);"
        },
        async getUrl(){
			if(this.statusk!=0){
                this.url = await this.$request.get('toolstationery/personledger/download',{alert:false})
                if(this.url!=''){
                    const res = download(baseUri+'/'+this.url)
                    this.statusk = 0
                    this.fetch()
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
                let mes = await this.$request.post('toolstationery/personledger/download?dateLap='+this.table_form.dateLap+'&org_id='+this.orgid,{
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
        async fetchToolData(){
            this.articleData = await this.$request.get('toolstationery/personledger/history',
                {params:{
                    materialCode: this.materialCode,
                    employeeCode: this.employeeCode
                }}
            )
        },
        async openDrawer(row,column,cell,event){
			if(row.articleTitle==event.target.innerText){
                this.openDrawers = true
                this.articleTitle = row.articleTitle
                this.articleSize = row.articleSize
                this.materialCode = row.materialCode
                this.employeeCode = row.employeeCode
                this.fetchToolData()
			}
		},
		cellStyle({row, column, rowIndex, columnIndex}){
			if(column.label == '物品名称'){
				return 'color:#0BB2D4;cursor:pointer!important'
			}else{
				return  ''
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
            this.table_form.org_id  = this.orgid
            const {rows , total, total_price}= await api_resource.get(this.table_form);
            this.table_data  = rows
            this.table_form.total = total
            this.total_price = total_price
            setTimeout(() => {
                this.table_loading = false;
            }, 300);
        },
    },
    async created() {
        const { field, action,table } = await api_common.menuInit("toolstationery/personledger");
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table
        this.fetchTableData();
    },
};
</script>
<style lang="scss">
    .drawerInfo{
        .ivu-drawer-body {
            padding:0;
        }
        .ivu-drawer-header{
            background: rgba(245,250,251,1)
        }
    }
</style>
<style lang="scss" scoped>
    .scroll {
        height: calc(100%);
        width: 100%;

        /deep/ .scrollbar-wrapper {
            overflow-x: hidden;
        }
    }
</style>