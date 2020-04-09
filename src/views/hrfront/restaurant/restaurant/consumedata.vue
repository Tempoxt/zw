  <template>
  <ui-table ref="table"
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  >
	
	<Drawer title="餐费详情" :closable="false" width="640" v-model="openDrawers" class="drawerInfo">
		<el-table
			v-loading="payloading"
			:data="payData"
			border
			show-summary
			:header-cell-style="headerStyle"
			:summary-method="getSummaries"
			style="width: 100%;padding:15px 15px 0">
			<el-table-column prop="date" label="日期" width="110"></el-table-column>
			<el-table-column prop="week" label="星期" width="110">
				<template slot-scope="scope">
				{{['星期一','星期二','星期三','星期四','星期五','星期六','星期日'][scope.row.week-1]}}
				</template>
			</el-table-column>
			<el-table-column prop="lunch" label="午餐(元)"></el-table-column>
			<el-table-column prop="dinner" label="晚餐(元)"></el-table-column>
			<el-table-column prop="nightingale" label="夜宵(元)"></el-table-column>
			<el-table-column prop="total" label="小计"></el-table-column>
		</el-table>
	</Drawer>


    <el-dialog
		:title="this.settle==false?'结算当月餐费':'膳食委员确认'"
		:visible.sync="dialogFormVisible"
		class="public-dialog"
		v-el-drag-dialog
		width="600"
    	>
      <div>
        <el-form ref="form" :model="form" label-width="120px" >
			<el-row>
				<el-col :span="16" :offset="3">
					<el-row :gutter="0">
						<el-col :span="24" v-if="this.settle==false">
							<form-render :type="`input`" :disabled=true :field="{name:'工号'}" v-model="form.workcode"/>
						</el-col>
						<el-col :span="24" v-if="this.settle==false">
							<form-render :type="`input`" :disabled=true :field="{name:'月份'}" v-model="form.month"/>
						</el-col>
						<el-col :span="24" v-if="this.settle==false">
							<form-render :type="`input`" :disabled=true :field="{name:'订餐费用'}" v-model="form.paymongey"/>
						</el-col>
						<el-col :span="24">
							<form-render  type="radio" :field="{name:'是否膳食委员',options:[{
								value: false,
								label: '否'
								},{
								value: true,
								label: '是'
								}]}" v-model="form.isdiet"/>
						</el-col>
						<el-col :span="24" v-if="form.isdiet==false">
							<form-render :type="`input`" :field="{name:'应扣费用'}" v-model="form.payable"/>
						</el-col>
						
					</el-row>
				</el-col>
			</el-row>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
      </div>
    </el-dialog>


	<el-dialog
		title="结算当月餐费"
		:visible.sync="dialogForm1Visible"
		class="public-dialog"
		v-el-drag-dialog
		width="600"
    	>
      <div>
        <el-form ref="form1" :model="form1" label-width="120px" >
			<el-row>
				<el-col :span="16" :offset="3">
					<el-row :gutter="0">
						<el-col :span="24">
							<form-render :type="`input`" :disabled=true :field="{name:'工号'}" v-model="form1.workcode"/>
						</el-col>
						<el-col :span="24">
							<form-render :type="`input`" :disabled=true :field="{name:'月份'}" v-model="form1.month"/>
						</el-col>
						<el-col :span="24">
							<form-render :type="`input`" :disabled=true :field="{name:'订餐费用'}" v-model="form1.paymongey"/>
						</el-col>
						<el-col :span="24">
							<form-render :type="`input`" :field="{name:'应扣费用'}" v-model="form1.payable"/>
						</el-col>
						<el-col :span="24">
							<form-render  type="radio" :field="{name:'是否膳食委员',options:[{
								value: false,
								label: '否'
								},{
								value: true,
								label: '是'
								}]}" v-model="form1.isdiet"/>
						</el-col>
					</el-row>
				</el-col>
			</el-row>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm1Visible = false">取 消</el-button>
        <el-button type="primary" @click="handleForm1Submit">确 定</el-button>
      </div>
    </el-dialog>


    <table-header
      :table_actions="table_actions"
      :table_selectedRows="table_selectedRows"
      @action="handleAction"
      :table_column="table_field.slice(1,table_field.length)"
      :table_form.sync="table_form"
    >
		<div style="padding-left:10px">
          <dateLap v-model="table_form.dateLap" disabled @change="fetch"/>
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
			
		<each-table-column :table_field="table_field"/>
    </el-table>
     <table-pagination 
        :total="table_form.total" 
        :pagesize.sync="table_form.pagesize"
        :currentpage.sync="table_form.currentpage"
        @change="fetchTableData"
        ref="table_pagination"
        :table_config="table_config"
        />
  </ui-table>
