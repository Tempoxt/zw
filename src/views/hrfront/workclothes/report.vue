  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  
  >

   <!-- 人员档案的信息预览 -->
	<div>
		<Drawer :closable="false" width="640" v-model="openDrawers">
			<p class="detail"><span style="color:#37474F">{{chineseName}}</span>工衣领用详情</p>
			<div class="demo-drawer-profile mt60">
				<el-table
					:data="clothesInfo"
					:header-cell-style="headerStyle"
					style="width: 100%;margin-top:30px" 
					:cellStyle="cellStyle"
					>
            		<el-table-column type="index" :index="indexMethods"/>
					<el-table-column prop="releaseTime" label="发放日期"></el-table-column>
					<el-table-column prop="clothCode" label="工衣编号"></el-table-column>
					<el-table-column prop="clothName" label="工衣名称"></el-table-column>
					<el-table-column prop="clothFormat" label="尺码"></el-table-column>
					<el-table-column prop="count" label="领用数量"></el-table-column>
					<el-table-column prop="amount" label="金额(元)">
						<template slot-scope="scope">
							<span style="color:red;cursor:default">{{scope.row.amount}}</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</Drawer>
	</div>
    <table-header
		:table_actions="table_actions"
		:table_selectedRows="table_selectedRows"
		@action="handleAction"
		:table_form.sync="table_form"
		:table_column="table_field"
    >
        <div style="padding-left:10px">
          	<dateLap v-model="table_form.dateLap" @change="fetch"/>
        </div>
    </table-header>
    <el-table
		@selection-change="handleChangeSelection"
		:row-class-name="table_state_className"
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
import dayjs from 'dayjs'
const api_resource = api_common.resource("workclothes/report");
export default {
	mixins: [table_mixin],
	props:['flag'],
	data() {
		return {
			loading: true,
			form:{},
			api_resource,
			orgCategory:[],
			queryDialogFormVisible:true,
			activeName:'first',
			openDrawers: false,
			clothesInfo:[],
			curr:1,
			page:'',
			chineseName:''
		};
	},
	watch:{
		flag(){
            this.table_form.currentpage = 1
			this.fetchMenu()
			this.fetchTableData()
		}
	},
	methods: {
		indexMethods(i){
			return (i+1)+(this.curr-1)*this.page
		},
        headerStyle(row,rowIndex,column,columnIndex){
            return "background:rgba(245,250,251,1);box-shadow:0px 1px 0px rgba(228,234,236,1);"
        },
		cellStyle({row, column, rowIndex, columnIndex}){
			if(column.label == '工号'){
				return 'color:#0BB2D4;cursor:pointer'
			}else{
				return  ''
			}
		},
		async openDrawer(row,column,cell,event){
			if(row.workcode==event.target.innerHTML){
				this.openDrawers = true
				this.chineseName = row.name
				this.clothesInfo = await this.$request.get('/workclothes/reportdetail?workcode='+row.workcode)
			}
		},
		fetch(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
		async fetchTableData() {
			this.table_loading = true;
			this.table_form.flag = this.flag
			const {rows , total }= await api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
		async issue(){
			let rows = this.table_selectedRows.map(row=>row.id)
			await this.$request.put('/workclothes/issue?ids='+rows.join(','))
			this.fetchTableData()
		},
		async fetchMenu(){
			const { field, action,table } = await api_common.menuInit("workclothes/report");
			this.table_field = field;
			this.table_actions = action;
			this.table_config = table
		}
	},
	async created() {
		this.fetchMenu()
		this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM'))
		this.fetchTableData();
	}
};
</script>
<style>
    .line-boxs{
        margin-top: 20px;
    }
    .ivu-drawer-body{
        padding-left: 30px;
    }
    .detail{
        color: #37474F;
        font-size: 14px;
        font-weight: bold;
        height: 60px;
        line-height: 60px;
        padding:0 20px 0;
        background: #E4EAEC;
        box-shadow: 0px 1px 0px rgba(228,234,236,1);
        margin:0 -30px 0;
        margin-bottom: 0;
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 99999;
    }
    .info{
        color: #0BB2D4;
        font-size: 16px;
        font-weight: bold;
        margin: 17px 0 24px 2px;
    }
    .labelCon{
        display: inline-block;
        width: 112px;
        text-align: right;
        font-size: 12px;
        color: #4C5D66;
    }
    .promp{
        color: #A3AFB7;
        text-align: left;
        width: auto;
    }
    .mt60{margin-top: 60px;}
    .mb20{margin-bottom: 20px;}
    .demo-drawer-profile .el-col-12{
        margin-bottom: 8px;
    }
</style>


