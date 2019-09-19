  <template>
  <ui-table ref="table" 
	:table_column="table_field" 
	:table_query.sync="table_form.query"
	@query="querySubmit"
	>

  	<el-dialog
		title="高温津贴设置"
		:visible.sync="dialogForm2Visible"
		class="public-dialog"
		v-el-drag-dialog
		width="500px"
		>
		<div style="width:400px;margin:0 auto">
			<el-form ref="form" :model="form2" label-width="100px">
				<el-row :gutter="20">
					<el-col :span="24">
						<form-render :type="`input`" :field="{name:'高温津贴'}" v-model="form2.hotAllowance" />
					</el-col>
					<el-col :span="24">
						<el-form-item label="津贴月份">
							<div style="display:flex">
								<el-select v-model="form2.startMonth" placeholder="请选择" >
									<el-option
									v-for="item in 12"
									:key="item"
									:label="item+'月'"
									:value="item">
									</el-option>
								</el-select>    
								<span style="padding:0 10px;">至</span>   
								<el-select v-model="form2.endMonth" placeholder="请选择">
									<el-option
									v-for="item in 12"
									:key="item"
									:label="item+'月'"
									:value="item">
									</el-option>
								</el-select>      
							</div>  
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm2Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm2Submit">确 定</el-button>
		</div>
    </el-dialog>

	<div>
		<Drawer :closable="false" width="640" v-model="openDrawers">
			<p class="detail"><span style="color:#37474F">{{chineseName}}({{emplCode}})</span>考勤明细</p>
			<div class="demo-drawer-profile">
				<el-table
					class="dtable"
					:data="drawerData"
					:header-cell-style="headerStyle"
					style="width: 100%;margin-top:30px" 
					max-height="840"
					show-summary
      				:summary-method="getSummaries"
					:cellStyle="drawerStyle"
					>
					<el-table-column prop="CheckDate" label="日期"  width="50">
						<template slot-scope="scope">
							<span :title="scope.row.CheckDate">{{scope.row.CheckDate.split('-')[2]}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="weekday" label="星期" width="50"></el-table-column>
					<el-table-column prop="OnDutyTime1" label="上班1" width="60"></el-table-column>
					<el-table-column prop="OffDutyTime1" label="下班1" width="60"></el-table-column>
					<el-table-column prop="OnDutyTime2" label="上班2" width="60"></el-table-column>
					<el-table-column prop="OffDutyTime2" label="下班2" width="60"></el-table-column>
					<el-table-column prop="OnDutyTime3" label="上班3" width="60"></el-table-column>
					<el-table-column prop="OffDutyTime3" label="下班3" width="60"></el-table-column>
					<el-table-column prop="Remark" label="异常说明" width="120">
						<template slot-scope="scope">
							<span :title="scope.row.Remark" style="width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:red;cursor:default">{{scope.row.Remark}}</span>
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
		<el-table-column type="index" :index="indexMethod" width="70"/>
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
const api_resource = api_common.resource("hot/history");
import OrgSelect from '@/components/Org/OrgSelect'
import dayjs from 'dayjs'
const defaultForm = () => {
    return {
        estate:1,
        sort:1
    }
}
export default {
	mixins: [table_mixin],
	props:['id'],
	components:{
		OrgSelect
	},
	data() {
		return {
			loading: true,
			form:{},
			api_resource,
			orgCategory:[],
			queryDialogFormVisible:true,
			table_topHeight:276,

			adminList:[],
			defaultForm,
			roomAdminList:[],
			dormList:[],
			dialogForm2Visible:false,
			dialogForm3Visible:false,
			form2:{},
			form3:{},
			openDrawers:false,
			drawerData: [],
			totalAllo:'',
			chineseName:'',
			emplCode:'',
			curr:1,
			page:'',
			template:{
				auditStatus(column,row){
					if(row.auditStatus==-1){
						return  <el-tag size="info" type="info">考勤未处理</el-tag>
					}else if(row.auditStatus==0){
						return  <el-tag size="mini" type="warning">未审核</el-tag>
					}else if(row.auditStatus==1){
						return  <el-tag size="mini">已审核</el-tag>
					}else if(row.auditStatus==2){
						return  <el-tag size="mini" type="danger">待结付</el-tag>
					}else if(row.auditStatus==3){
						return  <el-tag size="mini" type="success">已结付</el-tag>
					}
				}
			}
		};
	},
	watch:{
		id(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		'window.innerHeight'(){
			alert(123)
		}
	},
	methods: {
		fetch(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
		indexMethods(i){
			return (i+1)+(this.curr-1)*this.page
		},
		reset(){
			this.$request.get('hot/historyreset',{params:{dateLap:this.table_form.dateLap}})
			this.$message({
				type: 'success',
				message: '重置成功'
			})
		},
		cellStyle({row, column, rowIndex, columnIndex}){
			if(column.label == '津贴天数'){
				return 'color:#0BB2D4;cursor:pointer'
			}else{
				return  ''
			}
		},
		drawerStyle({row,column,rowIndex,columnIndex}){
			if(row.Remark!=''&&row.Remark!=null){
				return 'color:red'
			}else if(column.label=="星期"){
				if(row.weekday=='六'){
					return 'background-color:#68f59c;'
				}
				if(row.weekday=='日'){
					return 'background-color:#1cbe57;'
				}
			}else if(column.label=="日期"&&row.hotDetail!=''&&row.hotDetail!=null&&row.hotDetail==1){
				return 'background-color:#0bb2d4;'
			}
		},
        headerStyle(row,rowIndex,column,columnIndex){
            return "background:rgba(245,250,251,1);box-shadow:0px 1px 0px rgba(228,234,236,1);"
        },
		async openDrawer(row,column,cell,event){
            if(row.allowanceDays==event.target.innerText){
				this.openDrawers = true
				this.chineseName = row.chineseName
				this.emplCode = row.employeeCode
				const alloData = await this.$request.get('/attendance/hotdetail?history_id='+row.id)
				this.drawerData = alloData.detail
				this.totalAllo = alloData.total
            }
		},
		getSummaries(param) {
			const { columns, data } = param;
			const sums = [];
			columns.forEach((column, index) => {
				if(index === 0){
					sums[index] = this.totalAllo;
				}
			});
			return sums;
		},
		async set(){
			this.form2 = await this.$request.get('/hot/recordbasic')
			this.dialogForm2Visible = true
		},
		async handleForm2Submit(){
			await this.$request.put('/hot/recordbasic',this.form2)
			this.dialogForm2Visible = false
		},
		async handleForm3Submit(){
			this.form3.ids = this.$refs.OrgSelect.getIdsResult()
			await this.$request.post('/hot/record',this.form3)
			this.dialogForm3Visible = false
			this.fetchTableData()
		},
		add(){
			this.form3 = {}
			this.dialogForm3Visible = true
		},
		async audit(){
			let rows = this.table_selectedRows.map(row=>row.id)
			await this.$request.post('/hot/history/bluk',{ids:rows.join(','),action:'check'})
			this.fetchTableData()
		},
		async edit(){
			let row = this.table_selectedRows[0]
			this.form = await api_resource.find(row.id)
			this.dialogFormVisible = true;
		},
		async fetchTableData() {
			if(!this.id){
				return
			}
			this.table_loading = true;
			this.table_form.org_id = this.id
			const {rows , total }= await api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
		async handleFormSubmit(){
			let form = Object.assign({},this.form)
			form.org_id = this.id
			if(this.isInsert){
				await api_resource.create(form)
			}else{
				await api_resource.update(form.id,form)
			}
			this.dialogFormVisible = false
			this.fetchTableData()
		},
	},
	async created() {
		const { field, action,table } = await api_common.menuInit("hot/history");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.fetchTableData();
		this.table_form.dateLap = dayjs().format('YYYY-MM')
	}
};
</script>

<style  lang="scss" scoped>
	.ivu-drawer-body{
        padding-left: 30px;
    }
	.demo-drawer-profile{
		padding-top: 30px
	}
    .detail{
		width: 100%;
		position: fixed;
		top: 0;
        color: #37474F;
        font-size: 14px;
        font-weight: bold;
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
        padding-top: 10px;
        background: #E4EAEC;
        box-shadow: 0px 1px 0px rgba(228,234,236,1);
        margin:-16px -16px 0;
        margin-bottom: 30px
	}
	.theme-0BB2D4 .el-table--small td, .theme-0BB2D4 .el-table--small th{
		color: red;
		padding: 1px 0;
	}
	.theme-0BB2D4{
		.dtable{
			/deep/.cell{
				font-size:10px;
			}
			/deep/td{
				padding: 0px;
			}
			/deep/th{
				padding: 1px 0;
			}
		}
	}
</style>


