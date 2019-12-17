<template>
    <ui-table ref="table" 
        :table_column="table_field" 
        :table_query.sync="table_form.query"
        @query="querySubmit"
        >
        <!-- 物品流转追溯 -->
        <!-- <div>
            <Drawer title="物品流转追溯" :closable="false" width="640" v-model="openDrawers" class="drawerInfo">
                <div style="background: #f8f8f8;">
                    <el-row :gutter="20">
                        <el-col :span="3" class="imgFlex">
                            <img src="@/assets/avatar.png" alt="" srcset="" class="imgAvatar">
                        </el-col>
                        <el-col :span="6" class="userInfo">
                            <p>姓名: {{info.chineseName}}</p>
                            <p>工号: {{info.employeeCode}}</p>
                        </el-col>
                        <el-col :span="6" class="userInfo">
                            <p>部门: {{info.department_name}}</p>
                            <p>职位: {{info.job_name}}</p>
                        </el-col>
                        <el-col :span="6" class="userInfo">
                            <p>&nbsp;</p>
                            <p>入职日期: {{info.onDutyTime}}</p>
                        </el-col>
                    </el-row>
                </div>
            </Drawer>
        </div> -->

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
const api_resource = api_common.resource("toolstationery/personledger");
let baseUrl = process.env.VUE_APP_STATIC
// let baseUri = process.env.VUE_APP_BASEAPI
// const download = require('downloadjs')
export default {
    mixins: [table_mixin],
    props:['orgid'],
    data() {
        return {
            baseUrl,
            // baseUri,
            loading: false,
            api_resource,
            queryDialogFormVisible:true,
            table_topHeight:220,
            form:{},
			timer:'',
			url:'',
            statusk:1,
            moveData:[],
            status:'',
            articleData:{},
        };
    },
    watch:{
        orgid(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
    },
    methods: {
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
        async openDrawer(row,column,cell,event){
			// if(row.articleTitle==event.target.innerText){
			// 	this.openDrawers = true
			// 	this.articleData = await this.$request.get('holidaymanager/holidaystat/'+row.employeeCode)
			// 	this.info = this.holidayData[0]
			// }
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
            const {rows , total }= await api_resource.get(this.table_form);
            this.table_data  = rows
            this.table_form.total = total
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
<style lang="scss" scoped>
    .scroll {
        height: calc(100%);
        width: 100%;

        /deep/ .scrollbar-wrapper {
            overflow-x: hidden;
        }
    }
</style>