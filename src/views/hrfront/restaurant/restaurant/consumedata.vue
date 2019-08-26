  <template>
  <ui-table ref="table"
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  >
	<el-dialog
		title="餐费详情"
		:visible.sync="dialogPayVisible"
		class="public-dialog"
		v-el-drag-dialog
		>
		<el-table
		v-loading="payloading"
		:data="payData"
		border
		show-summary
        :summary-method="getSummaries"
		height="500"
		style="width: 100%">
		<el-table-column
			prop="date"
			label="日期"
			width="180">
		</el-table-column>
		<el-table-column
			prop="week"
			label="星期"
			width="180">
		<template slot-scope="scope">
			{{['星期一','星期二','星期三','星期四','星期五','星期六','星期日'][scope.row.week-1]}}
		</template>
		</el-table-column>
		
		<el-table-column
			prop="lunch"
			label="午餐(元)">
		</el-table-column>
			<el-table-column
			prop="dinner"
			label="晚餐(元)">
		</el-table-column>
		<el-table-column
			prop="nightingale"
			label="夜宵(元)">
		</el-table-column>
		<el-table-column
			prop="total"
			label="小计">
		</el-table-column>
		</el-table>
    
  
    </el-dialog>


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
    <el-table-column type="index" :index="indexMethod" width="70"/>


    <!-- :width="table_field.find(o=>o.name==='month').width||'auto'"
      :sortable="table_field.find(o=>o.name==='month').issort?'custom':false" -->
    <!-- <el-table-column
      align="left"
      v-if="table_field.length"
      width="150"
    
    >
      <template slot="header" slot-scope="scope">
        <div class="month-select">
            <span>{{table_form.month|monthFilter}} <span class="el-icon-caret-bottom" style="color:#c0c4cc"></span></span>
            <el-date-picker
                class="picker"
                style="opacity: 0;"
                v-model="table_form.month"
                type="month"
                value-format="yyyy-MM"
                placeholder="选择月份">
            </el-date-picker>
        </div>
      </template>
      <template slot-scope="scope">
          {{scope.row.month}}
      </template>
    </el-table-column> -->
    <!-- <each-table-column :table_field="table_field.filter(f=>f.name!=='month')" :template="template"/> -->
		
    <each-table-column :table_field="table_field" :template="template"/>
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
			// form:defaultForm,
			form:{
				isdiet:false
			},
			api_resource,
			payloading:false,
			dialogPayVisible:false,
			template:{
				paymongey(column,row){
					return <el-button type="text" size="medium" onClick={vm.showPayInfo.bind(vm,row)}>{row.paymongey}</el-button>
				}
			},
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
			settle:false
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
		async showPayInfo(row){
			this.payloading = true
			this.dialogPayVisible = true
			let { rows } = await this.$request.get('restaurant/consumedata/detail',{
				params:{
					workcode:row.workcode,
					month:this.table_form.dateLap
				}
			})
			this.payData =  rows
			this.payloading = false
	
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