</template>
<script>
import * as api_common from "@/api/common";
import * as api_org from "@/api/org";
import table_mixin from "@c/Table/table_mixin";
import dayjs from 'dayjs'
const api_resource = api_common.resource("restaurant/consumedata");
const defaultForm = ()=>({isdiet:false})
export default {
    props:{
        currentMenuid:[String,Number]
	},
    mixins: [table_mixin],
	data() {
		const vm = this
		return {
			loading: true,
			form:{
				isdiet:false
			},
			api_resource,
			payloading:false,
			payData:[],
			table_form:{
				dateLap:''
			},
			payId:'',
			form1:{
				isdiet:false
			},
			dialogForm1Visible:false,
			current:'',
			settle:false,
			openDrawers: false,
            table_topHeight:235,
		};
  	},
	watch:{
		// 
		async currentMenuid(id){
            this.table_form.currentpage = 1
			this.table_form.orgid = id 
			this.$refs.table_pagination.reset()
			await this.table_init_status
			this.fetchTableData();
			
		},
		'table_form.dateLap'(){
			if(this.current!==this.table_form.dateLap){
				this.settle = true
			}else{
				this.settle = false
			}
		}
	},
	methods: {
        fetch(){
            this.table_form.currentpage = 1
            this.fetchTableData()
		},
		headerStyle(row,rowIndex,column,columnIndex){
            return "background:#F5F5F5;"
        },
		getSummaries(param) {
			const { columns, data } = param;
			const sums = [];
			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = '合计';
					return;
				}else if(index === 1){
					sums[index] = '';
					return;
				}else{
					const values = data.map(item => Number(item[column.property]));
					if (!values.every(value => isNaN(value))) {
						sums[index] = values.reduce((prev, curr) => {
							const value = Number(curr);
							if (!isNaN(value)) {
							return prev + curr;
							} else {
							return prev;
							}
						}, 0);
						sums[index] = sums[index];
					} else {
						sums[index] = '';
					}
				}
			});
			return sums;
		},
		async openDrawer(row,column,cell,event){
			this.payloading = true
			if(row.paymongey==event.target.innerText){
				this.openDrawers = true
				let { rows } = await this.$request.get('restaurant/consumedata/detail',{
					params:{
						workcode:row.workcode,
						month:this.table_form.dateLap
					}
				})
				this.payData =  rows
				this.payloading = false
			}
		},
		
		cellStyle({row, column, rowIndex, columnIndex}){
			if(column.label == '订餐费用(元)'){
				return 'color:#0BB2D4;cursor:pointer'
			}else{
				return  ''
			}
		},
		async edit(){
			let row = this.table_selectedRows[0];
			this.form.payable = row.payable;
			this.form.workcode = row.workcode;
			this.form.month = row.month;
			this.form.paymongey = row.paymongey;
			this.payId = row.id
			
			this.dialogFormVisible = true;
		},
		//结算
		settlement(){
			let row = this.table_selectedRows[0];
			this.form1.payable = row.payable;
			this.form1.workcode = row.workcode;
			this.form1.month = row.month;
			this.form1.paymongey = row.paymongey;
			this.dialogForm1Visible = true
		},
		async fetchTableData() {
			this.table_loading = true;
			const {rows,total} =  await api_resource.get(this.table_form);
			this.table_data =rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
		async handleFormSubmit(){
			if(this.settle==false){
				await this.$request.post('/restaurant/consumedata',this.form,{alert:false});
			}else{
				await this.$request.put('/restaurant/consumedata/'+this.payId,this.form,{alert:false});
				this.$message.success('修改成功')
			}
			this.dialogFormVisible = false
			this.fetchTableData()
		},
		async handleForm1Submit(){
			await this.$request.post('/restaurant/consumedata',this.form1,{alert:false});
			this.dialogForm1Visible = false
			this.fetchTableData()
		}
	},
	async created() {
		this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM'))
		this.current = this.table_form.dateLap
		this.table_init("restaurant/consumedata")
	}
};
</script>
<style lang="scss" scoped>
.month-select {
    position:relative;
    .picker {
        position: absolute;
        left:0;
        top:0;

    }
}
</style>
<style lang="scss">
    .drawerInfo{
		.ivu-drawer-body {
			padding:0;
		}
		.ivu-drawer-header{
			background: rgba(245,250,251,1)
		}
		.infoDetail{
			padding: 0 20px ; 
		}
		.imgFlex{
			display: flex;
			align-items: center;
			height: 70px;
			margin-left: 15px;
		}
		.imgAvatar{
			width: 50px;
			height: 50px;
		}
		.userInfo{
			display: flex;
			flex-direction: column;
			justify-content: center;
			height: 70px;
			line-height: 26px;
		}
		.info{
			color: #0BB2D4;
			font-size: 16px;
			font-weight: bold;
			margin: 20px 0 10px 2px;
		}
		.fontStyle{
			color: #37474F;
			font-size: 14px;
		}
		.mt10{margin-top: 10px;}
	}
</style>

